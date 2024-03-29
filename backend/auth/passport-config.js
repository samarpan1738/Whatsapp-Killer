require("dotenv").config();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const { User } = require("../models/User");
let { CLIENT_ID, CLIENT_SECRET } = process.env;
passport.use(
	new LocalStrategy(function (username, password, done) {
		console.log("Inside Local Stat");
		User.findOne({ username })
			.then((user) => {
				// console.log(user);
				if (!user || password != user.password) {
					return done(null, false);
				}

				return done(null, user);
			})
			.catch((err) => {
				done(err, false);
			});
	})
);

passport.serializeUser(function (user, done) {
	console.log("Serializing user " + user.id);
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	console.log("Deserializing user ", id);
	User.findById(id)
		.then((user) => {
			done(null, user);
		})
		.catch((err) => {
			done(err, false);
		});
});

// passport.use(
// 	new FacebookStrategy(
// 		{
// 			clientID: CLIENT_ID,
// 			clientSecret: CLIENT_SECRET,
// 			callbackURL: "http://localhost:2000/login/facebook/callback",
// 		},
// 		function (accessToken, refreshToken, profile, cb) {
// 			// console.log(accessToken);
// 			// console.log(profile);
// 			User.create({
// 				username: profile.displayName,
// 				fbId: profile.id,
// 				fbToken: accessToken,
// 			})
// 				.then((user) => {
// 					console.log("User created => ", user);
// 					return cb(null, user);
// 				})
// 				.catch((err) => {
// 					// throw new Error('Could\'nt add user')
// 					return cb(null, false);
// 				});
// 		}
// 	)
// );

module.exports = {
	passport,
};
