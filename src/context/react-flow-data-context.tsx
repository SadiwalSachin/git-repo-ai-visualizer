"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface nodeData {
  nodes:[],
  edges:[]
}

interface repoInfo {
  owner:string,
  repoName:string
}

// Define types for context
interface ReactFlowDataContextType {
  nodeData: {
    nodes:[],
    edges:[]
  };
  setNodeData: React.Dispatch<React.SetStateAction<nodeData>>;
  repoUrl:string,
  setRepoUrl:React.Dispatch<React.SetStateAction<string>>
  repoInfo:{
    owner:string,
    repoName:string
  }
  setRepoInfo:React.Dispatch<React.SetStateAction<repoInfo>>
}

const ReactFlowDataContext = createContext<ReactFlowDataContextType | undefined>(undefined);

export const ReactFlowDataContextProvider = ({ children }: { children: ReactNode }) => {
  const [nodeData, setNodeData] = useState<nodeData>({nodes:[],edges:[]}); 
  const [repoUrl,setRepoUrl] = useState<string>("")
  const [repoInfo,setRepoInfo] = useState<repoInfo>({owner:"",repoName:""})

  return (
    <ReactFlowDataContext.Provider value={{ nodeData, setNodeData,repoUrl,setRepoUrl,repoInfo,setRepoInfo }}>
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
