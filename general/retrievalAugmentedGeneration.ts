import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { SHOULD_SHOW_ALL_LOGS } from "./constants";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { Document } from "langchain/document";
import path from "path";

export const splitTextIntoChunks = async (text: string) => {
  const splitText = await new RecursiveCharacterTextSplitter({
    chunkSize: 200,
    chunkOverlap: 20,
  }).splitText(text);

  console.log(`Split text into ${splitText.length} chunks.`);

  return splitText;
};

export const splitDocumentsIntoChunks = async (
  documents: Document<Record<string, any>>[]
) => {
  const splitDocs = await new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  }).splitDocuments(documents);

  return splitDocs;
};

export const performSimilaritySearchFromTexts = async (
  texts: string[],
  prompt: string,
  embeddings: OpenAIEmbeddings
) => {
  if (texts.length < 250) {
    console.log("Skipped similarity search because text was too short.");
    return texts;
  }

  const vectorStore = await MemoryVectorStore.fromTexts(texts, {}, embeddings);

  const numberOfSimilarityResults = 2;
  const similaritySearchResults = await vectorStore.similaritySearch(
    prompt,
    numberOfSimilarityResults
  );

  return similaritySearchResults;
};

export const performSimilaritySearchFromDocuments = async (
  documents: Document<Record<string, any>>[],
  prompt: string,
  embeddings: OpenAIEmbeddings
) => {
  console.log("Performing similarity search.");

  const vectorStore = await MemoryVectorStore.fromDocuments(
    documents,
    embeddings
  );

  const numberOfSimilarityResults = 4;
  const similaritySearchResults = await vectorStore.similaritySearch(
    prompt,
    numberOfSimilarityResults
  );

  const pageContent = getPageContentFromDocuments(similaritySearchResults);

  const stringifiedResults = JSON.stringify(pageContent.join("\n\n").trim());

  SHOULD_SHOW_ALL_LOGS &&
    console.log("Similarity search results:", stringifiedResults);

  return stringifiedResults;
};

export const performSimilaritySearchOnArrayOfStrings = async (
  texts: string[],
  prompt: string
) => {
  const embeddings = new OpenAIEmbeddings();

  const similaritySearchResults = await Promise.all(
    texts.map(async (text, i) => {
      console.log(
        texts.length > 1
          ? `Processing vector ${i + 1} out of ${texts.length}.`
          : "Processing vector."
      );

      const textSplitIntoChunks = await splitTextIntoChunks(text);

      return performSimilaritySearchFromTexts(
        textSplitIntoChunks,
        prompt,
        embeddings
      );
    })
  );

  const stringifiedResults = JSON.stringify(similaritySearchResults);

  SHOULD_SHOW_ALL_LOGS &&
    console.log("Similarity search results:", stringifiedResults);

  return stringifiedResults;
};

export const createRagPrompt = (userPrompt: string, context: string) => {
  if (!context) {
    console.log("Did not receive context.");
    return userPrompt;
  }

  return `BEGINCONTEXT
    ${context}
    ENDCONTEXT
    BEGININSTRUCTION
    ${userPrompt}
    ENDINSTRUCTION
  `;
};

export const fetchPdfFiles = async () => {
  const pdfDirectoryPath = path.join(process.cwd(), "/data/pdf/");
  console.log(`Retrieving PDFs from ${pdfDirectoryPath}`);

  const directoryLoader = new DirectoryLoader(pdfDirectoryPath, {
    ".pdf": (path: string) => new PDFLoader(path),
  });

  return await directoryLoader.load();
};

export const getPageContentFromDocuments = (
  documents: Document<Record<string, any>>[]
): string[] => {
  return documents.map((document) => document.pageContent);
};

export const throwIfPromptIsLong = (prompt: string): void => {
  if (prompt.length > 10000) {
    throw new Error(
      "The prompt is very long. It might not necessarily be too long to send to an LLM, but given that it should be the result of a similarity search, it shouldn't be this long. Your prompt was not sent to an LLM as a (monetary) safety precaution, but you may still be able to send it to an LLM. To do so, simply comment out this conditional."
    );
  }
};
