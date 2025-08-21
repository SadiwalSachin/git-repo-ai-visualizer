import { NextRequest, NextResponse } from "next/server";
import { inngest } from "@/inngest/client";
import repoDetails from "@/helper/get-repo-info";
import getRepoDiagrams from "@/helper/get-repo-daigram";
import { AnalyzedRepoModel } from "@/models/repo.model";
import dbConnection from "@/lib/db-connect";
import { auth } from "@clerk/nextjs/server";

interface allFilesAndFolders {
  path: string;
  type: string;
  sha: string;
  size: number | null;
  url: string | undefined;
}

export async function POST(request: NextRequest) {
  await dbConnection();
  try {

    const { url } = await request.json();

    const { userId } = await auth();

    if (!userId) {
      console.log("User id not found");
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!url) {
      console.log("URL not found");
      return NextResponse.json(
        { success: false, message: "Provide URL" },
        { status: 401 }
      );
    }

    const repo = await AnalyzedRepoModel.findOne({ repoUrl: url });

    if (repo) {
      if (!repo.embeddingsProcessed) {
        await inngest.send({
          name: "extract/repo-files",
          data: { repoUrl: url },
        });
      }
    } else {
      await AnalyzedRepoModel.create({
        repoUrl: url,
        users: [userId],
        embeddingsProcessed: false,
      });

      await inngest.send({
        name: "extract/repo-files",
        data: { repoUrl: url },
      });
    }

    const {allFilesAndFolders,owner,repo:repoName} = await repoDetails(url);

    const reactFlowNodes = await getRepoDiagrams(allFilesAndFolders);

    const match = reactFlowNodes?.match(/```json\s*([\s\S]*?)\s*```/i);

    const jsonString = match ? match[1].trim() : reactFlowNodes?.trim();

    const parsedData = JSON.parse(jsonString!);

    return NextResponse.json(
      { success: true, url, parsedData,owner,repoName },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}
