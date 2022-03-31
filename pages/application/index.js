import { useRouter } from "next/router";
import React from "react";
import ReactPlayer from 'react-player';

import { DataContext } from "../../components/reducer";
import Record from "../../components/record";
import styles from '../../styles/App.module.css';

export default function App() {
  const router = useRouter();
  const [state, dispatch] = React.useContext(DataContext);
  const playerRef = React.createRef();

  const [playInfo, setPlayInfo] = React.useState({
    playing: false,
    playedSeconds: 0,
    stopSecond: -1,
  })

  React.useEffect(() => {
    console.log("Playing: " + playInfo.playing);

  }, [playInfo.playing])

  React.useEffect(() => {
    console.log("PlayedSeconds: " + playInfo.playedSeconds);

    if (playInfo.playing) {
      playerRef.current.seekTo(playInfo.playedSeconds);
    }
  }, [playInfo.playedSeconds])

  React.useEffect(() => {
    console.log("stopSecond: " + playInfo.stopSecond);
  }, [playInfo.stopSecond])

  const playHandler = (start, end) => {
    setPlayInfo({ ...playInfo, playing: true, playedSeconds: start, stopSecond: end });
  }

  return (
    <>
      <div style={{ width: 500, height: 100 }}>
        <ReactPlayer
          width='100%'
          height='100%'
          ref={playerRef}
          playing={playInfo.playing}
          controls={true}
          url={URL.createObjectURL(state.file)}
          config={{
            file: {
              forceAudio: true
            },
          }}
        />
      </div>

      <div className={styles.list}>
        {state.timestamp.map((ele) => {
          return (
            <Record playHandler={playHandler} timestamp={ele} />
          )
        })}
      </div>

      <button>Submit</button>

      <div onClick={() => router.back()}>
        <h3>Go back</h3>
      </div>
    </>
  )
}