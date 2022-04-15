import React from "react";
import cn from 'classnames';
import download from "downloadjs";
import toast from "react-hot-toast";

import Item from "./item";
import Option from "./option";
import CustomSelect from "./select";
import appWrapper from '../styles/AppWrapper.module.css';
import styles from '../styles/Item.module.css';
import styless from '../styles/Extract.module.css';
import { DataContext, PlayContext } from "./reducer";

export default function Extract() {
  const [state, dispatch] = React.useContext(DataContext);
  const { info, setInfo } = React.useContext(PlayContext);
  const [checked, setChecked] = React.useState(Array(state.timestamp.length).fill(false));
  const [isFilter, setFilter] = React.useState(false);
  const [selectedSpkr, setSpeaker] = React.useState("");
  const checkList = React.useRef(Array(state.timestamp.length).fill(false));

  const handleChecked = (index) => {
    const newArr = [...checked];
    newArr[index] = !newArr[index];
    setChecked(newArr);
  }

  const handleSelectAll = () => {
    setChecked(Array(state.timestamp.length).fill(true));
  }

  const handleClear = () => {
    setChecked(Array(state.timestamp.length).fill(false));
  }

  const handleFilter = () => {
    setFilter(!isFilter);
  }

  const handleSelectChange = (event) => {
    setSpeaker(event.target.value);
  }

  const handleDownload = async () => {
    toast.loading("Processing...", { id: "loading" });

    const selectedTimestamp = [];
    checked.forEach((ele, index) => {
      if (ele && checkList.current[index] == true) {
        selectedTimestamp.push(state.timestamp[index])
      }
    })

    const formData = new FormData();
    formData.append("file", state.file);
    // formData.append("timestamp", selectedTimestamp);
    selectedTimestamp.forEach(ele => formData.append("timestamp[]", ele));

    const res = await fetch(`${process.env.url}/download/multiple`, {
      method: 'POST',
      body: formData,
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    })

    const zip = await res.blob();
    download(zip, 'result.zip');
    toast.dismiss(toast.loading("", { id: "loading" }));
  }

  return (
    <>
      <Option handleSelectAll={handleSelectAll} handleClear={handleClear} handleFilter={handleFilter}
        isFilter={isFilter} />
      <CustomSelect timestamp={state.timestamp} handleSelectChange={handleSelectChange} selectedSpkr={selectedSpkr} isFilter={isFilter} />
      <div className={appWrapper.itemContainer}>
        {state.timestamp.map((ele, index) => {
          if ((!isFilter || (isFilter && ele[1] - ele[0] > 3)) && (selectedSpkr === "" || selectedSpkr == ele[2])) {
            checkList.current[index] = true;
            return (
              <div className={styless.record} key={index}>
                <input type='checkbox' id={index} className={styless.checkBox} checked={checked[index]} onChange={() => handleChecked(index)} />
                <label htmlFor={index} className={cn(styles.wrapper, { [styles.selected]: info.index === index },)}>
                  <Item index={index} startTime={ele[0]} endTime={ele[1]} spkrId={ele[2]} spkrName={ele[3]} />
                </label>
              </div>
            )
          } else {
            checkList.current[index] = false;
          }
        })
        }
      </div>
      <button onClick={handleDownload} disabled={!checked.some((ele, index) => ele && checkList.current[index])}
        className={styless.dlBtn}>
        Download
      </button>
    </>
  )
}