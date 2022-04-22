import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlay, faCirclePause, faHeadset } from '@fortawesome/free-solid-svg-icons';

import styles from '../styles/Item.module.css';
import { DataContext, PlayContext } from './reducer';
import toast from 'react-hot-toast';

export default function Item({ index, startTime, endTime, spkrId, spkrName }) {
  const { info, setInfo } = React.useContext(PlayContext);
  const [state, dispatch] = React.useContext(DataContext);

  const [start, setStart] = React.useState(startTime);

  const [end, setEnd] = React.useState(endTime);
  const [speaker, setSpeaker] = React.useState("");
  const prevSpkr = React.useRef();
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
    setSpeaker(spkrName)
  }, [spkrName])

  const handleSpkrChange = (event) => {
    setSpeaker(event.target.value)
  }

  const handleSpkrBlur = (event) => {
    // Validate if the speaker conflict with other first
    const name = (ele) => ele[2] === spkrId ? true : ele[3] !== speaker;
    const validate = state.timestamp.every(name)

    if (validate) {
      const newArr = state.timestamp;
      newArr.forEach(ele => ele[2] === spkrId && (ele[3] = speaker));

      if (speaker !== undefined) {
        prevSpkr.current = speaker;
      }

      dispatch({ type: 'UPDATE_TIMESTAMP', timestamp: newArr });
    } else {
      toast.error("Speaker Conflicted!", { duration: 1000 });
      setSpeaker(prevSpkr.current);
      event.target.focus();
    }
  }

  const handlePlayPause = () => {
    setPlay(!isPlay);
  }

  const toDate = (sec) => {
    let millisecond = Math.round((sec - Math.floor(sec)) * 100)
    let second = Math.floor(sec % 60);
    let minute = Math.floor(sec / 60);
    return [millisecond, second, minute]
  }

  const displayDate = (sec) => {
    const arr = toDate(sec)

    const ms = arr[0];
    const s = arr[1];
    const min = arr[2];

    return `${min}:${s.toString().padStart(2, '0')},${ms.toString().padStart(2, '0')}`;

    // return `0:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div className={styles.top}>
      <span className={styles.index}>#{index + 1}</span>
      <div className={styles.middle}>
        <div className={styles.info}>
          <div>Start at {displayDate(start)} End at {displayDate(end)}</div>
          <div>
            <FontAwesomeIcon icon={faHeadset} className={styles.spkrIcon} />
            Speaker&nbsp;
            <input type='text' value={speaker} onChange={handleSpkrChange} onBlur={handleSpkrBlur} className={styles.spkr} /></div>
        </div>
      </div>
      {isPlay ? <FontAwesomeIcon icon={faCirclePause} className={styles.play} onClick={handlePlayPause} /> :
        <FontAwesomeIcon icon={faCirclePlay} className={styles.play} onClick={handlePlayPause} />}
    </div>
  )
}