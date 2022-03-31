import React from 'react';
import styles from '../../styles/Test.module.css';
import Player from '../../components/player';

export default function Test() {
  const fileRef = React.createRef();
  const [file, setFile] = React.useState();
  const timestamp = [[0, 13], [13, 15], [18, 26]];
  // const timestamp = [[10, 15]];

  const handleChange = () => {
    setFile(fileRef.current.files[0]);
  }

  return (
    <>
      <h1>Test</h1>
      <input type="file" accept='audio/*' onChange={handleChange} ref={fileRef} />
      {file && timestamp.map(ele => <Player audio={file} timestamp={ele} />)}
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