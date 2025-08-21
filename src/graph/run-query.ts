import { StateGraph, Annotation } from "@langchain/langgraph"
import { z } from "zod"
import llm from "./llm"
import { searchInVectorStore } from "@/helper/store-embeddings"

const routeSchema = z.object({
  step: z.enum(["generate-normal-ans", "analyze-more"])
})

const router = llm.withStructuredOutput(routeSchema)

const StateAnnotation = Annotation.Root({
  input: Annotation<string>,
  decision: Annotation<string>,
  vectorEmbeddingsCode: Annotation<string>,
  generatedCode: Annotation<string>,
  output: Annotation<string>,
  url: Annotation<string>
})

async function generateNormalAns(state: typeof StateAnnotation.State) {
  // console.log("🔹 [generateNormalAns] state:", state)
  try {
    const result = await llm.invoke([
      {
        role: "system",
        content:
          "You are an Expert in code explainer . You have to analyze the user query that what code or some technology about user wanted to know and explain him about code in simple language and by using some code snippet",
      },
      { role: "user", content: state.input }
    ])
    // console.log("✅ [generateNormalAns] output:", result.content)
    return { output: result.content }
  } catch (error) {
    // console.error("❌ [generateNormalAns] error:", error)
    throw new Error()
  }
}

async function enhanceUserQuery(state: typeof StateAnnotation.State) {
  // console.log("🔹 [enhanceUserQuery] state:", state)
  try {
    const result = await llm.invoke([
      {
        role: "system",
        content:
          "You are an expert in analyzing the user query about some coding snippet and technologies make broader ab elobrate the user query that what more user can wanted to know from you is he wanted to get to know some more technlogy or not",
      },
      { role: "user", content: state.input }
    ])
    // console.log("✅ [enhanceUserQuery] output:", result.content)
    return { input: result.content }
  } catch (error) {
    // console.error("❌ [enhanceUserQuery] error:", error)
    throw new Error()
  }
}

async function getDummyCodeOfEnhancedUserQuery(state: typeof StateAnnotation.State) {
  // console.log("🔹 [getDummyCodeOfEnhancedUserQuery] state:", state)
  try {
    const result = await llm.invoke([
      {
        role: "system",
        content:
          "You are an expert in generating or resolving error and user query of technlogy generate the code snippet what user is asking",
      },
      { role: "user", content: state.input }
    ])
    // console.log("✅ [getDummyCodeOfEnhancedUserQuery] output:", result.content)
    return { generatedCode: result.content }
  } catch (error) {
    // console.error("❌ [getDummyCodeOfEnhancedUserQuery] error:", error)
    throw new Error()
  }
}

async function getVectorEmbeddingsOfDummyCode(state: typeof StateAnnotation.State) {
  // console.log("🔹 [getVectorEmbeddingsOfDummyCode] state:", state)
  try {
    const embeddings = await searchInVectorStore(state.url, state.generatedCode)
    // console.log("✅ [getVectorEmbeddingsOfDummyCode] embeddings:", embeddings)
    return { vectorEmbeddingsCode: embeddings }
  } catch (error) {
    // console.error("❌ [getVectorEmbeddingsOfDummyCode] error:", error)
    throw new Error()
  }
}

async function getFinalResultOfUserQuery(state: typeof StateAnnotation.State) {
  // console.log("🔹 [getFinalResultOfUserQuery] state:", state)
  try {
    const result = await llm.invoke([
      {
        role: "system",
        content: `You are an expert in explainig to the user about the code snippet what user is asking about the code ${state.vectorEmbeddingsCode}`,
      },
      { role: "user", content: state.input }
    ])
    // console.log("✅ [getFinalResultOfUserQuery] output:", result.content)
    return { output: result.content }
  } catch (error) {
    // console.error("❌ [getFinalResultOfUserQuery] error:", error)
    throw new Error()
  }
}

async function routerOfUserQuery(state: typeof StateAnnotation.State) {
  // console.log("🔹 [routerOfUserQuery] state:", state)
  try {
    const decision = await router.invoke([
      {
        role: "system",
        content:
          "You are an expert in routing the user. You are an expert of code explainer based on user query . You are an expert of analyzing the user query what user want . analyze the user query that what user want if user ask about normal code not to specific code that exist in that repo about thier repo then route him to to generateNormalAns. If User want to answer some specific code he tells you that explain this in this repo the we have to further route him to enhanceUserQuery for further steps",
      },
      { role: "user", content: state.input }
    ])
    // console.log("✅ [routerOfUserQuery] decision:", decision.step)
    return { decision: decision.step }
  } catch (error) {
    // console.error("❌ [routerOfUserQuery] error:", error)
    throw new Error()
  }
}

function routeDecision(state: typeof StateAnnotation.State) {
  // console.log("🔹 [routeDecision] state.decision:", state.decision)
  if (state.decision === "analyze-more") {
    return "enhanceUserQuery"
  } else {
    return "generateNormalAns"
  }
}

const routerWorkFlow = new StateGraph(StateAnnotation)
  .addNode("generateNormalAns", generateNormalAns)
  .addNode("enhanceUserQuery", enhanceUserQuery)
  .addNode("getDummyCodeOfEnhancedUserQuery", getDummyCodeOfEnhancedUserQuery)
  .addNode("getVectorEmbeddingsOfDummyCode", getVectorEmbeddingsOfDummyCode)
  .addNode("getFinalResultOfUserQuery", getFinalResultOfUserQuery)
  .addNode("routerOfUserQuery", routerOfUserQuery)
  .addEdge("__start__", "routerOfUserQuery")
  .addConditionalEdges("routerOfUserQuery", routeDecision, ["enhanceUserQuery", "generateNormalAns"])
  .addEdge("generateNormalAns", "__end__")
  .addEdge("enhanceUserQuery", "getDummyCodeOfEnhancedUserQuery")
  .addEdge("getDummyCodeOfEnhancedUserQuery", "getVectorEmbeddingsOfDummyCode")
  .addEdge("getVectorEmbeddingsOfDummyCode", "getFinalResultOfUserQuery")
  .addEdge("getFinalResultOfUserQuery", "__end__")
  .compile()

export {routerWorkFlow}