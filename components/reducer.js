import React from "react";

export const DataContext = React.createContext();

export const PlayContext = React.createContext();

export const reducers = (state, action) => {
  switch (action.type) {
    case 'UPDATE_DIAR':
      let link = null;
      if (action.link) {
        link = action.link;
      }

      return {
        ...state,
        file: action.file,
        timestamp: action.timestamp,
        link: link,
      };
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
    case 'CLEAR':
      return {
        file: null,
        timestamp: null,
        application: null,
        link: null,
      }
  }
}