import { NextApiResponse } from "next";
import { MODEL, STATUS_CODE } from "../../../general/constants";
import {
  extractErrorMessage,
  parseTextResponse,
} from "../../../general/helpers";
import OpenAI from "openai";
import {
  createRagPrompt,
  fetchDataFiles,
} from "../retrievalAugmentedGeneration";
import {
  createEmbeddings,
  performSimilaritySearchFromDocuments,
  splitDocumentsIntoChunks,
} from "../retrievalAugmentedGeneration";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getPromptWithContext = async (message: string): Promise<string> => {
  // This will create embeddings. They are mathematical representations of data (like text) that convert
  // complex information into lists of numbers (vectors) capturing their meaning and context. They allow
  // machines to understand, compare, and work with the original data more effectively.
  const embeddings = createEmbeddings();
  // This will fetch whatever files you have in your data folder.
  // It currently doesn't support file formats such as HTML and MD, which you may want to add.
  const files = await fetchDataFiles();
  // This will split the files into chunks of text. A chunk is just a section of the file.
  const chunks = await splitDocumentsIntoChunks(files);
  // This will create a vector store --  a specialized system for storing embeddings and quickly finding similar ones.
  // This makes it ideal for tasks like semantic search, where you want to retrieve information that is conceptually
  // related rather than just an exact match. And so, we search for text that closely relates to the user message.
  const context = await performSimilaritySearchFromDocuments(
    chunks,
    message,
    embeddings
  );
  // This will create a final prompt that we send to the LLM.
  const prompt = createRagPrompt(message, context);
  return prompt;
};

export const hackathonTalkToYourDocs = async (
  res: NextApiResponse,
  message: string
) => {
  console.log(`Calling OpenAI's API.`);

  try {
    const promptWithContext = await getPromptWithContext(message);

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
            "You are a helpful assistant that can answer questions about given documents.",
        },
        {
          role: "user",
          content: promptWithContext,
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
