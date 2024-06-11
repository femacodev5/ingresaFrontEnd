/* eslint-disable jsx-a11y/media-has-caption */

import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { Box, Button, LinearProgress, Typography, CircularProgress, Backdrop } from '@mui/material';
import personService from '@/services/personService';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

function DetectorRostros({ empID }) {
	const videoRef = useRef();
	const canvasRef = useRef();
	const [progress, setProgress] = useState(0);
	const [loading, setLoading] = useState(false);

	const detectionThreshold = 5; // Number of successful detections needed
	const progressIncrement = 100 / detectionThreshold;

	const capturePhoto = async (detections) => {
		if (videoRef.current) {
			setLoading(true);

			const canvas = document.createElement('canvas');
			canvas.width = videoRef.current.videoWidth;
			canvas.height = videoRef.current.videoHeight;
			const context = canvas.getContext('2d');
			context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
			const dataUrl = canvas.toDataURL('image/png');

			const faceData = detections.map((d) => ({
				descriptor: Array.from(d.descriptor),
				box: d.detection.box,
				landmarks: {
					positions: d.landmarks.positions.map((position) => ({ x: position.x, y: position.y })),
					leftEye: d.landmarks.getLeftEye().map((position) => ({ x: position.x, y: position.y })),
					rightEye: d.landmarks.getRightEye().map((position) => ({ x: position.x, y: position.y })),
					mouth: d.landmarks.getMouth().map((position) => ({ x: position.x, y: position.y })),
					nose: d.landmarks.getNose().map((position) => ({ x: position.x, y: position.y })),
					jawOutline: d.landmarks.getJawOutline().map((position) => ({ x: position.x, y: position.y })),
				},
			}));

			const detectionInfo = {
				imageUrl: dataUrl,
				faces: faceData,
			};

			console.log('Detection Data:', JSON.stringify(detectionInfo, null, 2));

			// Enviar datos al servidor

			toast.info('Rostro registrado correctamente, enviando al servidor');

			try {
				const response = await personService.guardarRostro({
					rostro: detectionInfo,
					empID,
				});
				console.log('Success:', response.data);
				toast.success('Face data successfully sent to the server!');
			} catch (error) {
				console.error('Error:', error);
				toast.error('Failed to send face data to the server');
			}
			setLoading(false);
			setProgress(0); // Reset progress after sending data
		}
	};

	const faceMyDetect = () => {
		setInterval(async () => {
			if (videoRef.current && canvasRef.current) {
				const video = videoRef.current;
				const canvas = canvasRef.current;
				const displaySize = { width: video.videoWidth, height: video.videoHeight };

				faceapi.matchDimensions(canvas, displaySize);

				const detections = await faceapi
					.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
					.withFaceLandmarks()
					.withFaceDescriptors();

				const resizedDetections = faceapi.resizeResults(detections, displaySize);

				const context = canvas.getContext('2d');
				context.clearRect(0, 0, canvas.width, canvas.height);

				faceapi.draw.drawDetections(canvas, resizedDetections);
				faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

				if (resizedDetections.length > 0) {
					setProgress((prevProgress) => {
						const newProgress = prevProgress + progressIncrement;
						if (newProgress >= 100) {
							capturePhoto(resizedDetections);
						}
						return Math.min(newProgress, 100);
					});
				} else {
					setProgress(0);
				}
			}
		}, 1000);
	};

	const loadModels = () => {
		Promise.all([
			faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
			faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
			faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
		]).then(() => {
			faceMyDetect();
		});
	};

	const startVideo = () => {
		navigator.mediaDevices
			.getUserMedia({ video: true })
			.then((currentStream) => {
				videoRef.current.srcObject = currentStream;

				videoRef.current.addEventListener('loadeddata', () => {
					const video = videoRef.current;
					const canvas = canvasRef.current;
					canvas.width = video.videoWidth;
					canvas.height = video.videoHeight;
				});
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
				{loading && (
					<Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
						<CircularProgress color="inherit" />
					</Backdrop>
				)}
			</Box>
			<Box sx={{ width: '100%', mt: 2 }}>
				<Typography variant="h6" gutterBottom>
					Detección de Rostro
				</Typography>
				<LinearProgress variant="determinate" value={progress} />
			</Box>
			<ToastContainer />
		</div>
	);
}

export default DetectorRostros;
