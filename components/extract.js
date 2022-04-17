import React from "react";
import cn from 'classnames';
import download from "downloadjs";
import toast from "react-hot-toast";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

import Item from "./item";
import Option from "./option";
import CustomSelect from "./select";
import appWrapper from '../styles/AppWrapper.module.css';
import styles from '../styles/Item.module.css';
import styless from '../styles/Extract.module.css';
import { DataContext, PlayContext, ThemeContext } from "./reducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Pagination } from "@mui/material";

export default function Extract() {
  const { theme, setTheme } = React.useContext(ThemeContext);
  const [state, dispatch] = React.useContext(DataContext);
  const { info, setInfo } = React.useContext(PlayContext);
  const [checked, setChecked] = React.useState(Array(state.timestamp.length).fill(false));
  const [isFilter, setFilter] = React.useState(false);
  const [selectedSpkr, setSpeaker] = React.useState("");
  const [displayedItem, setDisplay] = React.useState(state.timestamp);
  const [page, setPage] = React.useState(1);

  const pageCount = 10;

  React.useEffect(() => {
    const itemOnScreen = state.timestamp.filter((ele) => (!isFilter || (isFilter && ele[1] - ele[0] > 3)) && (selectedSpkr === "" || selectedSpkr == ele[2]));
    setPage(1);
    setDisplay(itemOnScreen);
  }, [isFilter, selectedSpkr])

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

  const handlePageChange = (event, value) => {
    setPage(value);
  }

  const handleDownload = async () => {
    toast.loading("Processing...", { id: "loading" });

    const selectedTimestamp = [];
    selectedTimestamp = displayedItem.filter(ele => checked[ele[4]] == true)

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
        {displayedItem.map((ele, index) => {
          return (
            <div className={styless.record} key={ele[4]}>
              <label>
                <FontAwesomeIcon icon={faCircleCheck} className={cn(styless.checkIcon, { [styless.checkBoxSelected]: checked[ele[4]] })} />
                <input type='checkbox' id={index} className={styless.checkBox} checked={checked[index]} onChange={() => handleChecked(ele[4])} />
              </label>
              <label htmlFor={index} className={cn(styles.wrapper, { [styles.wrapperLight]: theme === 'light' }, { [styles.selected]: info.index === ele[4] },)}>
                <Item index={ele[4]} startTime={ele[0]} endTime={ele[1]} spkrId={ele[2]} spkrName={ele[3]} />
              </label>
            </div>
          )
        }).slice(pageCount * (page - 1), pageCount * (page - 1) + pageCount)
        }
        <Pagination page={page} count={Math.ceil(displayedItem.length / pageCount)}
          onChange={handlePageChange} showFirstButton showLastButton />
      </div>
      <button onClick={handleDownload} disabled={!displayedItem.some((ele) => checked[ele[4]] == true)}
        className={styless.dlBtn}>
        Download
      </button>
    </>
  )
}