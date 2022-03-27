import React from "react";

export const DataContext = React.createContext();

export const reducers = (state, action) => {
  switch (action.type) {
    case 'UPDATE_DIAR':
      return {
        ...state,
        file: action.file,
        timestamp: action.timestamp,
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
      }
  }
}