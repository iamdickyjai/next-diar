import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

import styles from '../styles/Option.module.css';
import { DataContext } from "./reducer";

export default function Option(props) {
  const [state, dispatch] = React.useContext(DataContext);

  if (state.application === "extract") {
    return (
      <div className={styles.largerBtnGroup}>
        <div className={styles.optionBtnGroup}>
          <button onClick={props.handleSelectAll} className={styles.optionBtn}>Select all</button>
          <button onClick={props.handleClear} className={styles.optionBtn}>Clear</button>
        </div>
        <div className={styles.filter}>
          <FontAwesomeIcon icon={faFilter} />
          <span className={styles.toolTip}>Filter segment below 1.5-second</span>
        </div>
      </div>
    )
  } else if (state.application === "label") {
    return (
      <div className={styles.largerBtnGroup}>
        <button onClick={props.handleRequest} disabled={props.asrBtnDisabled}
          className={styles.optionBtn}>
          Speech-to-text (experimental with English only)
        </button>
        <div className={styles.filter}>
          <FontAwesomeIcon icon={faFilter} />
          <span className={styles.toolTip}>Filter segment below 1.5-second</span>
        </div>
      </div>
    )
  } else {
    return (
      <div className={styles.largerBtnGroup}>
        <div className={styles.optionBtnGroup}>
          <button onClick={props.handleSelectAll} className={styles.optionBtn}>Select all</button>
          <button onClick={props.handleClear} className={styles.optionBtn}>Clear</button>
        </div>
        <div className={styles.filter}>
          <FontAwesomeIcon icon={faFilter} />
          <span className={styles.toolTip}>Filter segment below 1.5-second</span>
        </div>
      </div>
    )
  }
}