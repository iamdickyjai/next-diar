import React from "react";
import cn from 'classnames';
import download from "downloadjs";
import toast from "react-hot-toast";
import { Pagination } from "@mui/material";

import Item from "./item";
import Option from "./option";
import appWrapper from '../styles/AppWrapper.module.css';
import styles from '../styles/Item.module.css';
import styless from '../styles/Subtitle.module.css';
import { ThemeContext, DataContext, PlayContext } from "./reducer";

export default function Subtitle() {
  const { theme, setTheme } = React.useContext(ThemeContext);
  const [state, dispatch] = React.useContext(DataContext);
  const { info, setInfo } = React.useContext(PlayContext);
  const [subtitles, setSubtitle] = React.useState(Array(state.timestamp.length).fill(''));
  const [asrBtnDisabled, setAsrBtn] = React.useState(false);
  const [isFilter, setFilter] = React.useState(false);
  const [displayedItem, setDisplay] = React.useState(state.timestamp);
  const [page, setPage] = React.useState(1);

  const snapshot4ReceiveASR = React.useRef();

  const pageCount = 10;

  React.useEffect(() => {
    const itemOnScreen = state.timestamp.filter((ele) => (!isFilter || (isFilter && ele[1] - ele[0] > 3)));
    setPage(1);
    setDisplay(itemOnScreen);
  }, [isFilter])

  React.useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [page])

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
    const timestamps = displayedItem.map(ele => [ele[0], ele[1], ele[2], ele[3]]);
    const audio = state.file;

    try {
      toast.loading("Processing...", { id: "loading" });
      setAsrBtn(true);

      const formData = new FormData();
      formData.append("file", audio);
      formData.append("timestamps", timestamps);

      snapshot4ReceiveASR.current = displayedItem;

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
        const newArr = [...subtitles];
        const isNull = true;
        result.result.forEach((ele, index) => {
          const pointTo = snapshot4ReceiveASR.current[index];
          const subtitleIndex = pointTo[4];

          if (ele[0] !== "") {
            isNull = false;
            newArr[subtitleIndex] = ele[0];
          }
        })

        snapshot4ReceiveASR.current = null
        if (isNull) {
          toast.error("Server do not receive any transcript!", { duration: 1000 });
        } else {
          toast.success("Updated!", { duration: 1000 })
        }
        setSubtitle(newArr);
      } else {
        setAsrBtn(false);
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
      toast.dismiss(toast.loading("", { id: "loading" }));
      toast.error("Unexpected error occurred, please try again later.", { id: 'error' });
    } finally {
      setAsrBtn(false);
    }
  }

  const handleFilter = () => {
    setFilter(!isFilter);
  }

  const handleInput = (event, index) => {
    const newArr = [...subtitles];
    newArr[index] = event.target.value;
    setSubtitle(newArr);
  }

  const handlePageChange = (event, value) => {
    setPage(value);
  }

  const handleExport = (format) => {
    if (format === 'srt') {
      const output = [];
      displayedItem.forEach((ele) => {
        if (subtitles[ele[4]]) {

          const start = toDate(ele[0], 'standard');
          const end = toDate(ele[1], 'standard')
          const spkr = ele[3];
          output.push(ele[4] + '\n');
          output.push(`${start} --> ${end}\n`)
          output.push(spkr + " said: " + subtitles[ele[4]] + '\n');
          output.push('\n');
        }
      })

      download(new Blob(output), 'subtitle.srt');
      return;
    }

    if (format === 'txt') {
      const output = [];
      displayedItem.forEach((ele) => {
        if (subtitles[ele[4]]) {

          const start = toDate(ele[0], 'short');
          const spkr = ele[3];

          output.push(`at ${start}, ${spkr} said: ${subtitles[ele[4]]}\n`);
          output.push('\n');
        }
      })

      download(new Blob(output), 'result.txt');
      return;
    }
  }

  return (
    <>
      <Option handleRequest={handleRequest} handleFilter={handleFilter}
        asrBtnDisabled={asrBtnDisabled} isFilter={isFilter} />
      <div className={appWrapper.itemContainer}>
        {displayedItem.map((ele, index) => {
          return (
            <div key={ele[4]} className={cn(styles.wrapper, { [styles.wrapperLight]: theme === 'light' }, { [styles.selected]: info.index === ele[4] },)}>
              <Item index={ele[4]} startTime={ele[0]} endTime={ele[1]} spkrId={ele[2]} spkrName={ele[3]} />
              <input className={styles.input} type='text'
                placeholder="Type your script or comment here"
                onChange={(event) => handleInput(event, ele[4])}
                value={subtitles[ele[4]]} />
            </div>
          )
        }).slice(pageCount * (page - 1), pageCount * (page - 1) + pageCount)
        }

        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <Pagination page={page} count={Math.ceil(displayedItem.length / pageCount)}
            onChange={handlePageChange} showFirstButton showLastButton />
        </div>
      </div>
      <div className={styless.footer}>
        <span className={styless.export}>Export</span>
        <div className={styless.formatOption}>
          <div className={styless.btnContainer}>
            <label className={styless.btnLabel}>Looking for Subtitle?</label>
            <button className={styless.btn} onClick={() => handleExport('srt')}> .srt</button>
          </div>
          <div className={styless.btnContainer}>
            <label className={styless.btnLabel}>Label or comment?</label>
            <button className={styless.btn} onClick={() => handleExport('txt')}>.txt</button>
          </div>
        </div>
      </div>
    </>
  )
}