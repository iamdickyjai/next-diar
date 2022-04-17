import React from "react";

export const ThemeContext = React.createContext();

export const DataContext = React.createContext();

export const PlayContext = React.createContext();

export const reducers = (state, action) => {
  switch (action.type) {
    // Switch between file and link
    case 'UPDATE_DIAR':
      let link = null;
      if (action.link) {
        link = action.link;
      }

      const newArr = action.timestamp;
      newArr.forEach((ele, index) => {
        ele.push(ele[2].toString());
        ele.push(index);
      })

      return {
        ...state,
        file: action.file,
        timestamp: action.timestamp,
        link: link,
      };

    // Choosing the application desired 
    case 'UPDATE_SELECTION':
      if (state.application == action.application) {
        return {
          ...state,
          application: null,
        }
      } else {
        return {
          ...state,
          application: action.application,
        }
      }

    // Include modifying the cluster length and the spkr name
    case 'UPDATE_TIMESTAMP':
      return {
        ...state,
        timestamp: action.timestamp,
      }
    case 'CLEAR':
      return {
        file: null,
        timestamp: null,
        application: null,
        link: null,
      }
  }
}