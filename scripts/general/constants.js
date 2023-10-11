"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CONTEXT = exports.TEXTAREA_STYLE = exports.INPUT_MODE = exports.getDefaultModel = exports.IMAGE_SIZE = exports.getModelType = exports.MODEL_TYPE = exports.ALL_MEMORY_OPTIONS = exports.MEMORY = exports.ALL_SLOW_MODELS = exports.ALL_LLAMA_MODELS = exports.ALL_OPEN_AI_MODELS = exports.ALL_IMAGE_MODELS = exports.ALL_AUDIO_MODELS = exports.ALL_VIDEO_MODELS = exports.ALL_TEXT_MODELS = exports.getModelInformation = exports.MODEL_API_KEY = exports.MODEL_STATUS = exports.MODEL = exports.DEFAULT_TECHNICAL_VOICE_SIMILARITY_BOOST = exports.DEFAULT_VOICE_SIMILARITY_BOOST = exports.DEFAULT_TECHNICAL_VOICE_STABILITY = exports.DEFAULT_VOICE_STABILITY = exports.DEFAULT_TECHNICAL_TOP_P = exports.DEFAULT_TOP_P = exports.DEFAULT_TECHNICAL_PRESENCE_PENALTY = exports.DEFAULT_PRESENCE_PENALTY = exports.DEFAULT_TECHNICAL_FREQUENCY_PENALTY = exports.DEFAULT_FREQUENCY_PENALTY = exports.DEFAULT_TECHNICAL_TEMPERATURE = exports.DEFAULT_TEMPERATURE = exports.SHOULD_SHOW_ALL_LOGS = exports.IS_DEBUGGING = void 0;
exports.IS_DEBUGGING = process.env.NEXT_PUBLIC_IS_DEBUGGING === "true";
exports.SHOULD_SHOW_ALL_LOGS = process.env.NEXT_PUBLIC_SHOULD_SHOW_ALL_LOGS === "true";
exports.DEFAULT_TEMPERATURE = 30;
exports.DEFAULT_TECHNICAL_TEMPERATURE = 0.6;
exports.DEFAULT_FREQUENCY_PENALTY = 50;
exports.DEFAULT_TECHNICAL_FREQUENCY_PENALTY = 0;
exports.DEFAULT_PRESENCE_PENALTY = 50;
exports.DEFAULT_TECHNICAL_PRESENCE_PENALTY = 0;
exports.DEFAULT_TOP_P = 0;
exports.DEFAULT_TECHNICAL_TOP_P = 0;
exports.DEFAULT_VOICE_STABILITY = 50;
exports.DEFAULT_TECHNICAL_VOICE_STABILITY = 0.5;
exports.DEFAULT_VOICE_SIMILARITY_BOOST = 50;
exports.DEFAULT_TECHNICAL_VOICE_SIMILARITY_BOOST = 0.5;
var MODEL;
(function (MODEL) {
    MODEL["Gpt4"] = "gpt-4";
    MODEL["Gpt4_32k"] = "gpt-4-32k";
    MODEL["Gpt3_5_turbo"] = "gpt-3.5-turbo";
    MODEL["Gpt3_5_turbo_16k"] = "gpt-3.5-turbo-16k";
    MODEL["Dalle"] = "dall-e";
    MODEL["StableDiffusionSdXl"] = "stable-diffusion-xl";
    MODEL["Llama2_70b"] = "llama-2-70b";
    MODEL["Llama2_13b"] = "llama-2-13b";
    MODEL["Llama2_70b_chat"] = "llama-2-70b-chat";
    MODEL["Llama2_13b_chat"] = "llama-2-13b-chat";
    MODEL["CodeLlama_13b"] = "codellama-34b";
    MODEL["TextToPokemon"] = "text-to-pokemon";
    MODEL["AnimateDiff"] = "animate-diff";
    MODEL["LocalLlama"] = "local";
    MODEL["Maintainer"] = "local-maintainer";
    MODEL["ElevenLabs"] = "eleven-labs";
    MODEL["FactChecker"] = "gpt-4-fact-checker";
    MODEL["Midjourney"] = "midjourney-imagine";
    MODEL["Debug"] = "debug";
})(MODEL || (exports.MODEL = MODEL = {}));
var MODEL_STATUS;
(function (MODEL_STATUS) {
    MODEL_STATUS["Full"] = "Working as expected.";
    MODEL_STATUS["Partial"] = "Working but missing some features.";
    MODEL_STATUS["Poor"] = "Not working as expected.";
    MODEL_STATUS["Unknown"] = "Unknown.";
})(MODEL_STATUS || (exports.MODEL_STATUS = MODEL_STATUS = {}));
var MODEL_API_KEY;
(function (MODEL_API_KEY) {
    MODEL_API_KEY["OpenAi"] = "OpenAI";
    MODEL_API_KEY["Replicate"] = "Replicate";
    MODEL_API_KEY["ElevenLabs"] = "ElevenLabs";
    MODEL_API_KEY["HuggingFace"] = "HuggingFace";
    MODEL_API_KEY["None"] = "None";
})(MODEL_API_KEY || (exports.MODEL_API_KEY = MODEL_API_KEY = {}));
var getModelInformation = function (model) {
    switch (model) {
        case MODEL.Gpt4:
            return {
                status: MODEL_STATUS.Full,
                information: "Requires special permission from OpenAI to use. The requirements change constantly, so check the URL to learn more.",
                learnMoreUrl: "https://help.openai.com/en/articles/7102672-how-can-i-access-gpt-4",
                apiKey: MODEL_API_KEY.OpenAi,
            };
        case MODEL.Gpt4_32k:
            return {
                status: MODEL_STATUS.Full,
                information: "Same as gpt-4, but with greater context length (and higher cost).",
                learnMoreUrl: "https://platform.openai.com/docs/models/gpt-4",
                apiKey: MODEL_API_KEY.OpenAi,
            };
        case MODEL.Debug:
            return {
                status: MODEL_STATUS.Full,
                information: "Only used for debugging this project. Does not contact any external API. You can send empty messages to this endpoint.",
            };
        case MODEL.Gpt3_5_turbo:
            return {
                status: MODEL_STATUS.Full,
                information: "Same API as is used in the free tier of ChatGPT. Good starting API for text generation.",
                learnMoreUrl: "https://platform.openai.com/docs/models/gpt-3-5",
                apiKey: MODEL_API_KEY.OpenAi,
            };
        case MODEL.Gpt3_5_turbo_16k:
            return {
                status: MODEL_STATUS.Full,
                information: "Same as gpt-3.5-turbo, but with greater context length (and higher cost).",
                learnMoreUrl: "https://platform.openai.com/docs/models/gpt-3-5",
                apiKey: MODEL_API_KEY.OpenAi,
            };
        case MODEL.Dalle:
            return {
                status: MODEL_STATUS.Full,
                information: "An OpenAI image generation algorithm that is very easy to use.",
                learnMoreUrl: "https://platform.openai.com/docs/models/dall-e",
                apiKey: MODEL_API_KEY.OpenAi,
            };
        case MODEL.StableDiffusionSdXl:
            return {
                status: MODEL_STATUS.Full,
                information: "Very powerful image generator.",
                learnMoreUrl: "https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0",
                apiKey: MODEL_API_KEY.Replicate,
            };
        case MODEL.Llama2_70b_chat:
            return {
                status: MODEL_STATUS.Full,
                information: "A 70 billion parameter language model from Meta, fine tuned for chat completions.",
                learnMoreUrl: "https://replicate.com/meta/llama-2-70b-chat",
                apiKey: MODEL_API_KEY.Replicate,
            };
        case MODEL.Llama2_13b_chat:
            return {
                status: MODEL_STATUS.Full,
                information: "A 13 billion parameter language model from Meta, fine tuned for chat completions.",
                learnMoreUrl: "https://replicate.com/meta/llama-2-13b-chat",
                apiKey: MODEL_API_KEY.Replicate,
            };
        case MODEL.Llama2_13b:
            return {
                status: MODEL_STATUS.Full,
                information: "Base version of Llama 2, a 13 billion parameter language model from Meta.",
                learnMoreUrl: "https://replicate.com/meta/llama-2-13b",
                apiKey: MODEL_API_KEY.Replicate,
            };
        case MODEL.Llama2_70b:
            return {
                status: MODEL_STATUS.Full,
                information: "Base version of Llama 2, a 70 billion parameter language model from Meta.",
                learnMoreUrl: "https://replicate.com/meta/llama-2-70b",
                apiKey: MODEL_API_KEY.Replicate,
            };
        case MODEL.CodeLlama_13b:
            return {
                status: MODEL_STATUS.Full,
                information: "A 34 billion parameter Llama tuned for coding and conversation.",
                learnMoreUrl: "https://replicate.com/meta/codellama-34b",
                apiKey: MODEL_API_KEY.Replicate,
            };
        case MODEL.TextToPokemon:
            return {
                status: MODEL_STATUS.Full,
                information: "An API for generating Pokemon images from text.",
                learnMoreUrl: "https://replicate.com/lambdal/text-to-pokemon/api",
                apiKey: MODEL_API_KEY.Replicate,
            };
        case MODEL.AnimateDiff:
            return {
                status: MODEL_STATUS.Full,
                information: "An API for generating short animated mp4's. It takes a while to generate, so please be patient. Note that this model may be a bit more expensive to use than the other models in this project.",
                learnMoreUrl: "https://replicate.com/lucataco/animate-diff",
                apiKey: MODEL_API_KEY.Replicate,
            };
        case MODEL.LocalLlama:
            return {
                status: MODEL_STATUS.Full,
                information: "This model runs locally on your machine. If you have have opted to show all logs, then you can see its progress in the NodeJS console. End your message with \"Answer:\" to get an answer, otherwise you might get a continuation.",
                learnMoreUrl: "https://llama-node.vercel.app/docs/start",
            };
        case MODEL.Maintainer:
            return {
                status: MODEL_STATUS.Partial,
                information: "This model runs locally on your machine and is trained to maintain this repository's codebase. It is not yet fully operational.",
                learnMoreUrl: "https://llama-node.vercel.app/docs/start",
            };
        case MODEL.ElevenLabs:
            return {
                status: MODEL_STATUS.Full,
                information: "Generates audio from text. You can write text for it to generate as audio, or ask it to generate audio of any existing text message by clicking on it. The learn more link below goes directly to a page that tells you about the stability and similarity boost settings.",
                learnMoreUrl: "https://docs.elevenlabs.io/speech-synthesis/voice-settings",
                apiKey: MODEL_API_KEY.ElevenLabs,
            };
        case MODEL.FactChecker:
            return {
                status: MODEL_STATUS.Full,
                // information: `A custom implementation of a fact-checker using GPT-4 as a basis. Rates the accuracy of any statement on a scale from 0 to 100. Will rate the statement 50 if it is entirely subjective. It will usually rate statements as 0, 50, or 100, hence I might change it to simply present true, false, or debatable instead.`,
                information: "A custom implementation of a fact-checker using GPT-4 as a basis. Rates the accuracy of any statement. Will always return true, false, or debatable. You can send it at list of statements.",
                apiKey: MODEL_API_KEY.Replicate,
            };
        case MODEL.Midjourney:
            return {
                status: MODEL_STATUS.Full,
                information: "Temp.",
                learnMoreUrl: "https://docs.midjourneyapi.io/midjourney-api/midjourney-api/imagine",
            };
    }
    return {
        status: MODEL_STATUS.Unknown,
        information: "There is no information on this model.",
    };
};
exports.getModelInformation = getModelInformation;
exports.ALL_TEXT_MODELS = [
    MODEL.Gpt4,
    MODEL.Gpt4_32k,
    MODEL.Gpt3_5_turbo,
    MODEL.Gpt3_5_turbo_16k,
    MODEL.Llama2_70b,
    MODEL.Llama2_13b,
    MODEL.Llama2_70b_chat,
    MODEL.Llama2_13b_chat,
    MODEL.CodeLlama_13b,
    MODEL.LocalLlama,
    MODEL.Maintainer,
    MODEL.FactChecker,
    MODEL.Debug,
];
exports.ALL_VIDEO_MODELS = [MODEL.AnimateDiff];
exports.ALL_AUDIO_MODELS = [MODEL.ElevenLabs];
exports.ALL_IMAGE_MODELS = [
    MODEL.Dalle,
    MODEL.StableDiffusionSdXl,
    MODEL.TextToPokemon,
    //MODEL.Midjourney,
];
exports.ALL_OPEN_AI_MODELS = [
    MODEL.Gpt4,
    MODEL.Gpt4_32k,
    MODEL.Gpt3_5_turbo,
    MODEL.Gpt3_5_turbo_16k,
    MODEL.Dalle,
];
// Excludes MODEL.Maintainer
exports.ALL_LLAMA_MODELS = [
    MODEL.Llama2_70b,
    MODEL.Llama2_13b,
    MODEL.Llama2_70b_chat,
    MODEL.Llama2_13b_chat,
    MODEL.CodeLlama_13b,
    MODEL.LocalLlama,
];
exports.ALL_SLOW_MODELS = [
    MODEL.CodeLlama_13b,
    MODEL.Llama2_70b,
    MODEL.Llama2_70b_chat,
    MODEL.AnimateDiff,
    MODEL.LocalLlama,
    MODEL.Maintainer,
];
var MEMORY;
(function (MEMORY) {
    MEMORY["Remember"] = "On";
    MEMORY["DontRemember"] = "Off";
})(MEMORY || (exports.MEMORY = MEMORY = {}));
exports.ALL_MEMORY_OPTIONS = [MEMORY.Remember, MEMORY.DontRemember];
var MODEL_TYPE;
(function (MODEL_TYPE) {
    MODEL_TYPE["Text"] = "Text";
    MODEL_TYPE["Image"] = "Image";
    MODEL_TYPE["Video"] = "Video";
    MODEL_TYPE["Audio"] = "Audio";
})(MODEL_TYPE || (exports.MODEL_TYPE = MODEL_TYPE = {}));
var getModelType = function (model) {
    if (exports.ALL_TEXT_MODELS.indexOf(model) > -1) {
        return MODEL_TYPE.Text;
    }
    if (exports.ALL_IMAGE_MODELS.indexOf(model) > -1) {
        return MODEL_TYPE.Image;
    }
    if (exports.ALL_VIDEO_MODELS.indexOf(model) > -1) {
        return MODEL_TYPE.Video;
    }
    if (exports.ALL_AUDIO_MODELS.indexOf(model) > -1) {
        return MODEL_TYPE.Audio;
    }
    return MODEL_TYPE.Text;
};
exports.getModelType = getModelType;
var IMAGE_SIZE;
(function (IMAGE_SIZE) {
    IMAGE_SIZE["Small"] = "256x256";
    IMAGE_SIZE["Medium"] = "512x512";
    IMAGE_SIZE["Large"] = "1024x1024";
})(IMAGE_SIZE || (exports.IMAGE_SIZE = IMAGE_SIZE = {}));
var getDefaultModel = function () {
    if (exports.IS_DEBUGGING) {
        return MODEL.Debug;
    }
    return MODEL.Gpt4;
};
exports.getDefaultModel = getDefaultModel;
var INPUT_MODE;
(function (INPUT_MODE) {
    INPUT_MODE["Chat"] = "Chat";
    INPUT_MODE["Editor"] = "Editor";
})(INPUT_MODE || (exports.INPUT_MODE = INPUT_MODE = {}));
var TEXTAREA_STYLE;
(function (TEXTAREA_STYLE) {
    TEXTAREA_STYLE[TEXTAREA_STYLE["Default"] = 0] = "Default";
    TEXTAREA_STYLE[TEXTAREA_STYLE["Code"] = 1] = "Code";
})(TEXTAREA_STYLE || (exports.TEXTAREA_STYLE = TEXTAREA_STYLE = {}));
exports.DEFAULT_CONTEXT = {
    id: 1,
    title: "Default",
    content: "",
};
