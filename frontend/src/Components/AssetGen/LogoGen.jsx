import { useState } from "react";
import styles from "./LogoGen.module.css";

const LogoGen = (props) => {
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [content, setContent] = useState("");
	const [logo, setLogo] = useState("");
	const [primColor, setPrimColor] = useState("");
	const [secColor, setSecColor] = useState("");
	const [loading, setLoading] = useState(false);

	const handleChange = (event) => {
		if (event.target.name === "email") {
			setEmail(event.target.value);
		} else if (event.target.name === "name") {
			setName(event.target.value);
		} else if (event.target.name === "content") {
			setContent(event.target.value);
		} else if (event.target.name === "primColor") {
			setPrimColor(event.target.value);
		} else if (event.target.name === "secColor") {
			setSecColor(event.target.value);
		}
	};

	const setLocalStoreWithExp = (key, val) => {
		const timeWindow = 86400000;
		const now = new Date();
		const item = {
			value: val,
			expiry: now.getTime() + timeWindow,
		};
		localStorage.setItem(key, JSON.stringify(item));
	};

	const getLocalStoreWithExp = (key) => {
		const itemStr = localStorage.getItem(key);
		if (!itemStr) {
			return 0;
		} else {
			const item = JSON.parse(itemStr);
			const now = new Date();
			if (now.getTime() > item.expiry) {
				localStorage.removeItem(key);
				return 0;
			} else {
				return item.value;
			}
		}
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		let genUsage = parseInt(getLocalStoreWithExp("genUsage"));
		if (genUsage < 3) {
			setLocalStoreWithExp("genUsage", genUsage + 1);
			setLoading(true);
			fetch("https://api.openai.com/v1/chat/completions", {
				method: "POST",
				headers: {
					"Content-Type": "application/json; charset=utf-8",
					Authorization: `Bearer ${import.meta.env.VITE_API}`,
				},
				body: JSON.stringify({
					model: "gpt-4-turbo",
					messages: [
						{
							role: "system",
							content:
								"Act as a logo designer. You have worked for the greatest webdesign companies to create logos for tech companies and SaaS.",
						},
						{
							role: "user",
							content: `Create a logo for my company called "${name}".
                            
							${name} is a moving company, and can be described as "${content}"
							
							My colors are ${primColor} as the primary color and ${secColor} as the secondary color. I love the Gumroad design. Get heavily inspired by Gumroad. It's essential.
							
							I want something simple that conveys the values of ${name}. The only writing or text on the logo should be the name of the company: "${name}".
							
							You will create a detailed description of a vector logo.
							
							My ideal clients are around 25-45 years old.
							
							Take a deep breath, and work on this problem step-by-step.".`,
						},
					],
					temperature: 0.7,
				}),
			})
				.then((res) => res.json())
				.then((data) => {
					console.log(data);
					fetch("https://api.openai.com/v1/images/generations", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${import.meta.env.VITE_API}`,
						},
						body: JSON.stringify({
							prompt: data.choices[0].message.content,
							model: "dall-e-3",
							response_format: "b64_json",
						}),
					})
						.then((res) => res.json())
						.then((data) => {
							setLogo(data.data[0].b64_json);
							setLoading(false);
						})
						.catch((err) => console.log(err));
				})
				.catch((err) => console.log(err));
		} else {
			alert(
				"You have used the generator 3 times this session, please try again later."
			);
		}
	};

	const logoForm = (
		<div className={styles.form}>
			<form id="enquire-form" onSubmit={handleSubmit}>
				<label>Company Name</label>
				<input
					type="text"
					name="name"
					onChange={handleChange}
					placeholder="Company Name"
					value={name}
					required
				/>
				<label>Email</label>
				<input
					type="email"
					name="email"
					onChange={handleChange}
					placeholder="your@email.com"
					value={email}
					required
				/>
				<label>Quick description of company</label>
				<textarea
					rows="5"
					cols="25"
					name="content"
					style={{ resize: "none" }}
					onChange={handleChange}
					placeholder="IE: A delivery company that specializes in home pickup"
					value={content}
					required
				></textarea>
				<label>Primary Color</label>
				<input
					type="text"
					name="primColor"
					onChange={handleChange}
					placeholder="Red"
					value={primColor}
					required
				/>
				<label>Secondary Color</label>
				<input
					type="text"
					name="secColor"
					onChange={handleChange}
					placeholder="Blue"
					value={secColor}
					required
				/>
				<button type="submit">
					{logo ? "Regenerate Logo" : "Generate Logo"}
				</button>
			</form>
			<div className={styles.preview}>
				{logo ? (
					<>
						<a href={"data:image/png;base64, " + logo} download="logogen">
							<button>Download Logo</button>
						</a>
						<div>
							<h1>Preview:</h1>
							<img
								src={"data:image/png;base64, " + logo}
								alt="generated logo"
							/>
						</div>
					</>
				) : (
					<></>
				)}
			</div>
		</div>
	);

	return (
		<>
			{loading !== true ? (
				logoForm
			) : (
				<div className={styles.loading}>
					Please wait as we generate your logo ...
				</div>
			)}
		</>
	);
};

export default LogoGen;
