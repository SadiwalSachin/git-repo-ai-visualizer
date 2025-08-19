import { AnalyzedRepoModel } from "@/models/repo.model";
import { inngest } from "../client";

export const extractRepoCode = inngest.createFunction(
  { id: "extract-repo-code" },
  { event: "extract/repo-code" },
  async ({ event, step }) => {
    const { repoUrl, repoFiles, owner, repo } = event.data;

    console.log("Starting repo code extraction:", repoUrl);

    for (const file of repoFiles) {
      await inngest.send({
        name: "extract/file-code",
        data: { repoUrl, file, owner, repo },
      });
    }
    console.log(
      `All file extraction events queued for repo: ${repoUrl}. Inngest retries handle failures automatically.`
    );

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
