import { createAgent, gemini } from '@inngest/agent-kit';
import { get_embeddings } from '../tools/vector-db-tool';

const model = gemini({model:"gemini-1.5-flash",apiKey:process.env.GEMINI_API_KEY})

const selectAgent = createAgent({
    name:"User Query Resolver",
    system:"you are an git hub code explanation agent you analyze the user query and resolve the users query explain what user wanted to understand use tools if required to fetch the code and then explain via these code you can call this tool getEmbeddingsViaVectorDB it will return the vector embeddings and all to get the requiered details You are a GitHub code explanation agent.You may use the tool get_embeddings to fetch relevant code snippets. After calling a tool:You MUST read tool result Then continue reasoning Finally, explain clearly to the user in natural language.Never stop after just calling the tool.",
    model,
    tools:[get_embeddings],
})

export default selectAgent