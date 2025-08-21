import { AnalyzedRepoModel } from "@/models/repo.model";
import { inngest } from "../client";

export const extractRepoCode = inngest.createFunction(
  { id: "extract-repo-code" },
  { event: "extract/repo-code" },
  async ({ event, step }) => {
    const { repoUrl, repoFiles, owner, repo } = event.data;
    for (const file of repoFiles) {
      await inngest.send({
        name: "extract/file-code",
        data: { repoUrl, file, owner, repo },
      });
    }
    await AnalyzedRepoModel.findOneAndUpdate(
      { repoUrl },                    
      { $set: { embeddingsProcessed: true } },
      { new: true }
    )
    return {
      status: "queued",
      filesCount: repoFiles.length,
      message:
        "File extraction events queued. Inngest will retry failures automatically.",
    };
  }
);
