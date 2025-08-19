import {serve} from "inngest/next" 
import { inngest } from "@/inngest/client"
import { extractRepoCode } from "@/inngest/functions/extract-repo-code"
import { extractReposFileCode } from "@/inngest/functions/extract-file-codes"
import { extractRepoFiles } from "@/inngest/functions/extract-repo-files"

export const {GET , POST , PUT} = serve({
    client:inngest,
    functions:[
        extractRepoCode,
        extractRepoFiles,
        extractReposFileCode
    ]
})