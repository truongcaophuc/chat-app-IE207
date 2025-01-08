const admin = require("firebase-admin");
const serviceAccount = require("./config/chat-app-797e0-firebase-adminsdk-6vplm-00fa2b24c7.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
