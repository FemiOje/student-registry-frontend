import React, { createContext, useContext, useState } from "react";

type NewStudentDataContextType = {
  newStudentDataContext: any;
  setNewStudentDataContext: React.Dispatch<React.SetStateAction<any>>;
};

const NewStudentContext = createContext<NewStudentDataContextType | undefined>(undefined);

export const NewStudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [newStudentDataContext, setNewStudentDataContext] = useState<any>(null);

  return (
    <NewStudentContext.Provider value={{ newStudentDataContext, setNewStudentDataContext }}>
      {children}
    </NewStudentContext.Provider>
  );
};

export const useNewStudentContext = () => {
  const context = useContext(NewStudentContext);
  if (!context) {
    throw new Error("useStudentContext must be used within a StudentProvider");
  }
  return context;
};
