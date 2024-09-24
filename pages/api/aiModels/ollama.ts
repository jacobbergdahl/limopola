import { STATUS_CODE } from "../../../general/constants";
import {
  extractErrorMessage,
  parseTextResponse,
} from "../../../general/helpers";
import { NextApiResponse } from "next";
import { ProcessedBody } from "../../../general/apiHelper";
import { ChatOllama } from "@langchain/ollama";

export const ollama = async (
  res: NextApiResponse | undefined,
  message: string,
  processedBody: ProcessedBody
) => {
  // Ideally this function should check if Ollama is running, and otherwise return an error message.
  // Right now, the code will silently fail if Ollama is not running.
  console.log(
    `The backend is calling ${process.env.LOCAL_OLLAMA_MODEL_NAME} with Ollama through LangChain. Ensure that you are running the model via Ollama.`
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
    const llm = new ChatOllama({
      model: process.env.LOCAL_OLLAMA_MODEL_NAME,
      temperature: processedBody.temperature,
      topP: processedBody.topP,
      maxRetries: 2,
    });

    console.log();
    const output = await llm.invoke(message, {
      signal: abortController.signal,
      callbacks: [
        {
          handleLLMNewToken(token: string) {
            if (token === "\n") {
              process.stdout.write(token);
            } else {
              process.stdout.write(token.replace(/\n/g, ""));
            }
          },
        },
      ],
    });
    console.log();

    abortController.abort();

    console.log("Output from ollama before parsing:", output);
    const result = parseTextResponse(output.content as string);

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
