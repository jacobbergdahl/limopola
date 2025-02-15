import { NextApiResponse } from "next";
import { openAi } from "../aiModels/openAi";
import {
  MODEL,
  SHOULD_SHOW_ALL_LOGS,
  STATUS_CODE,
} from "../../../general/constants";
import {
  createEmbeddings,
  createRagPrompt,
  fetchDataFiles,
  performSimilaritySearchFromDocuments,
  splitDocumentsIntoChunks,
  throwIfPromptIsLong,
} from "../retrievalAugmentedGeneration";
import { ProcessedBody } from "../../../general/apiHelper";
import { claude } from "../aiModels/claude";
import { extractErrorMessage } from "@/general/helpers";

/**
 * Uses RAG to retrieve data from files in the data folder
 */
export const dataReader = async (
  res: NextApiResponse,
  message: string,
  model = MODEL.Gpt4_o,
  processedBody: ProcessedBody
) => {
  try {
    const embeddings = createEmbeddings();
    const files = await fetchDataFiles();
    const chunks = await splitDocumentsIntoChunks(files);
    const context = await performSimilaritySearchFromDocuments(
      chunks,
      message,
      embeddings
    );

    const prompt = createRagPrompt(message, context);

    SHOULD_SHOW_ALL_LOGS &&
      console.log("Prompt after reading pdf files\n", prompt);

    throwIfPromptIsLong(prompt);

    if (model === MODEL.Claude35Haiku || model === MODEL.Claude35Sonnet) {
      return claude(res, prompt, model, processedBody);
    }

    return openAi(res, prompt, model, processedBody);
  } catch (error: any) {
    const errorMessage = extractErrorMessage(error);
    console.error(error);
    res
      .status(STATUS_CODE.InternalServerError)
      .json({ error: errorMessage || "An error occurred" });
  }
};
