import { NextApiResponse } from "next";
import fetch from "node-fetch";
import {
  MODEL,
  SHOULD_SHOW_ALL_LOGS,
  STATUS_CODE,
} from "../../../general/constants";
import { ProcessedBody } from "../../../general/apiHelper";
import { getSearchQueryPrompt } from "../../../general/webConnectorPrompts";
import { createRagPrompt } from "../retrievalAugmentedGeneration";
import { extractErrorMessage } from "@/general/helpers";
import { callLlm } from "../generate";

const processSearchQueryResults = (response: string | void): string => {
  // If the AI does not need to do a web search to find the answer, it should only return with "-"
  if (!response || response.length <= 1) {
    console.log("The AI will not perform a web search.");
    return "";
  }

  // If the number of characters are greater than 1, then the back-end should treat the results as a search query
  return response;
};

const performWebSearch = async (searchQuery: string) => {
  console.log(`Starting web search for the query: ${searchQuery}`);
  const url = "https://www.searchapi.io/api/v1/search";
  const params = new URLSearchParams({
    engine: "google",
    q: searchQuery,
    api_key: process.env.SEARCH_API_KEY,
  });

  const response = await fetch(`${url}?${params}`);
  const data: any = await response.json();

  let contextString = "Google Search Results\n";
  if (!!data?.answer_box) {
    contextString += "# Answer Box\n";
    if (data.answer_box.title) {
      contextString += "\n" + data.answer_box.title;
    }
    if (data.answer_box.answer) {
      contextString += "\n" + data.answer_box.answer;
    }
    if (data.answer_box.answer_date) {
      contextString += "\n" + data.answer_box.answer_date;
    }
    if (data.answer_box.snippet) {
      contextString += "\n" + data.answer_box.snippet;
    }
    if (data.answer_box.organic_result?.title) {
      contextString += "\n" + data.answer_box.organic_result.title;
    }
    if (data.answer_box.organic_result?.source) {
      contextString += "\n" + data.answer_box.organic_result.source;
    }
    contextString += "\n\n";
  }
  if (!!data?.knowledge_graph) {
    contextString += "# Knowledge Graph\n";
    if (data.knowledge_graph.title) {
      contextString += "\n" + data.knowledge_graph.title;
    }
    if (data.knowledge_graph.type) {
      contextString += "\n" + data.knowledge_graph.type;
    }
    if (data.knowledge_graph.description) {
      contextString += "\n" + data.knowledge_graph.description;
    }
    if (data.knowledge_graph.source?.name) {
      contextString += "\n" + data.knowledge_graph.source.name;
    }
    if (data.knowledge_graph.born) {
      contextString += "\n" + data.knowledge_graph.born;
    }
    contextString += "\n\n";
  }
  if (!!data.organic_results) {
    const organicResults: any[] = data.organic_results;
    organicResults.forEach((result, i) => {
      contextString += `# Organic search result ${i + 1} of ${organicResults.length}\n`;
      if (result.title) {
        contextString += "\n" + result.title;
      }
      if (result.source) {
        contextString += "\n" + result.source;
      }
      if (result.snippet) {
        contextString += "\n" + result.snippet;
      }
      contextString += "\n\n";
    });
  }

  if (SHOULD_SHOW_ALL_LOGS) {
    console.log(`Finished web search:`);
    console.log(contextString);
  }

  return contextString;
};

/**
 * Asks the LLM if it needs to do a web search to handle the user's instruction.
 * If so, makes a Google web search.
 */
export const webConnector = async (
  res: NextApiResponse | undefined,
  message: string,
  model: MODEL,
  processedBody: ProcessedBody
) => {
  try {
    const {
      shouldAskBeforeSearching,
      returnEmptyStringIfNoSearch,
      returnOnlineSearchResultsWithoutAskingLLM,
    } = processedBody;

    console.log(
      `The back-end is asking AI model ${model} if it needs to access the internet. Should ask before searching: ${shouldAskBeforeSearching || false}.`
    );

    const searchPrompt = getSearchQueryPrompt(
      message,
      shouldAskBeforeSearching
    );

    const searchBody = processedBody;
    searchBody.message = searchPrompt;
    searchBody.isGivingAiSearchAccess = false;

    const responseSearchQuery = await callLlm(
      undefined,
      searchPrompt,
      model,
      searchBody
    );

    const processedSearchQuery = processSearchQueryResults(responseSearchQuery);
    // 400 is an arbitrary number, and perhaps too big of a number. If the AI returned a result that's longer than that, then it should be safe to presume that it did not return a search query
    const hasAiMisunderstoodAssignment = processedSearchQuery.length > 400;
    // The AI should return "-" if it does not need to do a web search
    const didAiReturnASearchQuery = processedSearchQuery.length > 1;

    let finalPrompt = message;
    if (hasAiMisunderstoodAssignment) {
      throw new Error(
        "The LLM did not understand the assignment. It was supposed to generate a short search query, but instead generated a long response."
      );
    } else if (didAiReturnASearchQuery) {
      const webSearchContext = await performWebSearch(processedSearchQuery);
      if (returnOnlineSearchResultsWithoutAskingLLM) {
        res.status(STATUS_CODE.Ok).json({ result: webSearchContext });
        return;
      }
      finalPrompt = createRagPrompt(message, webSearchContext);
    } else if (returnEmptyStringIfNoSearch) {
      res.status(STATUS_CODE.Ok).json({ result: "" });
      return;
    }

    return callLlm(res, finalPrompt, model, processedBody);
  } catch (error: any) {
    const errorMessage = extractErrorMessage(error);
    console.error(error);
    res
      .status(STATUS_CODE.InternalServerError)
      .json({ error: { message: errorMessage } });
  }
};
