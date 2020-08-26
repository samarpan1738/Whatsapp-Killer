
let admin = require("firebase-admin");

let serviceAccountCred = require("./secret/chat-app-2020-4760e-firebase-adminsdk-6qxit-0c1f7adbb3.json");

let firebase=admin.initializeApp({
  credential: admin.credential.cert(serviceAccountCred),
  databaseURL: "https://chat-app-2020-4760e.firebaseio.com"
});

// let {db,ADMIN}=firebase
let db=firebase.database()
// let adminS=firebase.admin()
console.log(db);