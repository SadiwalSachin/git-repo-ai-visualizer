import { NextRequest, NextResponse } from "next/server";
import resolveUserQuery from "@/helper/resolve-user-query";


export async function POST(request: NextRequest) {
  try {
    const { userQuery,repoUrl } = await request.json();

    console.log(userQuery,repoUrl);
    

    // const data = await resolveUserQuery({userQuery,url:repoUrl})

    const data = await resolveUserQuery({userQuery,url:repoUrl})

    console.log(data);
    if (data) {
      return NextResponse.json({ success: true, data });
    }
  } catch (error) {
    console.log(error);
  }
}
