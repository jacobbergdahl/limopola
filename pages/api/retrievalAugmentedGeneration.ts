import { OpenAIEmbeddings } from "@langchain/openai";
import { OllamaEmbeddings } from "@langchain/ollama";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { SHOULD_SHOW_ALL_LOGS } from "../../general/constants";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { PPTXLoader } from "@langchain/community/document_loaders/fs/pptx";
import { Document } from "langchain/document";
import path from "path";
import ExcelJS from "exceljs";
import { writeFileSync, statSync, readdirSync } from "fs";

type LangchainDocument = Document<Record<string, any>>;
type LangchainEmbeddings = OpenAIEmbeddings | OllamaEmbeddings;

let cachedDocuments: LangchainDocument[] | null = null;
// Intentionally left unused
let lastCacheTime = 0;
const CACHE_DURATION = 60 * 60 * 1000;

export const createEmbeddings = (): LangchainEmbeddings => {
  // This could be a prop/setting in the future
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

const convertExcelToCSV = async (filePath: string): Promise<string | null> => {
  const csvPath = filePath.replace(/\.(xlsx|xls)$/, ".csv");

  try {
    const excelStats = statSync(filePath);
    const csvStats = statSync(csvPath);
    const doesCsvExist = csvStats.mtime > excelStats.mtime;
    if (doesCsvExist) {
      SHOULD_SHOW_ALL_LOGS &&
        console.log(`Using existing CSV file for ${path.basename(filePath)}`);
      return null;
    }
  } catch (e) {
    // CSV doesn't exist, continue with conversion
  }

  console.log(`Converting ${path.basename(filePath)} to CSV`);
  const workbook = new ExcelJS.Workbook();

  try {
    await workbook.xlsx.readFile(filePath);

    let csvContent = "";
    workbook.eachSheet((worksheet) => {
      worksheet.eachRow((row) => {
        csvContent += Array.isArray(row.values)
          ? row.values
              .slice(1)
              // This map feels unnecessarily complex; there should probably be an easier way of extracting (correct) values from Excel cells.
              .map((cell: any) => {
                if (!cell) {
                  return "";
                }

                let cellValue = cell.toString().trim();
                if (
                  !cellValue.includes("[object Object]") &&
                  cellValue.length > 0 &&
                  // Don't return empty cells that only contain a comma; these are likely artifacts from Excel's internal representation
                  cellValue !== ","
                ) {
                  return cellValue;
                }

                if (typeof cell === "object") {
                  if ("result" in cell || "sharedFormula" in cell) {
                    cellValue = String(cell.result || "");
                  }
                  if ("formula" in cell) {
                    cellValue += String(cell.formula || "");
                  }
                  if ("richText" in cell) {
                    cellValue += String(
                      cell.richText?.map((rt: any) => rt.text).join("") || ""
                    );
                  }
                  if ("value" in cell) {
                    cellValue += String(cell.value || "");
                  }
                  if ("hyperlink" in cell) {
                    cellValue += String(cell.hyperlink || "");
                  }
                  cellValue += String(cell.numericValue || "");
                  cellValue += String(cell.text || "");
                  cellValue += String(cell.toString() || "");
                }

                cellValue = cellValue.replaceAll("[object Object]", "").trim();
                return cellValue;
              })
              // If a cell value contains commas, wrap it in quotes to preserve it as a single CSV field
              .map((value) => (value.includes(",") ? `"${value}"` : value))
              .join(",") + "\n"
          : "";
      });
    });

    writeFileSync(csvPath, csvContent);
    return csvContent;
  } catch (error) {
    const errorMessage = `Error processing ${path.basename(filePath)}: ${error}\n\nThe error above may be a red herring. A more common reason for this function failing is that the Excel file is open. Make sure to close it if you do have it open.`;
    console.error(errorMessage);
    throw error;
  }
};

export const fetchDataFiles = async () => {
  const currentTime = Date.now();

  // We are currently not caching the documents, which means that the documents are loaded anew every time. You could uncomment the code below if your data is static. I might make this into a prop/setting in the future.
  const shouldReturnCachedDocuments = false; // cachedDocuments && currentTime - lastCacheTime < CACHE_DURATION;

  if (shouldReturnCachedDocuments) {
    console.log("Returning cached documents");
    return cachedDocuments;
  }

  const dataDirectoryPath = path.join(process.cwd(), "/data/");
  console.log(`Retrieving data files from ${dataDirectoryPath}`);

  // LangChainJS doesn't have an xlsx loader (though the Python package does, so we might get one in the JS version in the future). For now, we convert Excel files to CSV.
  const files = readdirSync(dataDirectoryPath);
  for (const file of files) {
    if (file.match(/\.(xlsx|xls)$/)) {
      await convertExcelToCSV(path.join(dataDirectoryPath, file));
    }
  }

  const directoryLoader = new DirectoryLoader(dataDirectoryPath, {
    ".pdf": (path: string) => new PDFLoader(path),
    ".pptx": (path: string) => new PPTXLoader(path),
    ".docx": (path: string) => new DocxLoader(path),
    ".csv": (path: string) => new CSVLoader(path),
  });

  // Update cache
  cachedDocuments = await directoryLoader.load();
  lastCacheTime = currentTime;

  return cachedDocuments;
};

// This function will currently throw away anything that isn't just the pageContent.
// However, if you wanted to, you could also return sources.
// Below are some interesting properties of the documents that could be used to display the source(s):
// document.metadata.source is the file path
// document.metadata.pdf.info.Title is the file name (you can also find Author, Subject, etc. if it is present)
// document.metadata.loc.pageNumber is the page number, while document.metadata.pdf.totalPages is the total number of pages in the document
// document.metadata.loc.lines.from and document.metadata.loc.lines.to are the start and end of the lines of texts used on the page
// There's also more info in document.metadata.pdf.info, document.metadata.pdf.metadata, and document.metadata.loc.lines that may be of interest
// You may need to check if the values are undefined, but missing values will usually just be empty strings.
// You can use the double bang operator (!!) to check if a value is undefined or empty (!!document.metadata.pdf?.info?.Title).
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
