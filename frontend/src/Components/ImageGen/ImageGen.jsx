import { Select, FormControl, InputLabel, MenuItem } from "@mui/material";
import { useState } from "react";

const ImageGen = (props) => {
	const [asset, setAsset] = useState("");

	const handleSelectAsset = (event) => {
		setAsset(event.target.value);
	};

	return (
		<>
			<FormControl variant="standard" fullWidth>
				<InputLabel>What Type Of Asset Would You Like To Generate?</InputLabel>
				<Select value={asset} label="Asset" onChange={handleSelectAsset}>
					<MenuItem value={"Logo"}>Logo</MenuItem>
					<MenuItem value={"Image"}>Image</MenuItem>
				</Select>
			</FormControl>
		</>
	);
};

export default ImageGen;
