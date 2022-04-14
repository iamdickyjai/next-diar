import React from "react";
import cn from 'classnames';

import Item from "./item";
import Option from "./option";
import appWrapper from '../styles/AppWrapper.module.css';
import styles from '../styles/Item.module.css';
import { DataContext, PlayContext } from "./reducer";

export default function Editing() {
  const [state, dispatch] = React.useContext(DataContext);
  const { info, setInfo } = React.useContext(PlayContext);
  const [isFilter, setFilter] = React.useState(false);

  const handleFilter = () => {
    setFilter(!isFilter);
  }

  return (
    <>
      <Option handleFilter={handleFilter} isFilter={isFilter} />
      <div className={appWrapper.itemContainer}>
        {state.timestamp.map((ele, index) => {
          if (!isFilter || (isFilter && ele[1] - ele[0] > 3)) {
            return (
              <label htmlFor={index} className={cn(styles.wrapper, { [styles.selected]: info.index === index },)}>
                <Item index={index} startTime={ele[0]} endTime={ele[1]} spkrId={ele[2]} spkrName={ele[3]} />
              </label>
            )
          }
        })}
      </div>
    </>
  )
}