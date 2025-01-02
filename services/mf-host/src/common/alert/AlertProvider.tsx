import { Alert, Snackbar } from "@mui/material";
import { AlertContext } from "./AlertContext";
import { useAlertConsume } from "./useAlertConsume";
import { ReactNode } from "react";

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const { currentAlert, actions, state } = useAlertConsume();

  return (
    <AlertContext.Provider value={{ state, actions }}>
      {children}
      <Snackbar open={Boolean(currentAlert)} onClose={actions.stale}>
        <Alert onClose={actions.stale} severity={currentAlert.severity} variant="outlined">
          {children}
        </Alert>
      </Snackbar>
    </AlertContext.Provider>
  );
};
