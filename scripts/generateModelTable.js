"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../general/constants");
var generateModelTable = function () {
    var table = "| Model | API Key |\n| --- | --- |\n";
    for (var model in constants_1.MODEL) {
        var modelInfo = (0, constants_1.getModelInformation)(constants_1.MODEL[model]);
        table += "| ".concat(constants_1.MODEL[model], " | ").concat(modelInfo.apiKey || constants_1.MODEL_API_KEY.None, " |\n");
    }
    return table;
};
console.log(generateModelTable());
