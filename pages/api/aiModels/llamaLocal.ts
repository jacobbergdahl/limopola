import path from "path";
import { STATUS_CODE } from "../../../general/constants";
import {
  extractErrorMessage,
  parseTextResponse,
} from "../../../general/helpers";
import { NextApiResponse } from "next";
import { LlamaChatSession, getLlama } from "node-llama-cpp";
import { ProcessedBody } from "../../../general/apiHelper";

const modelName =
  process.env.LOCAL_MODEL_NAME ||
  "dolphin-2.6-mistral-7b-dpo-laser.Q4_K_M.gguf";

const modelPath = path.resolve(
  process.cwd(),
  `.${path.sep}models${path.sep}${modelName}`
);

export const llamaLocal = async (
  res: NextApiResponse | undefined,
  message: string,
  processedBody: ProcessedBody
) => {
  console.log(
    `The backend is calling your local machine learning model at ${modelPath} through node-llama-cpp.`
  );

  const abortController = new AbortController();
  if (process.env.LOCAL_MODEL_SHOULD_TIMEOUT === "true") {
    // If the model works for more than n milliseconds, abort it.
    setTimeout(
      () => {
        abortController.abort();
      },
      Number(process.env.LOCAL_MODEL_TIMEOUT_LENGTH) || 20 * 60 * 1000
    );
  }

  try {
    const llama = await getLlama();
    const model = await llama.loadModel({
      modelPath: modelPath,
    });
    const context = await model.createContext();
    const session = new LlamaChatSession({
      contextSequence: context.getSequence(),
    });
    const output = await session.prompt(message, {
      temperature: processedBody.temperature,
      maxTokens: processedBody.maxNumberOfTokens,
      topP: processedBody.topP,
      signal: abortController.signal,
    });

    abortController.abort();

    console.log("Output from your local LLM before parsing:", output);
    const result = parseTextResponse(output);

    if (!res) {
      return result;
    }

    res.status(STATUS_CODE.Ok).json({
      result:
        result.length > 0 ? result : "<i>The AI returned an empty message.</i>",
    });
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    console.error(errorMessage);
    res
      .status(STATUS_CODE.InternalServerError)
      .json({ error: { message: errorMessage } });
  }
};
