import { searchInVectorStore } from "@/helper/store-embeddings";
import { createTool } from "@inngest/agent-kit";
import { z } from "zod";

export const get_embeddings = createTool({
  name: "get_embeddings",
  description: "Call the vector DB to get embeddings for similarity search",
  parameters: z.object({
    url: z.string(),
    userQuery: z.string(),
  }),
  handler: async ({ url, userQuery }, { network, agent, step }) => {
    const result  = await searchInVectorStore(url,userQuery)
    return result
  },
});
