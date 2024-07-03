import { useState, useRef } from "react";

const mimeType = "audio/wav";

const Translation = (props) => {
	const [permission, setPermission] = useState(false);
	const [stream, setStream] = useState(null);
	const mediaRecorder = useRef(null);
	const [recordingStatus, setRecordingStatus] = useState(false);
	const [audioChunks, setAudioChunks] = useState([]);
	const [audio, setAudio] = useState(null);

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
				.then((data) => console.log(data))
				.catch((err) => console.log(err));
		};
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
							Stop Recording
						</button>
					) : null}
				</div>
			</main>
		</div>
	);
};

export default Translation;
