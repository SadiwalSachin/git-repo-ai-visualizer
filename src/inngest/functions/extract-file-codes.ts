import storeEmbeddings from "@/helper/store-embeddings";
import { inngest } from "../client";
import { octokit } from "@/helper/github-client";

export const extractReposFileCode = inngest.createFunction(
  { id: "extract-file-code" },
  { event: "extract/file-code" },
  async ({ event, step }) => {
    const { repoUrl, file, owner, repo } = event.data;
    try {
      const { data } = await octokit.repos.getContent({
        owner,
        repo,
        path: file.path,
      });

      let fileContent = "";

      // GitHub can return a single file (blob) or a folder (array)
      if (!Array.isArray(data) && "content" in data) {
        // Decode Base64 content to string
        fileContent = Buffer.from(data.content, "base64").toString("utf-8");
      } else if (Array.isArray(data)) {
        console.warn("Path is a directory, not a file:", file.path);
      }
      const response  = await storeEmbeddings({content:fileContent,path:file.path,repoUrl})
      // You can now store fileContent or return it
      return { path: file.path, content: fileContent , repoUrl };
    } catch (error) {
      console.error("Error fetching file content:", error);
      throw error;
    }
  }
);
