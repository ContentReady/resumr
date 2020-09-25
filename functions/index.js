const functions = require("firebase-functions");

const admin = require("firebase-admin");
const serviceAccount = require("./service-account.json");

admin.initializeApp({
  //   credential: admin.credential.cert(serviceAccount),
  //   databaseURL: "https://resumr-8540b.firebaseio.com",
});

// console.log("initialised");

// admin
//   .database()
//   .ref(`users`)
//   .once("value")
//   .then((data) => {
//     console.log(data.val());
//   });

exports.paymentWebhook = functions.https.onRequest(async (req, res) => {
  const entity = req.body.payload.payment.entity;
  const email = entity.email;
  const phoneNumber = entity.contact;
  // look up with this email or phone
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
          admin
            .database()
            .ref(`users/${uid}/subscription`)
            .set({
              start: start,
              end: end,
            })
            .then(() => {
              console.log("saved subscription details");
            })
            .catch((e) => console.error(e));
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
              admin
                .database()
                .ref(`users/${uid}/subscription`)
                .set({
                  start,
                  end,
                })
                .then(() => {
                  console.log("saved subscription details");
                })
                .catch((e) => console.error(e));
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
