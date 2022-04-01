import React from 'react';
import cn from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlay, faCirclePause } from '@fortawesome/free-solid-svg-icons';

import styles from '../styles/Item.module.css';
import { PlayContext } from './reducer';

export default function Item({ timestamp, index }) {
  const { info, setInfo } = React.useContext(PlayContext);

  const [start, setStart] = React.useState(timestamp[0]);
  const [end, setEnd] = React.useState(timestamp[1]);
  const [speaker, setSpeaker] = React.useState(timestamp[2]);
  const [isPlay, setPlay] = React.useState(false);

  React.useEffect(() => {
    if (isPlay) {
      // When this start to play
      setInfo({ index: index, seekTo: start, end: end });
    } else {
      // When this pause
      info.index == index && setInfo({ ...info, index: null })
    }
  }, [isPlay])

  React.useEffect(() => {
    info.index !== index && setPlay(false);
  }, [info.index])

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
    <div className={cn(styles.container, { [styles.selected]: isPlay },)}>
      <span className={styles.index}>#{index}</span>
      <div className={styles.middle}>
        <div className={styles.info}>
          <div>Start at: {displayDate(start)} End at {displayDate(end)}</div>
          <div>Speak by {speaker}</div>
        </div>
      </div>
      {isPlay ? <FontAwesomeIcon icon={faCirclePause} className={styles.play} onClick={handlePlayPause} /> :
        <FontAwesomeIcon icon={faCirclePlay} className={styles.play} onClick={handlePlayPause} />}
    </div>
  )
}