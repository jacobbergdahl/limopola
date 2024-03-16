import { ProcessedBody } from "./../../../general/apiHelper";
import { TextClassificationOutput, pipeline } from "@xenova/transformers";
import { NextApiResponse } from "next";
import {
  MODEL,
  SHOULD_SHOW_ALL_LOGS,
  STATUS_CODE,
} from "../../../general/constants";
import {
  extractErrorMessage,
  parseTextResponse,
} from "../../../general/helpers";

type Text2TextOutput = {
  generated_text: string;
};

const processSentimentAnalysis = (
  sentimentResult: TextClassificationOutput | TextClassificationOutput[]
) => {
  if (!Array.isArray(sentimentResult) || sentimentResult.length === 0) {
    return sentimentResult.toString();
  }

  const item = sentimentResult[0];

  if (!("label" in item) || !("score" in item)) {
    return sentimentResult.toString();
  }

  const label =
    item.label.charAt(0).toUpperCase() + item.label.slice(1).toLowerCase();
  const score = (item.score * 100).toFixed(2);

  return `${label} (${score}% certainty)`;
};

// Contains all implementations of transformers.js
export const transformers = async (
  res: NextApiResponse | undefined,
  message: string,
  model: MODEL,
  processedBody: ProcessedBody
) => {
  try {
    console.log(
      `The backend is calling model ${model} via transformers.js. This operation runs in your browser. It is NOT an API call to an external server. It may be slow the first time you run it, but subsequent runs will be faster.`
    );

    let result = "";

    if (model === MODEL.TransformersSentimentAnalysis) {
      let classifier = await pipeline("sentiment-analysis");

      let output = await classifier(message);

      SHOULD_SHOW_ALL_LOGS && console.log("Output before parsing:", output);
      result = processSentimentAnalysis(output);
    } else if (model === MODEL.TransformersText2Text) {
      const generator = await pipeline(
        "text2text-generation",
        "Xenova/LaMini-Flan-T5-783M"
      );

      const output = await generator(message, {
        max_new_tokens: processedBody.maxNumberOfTokens ?? Number.MAX_VALUE,
      });

      SHOULD_SHOW_ALL_LOGS && console.log("Output before parsing:", output);

      const typedOutput = output[0] as Text2TextOutput;
      result = parseTextResponse(typedOutput.generated_text);
    }

    res.status(STATUS_CODE.Ok).json({ result: result });
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    console.error(error);
    res
      .status(STATUS_CODE.InternalServerError)
      .json({ error: { message: errorMessage } });
  }
};
