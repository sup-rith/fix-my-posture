import React, {useEffect, useRef, useState} from 'react';
import * as tf from "@tensorflow/tfjs";
import * as posenet from "@tensorflow-models/posenet";
import Webcam from "react-webcam";

const Video = () => {

  const [pauseClicked, setPauseClicked] = useState(false);
  const [intervalId, setIntervalId] = useState(0);

  const [leftEye, setLeftEye] = useState(0);
  const webcamRef = useRef(null);

  const loadPosenet = async () => {
    const net = await posenet.load({
      inputResolution: {width: 640, height: 480},
      scale: 0.2
    });

    return detect(net);
  };

  useEffect( () => {
    async function poseNet() {
      const net = await posenet.load({
        inputResolution: {width: 640, height: 480},
        scale: 0.2
      });

      return detect(net);
    };

    poseNet();
    console.log('Running from useEffect');

  }, [pauseClicked]);


  const getPostures = async () => {
    const net = await posenet.load({
      inputResolution: {width: 640, height: 480},
      scale: 0.2
    });

    return detect(net);
  };

  const startPosenet = () => {
    console.log(pauseClicked);
    loadPosenet();
    let intervalId = setInterval(getPostures, 3000);
    setIntervalId(intervalId);
    // blurScreen();
  };

  const stopPosenet = () => {
    clearInterval(intervalId);
    // removeBlur();
  };

  const changePause = () => {
    if (pauseClicked) {
      console.log('Stopping');
      setPauseClicked(false);
      stopPosenet();
    } else {
      console.log('Starting');
      setPauseClicked(true);
      startPosenet();
    }
  };

  const detect = async (net) => {
    const webcam = webcamRef.current;
    if (typeof webcam !== "undefined" && webcam !== null && webcam.video.readyState === 4) {
      // Get Video Properties
      const {video, videoWidth, videoHeight} = getVideoProperties(webcamRef);

      // Set video width
      setVideoProperties(videoHeight, videoWidth);

      // Make Detections
      if (pauseClicked) {
        await getInitialPose(net, video);
      } else {
        await getRealtimePose(net, video)
      }
    }
  };

  const getVideoProperties = (webcamRef) => {
    const video = webcamRef.current.video;
    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;

    return {video, videoWidth, videoHeight};
  };

  const setVideoProperties = (height, width) => {
    webcamRef.current.video.height = height;
    webcamRef.current.video.width = width;
  };

  const getInitialPose = async (net, video) => {
    const pose = await net.estimateSinglePose(video);
    const leftEyePosition = pose.keypoints[1].position.y;
    setLeftEye(leftEyePosition);
    console.log('Initial Eye position:: '+ leftEyePosition);
  };

  const getRealtimePose = async (net, video) => {
    const pose = await net.estimateSinglePose(video);
    const leftEyePosition = pose.keypoints[1].position.y;
    console.log('Real Time:: ' + leftEyePosition);
  };

  const blurScreen = () => {
    document.body.style.filter = 'blur(10px)';
    document.body.style.transition = '0.9s';
  };

  const removeBlur = () => {
    document.body.style.filter = 'blur(0px)';
  };

  return (
    <div>
      <Webcam
        ref={webcamRef}
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: 640,
          height: 480
        }}
      />

      <button onClick={() => { changePause() }}>
        {pauseClicked ? 'Stop' : 'Start'}
      </button>

    </div>
  )
};

export default Video;