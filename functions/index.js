const functions = require("firebase-functions");

const admin = require("firebase-admin");
const serviceAccount = require("./service-account.json");
const razorpay = require("razorpay");
const nodemailer = require("nodemailer");

const mailTransport = nodemailer.createTransport({
  host: "email-smtp.ap-south-1.amazonaws.com",
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: "AKIAXPHB5CHQ2ZKL2P3H",
    pass: "BOX5bw9MeHfpveqhgTY1kZj7+blTiisI3W82tc4mQc1V",
  },
});

const razorpaySecret = "eRLp9V9ewmLQ9DW";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://resumr-8540b.firebaseio.com",
});

function verifySignature(message, receivedSignature) {
  return razorpay.validateWebhookSignature(
    message,
    receivedSignature,
    razorpaySecret
  );
}

const db = admin.firestore();
const subscriptionsRef = db.collection("subscriptions");

exports.setupTrialSubscription = functions.auth.user().onCreate((user) => {
  console.log(user);
  const uid = user.uid;
  const start = new Date();
  const end = new Date();
  end.setDate(new Date().getDate() + 30);
  const doc = {
    start: start.getTime(),
    end: end.getTime(),
  };
  const ref = subscriptionsRef.doc(uid);
  ref.set(doc);
  //   Send email
  const email = user.email;
  if (email) {
    const mailOptions = {
      from: '"Resumr" <resumr@contentready.co>',
      to: email,
      subject: "Welcome to Resumr! Your free trial has started.",
    };
    const subscriptionText = `\n\nYour 30 day trial will end on ${end.toDateString()}. \n\nWe would love to hear your questions or feedback. Just hit reply to this email. Or tweet us @resumr_io.`;
    mailOptions.text = user.emailVerified
      ? `Welcome onboard! You are all set. ${subscriptionText}`
      : `Welcome onboard! You will receive a separate verification email - verify to get started! ${subscriptionText}`;
    mailTransport
      .sendMail(mailOptions)
      .then((r) => {
        //   console.log(r);
      })
      .catch((e) => {
        console.error(e);
      });
    return null;
  }
});

exports.disableExpiredTrials = functions.pubsub
  .schedule("every 5 minutes")
  .onRun((context) => {
    const now = Date.now();
    console.log(now);
    subscriptionsRef
      .where("end", "<=", now)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          // Each doc.id is a uid whose subscription has expired. Disable the user and send an email to notify them that their subscription has ended.
          console.log(doc.id, "=>", doc.data());
          const uid = doc.id;
          admin.auth().updateUser(uid, { disabled: true });
          admin
            .auth()
            .getUser(uid)
            .then((user) => {
              const mailOptions = {
                from: '"Resumr" <resumr@contentready.co>',
                to: user.email,
                subject:
                  "Your free trial has expired. It takes 1 minute to reactivate!",
              };
              mailTransport.text = `Your 30 day trial to Resumr has just ended :-(. You can continue using Resumr on all your devices. However you won't be able to sync content and progress across them. \n\nClick this link to subscribe for an year and continue syncing. \n\nWhatever you choose, we would love to hear your questions or feedback. Just hit reply to this email. Or tweet us @resumr_io.`;

              mailTransport
                .sendMail(mailOptions)
                .then((r) => {
                  //   console.log(r);
                })
                .catch((e) => {
                  console.error(e);
                });
              return null;
            });
        });
      });
    return null;
  });

exports.paymentWebhook = functions.https.onRequest(async (req, res) => {
  console.log(req.body);
  // Verify that message is from Razorpay
  const message = req.rawBody;
  const receivedSignature = req.headers["x-razorpay-signature"];
  if (!verifySignature(message, receivedSignature))
    throw Error("Signature mismatch");

  const entity = req.body.payload.payment.entity;
  const email = entity.email;
  const phoneNumber = entity.contact;
  // look up account with this (1) email or (2) phone
  // enable account if disabled
  admin
    .auth()
    .getUserByEmail(email)
    .then((userRecord) => {
      //   console.log("Successfully fetched user data:", userRecord.toJSON());
      const uid = userRecord.uid;
      admin
        .auth()
        .updateUser(uid, { disabled: false })
        .then(function (userRecord) {
          // See the UserRecord reference doc for the contents of userRecord.
          //   console.log("Successfully updated user", userRecord.toJSON());
          // add custom properties: subscription.start and subscription.end to their RealtimeDB
          const start = new Date();
          const end = new Date();
          end.setDate(new Date().getDate() + 365);
          const doc = {
            start: start.getTime(),
            end: end.getTime(),
          };
          //   const ref = subscriptionsRef.child(`${uid}`);
          const ref = subscriptionsRef.doc(uid);
          ref.set(doc);
        })
        .catch(function (error) {
          console.log("Error updating user:", error);
        });
    })
    .catch(function (error) {
      //   console.log("Error fetching user data:", error);
      admin
        .auth()
        .getUserByPhoneNumber(phoneNumber)
        .then(function (userRecord) {
          // See the UserRecord reference doc for the contents of userRecord.
          //   console.log("Successfully fetched user data:", userRecord.toJSON());
          const uid = userRecord.uid;
          admin
            .auth()
            .updateUser(uid, { disabled: false })
            .then(function (userRecord) {
              // See the UserRecord reference doc for the contents of userRecord.
              //   console.log("Successfully updated user", userRecord.toJSON());
              // add custom properties: subscription.start and subscription.end to their RealtimeDB
              const start = new Date();
              const end = new Date();
              end.setDate(new Date().getDate() + 365);
              const doc = {
                start: start.getTime(),
                end: end.getTime(),
              };
              //   const ref = subscriptionsRef.child(`${uid}`);
              const ref = subscriptionsRef.doc(uid);
              ref.set(doc);
            })
            .catch(function (error) {
              console.log("Error updating user:", error);
            });
        })
        .catch(function (error) {
          console.log("Error fetching user data:", error);
          //   User has paid without signing up!
          //   Create a user. They will be able to complete signup using the Firebase auth UI
          //   Creating a user causes more problems than it's worth - user will need to trigger a password reset email too.
          //   admin
          //     .auth()
          //     .createUser({
          //       email: email,
          //       emailVerified: false,
          //       phoneNumber: phoneNumber,
          //       disabled: false,
          //     })
          //     .then(function (userRecord) {
          //       // See the UserRecord reference doc for the contents of userRecord.
          //       console.log("Successfully created new user:", userRecord.uid);
          //     })
          //     .catch(function (error) {
          //       console.log("Error creating new user:", error);
          //     });
        });
    });

  res.json({ ok: true });
});
