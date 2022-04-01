import React from "react";

import Item from "./item";
import { DataContext } from "./reducer";

export default function Subtitle() {
  const [state, dispatch] = React.useContext(DataContext);

  return (
    <>
      {state.timestamp.map((ele, index) => <Item key={index} timestamp={ele} index={index} Content={Main} />)}
    </>
  )
}

function Main() {
  return (
    <input type='text' />
  )
}