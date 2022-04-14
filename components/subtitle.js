import React from "react";
import cn from 'classnames';
import download from "downloadjs";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

import Item from "./item";
import Option from "./option";
import appWrapper from '../styles/AppWrapper.module.css';
import styles from '../styles/Item.module.css';
import styless from '../styles/Subtitle.module.css';
import { DataContext, PlayContext } from "./reducer";

export default function Subtitle() {
  const [state, dispatch] = React.useContext(DataContext);
  const { info, setInfo } = React.useContext(PlayContext);
  const [subtitles, setSubtitle] = React.useState(Array(state.timestamp.length).fill(''));
  const [asrBtnDisabled, setAsrBtn] = React.useState(false);

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

  const handleRequest = async () => {
    const timestamps = state.timestamp;
    const audio = state.file;

    try {
      toast.loading("Processing...", { id: "loading" });
      setAsrBtn(true);

      const formData = new FormData();
      formData.append("file", audio);
      formData.append("timestamps", state.timestamp);

      const response = await fetch(process.env.url + '/asr', {
        method: "POST",
        body: formData,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      })

      // Wait for response
      // Success: return result
      // Failed: show error and enable inputSelection again.
      const result = await response.json();
      toast.dismiss(toast.loading("", { id: "loading" }));

      if (response.status == 200) {
        const newArr = [];
        const isNull = true;
        result.result.forEach((ele, index) => {
          if (ele[0] === "") {
            newArr.push(subtitles[index]);
          } else {
            isNull = false;
            newArr.push(ele[0])
          }
        })
        if (isNull) {
          toast.error("Server do not receive any transcript!", { duration: 1000 });
        } else {
          toast.success("Updated!", { duration: 1000 })
        }
        setSubtitle(newArr);
      } else {
        switch (response.status) {
          case 500:
            toast.error("Server error occured", { id: "error", duration: 2000 });
            break;
          default:
            toast.error(`Error ${response.status}`, { id: "error", duration: 2000 });
            break;
        }
      }
    } catch (error) {
      console.log(error);
      toast.dismiss(toast.loading("", { id: "loading" }));
      toast.error("Unexpected error occurred, please try again later.", { id: 'error' });
    } finally {
      setAsrBtn(false);
    }
  }

  const handleInput = (event, index) => {
    const newArr = [];
    subtitles.forEach((ele, index) => {
      newArr[index] = ele;
    });
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
      <Option handleRequest={handleRequest} asrBtnDisabled={asrBtnDisabled} />
      <div className={appWrapper.itemContainer}>
        {state.timestamp.map((ele, index) =>
          <div key={index} className={cn(styles.wrapper, { [styles.selected]: info.index === index },)}>
            <Item index={index} startTime={ele[0]} endTime={ele[1]} spkrId={ele[2]} spkrName={ele[3]} />
            <input className={styles.input} type='text'
              placeholder="Type your script or comment here"
              onChange={(event) => handleInput(event, index)}
              value={subtitles[index]} />
          </div>
        )}
      </div>
      <div className={styless.footer}>
        <span className={styless.export}>Export</span>
        <div className={styless.formatOption}>
          <button className={styless.btn} onClick={() => handleExport('srt')}>Subtitle? (.srt)</button>
          <button className={styless.btn} onClick={() => handleExport('txt')}>Label or comment? (.txt)</button>
        </div>
      </div>
    </>
  )
}