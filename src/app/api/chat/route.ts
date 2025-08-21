import { NextRequest, NextResponse } from "next/server";
import { routerWorkFlow } from "@/graph/run-query";


export async function POST(request: NextRequest) {
  try {
    const { userQuery,repoUrl } = await request.json();

    // console.log(userQuery,repoUrl);

    const data = await routerWorkFlow.invoke({input:userQuery,url:repoUrl})

    // console.log("data coming from the langgraph code",data);

    console.log(data);
    if (data) {
      return NextResponse.json({ success: true, data });
    }
  } catch (error) {
    console.log(error);
  }
}
