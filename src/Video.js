import React, {useRef, useState} from 'react';
import * as tf from "@tensorflow/tfjs";
import * as posenet from "@tensorflow-models/posenet";
import Webcam from "react-webcam";

const Video = () => {

  const [pauseClicked, setPauseClicked] = useState(false);
  const [intervalId, setIntervalId] = useState(0);

  const webcamRef = useRef(null);

  const loadPosenet = async () => {
    const net = await posenet.load({
      inputResolution: {width: 640, height: 480},
      scale: 0.2
    });

    return detect(net);
  };

  const blurScreen = () => {
    document.body.style.filter = 'blur(10px)';
    document.body.style.transition= '0.9s';
  };

  const removeBlur = () => {
    document.body.style.filter = 'blur(0px)';
  };

  const startPosenet = () => {
    let intervalId = setInterval(loadPosenet, 3000);
    setIntervalId(intervalId);
    setPauseClicked(true);
    // blurScreen();
  };

  const stopPosenet = () => {
    clearInterval(intervalId);
    setPauseClicked(false);
    // removeBlur();
  };

  const changePause = () => {
    if(pauseClicked) {
      console.log('Stopping');
      stopPosenet();
    } else {
      console.log('Starting');
      startPosenet();
    }
  };

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Make Detections
      const pose = await net.estimateSinglePose(video);

      const leftEyePosition = pose.keypoints[1].position.y;
      const rightEyePosition = pose.keypoints[2].position.y;

      const goodPostureValues = Promise.all([leftEyePosition, rightEyePosition]);

      await goodPostureValues.then((x) => console.log(x) )
      // console.log('leftEye:: '+ leftEyePosition);
      // console.log('rightEye:: ' + rightEyePosition);
    }
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

      <button onClick={() => {changePause()}}>
        {pauseClicked ? 'Stop': 'Start'}
      </button>

    </div>
  )
};

export default Video;