import * as React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import download from 'downloadjs';

export default function Player(props) {
  const audio = props.audio;
  const timestamp = props.timestamp;

  // State management
  const audioCtx = React.useRef(new (window.AudioContext || window.webkitAudioContext)());
  const audioRef = React.useRef();

  React.useEffect(() => {
    const fileReader = new FileReader();

    fileReader.onload = function () {
      audioCtx.current.decodeAudioData(
        fileReader.result,
        function (buffer) {
          const source = audioCtx.current.createBufferSource();
          source.buffer = buffer;
          source.loop = false;
          source.start(0,
            timestamp[0],
            timestamp[1] - timestamp[0]);

          const streamNode = audioCtx.current.createMediaStreamDestination();
          source.connect(streamNode);

          // const audioElem = new Audio();
          // audioElem.controls = true;
          // audioElem.preload = 'metadata';
          // document.body.appendChild(audioElem);
          // audioElem.srcObject = streamNode.stream;

          audioRef.current.srcObject = streamNode.stream;
          // console.log(source.buffer);

          // const blob = new Blob([streamNode.stream]);
          // console.log(streamNode);
          // const url = URL.createObjectURL(blob);
          // audioRef.current.src = url;

          // download(blob, 'test.wav', 'audio/wav');
        },
        function (e) { console.log("Error"); });
    };
    fileReader.readAsArrayBuffer(audio);
  }, [])

  return (
    <>
      <audio controls preload='none' ref={audioRef}></audio>
      <button>Play/Pause</button>
    </>
  )
}

/*
export default function Player(props) {
  const audio = props.audio;
  const timestamp = props.timestamp;      // TODO: Allow user to adjust this
  const index = props.index;
  const switchPlaying = props.switchPlaying;
  const playingKey = props.playingKey;

  // Constant state
  const duration = timestamp[1] - timestamp[0];

  // State management of the player
  const [isPaused, setPaused] = React.useState(true);
  const [counter, setCounter] = React.useState(0);

  // variables for the audio processing
  const audioCtx = React.useRef(new (window.AudioContext || window.webkitAudioContext)());
  const source = React.useRef();
  const fileReader = new FileReader();
  const intervalId = React.useRef();
  const start = React.useRef();

  React.useEffect(() => {
    if (intervalId.current) {
      intervalId.current = setTimeout(() => { setCounter(audioCtx.current.currentTime - start.current); }, 30);
    }
  }, [counter])

  React.useEffect(() => {
    if (isPaused && source.current) {
      // TODO: Cancel all the Audio context and setInterval()
      source.current.stop();

      clearTimeout(intervalId.current);
    }
  }, [isPaused])

  React.useEffect(() => {
    playingKey.current !== index && setPaused(true);
  }, [playingKey.current]);

  const handlePlayPause = () => {
    if (isPaused) {
      // TODO: Play the audio
      switchPlaying(index);

      fileReader.onload = function () {
        ;
        audioCtx.current.decodeAudioData(
          fileReader.result,
          function (buffer) {
            source.current = audioCtx.current.createBufferSource();
            source.current.buffer = buffer;
            source.current.connect(audioCtx.current.destination);
            source.current.loop = false;
            source.current.start(audioCtx.current.currentTime,
              timestamp[0] + counter,
              timestamp[1] - (timestamp[0] + counter));
            source.current.onended = () => {
              // !Ended cannot replay
              clearTimeout(intervalId.current);
              setPaused(true);
            }

            start.current = audioCtx.current.currentTime - counter;
            intervalId.current = (setTimeout(() => {
              setCounter(audioCtx.current.currentTime - start.current);
            }, 30));
          },
          function (e) { console.log("Error"); });
      };
      fileReader.readAsArrayBuffer(audio);
    }

    setPaused(!isPaused);
  }

  return (
    <>
      <Slider min={0} max={duration} value={counter} step={0.01} />
      <button onClick={handlePlayPause}>Play/Pause</button>
    </>
  )
}
*/