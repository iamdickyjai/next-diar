import React from "react";
import { FormHelperText, MenuItem, Select } from '@mui/material';

export default function CustomSelect({ timestamp, handleSelectChange, selectedSpkr, isFilter }) {
  const spkrGp = [["", "Show All"]];

  const testArr = [];
  // This array is [spkrId, spkrName, duration]
  timestamp.forEach(ele => testArr.push([ele[2], ele[3], ele[1] - ele[0]]));
  testArr.sort((a, b) => a[0] - b[0]);

  testArr.forEach((ele, index) => {
    if (isFilter) {
      if (ele[2] > 3) {
        if (index > 0) {
          ele[0] !== spkrGp[spkrGp.length - 1][0] && spkrGp.push(ele);
        } else {
          spkrGp.push(ele);
        }
      }
    } else {
      if (index > 0) {
        ele[0] !== spkrGp[spkrGp.length - 1][0] && spkrGp.push(ele);
      } else {
        spkrGp.push(ele);
      }
    }
  })

  return (
    <>
      <Select value={selectedSpkr} displayEmpty onChange={handleSelectChange}>
        {spkrGp.map(ele => <MenuItem key={`${ele[0]}_${ele[1]}`} value={ele[0]}>{ele[1]}</MenuItem>)}
      </Select>
      <FormHelperText>*Choose the speaker you want to show</FormHelperText>
    </>
  )
}