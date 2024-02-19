import { NextApiResponse } from "next";
import { gpt } from "../aiModels/gpt";
import {
  MODEL,
  SHOULD_SHOW_ALL_LOGS,
  STATUS_CODE,
} from "../../../general/constants";
import {
  createRagPrompt,
  fetchPdfFiles,
  performSimilaritySearchFromDocuments,
  splitDocumentsIntoChunks,
  throwIfPromptIsLong,
} from "../../../general/retrievalAugmentedGeneration";
import { OpenAIEmbeddings } from "@langchain/openai";
import { ProcessedBody } from "../../../general/apiHelper";

/**
 * Retrieves data from pdf files
 */
export const pdfReader = async (
  res: NextApiResponse,
  message,
  model = MODEL.Gpt4,
  processedBody: ProcessedBody
) => {
  try {
    const embeddings = new OpenAIEmbeddings();
    const pdfFiles = await fetchPdfFiles();
    const chunks = await splitDocumentsIntoChunks(pdfFiles);
    const context = await performSimilaritySearchFromDocuments(
      chunks,
      message,
      embeddings
    );

    const prompt = createRagPrompt(message, context);

    SHOULD_SHOW_ALL_LOGS &&
      console.log("Prompt after reading pdf files\n", prompt);

    throwIfPromptIsLong(prompt);

    return gpt(res, prompt, model, processedBody);
  } catch (error: any) {
    res
      .status(STATUS_CODE.InternalServerError)
      .json({ error: error.message || "An error occurred" });
  }
};
