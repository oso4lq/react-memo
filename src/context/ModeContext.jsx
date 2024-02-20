import { createContext, useState } from "react";

const initialState = {
  isEnabled: false,
  setIsEnabled: () => {},
};

export const ModeContext = createContext(initialState);
export const ModeProvider = ({ children }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  console.log("switch");
  return <ModeContext.Provider value={{ isEnabled, setIsEnabled }}>{children}</ModeContext.Provider>;
};
