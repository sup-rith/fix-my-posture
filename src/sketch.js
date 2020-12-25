import React, { useRef, useState } from 'react';
import * as tf from "@tensorflow/tfjs";
import * as posenet from "@tensorflow-models/posenet";
import Webcam from "react-webcam";

const Sketch = () => {
  const webcamRef = useRef(null);
  //Interval
  let interval;

  // Invoked onClick of start button
  const startDetection = async () => {
    //Straight posture variable
    let straightPosture = 0;


    //Load posenet
    const net = await posenet.load();

    //get video properties
    const {video, videoWidth, videoHeight} = getVideo(webcamRef);
    const webcam = webcamRef.current;

    if (typeof webcam !== "undefined" && webcam !== null && webcam.video.readyState === 4) {
      setVideoProperties(videoHeight, videoWidth);

      //get onStart posture coordinates
      const pose = await net.estimateSinglePose(video);
      straightPosture = Math.ceil(pose.keypoints[1].position.y);
      console.log('Straight Posture:: ' + straightPosture);
    }

    const lowerBound = straightPosture - 10;
    const upperBound = straightPosture + 10;

    // compare correct posture to real time posture and blur when correctPosture != realTimePosture
    if (straightPosture) {
      interval = setInterval(async function () {
        const realTimePose = await net.estimateSinglePose(video);
        let eyePosition = Math.ceil(realTimePose.keypoints[1].position.y);
        console.log(eyePosition);

        while (eyePosition < lowerBound || eyePosition > upperBound) {
          console.log('Screen is blurry');
          document.body.style.filter = 'blur(10px)';
          document.body.style.transition = '.1s';

          eyePosition = await net.estimateSinglePose(video)
            .then(d => d.keypoints[1].position.y);

          if (eyePosition > lowerBound && eyePosition < upperBound) {
            document.body.style.filter = 'blur(0px)';
          }
        }
      }, 1000);
    }
  };

  const stopDetection = () => {
    if (interval) {
      clearInterval(interval);
    }
  };


  const getVideo = (webcamRef) => {
    const video = webcamRef.current.video;
    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;

    return {video, videoWidth, videoHeight};
  };
  const setVideoProperties = (height, width) => {
    webcamRef.current.video.height = height;
    webcamRef.current.video.width = width;
  };


  return (
    <div>
      <button onClick={() => {
        console.log('Started');
        startDetection();
      }}>Start
      </button>
      <button onClick={() => {
        console.log('stopped');
        stopDetection();
      }}>Stop
      </button>

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
    </div>
  )


};

export default Sketch;

