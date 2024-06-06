/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

function Camera({ employeeImageUris }) {
	const videoRef = useRef(null);
	const canvasRef = useRef(null);
	const [faceMatcher, setFaceMatcher] = useState(null);

	const loadLabeledImages = async () => {
		const labeledDescriptors = await Promise.all(
			employeeImageUris.map(async (uri, i) => {
				const img = await faceapi.fetchImage(uri);
				const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
				if (!detections) {
					throw new Error(`No faces detected for image at ${uri}`);
				}
				const label = `employee${i + 1}`; // Puedes personalizar la etiqueta según sea necesario
				return new faceapi.LabeledFaceDescriptors(label, [detections.descriptor]);
			}),
		);
		setFaceMatcher(new faceapi.FaceMatcher(labeledDescriptors, 0.6));
	};
	useEffect(() => {
		const loadModels = async () => {
			const MODEL_URL = '/models'; // Asegúrate de que los modelos estén en la carpeta pública
			await faceapi.loadTinyFaceDetectorModel(MODEL_URL);
			await faceapi.loadFaceLandmarkTinyModel(MODEL_URL);
			await faceapi.loadFaceRecognitionModel(MODEL_URL);
			await loadLabeledImages();
		};

		const startVideo = async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({ video: true });
				if (videoRef.current) {
					videoRef.current.srcObject = stream;
				}
			} catch (err) {
				console.error('Error accessing webcam:', err);
			}
		};

		const handleVideoPlay = () => {
			setInterval(async () => {
				if (videoRef.current && canvasRef.current) {
					const displaySize = {
						width: videoRef.current.videoWidth,
						height: videoRef.current.videoHeight,
					};

					faceapi.matchDimensions(canvasRef.current, displaySize);
					const detections = await faceapi
						.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
						.withFaceLandmarks()
						.withFaceDescriptors();
					const resizedDetections = faceapi.resizeResults(detections, displaySize);
					canvasRef.current
						.getContext('2d')
						.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
					faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
					faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);

					if (faceMatcher) {
						const results = resizedDetections.map((d) => faceMatcher.findBestMatch(d.descriptor));
						results.forEach((result, i) => {
							// eslint-disable-next-line prefer-destructuring
							const box = resizedDetections[i].detection.box;
							const { label, distance } = result;
							const drawBox = new faceapi.draw.DrawBox(box, {
								label: `${label} (${Math.round(distance * 100) / 100})`,
							});
							drawBox.draw(canvasRef.current);
						});
					}
				}
			}, 100);
		};

		loadModels();
		startVideo();

		videoRef.current?.addEventListener('play', handleVideoPlay);

		return () => {
			videoRef.current?.removeEventListener('play', handleVideoPlay);
		};
	}, [employeeImageUris]);

	return (
		<div>
			<video ref={videoRef} autoPlay style={{ width: '100%' }} />
			<canvas ref={canvasRef} style={{ position: 'absolute' }} />
		</div>
	);
}

export default Camera;
