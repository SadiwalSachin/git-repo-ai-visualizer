import { GoogleGenAI } from "@google/genai";
import { searchInVectorStore } from "./store-embeddings";
import { date } from "zod";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const selectAgent = async ({ userQuery }: { userQuery: string }) => {
  const PROMPT = `
  You are a Tool Selector Agent.  
  Your job is to analyze the user query and decide **whether to call a tool or not**.  
  
  Available Tools:
  1. get_embeddings(userQuery)
     - Use this when the user asks to see, analyze, or explain code from a GitHub repo.
     - Example queries:
       - "Show me the code of this repo."
       - "Explain the code in file utils.js of this repo."
       - "Get the content of index.js from this GitHub repo."
       - "This tool get the vector embedding for that code."
  
   Examples:

  - User: "Find where authentication is implemented"  
    → Call **get_embeddings**  
  
  - User: "Who are you?"  
    → **Do NOT call any tool**, just reply directly.  
  
   Rules:
  - Only call a tool when it's strictly needed based on the query.  
  - If the query is conversational (e.g., greetings, unrelated chit-chat), just answer directly without tools.  
  - If the query clearly maps to one of the tools above, **output the tool name + required parameters.  
  
  Now, analyze the user query:  
  "${userQuery}"
    `;

  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "model",
          parts: [{ text: PROMPT }],
        },
        {
          role: "user",
          parts: [{ text: JSON.stringify(userQuery) }],
        },
      ],
    });

    const text = result.text;
    return text;
  } catch (error) {
    console.log(error);
  }
};

export default async function resolveUserQuery({
  userQuery,
  url,
}: {
  userQuery: string;
  url: string;
}) {
  const embeddingData = await searchInVectorStore(url, userQuery);

  console.log("embedding data in the searchInVectorStore", embeddingData);

  const PROMPT = `
  You are a **GitHub Repo Code Explainer AI**.  
  Your job: analyze the user query in relation to the provided vector embeddings (code context) and give a clear, accurate explanation of the code.  
  
  ---
  
  ### Output Format (Always Follow This)  
  You must return the answer as a JSON object with the structure:  
  
  {
    "role": "system",
    "content": "<your explanation here>"
  }
  
  ---
  
  ### Guidelines
  - If embeddings are available → use them to directly answer about that specific code section.  
  - If embeddings are not available → reason about the query logically and answer based on general programming knowledge.  
  - Always explain in **simple terms**.  
  - Provide short **code snippets** or references from the repo if useful.  
  - If the query is vague → clarify assumptions and explain the most likely interpretation.  
  
  ---
  
  ### Examples  
  
  **Example 1**  
  User Query: *"What does this function do?"*  
  Embeddings: *function add(a, b) { return a + b }*  
  Answer:  
  {
    "role": "system",
    "content": "This function takes two numbers 'a' and 'b', adds them, and returns the result."
  }
  
  ---
  
  **Example 2**  
  User Query: *"How does authentication work in this repo?"*  
  Embeddings: *Express middleware with JWT verification code*  
  Answer:  
  {
    "role": "system",
    "content": "The repo uses JWT-based authentication. When a user logs in, the server issues a signed token. On each request, the middleware verifies this token before allowing access to protected routes."
  }
  
  ---
  
  **Example 3**  
  User Query: *"Explain the use of hooks here."*  
  Embeddings: *React code with useEffect and useState*  
  Answer:  
  {
    "role": "system",
    "content": "This part of the code uses React hooks. 'useState' stores the current value and 'useEffect' runs side effects whenever dependencies change, such as fetching data when the component mounts."
  }
  
  ---
  
  **Example 4**  
  User Query: *"There are no embeddings, but can you explain what an Express router is?"*  
  Answer:  
  {
    "role": "system",
    "content": "An Express router helps modularize routes in a Node.js app. Instead of keeping all routes in 'app.js', you can create a router for each feature (e.g., 'userRoutes.js') and mount it with 'app.use('/users', userRouter)'."
  }
  
  ---
  
  Now, respond to the user query in the same structured format.  
  
  Vector embeddings of the code:  
  "${embeddingData}"
  `;

  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "model",
          parts: [{ text: PROMPT }],
        },
        {
          role: "user",
          parts: [{ text: JSON.stringify(userQuery) }],
        },
      ],
    });

    const text = result.text;

    console.log(text);

    const match = text?.match(/```json\s*([\s\S]*?)\s*```/i);

    const jsonString = match ? match[1].trim() : text?.trim();

    const parsedData = JSON.parse(jsonString!);

    return parsedData;
  } catch (error) {
    console.log(error);
  }
}

