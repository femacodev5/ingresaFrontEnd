/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import { Box } from '@mui/material';

function Camera({ employeeImageUris }) {
	const videoRef = useRef();
	const canvasRef = useRef();

	const faceMyDetect = () => {
		setInterval(async () => {
			if (videoRef.current && canvasRef.current) {
				const detections = await faceapi
					.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
					.withFaceLandmarks()
					.withFaceExpressions();

				const canvas = canvasRef.current;
				const displaySize = { width: videoRef.current.videoWidth, height: videoRef.current.videoHeight };

				faceapi.matchDimensions(canvas, displaySize);
				const resizedDetections = faceapi.resizeResults(detections, displaySize);

				const context = canvas.getContext('2d');
				context.clearRect(0, 0, canvas.width, canvas.height);

				faceapi.draw.drawDetections(canvas, resizedDetections);
				faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
				faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
			}
		}, 1000);
	};

	const loadModels = () => {
		Promise.all([
			faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
			faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
			faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
			faceapi.nets.faceExpressionNet.loadFromUri('/models'),
		]).then(() => {
			faceMyDetect();
		});
	};

	const startVideo = () => {
		navigator.mediaDevices
			.getUserMedia({ video: true })
			.then((currentStream) => {
				videoRef.current.srcObject = currentStream;
			})
			.catch((err) => {
				console.log('Error accessing webcam:', err);
			});
	};

	useEffect(() => {
		startVideo();
		loadModels();
	}, []);

	return (
		<div>
			<Box className="appvide" sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
				<video crossOrigin="anonymous" ref={videoRef} autoPlay style={{ width: '100%', height: 'auto' }} />
				<Box
					component="canvas"
					ref={canvasRef}
					className="appcanvas"
					sx={{ position: 'absolute', top: 0, left: 0 }}
				/>
			</Box>
		</div>
	);
}

export default Camera;
