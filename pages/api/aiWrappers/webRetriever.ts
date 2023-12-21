/**
 * The code in this file is based in large parts on this file from a repository by DevelopersDigest:
 * https://github.com/developersdigest/OpenAI-Web-Search-RAG-LLM-API-with-BUN.js/blob/main/index.js
 */
import type { NextApiResponse } from "next";
import fetch from "node-fetch";
import { load } from "cheerio";
import { gpt } from "../aiModels/gpt";
import { ProcessedBody } from "../generate";
import { MODEL, SHOULD_SHOW_ALL_LOGS } from "../../../general/constants";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

const embeddings = new OpenAIEmbeddings();

const addHttpsToUrl = (url: string): string => {
  if (
    url.length !== 0 &&
    !url.startsWith("http://") &&
    !url.startsWith("https://")
  ) {
    url = "https://" + url;
  }
  return url;
};

const createUrlArrayFromStringOfUrls = (urls: string): string[] => {
  return urls.split(",").map((url) => addHttpsToUrl(url.trim()));
};

const fetchPageContent = async (url: string): Promise<string> => {
  try {
    console.log(`Reading data from ${url}`);
    const response = await fetch(url);
    const html = await response.text();
    const $ = load(html);
    $("script, style, head, nav, footer, iframe, img").remove();
    return $("body").text().replace(/\s+/g, " ").trim();
  } catch (error: any) {
    console.error(`Could not read data from url: ${url}`);
    console.error(error);
    return "";
  }
};

const getTextFromWebsites = async (urlArray: string[]): Promise<string[]> => {
  return Promise.all(urlArray.map(fetchPageContent));
};

const validateText = (textArray: string[]): void => {
  if (
    textArray.length === 0 ||
    textArray.every((text) => text.trim().length === 0)
  ) {
    throw new Error(
      "No text was scraped from the web. There may be additional logs above this that provide more insights into what went wrong."
    );
  }
};

const performSimilaritySearch = async (text: string, message: string) => {
  if (text.length < 250) {
    console.log("Skipped similarity search because text was too short.");
    return null;
  }

  const splitText = await new RecursiveCharacterTextSplitter({
    chunkSize: 200,
    chunkOverlap: 20,
  }).splitText(text);

  console.log(`Split text into ${splitText.length} chunks.`);

  const vectorStore = await MemoryVectorStore.fromTexts(
    splitText,
    {},
    embeddings
  );

  const numberOfSimilarityResults = 2;
  const similaritySearchResults = await vectorStore.similaritySearch(
    message,
    numberOfSimilarityResults
  );

  SHOULD_SHOW_ALL_LOGS &&
    console.log(
      "Similarity search results:",
      JSON.stringify(similaritySearchResults)
    );

  return similaritySearchResults;
};

/**
 * Retrieves data from defined url's
 */
export const webRetriever = async (
  res: NextApiResponse,
  message,
  model = MODEL.Gpt4,
  processedBody: ProcessedBody,
  urls = "",
  shouldRunSimilaritySearch = false
) => {
  try {
    const urlArray = createUrlArrayFromStringOfUrls(urls);
    const textScrapedFromWebsites = await getTextFromWebsites(urlArray);
    validateText(textScrapedFromWebsites);

    const context = shouldRunSimilaritySearch
      ? await Promise.all(
          textScrapedFromWebsites.map(
            (text, i) => (
              console.log(
                `Processing vector ${i + 1} out of ${
                  textScrapedFromWebsites.length
                }.`
              ),
              performSimilaritySearch(text, message)
            )
          )
        )
      : textScrapedFromWebsites.join(" ");

    const prompt = `BEGINCONTEXT
      ${JSON.stringify(context)}
      ENDCONTEXT
      BEGININSTRUCTION
      ${message}
      ENDINSTRUCTION
    `;

    SHOULD_SHOW_ALL_LOGS &&
      console.log("Prompt after text scraping from the web\n", prompt);

    return gpt(res, prompt, model, processedBody);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "An error occurred" });
  }
};
