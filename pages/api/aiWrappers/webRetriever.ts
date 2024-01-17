/**
 * The code in this file is based in large parts on this file from a repository by DevelopersDigest:
 * https://github.com/developersdigest/OpenAI-Web-Search-RAG-LLM-API-with-BUN.js/blob/main/index.js
 */
import { NextApiResponse } from "next";
import fetch from "node-fetch";
import { load } from "cheerio";
import { gpt } from "../aiModels/gpt";
import {
  MODEL,
  SHOULD_SHOW_ALL_LOGS,
  STATUS_CODE,
} from "../../../general/constants";
import {
  createRagPrompt,
  performSimilaritySearchOnArrayOfStrings,
  throwIfPromptIsLong,
} from "../../../general/retrievalAugmentedGeneration";
import { ProcessedBody } from "../../../general/apiHelper";

const addHttpsToUrl = (url: string): string => {
  if (
    url.length !== 0 &&
    !url.startsWith("http://") &&
    !url.startsWith("https://")
  ) {
    return "https://" + url;
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

    const isTextEmpty =
      textScrapedFromWebsites.length === 0 ||
      textScrapedFromWebsites.every((text) => text.trim().length === 0);

    if (isTextEmpty) {
      throw new Error(
        "No text was scraped from the web. There may be additional logs above this that provide more insights into what went wrong."
      );
    }

    const context = shouldRunSimilaritySearch
      ? await performSimilaritySearchOnArrayOfStrings(
          textScrapedFromWebsites,
          message
        )
      : JSON.stringify(textScrapedFromWebsites.join(" ").trim());

    const prompt = createRagPrompt(message, context);

    SHOULD_SHOW_ALL_LOGS &&
      console.log("Prompt after text scraping the web\n", prompt);

    throwIfPromptIsLong(prompt);

    return gpt(res, prompt, model, processedBody);
  } catch (error: any) {
    res
      .status(STATUS_CODE.InternalServerError)
      .json({ error: error.message || "An error occurred" });
  }
};