export async function resolveUserQueryWithStream({
  userQuery,
  url,
}: {
  userQuery: string;
  url: string;
}) {
  const embeddingData = await searchInVectorStore(url, userQuery);

  console.log("embedding data in the searchInVectorStore", embeddingData);

  const PROMPT = `
  You are a **GitHub Repo Code Explainer AI**.  
  Your job: analyze the user query in relation to the provided vector embeddings (code context) and give a clear, accurate explanation of the code.  
  
  ---
  
  ### Output Format (Always Follow This)  
  You must return the answer as a JSON object with the structure:  
  
  {
    "role": "system",
    "content": "<your explanation here>"
  }
  
  ---
  
  ### Guidelines
  - If embeddings are available → use them to directly answer about that specific code section.  
  - If embeddings are not available → reason about the query logically and answer based on general programming knowledge.  
  - Always explain in **simple terms**.  
  - Provide short **code snippets** or references from the repo if useful.  
  - If the query is vague → clarify assumptions and explain the most likely interpretation.  
  
  ---
  
  ### Examples  
  
  **Example 1**  
  User Query: *"What does this function do?"*  
  Embeddings: *function add(a, b) { return a + b }*  
  Answer:  
  {
    "role": "system",
    "content": "This function takes two numbers 'a' and 'b', adds them, and returns the result."
  }
  
  ---
  
  **Example 2**  
  User Query: *"How does authentication work in this repo?"*  
  Embeddings: *Express middleware with JWT verification code*  
  Answer:  
  {
    "role": "system",
    "content": "The repo uses JWT-based authentication. When a user logs in, the server issues a signed token. On each request, the middleware verifies this token before allowing access to protected routes."
  }
  
  ---
  
  **Example 3**  
  User Query: *"Explain the use of hooks here."*  
  Embeddings: *React code with useEffect and useState*  
  Answer:  
  {
    "role": "system",
    "content": "This part of the code uses React hooks. 'useState' stores the current value and 'useEffect' runs side effects whenever dependencies change, such as fetching data when the component mounts."
  }
  
  ---
  
  **Example 4**  
  User Query: *"There are no embeddings, but can you explain what an Express router is?"*  
  Answer:  
  {
    "role": "system",
    "content": "An Express router helps modularize routes in a Node.js app. Instead of keeping all routes in 'app.js', you can create a router for each feature (e.g., 'userRoutes.js') and mount it with 'app.use('/users', userRouter)'."
  }
  
  ---
  
  Now, respond to the user query in the same structured format.  
  
  Vector embeddings of the code:  
  "${embeddingData}"
  `;

  try {
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        try {
          const result = await ai.models.generateContentStream({
            model: "gemini-2.5-flash",
            contents: [
              {
                role: "model",
                parts: [{ text: PROMPT }],
              },
              {
                role: "user",
                parts: [{ text: JSON.stringify(userQuery) }],
              },
            ],
          });

          console.log(result);

          for await (const chunk of result) {
            const text = chunk.text;

            const match = text?.match(/```json\s*([\s\S]*?)\s*```/i);

            const jsonString = match ? match[1].trim() : text?.trim();

            console.log(text);
            if (text) {
              controller.enqueue(
                encoder.encode(
                  JSON.stringify({
                    type: "chunk",
                    data: jsonString,
                  })
                )
              );
            }
          }
        } catch (error) {
          console.error("Streaming error:", error);
          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                type: "error",
                data: error,
              }) + "\n"
            )
          );
        } finally {
          controller.close();
        }
      },
    });

    return stream;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Alternative simpler approach for backend streaming


// export async function resolveUserQueryWithStream({
//   userQuery,
//   url,
// }: {
//   userQuery: string;
//   url: string;
// }) {
//   const embeddingData = await searchInVectorStore(url, userQuery);

//   console.log("embedding data in the searchInVectorStore", embeddingData);
  
//   const PROMPT = `
//   You are a **GitHub Repo Code Explainer AI**.  
//   Your job: analyze the user query in relation to the provided vector embeddings (code context) and give a clear, accurate explanation of the code.  
  
//   Please respond with ONLY the explanation content, without any JSON formatting, backticks, or structure. 
//   Just provide the plain text explanation that would be helpful to the user.
  
//   ---
  
//   ### Guidelines
//   - If embeddings are available → use them to directly answer about that specific code section.  
//   - If embeddings are not available → reason about the query logically and answer based on general programming knowledge.  
//   - Always explain in **simple terms**.  
//   - Provide short **code snippets** or references from the repo if useful.  
//   - If the query is vague → clarify assumptions and explain the most likely interpretation.  
  
//   Vector embeddings of the code:  
//   "${embeddingData}"
//   `;

//   try {
//     // Create a readable stream
//     const stream = new ReadableStream({
//       async start(controller) {
//         const encoder = new TextEncoder();
        
//         try {
//           const result = await ai.models.generateContentStream({
//             model: "gemini-2.5-flash",
//             contents: [
//               {
//                 role: "model",
//                 parts: [{ text: PROMPT }],
//               },
//               {
//                 role: "user",
//                 parts: [{ text: JSON.stringify(userQuery) }],
//               },
//             ],
//           });

//           // Stream the chunks directly as content
//           for await (const chunk of result) {
//             const text = chunk;
//             if (text) {
//               // Send each chunk directly as content
//               controller.enqueue(encoder.encode(JSON.stringify({ 
//                 type: 'chunk', 
//                 data: text 
//               }) + '\n'));
//             }
//           }

//           // Send completion signal
//           controller.enqueue(encoder.encode(JSON.stringify({ 
//             type: 'complete'
//           }) + '\n'));

//         } catch (error) {
//           console.error('Streaming error:', error);
//           controller.enqueue(encoder.encode(JSON.stringify({ 
//             type: 'error', 
//             data: error
//           }) + '\n'));
//         } finally {
//           controller.close();
//         }
//       }
//     });

//     return stream;
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// }
