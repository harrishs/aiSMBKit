import { Select, FormControl, InputLabel, MenuItem } from "@mui/material";
import { useState } from "react";
// import Auth from "../Auth/Auth";
import AssetGen from "../AssetGen/AssetGen";
import Translation from "../Translation/Translation";
import Chatbot from "../Chatbot/Chatbot";

const Layout = (props) => {
	const [selection, setSelection] = useState("AssetGen");

	const handleSelection = (event) => {
		setSelection(event.target.value);
	};

	let display;
	if (selection === "AssetGen") {
		display = <AssetGen />;
	} else if (selection === "ChatBot") {
		display = <Chatbot />;
	} else if (selection === "Translation") {
		display = <Translation />;
	}

	return (
		<>
			<FormControl fullWidth variant="standard">
				<InputLabel>Which Tool Would You Like To Use?</InputLabel>
				<Select value={selection} label="Selection" onChange={handleSelection}>
					<MenuItem value={"AssetGen"}>Asset Generator</MenuItem>
					<MenuItem value={"ChatBot"}>Sales Training Chat Bot</MenuItem>
					<MenuItem value={"Translation"}>
						Transcribe and Translate Audio
					</MenuItem>
				</Select>
			</FormControl>
			{display}
			{/* <Auth /> */}
		</>
	);
};

export default Layout;
