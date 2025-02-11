import { NextApiResponse } from "next";
import { MODEL, STATUS_CODE } from "../../../general/constants";
import {
  extractErrorMessage,
  parseTextResponse,
} from "../../../general/helpers";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const hackathonTestDataGenerator = async (
  res: NextApiResponse,
  message: string
) => {
  console.log(`Calling OpenAI's API.`);

  try {
    // This is a simple API call to OpenAI. If you'd like, you can change the model from
    // Gpt4_o_mini to Gpt4_o or Gpt4, which are more accurate (smarter) LLMs.
    // To solve the first challenge, you will likely need to either change the system prompt,
    // or add some text before or after the user's message.
    const completion = await openai.chat.completions.create({
      model: MODEL.Gpt4_o_mini,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that can generate test data in CSV file format.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    console.log("Response from OpenAI:", completion);
    console.log();

    // This is the actual response from the LLM.
    const text = completion.choices[0].message.content;

    console.log("\nOutput from OpenAI before parsing:", text);
    console.log();

    // We do light post-processing of the LLM's output. You don't need to look into this function
    // or make changes to it. If you need to do post-processing to solve the hackathon's challenges,
    // then you can do it all right in this file if you prefer.
    const output = parseTextResponse(text);

    res.status(STATUS_CODE.Ok).json({ result: output });
  } catch (error: any) {
    const errorMessage = extractErrorMessage(error);
    console.error(error);
    res
      .status(STATUS_CODE.InternalServerError)
      .json({ error: { message: errorMessage } });
  }
};
