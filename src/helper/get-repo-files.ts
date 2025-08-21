import { octokit } from "./github-client";

async function getAllRepoFiles(url: string) {
  try {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)(?:\/|$)/);
    const owner = match?.[1];
    const repo = match?.[2].replace(/\.git$/, "");
    // Get reference to main branch (fallback to master if main doesn’t exist)
    let ref;
    try {
      ({ data: ref } = await octokit.git.getRef({
        owner:owner!,
        repo:repo!,
        ref: "heads/main",
      }));
    } catch {
      ({ data: ref } = await octokit.git.getRef({
        owner:owner!,
        repo:repo!,
        ref: "heads/master",
      }));
    }

    const latestCommitSha = ref.object.sha;
    console.log("Latest commit SHA:", latestCommitSha);

    // Get commit details
    const { data: commit } = await octokit.git.getCommit({
      owner:owner!,
      repo:repo!,
      commit_sha: latestCommitSha,
    });

    const treeSha = commit.tree.sha;

    // Get full repo tree (recursive true)
    const { data: treeData } = await octokit.git.getTree({
      owner:owner!,
        repo:repo!,
      tree_sha: treeSha,
      recursive: "true",
    });

    // Allowed file extensions
    const allowedExtensions = [".js", ".ts", ".jsx", ".tsx"];

    // Filter only main code files
    const codeFiles = treeData.tree
      .filter(
        (item) =>
          item.type === "blob" &&
          allowedExtensions.some((ext) => item.path.endsWith(ext))
      )
      .map((item) => ({
        path: item.path,
        sha: item.sha,
        size: item.size ?? null,
        url: item.url,
      }));
    return {owner,repo,codeFiles};
  } catch (error) {
    console.error("Error fetching repo details:", error);
    throw error;
  }
}

export default getAllRepoFiles;
