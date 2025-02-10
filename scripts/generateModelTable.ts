import {
  ALL_CUSTOM_WRAPPERS,
  MODEL,
  MODEL_API_KEY,
  getModelInformation,
  getModelType,
} from "../general/constants";

const hasNoteBeenAdded = (note: string, notes: string[]): boolean => {
  return notes.includes(note);
};

const getNumberOfAsterisks = (numberOfNotes: number): string => {
  let asterisks = "\\";
  for (let i = 0; i < numberOfNotes; i++) {
    asterisks += "*";
  }
  return asterisks;
};

const getNotesSection = (notes: string[]): string => {
  return notes
    .map((note, index) => `${getNumberOfAsterisks(index + 1)} ${note}`)
    .join("\n\n");
};

const generateModelTables = () => {
  let aiModelsTable = "| Model | Type | API Source |\n| --- | --- | --- |\n";
  let aiWrappersTable =
    "| Model | Type | API Source | Note | \n| --- | --- | --- | --- |\n";
  let numberOfNotesInAiModelsTable = 0;
  let notes: string[] = [];

  for (const model in MODEL) {
    if (MODEL[model] === MODEL.Debug) {
      continue;
    }

    const modelInfo = getModelInformation(MODEL[model]);
    const modelType = getModelType(MODEL[model]);
    const allModelInformation = getModelInformation(MODEL[model]);
    const note: string | undefined = allModelInformation.mdNote;

    if (ALL_CUSTOM_WRAPPERS.includes(MODEL[model])) {
      aiWrappersTable += `| ${MODEL[model]} | ${modelType} | ${
        modelInfo.apiKey || MODEL_API_KEY.None
      } | ${note} |\n`;
    } else {
      let asterisk = "";
      if (note && note.length > 0) {
        if (!hasNoteBeenAdded(note, notes)) {
          notes.push(note);
          numberOfNotesInAiModelsTable++;
          asterisk = getNumberOfAsterisks(numberOfNotesInAiModelsTable);
        } else {
          asterisk = getNumberOfAsterisks(notes.indexOf(note) + 1);
        }
      }
      aiModelsTable += `| ${MODEL[model]}${asterisk} | ${modelType} | ${
        modelInfo.apiKey || MODEL_API_KEY.None
      } |\n`;
    }
  }

  const finalMd = `
  ${aiModelsTable}
  ${getNotesSection(notes)}
  ### Custom wrappers of AI models

  ${aiWrappersTable}
  `;

  return finalMd;
};

console.log(generateModelTables());
