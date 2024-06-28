import { useState } from "react";

function Translation(props) {
	if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
		navigator.mediaDevices
			.getUserMedia({
				audio: true,
			})
			.then((stream) => {
				const mediaRecorder = new MediaRecorder(stream);
				let chunks = [];
				const [audio, setAudio] = useState(null);

				const handleRecord = () => {
					mediaRecorder.start();
					console.log(mediaRecorder.state);
					console.log("recorder started");
				};

				const handleStop = () => {
					mediaRecorder.stop();
					console.log(mediaRecorder.state);
					console.log("recorder stopped");
				};

				mediaRecorder.ondataavailable = (e) => {
					chunks.push(e.data);
				};

				mediaRecorder.onstop = (e) => {
					const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
					chunks = [];
					const audioURL = window.URL.createObjectURL(blob);
					setAudio(audioURL);
				};
			})
			.catch((err) => {
				console.error(`The following getUserMedia error occurred: ${err}`);
			});
	} else {
		console.log("getUserMedia not supported on your browser!");
	}

	return (
		<div>
			<h1>Translation</h1>
			<form>
				<button onClick={handleRecord}>Record Audio</button>
				<button onClick={handleStop}>Stop Recording</button>
				<audio src={audio} controls></audio>
			</form>
		</div>
	);
}

export default Translation;
