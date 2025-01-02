import React, { useContext } from "react";
import { AlertState } from "./alert.type";
import { alertInitialState, bindActionCreators } from "./useAlertConsume";

interface IAlertContext {
  state: AlertState;
  actions: ReturnType<typeof bindActionCreators>;
}

export const AlertContext = React.createContext<IAlertContext>({
  state: alertInitialState,
  actions: bindActionCreators(() => {}),
});

AlertContext.displayName = "AlertContext";

export const useAlertProduce = () => useContext(AlertContext).actions;
