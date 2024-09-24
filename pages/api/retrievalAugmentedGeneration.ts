import { OpenAIEmbeddings } from "@langchain/openai";
import { OllamaEmbeddings } from "@langchain/ollama";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { SHOULD_SHOW_ALL_LOGS } from "../../general/constants";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document } from "langchain/document";
import path from "path";

type LangchainDocument = Document<Record<string, any>>;
type LangchainEmbeddings = OpenAIEmbeddings | OllamaEmbeddings;

export const createEmbeddings = (): LangchainEmbeddings => {
  return process.env.NEXT_PUBLIC_IS_USING_LOCAL_EMBEDDINGS === "true"
    ? new OllamaEmbeddings()
    : new OpenAIEmbeddings();
};

export const splitTextIntoChunks = async (text: string) => {
  const splitText = await new RecursiveCharacterTextSplitter({
    chunkSize: 200,
    chunkOverlap: 20,
  }).splitText(text);

  console.log(`Split text into ${splitText.length} chunks.`);

  return splitText;
};

export const splitDocumentsIntoChunks = async (
  documents: LangchainDocument[]
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
  embeddings: LangchainEmbeddings
) => {
  const vectorStore = await MemoryVectorStore.fromTexts(texts, {}, embeddings);

  const numberOfSimilarityResults = 2;
  const similaritySearchResults = await vectorStore.similaritySearch(
    prompt,
    numberOfSimilarityResults
  );

  return similaritySearchResults;
};

export const performSimilaritySearchFromDocuments = async (
  documents: LangchainDocument[],
  prompt: string,
  embeddings: LangchainEmbeddings
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
  const embeddings = createEmbeddings();

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
    SHOULD_SHOW_ALL_LOGS && console.log("Did not receive context.");
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
  documents: LangchainDocument[]
): string[] => {
  return documents.map((document) => document.pageContent);
};

export const throwIfPromptIsLong = (prompt: string): void => {
  if (prompt.length > 10000) {
    throw new Error(
      "The prompt is very long. It might not necessarily be too long to send to an LLM, but given that it should be the result of a similarity search, it shouldn't be this long. Your prompt was not sent to an LLM as a (monetary) safety precaution, but you may still be able to send it to an LLM. To do so, simply comment out this conditional.\n\nThis can also probably be resolved by splitting the content from the retrieval into chunks."
    );
  }
};
