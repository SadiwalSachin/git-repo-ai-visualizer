import { GoogleGenAI } from "@google/genai";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

interface allFilesAndFolders {
  path: string;
  type: string;
  sha: string;
  size: number | null;
  url: string | undefined;
}


async function getRepoDiagrams(repoDetails:allFilesAndFolders[]) {

    const PROMPT = `
    You are given repository details in JSON or structured text format.
    Your task is to extract the most important nodes that represent the structure of the repository.
    give them position such that they can build a tree like sturcture
    Analyze the repo detials and include important nodes dont include the ui component like button
    accordian and many design component the main focus is towards the logic of the application that 
    why include the component which share complexity in the appliaction and share contribution in application
    like the controllers , index.js file which is entry point of the application , important utilites 
    if there like payment gatway any queue system any event driven architecture code , any ai dependecies code

    
    Important nodes include:
    - Main directories (src, components, routes, utils, tests, etc.)
    - Key files (index.js, app.js, package.json, README.md, etc.)
    - Dependencies and their relationships (from package.json or requirements file)
    - Entry points (e.g., main server file, frontend entry point)
    - Any important configuration files (like .env, .gitignore, tsconfig.json, webpack.config.js)
    
    Return the extracted nodes in a **clean JSON format** like this:

    type of node structure 
        { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
        { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' } },
    
    Example of nodes

    {
      "nodes": [
        { "id":"n1",position: { x: 0, y: 0 }, data: { label: 'Src' } },
        { "id":"n1" "file", position: { x: 0, y: 0 }, data: { label: 'app.js' } },
      ],
      "edges": [
        { id: 'n1-n2', source: 'n1', target: 'n2' }
      ]
    }

    {
      "nodes": [
    {
      "id": "app",
      "position": { "x": 400, "y": 0 },
      "data": { "label": "app/", "type": "folder" },
    },
    {
      "id": "layout-tsx",
      "position": { "x": 200, "y": 120 },
      "data": { "label": "layout.tsx", "type": "layout" },
    },
    {
      "id": "page-tsx",
      "position": { "x": 600, "y": 120 },
      "data": { "label": "page.tsx", "type": "page" },
    },
    {
      "id": "components",
      "position": { "x": 400, "y": 240 },
      "data": { "label": "components/", "type": "folder" },
    },
    {
      "id": "header-tsx",
      "position": { "x": 300, "y": 360 },
      "data": { "label": "Header.tsx", "type": "component" },
    }
  ],
  "edges": [
    { "id": "app-layout", "source": "app", "target": "layout-tsx", "type": "default", "animated": false, "label": "" },
    { "id": "app-page", "source": "app", "target": "page-tsx", "type": "default", "animated": false, "label": "" },
    { "id": "app-components", "source": "app", "target": "components", "type": "default", "animated": false, "label": "" },
    { "id": "components-header", "source": "components", "target": "header-tsx", "type": "default", "animated": false, "label": "" },
    { "id": "layout-header", "source": "layout-tsx", "target": "header-tsx", "type": "smoothstep", "animated": true, "label": "import" }
  ]
}
    
    Do not explain. Only return valid JSON output.
    `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: [
        {
          role: "model",
          parts: [{ text: PROMPT }],
        },
        {
          role: "user",
          parts: [{ text: JSON.stringify(repoDetails) }],
        },
      ],
    });

    return response.text
  } catch (error) {
    console.log("some error occured in get repo -daigram");
    console.log(error);
  }
}

export default getRepoDiagrams