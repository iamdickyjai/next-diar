import React from "react";
import cn from 'classnames';

import Item from "./item";
import styles from '../styles/Item.module.css';
import { DataContext, PlayContext } from "./reducer";

export default function Editing() {
  const [state, dispatch] = React.useContext(DataContext);
  const { info, setInfo } = React.useContext(PlayContext);

  return (
    <>
      <h1>This is video eiding</h1>
      {state.timestamp.map((ele, index) =>
        <label htmlFor={index} className={cn(styles.container, { [styles.selected]: info.index === index },)}>
          <Item index={index} startTime={ele[0]} endTime={ele[1]} spkrId={ele[2]} spkrName={ele[3]} />
        </label>
      )}
    </>
  )
}