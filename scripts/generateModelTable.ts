import {
  MODEL,
  MODEL_API_KEY,
  getModelInformation,
} from "../general/constants";

const generateModelTable = () => {
  let table = "| Model | API Key |\n| --- | --- |\n";

  for (const model in MODEL) {
    if (
      model === MODEL.Debug ||
      model === MODEL.Maintainer ||
      model === MODEL.Midjourney ||
      model === MODEL.FactChecker
    ) {
      continue;
    }
    const modelInfo = getModelInformation(MODEL[model]);
    table += `| ${MODEL[model]} | ${
      modelInfo.apiKey || MODEL_API_KEY.None
    } |\n`;
  }

  return table;
};

console.log(generateModelTable());
