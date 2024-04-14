require("dotenv").config();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const salt = 12;
const jwt = require("jsonwebtoken");

exports.login = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	let loadedUser;
	User.findOne({ email })
		.then((user) => {
			if (!user) {
				res
					.status(401)
					.json({ error: "A user with this email could not be found." });
			} else {
				loadedUser = user;
				return bcrypt.compare(password, user.password);
			}
		})
		.then((isEqual) => {
			if (!isEqual) {
				res
					.status(401)
					.json({ error: "The email or password entered is incorrect." });
			} else {
				const token = jwt.sign({ ...loadedUser }, process.env.SECRET, {
					expiresIn: "1h",
				});
				res.status(201).json({ ...loadedUser, msg: "Login Successful", token });
			}
		})
		.catch((err) => res.status(500).json({ err }));
};

exports.signUp = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	bcrypt
		.hash(password, salt)
		.then((hashedPw) => {
			const user = new User({ email, password: hashedPw });
			user
				.save()
				.then((result) => {
					const token = jwt.sign({ ...loadedUser }, process.env.SECRET, {
						expiresIn: "1h",
					});
					res.status(201).json({ ...result, msg: "Signup Successful", token });
				})
				.catch((err) => res.status(500).json({ err }));
		})
		.catch((err) => res.status(500).json({ err }));
};
