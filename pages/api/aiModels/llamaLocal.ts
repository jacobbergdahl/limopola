import { LLM } from "llama-node";
import { LLamaCpp } from "llama-node/dist/llm/llama-cpp.js";
import path from "path";
import { SHOULD_SHOW_ALL_LOGS, STATUS_CODE } from "../../../general/constants";
import { parseTextResponse } from "../../../general/helpers";
import * as fs from "fs/promises";

const modelName =
  process.env.LOCAL_MODEL_NAME || "airoboros-13b-gpt4.ggmlv3.q4_0.bin";
const modelPath = path.resolve(
  process.cwd(),
  `.${path.sep}models${path.sep}${modelName}`
);
// The process of creating this txt will be streamlined/automated
// It might be too much context to send the whole codebase, but perhaps the user can choose
// what files to send.
// We could also train the model on the codebase, but it's still changing quickly
const txtCodePath = path.resolve(
  process.cwd(),
  `.${path.sep}models${path.sep}code.txt`
);
const llama = new LLM(LLamaCpp);
const config = {
  modelPath: modelPath,
  enableLogging: false,
  nCtx: 1024,
  seed: 0,
  f16Kv: false,
  logitsAll: false,
  vocabOnly: false,
  useMlock: false,
  embedding: false,
  useMmap: true,
  nGpuLayers: 0,
};

// Learn more about labeling: https://huggingface.co/TheBloke/airoboros-13b-gpt4-GGML
const getPrompt = async (
  prompt: string,
  isMaintainer: boolean,
  requestedNumberOfTokens: number
) => {
  const hasRequestedANumberOfTokens = requestedNumberOfTokens > 0;
  const commonInstructions =
    "# Instructions: Please answer the question in English. Don't make up answers if you don't know." +
    (hasRequestedANumberOfTokens
      ? ` Make your answer around ${requestedNumberOfTokens} tokens in length.\n`
      : "\n");

  const processedUserInput =
    "BEGININSTRUCTION\n" +
    "USER: " +
    prompt +
    "\nENDINSTRUCTION\n" +
    "ASSISTANT:\n";

  const getProcessedInstructions = (
    additionalContext: string = "",
    additionalInput: string = ""
  ) => {
    return (
      "BEGININPUT\n" +
      "BEGINCONTEXT\n" +
      commonInstructions +
      additionalContext +
      "\nENDCONTEXT\n" +
      additionalInput +
      "\nENDINPUT\n"
    );
  };

  if (isMaintainer) {
    SHOULD_SHOW_ALL_LOGS && console.log("Reading codebase...");
    // TODO: Throw if codebase is nullish
    const codeBase = await fs.readFile(txtCodePath, "utf8");
    SHOULD_SHOW_ALL_LOGS && console.log("Finished reading codebase.");

    return (
      getProcessedInstructions(
        "Below is a copy of the codebase.\n" + "```" + codeBase + "```",
        `You are a programming assistant with access to the entire code base for this repository. You are an expert in JavaScript, TypeScript, and CSS, as well as ReactJS and NextJS specifically. As you can tell, the codebase all JavaScript, TypeScript, and CSS.`
      ) + processedUserInput
    );
  }

  return getProcessedInstructions() + processedUserInput;
};

export const llamaLocal = async (
  res,
  message,
  temperature,
  requestedNumberOfTokens,
  isMaintainer = false
) => {
  console.log(
    `The backend is calling your local machine learning model at ${modelPath}.`
  );

  const abortController = new AbortController();
  // If the model works for more than n milliseconds, abort it.
  setTimeout(() => {
    abortController.abort();
  }, Number(process.env.LOCAL_MODEL_TIMEOUT_LENGTH) || 20 * 60 * 1000);

  try {
    const prompt = await getPrompt(
      message,
      isMaintainer,
      requestedNumberOfTokens
    );
    if (SHOULD_SHOW_ALL_LOGS) {
      console.log("Final prompt:");
      console.log(prompt);
    }

    await llama.load(config);

    const response = await llama.createCompletion(
      {
        nThreads: 4,
        nTokPredict:
          requestedNumberOfTokens > 0 ? requestedNumberOfTokens : 200,
        temp: temperature,
        prompt: prompt || "",
      },
      (response) => {
        // This API will generate one token at a time, and you can view it in real-time in your console as it is generating new tokens
        // In the future, we could enable streaming so that the UI can show the user the tokens as they are being generated
        SHOULD_SHOW_ALL_LOGS && console.log(response.token);
      },
      abortController.signal
    );
    abortController.abort();
    const result = parseTextResponse(
      response.tokens
        .join("")
        .replace("\n\n<end>", "")
        .replace("\n\n</end>", "")
        .trim()
    );
    res.status(STATUS_CODE.Ok).json({
      result:
        result.length > 0 ? result : "<i>The AI returned an empty message.</i>",
    });
  } catch (error) {
    const errorMessage = error.message;
    console.error(errorMessage);
    res
      .status(STATUS_CODE.InternalServerError)
      .json({ error: { message: errorMessage } });
  }
};
