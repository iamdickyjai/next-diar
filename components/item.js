import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlay, faCirclePause } from '@fortawesome/free-solid-svg-icons';

import styles from '../styles/Item.module.css';
import { DataContext, PlayContext } from './reducer';

export default function Item({ index, startTime, endTime, spkrId, spkrName }) {
  const { info, setInfo } = React.useContext(PlayContext);
  const [state, dispatch] = React.useContext(DataContext);

  const [start, setStart] = React.useState(startTime);

  const [end, setEnd] = React.useState(endTime);
  const [speaker, setSpeaker] = React.useState(spkrName);
  const [isPlay, setPlay] = React.useState(false);

  // When the play button is pressed,
  React.useEffect(() => {
    if (isPlay) {
      setInfo({ ...info, index: index, seekTo: start, end: end });
    } else {
      if (info.index === index) {
        // Force the player to stop instantly.
        setInfo({ ...info, end: 0 });

      }
    }
  }, [isPlay])

  React.useEffect(() => {
    info.index !== index && setPlay(false);
  }, [info.index])

  // *Update the index
  React.useEffect(() => {
    if (info.at) {
      if (info.at >= start && info.at < end && info.index !== index) {
        setInfo({ ...info, index: index });
      }
    }
  }, [info.at])

  React.useEffect(() => {
    setSpeaker(spkrName);
  }, [spkrName])

  const handleSpkrChange = (event) => {
    setSpeaker(event.target.value);
  }

  const handleSpkrBlur = () => {
    const newArr = state.timestamp;
    newArr.forEach(ele => ele[2] === spkrId && (ele[3] = speaker));

    dispatch({ type: 'UPDATE_TIMESTAMP', timestamp: newArr });
  }

  const handlePlayPause = () => {
    setPlay(!isPlay);
  }

  const toDate = (sec) => {
    if (sec < 60) {
      return [sec]
    }
    if (sec < 3600) {
      let second = Math.round(sec % 60 * 100) / 100
      let minute = Math.floor(sec / 60)
      return [second, minute]
    }

    let hour = Math.floor(sec / 3600)
    let minute = Math.floor((sec % 3600) / 60)
    let second = Math.round(sec % 60 * 100) / 100
    return [second, minute, hour]
  }

  const displayDate = (sec) => {
    const arr = toDate(sec)

    if (arr.length === 1) {
      return `0:${sec.toString().padStart(2, '0')}`
    } else if (arr.length === 2) {
      return `${arr[1].toString().padStart(2, '0')}:${arr[0].toString().padStart(2, '0')}`
    } else {
      return `${arr[2].toString().padStart(2, '0')}:${arr[1].toString().padStart(2, '0')}:${arr[0].toString().padStart(2, '0')}`
    }
  }

  return (
    <div className={styles.top}>
      <span className={styles.index}>#{index + 1}</span>
      <div className={styles.middle}>
        <div className={styles.info}>
          <div>Start at {displayDate(start)} End at {displayDate(end)}</div>
          <div>Speaked by <input type='text' value={speaker} onChange={handleSpkrChange} onBlur={handleSpkrBlur} className={styles.spkr} /></div>
        </div>
      </div>
      {isPlay ? <FontAwesomeIcon icon={faCirclePause} className={styles.play} onClick={handlePlayPause} /> :
        <FontAwesomeIcon icon={faCirclePlay} className={styles.play} onClick={handlePlayPause} />}
    </div>
  )
}