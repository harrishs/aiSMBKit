import { useState } from "react";

const Auth = (props) => {
	let [email, setEmail] = useState("");
	let [password, setPassword] = useState("");
	let [login, setlogin] = useState(false);

	const handleChange = (event) => {
		if (event.target.name === "email") {
			setEmail(event.target.value);
		} else if (event.target.name === "password") {
			setPassword(event.target.value);
		}
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		let endPoint = login === false ? "http://localhost:8080/auth/signup" : "http://localhost:8080/auth/login";
		fetch( endPoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({email, password})
		}).then(res => res.json())
		.then(data => console.log(data));
	};

	const swapAuth = () => {
		setlogin(!login);
	}

	const loginForm = (
		<div>
			<form id="enquire-form" onSubmit={handleSubmit}>
				<label>Email</label>
				<input
					type="text"
					name="email"
					onChange={handleChange}
					placeholder="name@email.com"
					required
				/>
				<label>Email</label>
				<input
					type="password"
					name="password"
					onChange={handleChange}
					placeholder="password"
					required
				/>
				<button type="submit">
                    Login
				</button>
			</form>
		</div>
	);

	return (
		<>
		{loginForm}
		<button onClick={swapAuth}>{login === false ? "Already Have An Account? Click Here" : "Click Here To Sign Up"}</button>
		</>
	)
};

export default Auth;
