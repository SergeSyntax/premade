import { Dispatch, useEffect, useReducer } from "react";
import { Action, AlertActionType, AlertDisplayPayload, AlertState } from "./alert.type";

export const alertInitialState: AlertState = [];

const alertReducer = (state: AlertState = alertInitialState, action: Action): AlertState => {
  switch (action.type) {
    case AlertActionType.ALERT_DISPLAY:
      return [action.payload, ...state];
    case AlertActionType.ALERT_STALE:
      return state.slice(1);
    case AlertActionType.ALERT_CLEAR:
      return [];
    default:
      return state;
  }
};

export const bindActionCreators = (dispatch: Dispatch<Action>) => {
  return {
    display: (payload: AlertDisplayPayload) =>
      dispatch({ type: AlertActionType.ALERT_DISPLAY, payload }),
    stale: () => dispatch({ type: AlertActionType.ALERT_STALE }),
    clear: () => dispatch({ type: AlertActionType.ALERT_CLEAR }),
  };
};
const ALERT_TIMEOUT = 4000;

export const useAlertConsume = () => {
  const [state, dispatch] = useReducer(alertReducer, alertInitialState);
  const actions = bindActionCreators(dispatch);
  const [currentAlert] = state;

  useEffect(() => {
    const timer = setTimeout(() => {
      actions.stale();
    }, ALERT_TIMEOUT);

    return () => clearTimeout(timer);
  }, [actions, currentAlert]);

  return { currentAlert, actions, state };
};
