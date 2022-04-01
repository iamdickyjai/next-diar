import { useRouter } from "next/router";
import cn from 'classnames';
import React from "react";
import ReactPlayer from 'react-player';

import { DataContext, PlayContext } from "../../components/reducer";
import Item from "../../components/item";
import Subtitle from "../../components/subtitle";
import Extract from "../../components/extract";
import Processing from "../../components/processing";
import styles from '../../styles/App.module.css';

export default function App() {
  const [state, dispatch] = React.useContext(DataContext);
  const [isLoading, setLoading] = React.useState(true);

  const player = React.useRef();
  const url = React.useRef(URL.createObjectURL(state.file));
  const [playing, setPlaying] = React.useState(false);
  const [info, setInfo] = React.useState({
    index: null,
    seekTo: 0,
    end: 0,
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
  })

  React.useEffect(() => {
    if (player.current) {
      if (info.index !== null) {
        player.current.seekTo(info.seekTo, 'seconds');
        setPlaying(true);
      } else {
        setPlaying(false);
      }
    }
  }, [info])

  const handleProgress = (s) => {
    if (s.playedSeconds > info.end || s.played === 1) {
      setInfo({ ...info, index: null });
    }
  }

  return (
    <>
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
                  onProgress={handleProgress} />

              </div>
              <div className={styles.main}>
                {state.timestamp.map((ele, index) => <Item key={index} timestamp={ele} index={index} />)}
              </div>
            </>
          }

        </div>
      </PlayContext.Provider>
    </>
  )
}