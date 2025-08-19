import { AnalyzedRepoModel } from "@/models/repo.model";
import { octokit } from "./github-client";

async function repoDetails(url: string) {
  try {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)(?:\/|$)/);

    const owner = match?.[1];
    const repo = match?.[2].replace(/\.git$/, "");

    await AnalyzedRepoModel.findOneAndUpdate({repoUrl:url},{$set:{
      owner:owner
    }})


    console.log(`URL coming from frontend: ${url}`);
    console.log("Owner:", owner, "Repo:", repo);

    const { data: ref } = await octokit.git.getRef({
      owner:owner!,
      repo:repo!,
      ref: "heads/main",
    });

    const latestCommitSha = ref.object.sha;
    console.log("Latest commit SHA:", latestCommitSha);

    const { data: commit } = await octokit.git.getCommit({
      owner:owner!,
      repo:repo!,
      commit_sha: latestCommitSha,
    });

    const treeSha = commit.tree.sha;

    const { data: treeData } = await octokit.git.getTree({
      owner:owner!,
      repo:repo!,
      tree_sha: treeSha,
      recursive: "true",
    });

    const allFilesAndFolders = treeData.tree.map((item) => ({
      path: item.path,
      type: item.type,
      sha: item.sha,
      size: item.size ?? null,
      url: item.url,
    }));

    console.log("Repo structure:", allFilesAndFolders);

    return {allFilesAndFolders,owner,repo};
  } catch (error) {
    console.error("Error fetching repo details:", error);
    throw error;
  }
}

export default repoDetails;
