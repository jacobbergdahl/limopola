import { SHOULD_SHOW_ALL_LOGS, STATUS_CODE } from "../../../general/constants";
import { parseTextResponse } from "../../../general/helpers";
import { ProcessedBody } from "../generate";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Accepts all versions of GPT-3.5 and GPT-4
 */
export const gpt = async (
  res,
  message,
  model,
  processedBody: ProcessedBody,
  shouldReturnRawCompletion = false
) => {
  console.log(`The backend is calling OpenAI model ${model}.`);

  const {
    temperature,
    frequencyPenalty,
    presencePenalty,
    topP,
    maxNumberOfTokens,
  } = processedBody;

  try {
    const completion = await openai.chat.completions.create({
      model: model,
      /**
       * n determines the number of replies that the AI generates.
       * I could add a field for the user to set this, but the challenge is
       * how to present this in the UI. Additionally, using this prop
       * can quickly add up expenses, so its usefulness is questionable.
       */
      n: 1,
      temperature: temperature,
      frequency_penalty: frequencyPenalty,
      presence_penalty: presencePenalty,
      top_p: topP,
      max_tokens: maxNumberOfTokens,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });

    SHOULD_SHOW_ALL_LOGS &&
      (console.log("Response from OpenAI:", completion),
      console.log("End of response from OpenAI"));

    let text = "";
    // This will be true if n is greater than 1
    if (completion.choices.length > 1) {
      completion.choices.forEach((choice, i) => {
        text += `${i > 0 ? "\n\n" : ""}Answer ${i + 1}:\n ${
          choice.message.content
        }`;
      });
    } else {
      text = completion.choices[0].message.content;
    }

    const output = parseTextResponse(text);
    SHOULD_SHOW_ALL_LOGS &&
      (console.log("\nOutput from OpenAI before parsing:\n", text),
      console.log());

    if (shouldReturnRawCompletion) {
      return output;
    }

    res.status(STATUS_CODE.Ok).json({ result: output });
  } catch (error) {
    console.error(error);
    let errorMessage = error?.message;
    if (error?.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error?.response?.error?.message) {
      errorMessage = error.response.error.message;
    } else if (error?.response?.data?.error?.message) {
      errorMessage = error.response.data.error.message;
    }
    res
      .status(STATUS_CODE.InternalServerError)
      .json({ error: { message: errorMessage } });
  }
};
