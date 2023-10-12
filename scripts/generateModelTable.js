"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../general/constants");
var generateModelTable = function () {
    var table = "| Model | API Type | API Source |\n| --- | --- | --- |\n";
    for (var model in constants_1.MODEL) {
        if (constants_1.MODEL[model] === constants_1.MODEL.Debug ||
            constants_1.MODEL[model] === constants_1.MODEL.Maintainer ||
            constants_1.MODEL[model] === constants_1.MODEL.Midjourney ||
            constants_1.MODEL[model] === constants_1.MODEL.FactChecker) {
            continue;
        }
        var modelInfo = (0, constants_1.getModelInformation)(constants_1.MODEL[model]);
        var modelType = (0, constants_1.getModelType)(constants_1.MODEL[model]);
        table += "| ".concat(constants_1.MODEL[model], " | ").concat(modelType, " | ").concat(modelInfo.apiKey || constants_1.MODEL_API_KEY.None, " |\n");
    }
    return table;
};
console.log(generateModelTable());
