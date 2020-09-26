const functions = require("firebase-functions");

const admin = require("firebase-admin");
const serviceAccount = require("./service-account.json");
const razorpay = require("razorpay");

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

const uid = "lJbjXyD9jZdj6Q8KjplqCAv9psk2";
const db = admin.database();
const ref = db.ref("users");

// admin
//   .database()
//   .ref(`users/${uid}/subscription`)
//   .set({
//     start: new Date(),
//     end: new Date(),
//   })
//   .then((ref) => {
//     console.log("saved subscription details");
//     console.log(ref);
//   })
//   .catch((e) => console.error(e));

exports.paymentWebhook = functions.https.onRequest(async (req, res) => {
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
          console.log(uid, start, end);
          const usersRef = ref.child(`${uid}/subscription`);
          usersRef.set({
            start: start.getTime(),
            end: end.getTime(),
          });
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
              console.log(uid, start, end);
              const usersRef = ref.child(`${uid}/subscription`);
              usersRef.set({
                start: start.getTime(),
                end: end.getTime(),
              });
            })
            .catch(function (error) {
              console.log("Error updating user:", error);
            });
        })
        .catch(function (error) {
          console.log("Error fetching user data:", error);
        });
    });

  res.json({ ok: true });
});
