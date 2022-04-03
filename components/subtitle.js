import React from "react";
import cn from 'classnames';
import download from "downloadjs";

import Item from "./item";
import styles from '../styles/Item.module.css';
import styless from '../styles/Subtitle.module.css';
import { DataContext, PlayContext } from "./reducer";

export default function Subtitle() {
  const [state, dispatch] = React.useContext(DataContext);
  const { info, setInfo } = React.useContext(PlayContext);
  const [subtitles, setSubtitle] = React.useState(Array(state.timestamp.length).fill(''));

  const toDate = (sec, type) => {
    if (type === 'standard') {
      let hour = Math.floor(sec / 3600)
      let minute = Math.floor((sec % 3600) / 60)
      let second = Math.floor(sec % 60)
      let ms = Math.floor(sec * 1000) - (Math.floor(sec) * 1000)
      return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`
    } else {
      let hour = Math.floor(sec / 3600)
      let minute = Math.floor((sec % 3600) / 60)
      let second = Math.floor(sec % 60)
      if (sec >= 3600) {
        return `${hour}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
      } else if (sec >= 60) {
        return `${minute}:${second.toString().padStart(2, '0')}`;
      } else {
        return `0:${second.toString().padStart(2, '0')}`;
      }
    }
  }

  const handleInput = (event, index) => {
    const newArr = subtitles;
    newArr[index] = event.target.value;
    setSubtitle(newArr);
  }

  const handleExport = (format) => {
    if (format === 'srt') {
      const output = [];
      subtitles.forEach((ele, index) => {
        const start = toDate(state.timestamp[index][0], 'standard');
        const end = toDate(state.timestamp[index][1], 'standard')
        const spkr = state.timestamp[index][3];
        output.push(index + '\n');
        output.push(`${start} --> ${end}\n`)
        output.push(ele ? (spkr + " said: " + ele + '\n') : '\n');
        output.push('\n');
      })

      // console.log(output);
      download(new Blob(output), 'subtitle.srt');
      return;
    }

    if (format === 'txt') {
      const output = [];
      subtitles.forEach((ele, index) => {
        const start = toDate(state.timestamp[index][0], 'short');
        const spkr = state.timestamp[index][3];
        if (ele) {
          output.push(`at ${start}, ${spkr} said: ${ele}\n`);
          output.push('\n');
        }
      })

      download(new Blob(output), 'result.txt');
      return;
    }
  }

  return (
    <>
      {state.timestamp.map((ele, index) =>
        <div key={index} className={cn(styles.container, { [styles.selected]: info.index === index },)}>
          <Item index={index} startTime={ele[0]} endTime={ele[1]} spkrId={ele[2]} spkrName={ele[3]} />
          <input className={styles.input} type='text'
            placeholder="Type your script or comment here"
            onChange={(event) => handleInput(event, index)} />
        </div>
      )}
      <div className={styless.footer}>
        <h1>Export</h1>
        <div className={styless.formatOption}>
          <button className={styless.btn} onClick={() => handleExport('srt')}>Subtitling? (.srt)</button>
          <button className={styless.btn} onClick={() => handleExport('txt')}>Commenting? (.txt)</button>
        </div>
      </div>
    </>
  )
}