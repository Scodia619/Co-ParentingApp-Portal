import React, { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

type UnreadContextType = {
  totalUnread: number;
  setTotalUnread: Dispatch<SetStateAction<number>>;
};

const UnreadContext = createContext<UnreadContextType>({
  totalUnread: 0,
  setTotalUnread: () => {},
});

export const UnreadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [totalUnread, setTotalUnread] = useState<number>(0);
  return (
    <UnreadContext.Provider value={{ totalUnread, setTotalUnread }}>
      {children}
    </UnreadContext.Provider>
  );
};

export const useUnread = () => useContext(UnreadContext);
