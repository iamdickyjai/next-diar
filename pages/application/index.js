import { useRouter } from "next/router";
import cn from 'classnames';
import React from "react";
import ReactPlayer from 'react-player';
import Link from 'next/link';
import { Toaster } from "react-hot-toast";

import { DataContext, PlayContext } from "../../components/reducer";
import Subtitle from "../../components/subtitle";
import Extract from "../../components/extract";
import Editing from "../../components/editing";
import styles from '../../styles/App.module.css';

export default function App() {
  const [state, dispatch] = React.useContext(DataContext);
  const [isLoading, setLoading] = React.useState(true);

  const player = React.useRef();
  const url = React.useRef(state.file && URL.createObjectURL(state.file));
  const [playing, setPlaying] = React.useState(false);
  const [info, setInfo] = React.useState({
    index: null,
    seekTo: null,
    end: null,
    at: null,
  });
  const router = useRouter();

  // Return to Home page if info is not complete
  React.useEffect(() => {
    if (!state.file && !state.link) {
      router.push('/');
      return;
    }
    if (state.timestamp === null || !state.timestamp) {
      router.push('/');
      return
    }

    setLoading(false);
  }, [state.file, state.link, state.timestamp])

  React.useEffect(() => {
    // An item is clicked
    if (info.seekTo !== null) {
      player.current.seekTo(info.seekTo, 'seconds');
      setInfo({ ...info, seekTo: null });
      setPlaying(true);
    }
  }, [info.seekTo]);

  const handleProgress = (s) => {

    if (info.end !== null) {
      if (s.playedSeconds > info.end) {
        setInfo({ ...info, at: null, end: null, seekTo: null, index: null });
        setPlaying(false);
        return;
      }
    }

    // Make sure progress will not update info if the player is paused
    if (!playing) {
      setInfo({ ...info, at: null, });
      return
    }

    setInfo({ ...info, at: s.playedSeconds });
  }

  const handlePlay = () => {
    setPlaying(true);
  }

  const handlePause = () => {
    setPlaying(false)
    setInfo({ ...info, at: null, });
  }

  const handleEnded = () => {
    setPlaying(false);
    setInfo({ ...info, at: null, index: null });
  }

  return (
    <>
      <Toaster />
      <PlayContext.Provider value={{ info, setInfo }}>
        <div className={styles.container}>
          {isLoading ? <h1>Loading...</h1> :
            <>
              <div className={cn(styles.playerContainer, { [styles.audioOnly]: !state.link })}>
                <ReactPlayer url={state.link ? state.link : url.current}
                  controls
                  progressInterval={50}
                  playing={playing}
                  ref={player}
                  height='100%' width='100%'
                  onProgress={handleProgress}
                  onPlay={handlePlay}
                  onPause={handlePause}
                  onEnded={handleEnded} />
              </div>
              <div className={styles.main}>
                {state.application === 'extract' ? <Extract /> :
                  state.application === 'label' ? <Subtitle /> :
                    <Editing />}
              </div>
              <button onClick={() => router.push('/')} className={styles.goBack}>
                Go Back
              </button>
            </>
          }

        </div>
      </PlayContext.Provider>
    </>
  )
}