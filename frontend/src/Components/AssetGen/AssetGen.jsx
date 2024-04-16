import { Select, FormControl, InputLabel, MenuItem } from "@mui/material";
import { useState } from "react";
import LogoGen from "./LogoGen";

const ImageGen = (props) => {
	const [asset, setAsset] = useState("");

	const handleSelectAsset = (event) => {
		setAsset(event.target.value);
	};

	let generator;
	if (asset === "Logo") {
		generator = <LogoGen />;
	}

	return (
		<>
			<FormControl fullWidth variant="standard">
				<InputLabel>What Type Of Asset Would You Like To Generate?</InputLabel>
				<Select value={asset} label="Asset" onChange={handleSelectAsset}>
					<MenuItem value={"Logo"}>Logo</MenuItem>
					<MenuItem value={"Image"}>Image</MenuItem>
				</Select>
			</FormControl>
			{generator}
		</>
	);
};

export default ImageGen;
