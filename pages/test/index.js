import React from 'react';


import styles from '../../styles/Test.module.css';
import Player from '../../components/player_test';

export default function Test() {
  const fileRef = React.createRef();
  const [file, setFile] = React.useState();
  // const timestamp = [[0, 13], [13, 15], [18, 26]];
  const playingKey = React.useRef();
  const timestamp = [[10, 15]];

  const handleChange = () => {
    setFile(fileRef.current.files[0]);
  }

  const switchPlaying = (index) => {
    // console.log(index);
    playingKey.current = index;
  }

  return (
    <>
      <h1>Test</h1>
      <input type="file" accept='audio/*' onChange={handleChange} ref={fileRef} />
      {file && timestamp.map((ele, index) =>
        <Player audio={file} timestamp={ele} key={index} index={index} switchPlaying={switchPlaying} playingKey={playingKey} />
      )}
    </>
  )
}

/*
<audio src={url} controls className={styles.audio} ref={player}></audio>
<button onClick={() => setState("test")}>Test</button>
<button onClick={() => player.current.play()}>Play</button>
<button onClick={() => player.current.pause()}>Pause</button>
<button onClick={() => player.current.currentTime = 5}>Jump</button>
*/