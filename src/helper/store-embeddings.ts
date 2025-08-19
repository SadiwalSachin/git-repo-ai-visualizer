import { VertexAIEmbeddings } from "@langchain/google-vertexai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { Document } from "@langchain/core/documents";

import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY,
  model: "text-embedding-004",
  taskType: TaskType.RETRIEVAL_DOCUMENT,
  title: "Document title",
});

const pinecone = new PineconeClient({apiKey:process.env.PINECONE_API_KEY!});

const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);

const vectorStore = new PineconeStore(embeddings, {
  pineconeIndex,
  maxConcurrency: 5,
});

export default async function storeEmbeddings({ content, path ,repoUrl}:{content:string,path:string,repoUrl:string}):Promise<string[] | void> {
  try {
    const doc = new Document({
      pageContent: content,
      metadata: {
        source: path,
        repoUrl
      },
    });
    const result = await vectorStore.addDocuments([doc]);

    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function searchInVectorStore(url:string,userQuery:string){
  try {

    console.log("searchInVectorStore called");

    console.log(url , userQuery);
    
    const filter = {repoUrl:url}

    const similaritySearchResults = await vectorStore.similaritySearch(
      userQuery,
      2,
      filter
    );

    return similaritySearchResults
  } catch (error) {
    console.log("some error occured in searchInVectorStore");
  }
}
