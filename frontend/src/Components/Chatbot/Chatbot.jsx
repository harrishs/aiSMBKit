import { useState } from "react";

const Chatbot = (props) => {
	const [profile, setProfile] = useState(
		"An established businessman who has run multiple businesses"
	);
	const [userMessage, setUserMessage] = useState("");
	const [response, setResponse] = useState("");
	const messages = [
		{
			role: "system",
			content: `You are a customer with the following profile: ${profile}. You are talking to a sales representative who is trying to sell you a product. Respond realistically to their sales pitch.`,
		},
		{
			role: "user",
			content: userMessage,
		},
	];

	const handleSubmit = async (event) => {
		event.preventDefault();

		const res = await fetch("https://api.openai.com/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				Authorization: `Bearer ${import.meta.env.VITE_API}`,
			},
			body: JSON.stringify({
				model: "gpt-4-turbo",
				messages: messages,
			}),
		});

		const data = await res.json();
		console.log(data);
		setResponse(data.choices[0].message.content);
		messages.push({ role: "assistant", content: response });
	};

	return (
		<div>
			<div className="App">
				<h1>Sales Call Simulator</h1>
				<form onSubmit={handleSubmit}>
					<div>
						<label htmlFor="profile">Customer Profile:</label>
						<textarea
							id="profile"
							value={profile}
							onChange={(e) => setProfile(e.target.value)}
							rows="4"
							cols="50"
						/>
					</div>
					<div>
						<label htmlFor="userMessage">Your Message:</label>
						<textarea
							id="userMessage"
							value={userMessage}
							onChange={(e) => setUserMessage(e.target.value)}
							rows="4"
							cols="50"
						/>
					</div>
					<button type="submit">Simulate</button>
				</form>
				{response && (
					<div>
						<h2>AI Response:</h2>
						<p>{response}</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default Chatbot;
