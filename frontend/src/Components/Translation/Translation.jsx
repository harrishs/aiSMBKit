import { useState, useRef } from "react";

const mimeType = "audio/wav";

const Translation = (props) => {
	const [permission, setPermission] = useState(false);
	const [stream, setStream] = useState(null);
	const mediaRecorder = useRef(null);
	const [recordingStatus, setRecordingStatus] = useState(false);
	const [audioChunks, setAudioChunks] = useState([]);
	const [audio, setAudio] = useState(null);
	const [transcription, setTranscription] = useState(null);
	const [sourceLanguage, setSourceLanguage] = useState("");
	const [targetLanguage, setTargetLanguage] = useState("");

	const getMicrophonePermission = async () => {
		if ("MediaRecorder" in window) {
			try {
				const streamData = await navigator.mediaDevices.getUserMedia({
					audio: true,
					video: false,
				});
				setPermission(true);
				setStream(streamData);
			} catch (err) {
				console.log(err);
			}
		} else {
			alert("Your browser does not support audio recording via this app.");
		}
	};

	const startRecording = async () => {
		setRecordingStatus(true);
		const media = new MediaRecorder(stream, { type: mimeType });
		mediaRecorder.current = media;
		mediaRecorder.current.start();
		let localAudioChunks = [];
		mediaRecorder.current.ondataavailable = (event) => {
			if (typeof event.data === "undefined") return;
			if (event.data.size === 0) return;
			localAudioChunks.push(event.data);
		};
		setAudioChunks(localAudioChunks);
	};

	const stopRecording = () => {
		setRecordingStatus(false);
		mediaRecorder.current.stop();
		mediaRecorder.current.onstop = () => {
			const audioBlob = new Blob(audioChunks, { type: mimeType });
			const audioUrl = URL.createObjectURL(audioBlob);
			setAudio(audioUrl);
			setAudioChunks([]);

			const file = new File([audioBlob], "input.wav", { type: mimeType });
			const formData = new FormData();
			formData.append("model", "whisper-1");
			formData.append("file", file);

			fetch("https://api.openai.com/v1/audio/transcriptions", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${import.meta.env.VITE_API}`,
				},
				body: formData,
			})
				.then((res) => res.json())
				.then((data) => {
					//Original transcription below commented out to use ChatGPT to convert transcription to script
					// setTranscription(data.text);
					const chatMsgs = [
						{
							role: "system",
							content:
								"You are a talented transcriber, who works in a multitude of languages and specializes in transcribing sales calls. You will be provided with a transcription of a conversation between a sales/ field agent and a potential customer. Identify who the sales agent is and who the customer is, and then transcribe the conversation in this format: [{role: 'salesperson', content: 'transcribed speech'}, {role: 'customer', content: 'transcribed speech'}]",
						},
						{
							role: "user",
							content:
								"Here is the transcription to be converted: " + data.text,
						},
					];
					fetch("https://api.openai.com/v1/chat/completions", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${import.meta.env.VITE_API}`,
						},
						body: JSON.stringify({
							model: "gpt-4-turbo",
							messages: chatMsgs,
						}),
					})
						.then((res) => res.json())
						.then((data) => setTranscription(data.choices[0].message.content))
						.catch((err) => console.log(err));
				})
				.catch((err) => console.log(err));
		};
	};

	const translate = (event) => {
		event.preventDefault();
		if (sourceLanguage !== "" && targetLanguage !== "") {
			fetch("https://api.openai.com/v1/chat/completions", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${import.meta.env.VITE_API}`,
				},
				body: JSON.stringify({
					model: "gpt-4-turbo",
					messages: [
						{
							role: "user",
							content: `Can you output just the translation of the following text from ${sourceLanguage} to ${targetLanguage}, if you are not familiar with either of the languages output an apology stating the reason you cannot translate and output the original text: ${transcription}`,
						},
					],
				}),
			})
				.then((res) => res.json())
				.then((data) => setTranscription(data.choices[0].message.content))
				.catch((err) => console.log(err));
		}
	};

	return (
		<div>
			<h2>Audio Recorder</h2>
			<main>
				<div>
					{!permission ? (
						<button onClick={getMicrophonePermission} type="button">
							Allow Mic Access
						</button>
					) : null}
					{permission && recordingStatus === false ? (
						<button onClick={startRecording} type="button">
							Start Recording
						</button>
					) : null}
					{recordingStatus === true ? (
						<button onClick={stopRecording} type="button">
							Stop Recording and Transcribe
						</button>
					) : null}
					{audio ? (
						<div className="audio-player">
							<audio src={audio} controls></audio>
							<a download href={audio}>
								Download Recording
							</a>
							<h2>Transcription</h2>
							<p>{transcription}</p>
							<form onSubmit={translate}>
								<h4>Enter Translation Languages</h4>
								<label>Source Language:</label>
								<input
									type="text"
									value={sourceLanguage}
									onChange={(e) => setSourceLanguage(e.target.value)}
								></input>
								<label>Target Language:</label>
								<input
									type="text"
									value={targetLanguage}
									onChange={(e) => setTargetLanguage(e.target.value)}
								></input>
								<button type="submit">Translate</button>
							</form>
						</div>
					) : null}
				</div>
			</main>
		</div>
	);
};

export default Translation;
