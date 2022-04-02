import React from "react";

import Item from "./item";
import { DataContext } from "./reducer";

export default function Processing() {
  const [state, dispatch] = React.useContext(DataContext);

  return (
    <>
      <h1>THis is {state.application}</h1>
      {state.timestamp.map((ele, index) => <Item key={index} timestamp={ele} index={index} />)}
    </>
  )
}