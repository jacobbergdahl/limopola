import {
  MODEL,
  MODEL_API_KEY,
  getModelInformation,
  getModelType,
} from "../general/constants";

const generateModelTable = () => {
  let table = "| Model | API Type | API Source |\n| --- | --- | --- |\n";

  for (const model in MODEL) {
    if (
      MODEL[model] === MODEL.Debug ||
      MODEL[model] === MODEL.Maintainer ||
      MODEL[model] === MODEL.Midjourney ||
      MODEL[model] === MODEL.FactChecker
    ) {
      continue;
    }
    const modelInfo = getModelInformation(MODEL[model]);
    const modelType = getModelType(MODEL[model]);
    table += `| ${MODEL[model]} | ${modelType} | ${
      modelInfo.apiKey || MODEL_API_KEY.None
    } |\n`;
  }

  return table;
};

console.log(generateModelTable());
