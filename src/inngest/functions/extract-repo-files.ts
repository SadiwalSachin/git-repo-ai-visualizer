import getAllRepoFiles from "@/helper/get-repo-files";
import { inngest } from "../client";

// extract all the files
export const extractRepoFiles = inngest.createFunction(
  { id: "extract-repo-files" },
  { event: "extract/repo-files" },
  async ({ event, step }) => {
    const { repoUrl } = event.data;

    console.log("Extracting repo files...");

    const { owner, repo, codeFiles } = await getAllRepoFiles(repoUrl);

    // Trigger the next Inngest function
    await inngest.send({
      name: "extract/repo-code",
      data: { repoUrl, repoFiles: codeFiles, owner, repo },
    });

    console.log(`Sent ${codeFiles.length} files for processing.`);
  }
);
