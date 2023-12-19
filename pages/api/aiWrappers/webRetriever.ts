import type { NextApiResponse } from "next";
import fetch from "node-fetch";
import { load } from "cheerio";
import { gpt } from "../aiModels/gpt";
import { ProcessedBody } from "../generate";
import { MODEL, SHOULD_SHOW_ALL_LOGS } from "../../../general/constants";

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

/**
 * Retrieves data from defined url's (RAG)
 */
export const webRetriever = async (
  res: NextApiResponse,
  message,
  model = MODEL.Gpt4,
  processedBody: ProcessedBody,
  urls = ""
) => {
  const urlArray = createUrlArrayFromStringOfUrls(urls);

  const fetchPageContent = async (url: string): Promise<string> => {
    try {
      console.log(`Reading data from ${url}`);
      const response = await fetch(url);
      const html = await response.text();
      const htmlWithoutLargeSequencesOfWhitespaceCharacters = html.replace(
        /\s+/g,
        " "
      );
      const $ = load(htmlWithoutLargeSequencesOfWhitespaceCharacters);
      $("script, style, head, nav, footer, iframe, img").remove();
      return $("body").text().trim();
    } catch (error: any) {
      console.error(`Could not read data from url: ${url}`);
      console.error(error);
      return "";
    }
  };

  const getTextFromWebsites = async (): Promise<string[]> => {
    return Promise.all(urlArray.map(fetchPageContent));
  };

  try {
    const textScrapedFromWebsites = await getTextFromWebsites();

    if (
      textScrapedFromWebsites.length === 0 ||
      textScrapedFromWebsites.every((text) => text.trim().length === 0)
    ) {
      throw new Error(
        "No text was scraped from the web. There may be additional logs above this that provide more insights into what went wrong."
      );
    }

    const prompt = `BEGINCONTEXT
      ${JSON.stringify(textScrapedFromWebsites)}
      ENDCONTEXT
      BEGININSTRUCTION
      ${message}
      ENDINSTRUCTION`;

    SHOULD_SHOW_ALL_LOGS &&
      console.log("Prompt after text scraping from the web", prompt);

    gpt(res, prompt, model, processedBody);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "An error occurred" });
  }
};
