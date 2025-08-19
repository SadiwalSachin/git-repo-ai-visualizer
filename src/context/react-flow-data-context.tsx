"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Define types for context
interface ReactFlowDataContextType {
  nodeData: any;
  setNodeData: React.Dispatch<React.SetStateAction<any>>;
  repoUrl:string,
  setRepoUrl:React.Dispatch<React.SetStateAction<string>>
}

const ReactFlowDataContext = createContext<ReactFlowDataContextType | undefined>(undefined);

export const ReactFlowDataContextProvider = ({ children }: { children: ReactNode }) => {
  const [nodeData, setNodeData] = useState<any>({nodes:[],edges:[]}); 
  const [repoUrl,setRepoUrl] = useState<string>("")

  return (
    <ReactFlowDataContext.Provider value={{ nodeData, setNodeData,repoUrl,setRepoUrl }}>
      {children}
    </ReactFlowDataContext.Provider>
  );
};

export const useReactFlowData = () => {
  const context = useContext(ReactFlowDataContext);
  if (!context) {
    throw new Error("useAuth must be used within a UserAuthContextProvider");
  }
  return context;
};
