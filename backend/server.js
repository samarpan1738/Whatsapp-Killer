require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 2000;
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

const { connect } = require("./mongoDB");
const { onConnect } = require("./socket/index");

// Importing models
const mongoose = require("mongoose");
const { Mongoose } = require("mongoose");
const { User } = require("./models/User");
const { Message } = require("./models/Message");
const { Contact } = require("./models/Contact");
const session = require("express-session");
let { passport } = require("./auth/passport-config");
// Just kept it for reference
let users = [
	{
		uname: "username", // Unique
		password: "shhhhhh",
		socketId: "user ki socket id",
		contacts: [
			{
				uname: "contact.uname",
				messages: [
					{
						id: "uuid",
						content: "kya haal chaal hai",
						type: "received | sent",
					},
				],
			},
		],
	},
];

//Cors
// app.use(cors());

//Body Parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.use(cookieParser());
app.use(
	session({
		secret: "shhh",
		resave: false,
		saveUninitialized: true,
	})
);
app.use(passport.initialize());
app.use(passport.session());
// console.log(passport.session);
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/user", async (req, res, next) => {
	let users = await User.find({});
	res.json(users);
});

app.post("/user", async (req, res, next) => {
	console.log("Signup");
	let { username, password, displayName } = req.body;

	// Validate Data
	username = username.trim();
	password = password.trim();
	displayName = displayName.trim();
	if (
		username.length == 0 &&
		password.length == 0 &&
		displayName.length == 0
	) {
		return res.status(403).send("Missing Credentials");
	}

	// Add user
	try {
		let user = await User.create({
			displayName,
			username,
			password,
			lastSeen: Date.now(),
		});
		console.log(`${displayName} added`);
		res.status(201).send(user);
	} catch (err) {
		res.status(403).send(err);
		throw new Error("Error adding user");
	}
});

app.post(
	"/login",
	passport.authenticate("local", {
		successRedirect: "/loggedIn",
		failureRedirect: "/",
	})
);
app.get("/loggedIn", async (req, res) => {
	console.log(req.session.id);
	console.log("REQ.USER => ", req.user.contacts);
	let contacts = await getContacts(req.user.contacts);
	// res.send({ msg: "Logged In", user: req.user, contacts: {} });
	res.status(201).send({ msg: "Logged In", user: req.user, contacts });
});
// async (req, res, next) => {
// 	// console.log('Login');
// 	let { username, password } = req.body;
// 	// Validate Data
// 	username = username.trim();
// 	password = password.trim();
// 	if (username.length == 0 && password.length == 0) {
// 		res.status(403).send({ msg: "Missing Credentials" });
// 		return;
// 	}

// 	// Find user
// 	let user = await User.findOne({ username });
// 	// console.log(user);
// 	delete user._v;
// 	if (user) {
// 		if (user.password == password) {
// 			let contacts = await getContacts(user.contacts);
// 			// user.contacts = contacts;
// 			// console.log(user, contacts);
// 			res.status(201).send({ msg: "Logged In", user, contacts });
// 		} else res.status(403).send({ msg: "Password Mismatch" });
// 	} else {
// 		res.status(404).send({ msg: "User not found" });
// 	}
// });

app.post("/contact", async (req, res) => {
	let { user_username, contact_username } = req.body;
	let ans = await addContact(user_username, contact_username);
	console.log(ans);
	if (ans) {
		res.status(201).send({ msg: "Added Contact", contact: ans });
	} else res.send({ msg: "Could not add Contact" });
});

io.on("connect", onConnect);

async function addContact(user_username, contact_username) {
	let user = await User.findOne({ username: user_username }).populate(
		"contacts"
	);
	console.log(user);

	let duplicate = user.contacts.find(async (contact) => {
		let cont = await Contact.findOne({ _id: contact._id }).populate(
			"info",
			"username"
		);
		console.log(cont);
		// .exec((err, cont) => {
		// if (err) throw new Error("Error finding contact");
		if (cont && cont.info.username == contact_username) return false;
		// });
	});

	if (!duplicate) {
		let contact_user = await User.findOne({ username: contact_username });
		if (contact_user) {
			let contact_obj = await Contact.create({
				info: mongoose.Types.ObjectId(contact_user._id),
			});

			let res = await User.updateOne(
				{ username: user_username },
				{
					$push: {
						contacts: contact_obj._id,
					},
				}
			);
			console.log(res);
			console.log("\n\n\t\tAdded contact\n\n");
			return await Contact.findOne({ info: contact_obj.info }).populate(
				"info"
			);
		} else console.log("Invalid contact_username");
	} else {
		console.log("\n\n\t\tContact already exists\n\n");
	}
	return false;
	// });
}

async function findContact() {
	let contact = await Contact.findOne({
		_id: "5f4ab4554aefec3a2865a23b",
	});
	// .populate("info");
	console.log(contact);
}

async function getContacts(contactIds) {
	let contacts = {};
	// await contactIds.forEach(async (contactId) => {
	for (let i = 0; i < contactIds.length; ++i) {
		// if (i == contactIds.length) return contacts;
		let contactId = contactIds[i];
		let contact_obj = await Contact.findOne(
			{
				_id: contactId._id,
			},
			"info -_id"
		)
			.populate("info", ["username", "displayName", "lastSeen", "status"])
			.populate("messages");
		contacts[contact_obj.info.username] = contact_obj;
		// console.log("Messages");
		// console.log(contact_obj);
		// contacts[contact_obj.info.username].messages = contact_obj.messages;
		// console.log(contact_obj.messages);
		// await getMessages();
	}
	return contacts;
}

async function getMessages() {}
// console.log(process.end);
connect()
	.then(() => {
		server.listen(3000, () => {
			console.log("Socket.io server started at https://localhost:3000");
		});
		app.listen(PORT, () => {
			console.log(`App Server started at http://localhost:${PORT}`);
		});
		// addContact("samar", "dave");
		// addContact("dave", "samar");
		// findContact();
	})
	.catch((err) => {
		throw new Error("Error connecting to DB");
	});
