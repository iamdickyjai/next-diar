import React from "react";
import cn from 'classnames';

import Item from "./item";
import styles from '../styles/Item.module.css';
import { DataContext, PlayContext } from "./reducer";

export default function Extract() {
  const [state, dispatch] = React.useContext(DataContext);
  const { info, setInfo } = React.useContext(PlayContext);

  return (
    <>
      <h1>THis is {state.application}</h1>
      {state.timestamp.map((ele, index) =>
        <div className={cn(styles.container, { [styles.selected]: info.index === index },)}>
          <Item key={index} timestamp={ele} index={index} />
        </div>
      )}
    </>
  )
}