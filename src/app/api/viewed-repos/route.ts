import dbConnection from "@/lib/db-connect";
import { AnalyzedRepoModel } from "@/models/repo.model";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest) {
  await dbConnection();
  try {

    const {userID} = await request.json()

    const { userId } = await auth();
    console.log("user Id",userId);
    
    const repos = await AnalyzedRepoModel.find({ users: userID || userId });

    console.log(repos);

    if (!repos || repos.length === 0) {
      return NextResponse.json(
        { success: false, message: "No Repo Viewed" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Repo is there", data: repos },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error fetching analyzed repos:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error",
    });
  }
}
