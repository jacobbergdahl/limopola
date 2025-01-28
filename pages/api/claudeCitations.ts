import { NextApiResponse } from "next";
import { Anthropic } from "@anthropic-ai/sdk";
import { MODEL, SHOULD_SHOW_ALL_LOGS } from "../../general/constants";
import { ProcessedBody } from "../../general/apiHelper";
import { extractErrorMessage } from "../../general/helpers";
import path from "path";
import fs from "fs";

const anthropic = new Anthropic();

type TextBlock = {
  type: "text";
  text: string;
  citations?: {
    type: string;
    cited_text: string;
    document_index: number;
    document_title: string;
    start_char_index?: number;
    end_char_index?: number;
    start_page_number?: number;
    end_page_number?: number;
  }[];
};

type Citation = {
  type: string;
  cited_text: string;
  document_index: number;
  document_title: string;
  start_char_index?: number;
  end_char_index?: number;
  start_page_number?: number;
  end_page_number?: number;
};

type DocumentWithCitations = {
  type: "document";
  source: {
    type: "base64";
    media_type: "application/pdf";
    data: string;
  };
  title: string;
  context?: string;
  citations: {
    enabled: boolean;
  };
};

const getPageNumbers = (citation: Citation): string => {
  const hasPageNumbers = citation.start_page_number || citation.end_page_number;
  if (!hasPageNumbers) {
    return "";
  }

  const startsAndEndsOnSamePage =
    citation.start_page_number === citation.end_page_number ||
    (!!citation.start_page_number && !citation.end_page_number);
  if (startsAndEndsOnSamePage) {
    return ` p. ${citation.start_page_number}`;
  }

  return ` pp. ${citation.start_page_number}-${citation.end_page_number}`;
};

const processCitedText = (citedText: string): string => {
  return citedText.replace(/\r\n/g, "").replace(/\n/g, "").trim() + " ";
};

export const claudeWithCitations = async (
  res: NextApiResponse | undefined,
  message: string,
  model: MODEL = MODEL.Claude35Sonnet,
  processedBody: ProcessedBody
) => {
  try {
    console.log("Preparing documents for Claude with citations enabled");
    const dataDirectoryPath = path.join(process.cwd(), "/data/");
    const files = fs.readdirSync(dataDirectoryPath);
    const pdfFiles = files.filter((file) => file.endsWith(".pdf"));

    const documents: DocumentWithCitations[] = await Promise.all(
      pdfFiles.map(async (filename) => {
        const filePath = path.join(dataDirectoryPath, filename);
        const fileData = fs.readFileSync(filePath);
        const base64Data = fileData.toString("base64");

        return {
          type: "document",
          source: {
            type: "base64",
            media_type: "application/pdf",
            data: base64Data,
          },
          title: filename,
          citations: {
            enabled: true,
          },
        };
      })
    );

    console.log(
      "Finished preparing documents, now asking Claude to look through them with your instruction"
    );

    const { temperature, topP, maxNumberOfTokens } = processedBody;

    const completion = await anthropic.messages.create({
      model: model,
      temperature: temperature,
      top_p: topP,
      max_tokens: maxNumberOfTokens || 1024,
      messages: [
        {
          role: "user",
          content: [
            ...documents,
            {
              type: "text",
              text: message,
            },
          ],
        },
      ],
    });

    SHOULD_SHOW_ALL_LOGS &&
      console.log("Response from Anthropic with citations:", completion);

    const content = completion.content;
    const output = content.map((block: TextBlock) => {
      if (block.type === "text") {
        return {
          text: block.text,
          citations: block.citations || [],
        };
      }
      return block;
    });

    const formattedMessage = output.reduce((acc, block) => {
      const text = block.text || "";
      const citations = block.citations || [];

      let formattedText = text;
      if (citations.length > 0) {
        formattedText +=
          "<span class='citation'>" +
          `${citations.length > 1 ? "Citations:\n" : "Citation: "}` +
          citations
            .map(
              (citation, index) =>
                `${citations.length > 1 ? `[${index + 1}] ` : ""}<span class='citation-title'>${citation.document_title}</span>${getPageNumbers(citation)}: <span class='citation-text'>"${processCitedText(citation.cited_text)}</span>"`
            )
            .join("\n")
            .trim() +
          "</span>";
      }

      return acc + formattedText;
    }, "");

    const formattedMessageWithoutDoubleNewLines = formattedMessage.replace(
      /\n\n/g,
      "\n"
    );

    res.status(200).json({ result: formattedMessageWithoutDoubleNewLines });
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    console.error("Error in Claude citations:", error);
    res.status(500).json({ error: { message: errorMessage } });
  }
};
