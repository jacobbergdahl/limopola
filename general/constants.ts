export const IS_DEBUGGING = process.env.NEXT_PUBLIC_IS_DEBUGGING === "true";
export const SHOULD_SHOW_ALL_LOGS =
  process.env.NEXT_PUBLIC_SHOULD_SHOW_ALL_LOGS === "true";
export const DEFAULT_TEMPERATURE = 30;
export const DEFAULT_TECHNICAL_TEMPERATURE = 0.6;
export const DEFAULT_FREQUENCY_PENALTY = 50;
export const DEFAULT_TECHNICAL_FREQUENCY_PENALTY = 0;
export const DEFAULT_PRESENCE_PENALTY = 50;
export const DEFAULT_TECHNICAL_PRESENCE_PENALTY = 0;
export const DEFAULT_TOP_P = 0;
export const DEFAULT_TECHNICAL_TOP_P = 0;
export const DEFAULT_VOICE_STABILITY = 50;
export const DEFAULT_TECHNICAL_VOICE_STABILITY = 0.5;
export const DEFAULT_VOICE_SIMILARITY_BOOST = 50;
export const DEFAULT_TECHNICAL_VOICE_SIMILARITY_BOOST = 0.5;

export enum MODEL {
  Gpt41 = "gpt-4.1",
  Gpt41_mini = "gpt-4.1-mini",
  Gpt41_nano = "gpt-4.1-nano",
  Gpt4 = "gpt-4",
  Gpt4_o = "gpt-4o",
  ChatGpt4_o = "chatgpt-4o-latest",
  Gpt4_32k = "gpt-4-32k",
  Gpt4_Turbo = "gpt-4-turbo",
  Gpt4_o_mini = "gpt-4o-mini",
  Gpt5 = "gpt-5",
  Gpt5_mini = "gpt-5-mini",
  Gpt5_nano = "gpt-5-nano",
  O4_mini = "o4-mini",
  O3 = "o3",
  O3_mini = "o3-mini",
  O1 = "o1",
  Claude4Opus = "claude-opus-4-20250514",
  Claude4Sonnet = "claude-sonnet-4-20250514",
  Claude37Sonnet = "claude-3-7-sonnet-latest",
  Claude35Sonnet = "claude-3-5-sonnet-latest",
  Claude35Haiku = "claude-3-5-haiku-latest",
  ClaudeCitations = "claude-citations",
  Dalle2 = "dall-e",
  Dalle3 = "dall-e-3",
  Flux11ProUltra = "flux-1.1-pro-ultra",
  Flux11Pro = "flux-1.1-pro",
  FluxSchnell = "flux-schnell",
  Imagen4 = "imagen-4",
  Imagen4Ultra = "imagen-4-ultra",
  Imagen4Fast = "imagen-4-fast",
  Seedream3 = "seedream-3",
  RecraftV3Svg = "recraft-v3-svg",
  StableDiffusionSdXl = "stable-diffusion-xl", // full name: stable-diffusion-xl-base-1.0
  DeepSeek_67b = "deepseek-67b-base",
  Llama2_70b = "llama-2-70b",
  Llama2_13b = "llama-2-13b",
  Llama3_8b_instruct = "llama-3-8b-instruct",
  Llama3_70b_instruct = "llama-3-70b-instruct",
  Llama2_70b_chat = "llama-2-70b-chat",
  Llama2_13b_chat = "llama-2-13b-chat",
  CodeLlama_13b = "codellama-34b",
  MistralLarge = "mistral-large-latest",
  MistralSmall = "mistral-small-latest",
  MistralSaba = "mistral-saba-latest",
  Ministral3B = "ministral-3b-latest",
  Ministral8B = "ministral-8b-latest",
  MistralModeration = "mistral-moderation-latest",
  Codestral = "codestral-latest",
  DevstralSmall = "devstral-small-latest",
  OpenMistralNemo = "open-mistral-nemo",
  OpenCodestralMamba = "open-codestral-mamba",
  TextToPokemon = "text-to-pokemon",
  AnimateDiff = "animate-diff",
  ElevenLabs = "eleven-labs",
  PalmTextBison001 = "text-bison-001",
  PalmChatBison001 = "chat-bison-001",
  FactChecker = "gpt-4-fact-checker",
  WebRetriever = "gpt-4-web-retriever",
  GptDataReader = "gpt-data-reader",
  ClaudeDataReader = "claude-data-reader",
  Azure = "azure",
  LocalLlm = "local-node-llama-cpp",
  LocalOllama = "local-ollama",
  OpenAiCompatibleApi = "openai-compatible-api",
  WebLlm = "web-llm",
  TransformersSentimentAnalysis = "t-sentiment-analysis",
  TransformersText2Text = "t-text2text",
  Debug = "debug",
}

export enum MODEL_STATUS {
  Full = "Working as expected.",
  Partial = "Working but missing some features.",
  Poor = "Not working as expected.",
  Unknown = "Unknown.",
}

export enum MODEL_API_KEY {
  OpenAi = "OpenAI",
  Replicate = "Replicate",
  ElevenLabs = "ElevenLabs",
  HuggingFace = "HuggingFace",
  Google = "Google",
  Anthropic = "Anthropic",
  Azure = "Azure",
  Mistral = "Mistral",
  Any = "Any",
  None = "None",
}

type ModelInformation = {
  status: MODEL_STATUS;
  information: string;
  learnMoreUrl?: string;
  apiKey?: MODEL_API_KEY;
  mdNote?: string;
};

export const getModelInformation = (model: MODEL): ModelInformation => {
  switch (model) {
    case MODEL.Gpt4:
      return {
        status: MODEL_STATUS.Full,
        information:
          "A model that OpenAI considers obsolete, but is in many regards still one of its best models at following prompts.",
        learnMoreUrl: "https://platform.openai.com/docs/models/gpt-4",
        apiKey: MODEL_API_KEY.OpenAi,
      };
    case MODEL.Gpt4_32k:
      return {
        status: MODEL_STATUS.Full,
        information:
          "Same as gpt-4, but with greater context length (and higher cost).",
        learnMoreUrl:
          "https://platform.openai.com/docs/models/gpt-4-and-gpt-4-turbo",
        apiKey: MODEL_API_KEY.OpenAi,
      };
    case MODEL.Gpt4_Turbo:
      return {
        status: MODEL_STATUS.Full,
        information:
          "GPT-4 Turbo has more up-to-date information and a larger context window than GPT-4.",
        learnMoreUrl:
          "https://platform.openai.com/docs/models/gpt-4-and-gpt-4-turbo",
        apiKey: MODEL_API_KEY.OpenAi,
      };
    case MODEL.Gpt4_o:
      return {
        status: MODEL_STATUS.Full,
        information:
          "GPT-4o is a multimodal LLM from OpenAI. It is faster and cheaper than GPT-4, and the ChatGPT default, though GPT-4 tends to perform better.",
        learnMoreUrl: "https://platform.openai.com/docs/models/gpt-4o",
        apiKey: MODEL_API_KEY.OpenAi,
      };
    case MODEL.Gpt5:
      return {
        status: MODEL_STATUS.Full,
        information:
          "GPT-5 is an LLM from OpenAI. Used for complex reasoning, broad world knowledge, and code-heavy or multi-step agentic tasks.",
        learnMoreUrl: "https://platform.openai.com/docs/models/gpt-5",
        apiKey: MODEL_API_KEY.OpenAi,
      };
    case MODEL.Gpt5_mini:
      return {
        status: MODEL_STATUS.Full,
        information:
          "GPT-5 mini is an LLM from OpenAI. Cost-optimized reasoning and chat; balances speed, cost, and capability.",
        learnMoreUrl: "https://platform.openai.com/docs/models/gpt-5-mini",
        apiKey: MODEL_API_KEY.OpenAi,
      };
    case MODEL.Gpt5_nano:
      return {
        status: MODEL_STATUS.Full,
        information:
          "GPT-5 nano is an LLM from OpenAI. High-throughput tasks, especially simple instruction-following or classification.",
        learnMoreUrl: "https://platform.openai.com/docs/models/gpt-5-nano",
        apiKey: MODEL_API_KEY.OpenAi,
      };
    case MODEL.Debug:
      return {
        status: MODEL_STATUS.Full,
        information:
          "Only used for debugging this project. Does not contact any external API. You can send empty messages to this endpoint.",
      };
    case MODEL.Gpt4_o_mini:
      return {
        status: MODEL_STATUS.Full,
        information:
          "OpenAI's affordable and intelligent small model for fast, lightweight tasks.",
        learnMoreUrl: "https://platform.openai.com/docs/models/gpt-4o-mini",
        apiKey: MODEL_API_KEY.OpenAi,
      };
    case MODEL.Dalle2:
      return {
        status: MODEL_STATUS.Full,
        information:
          "An OpenAI image generation algorithm that is very easy to use.",
        learnMoreUrl: "https://platform.openai.com/docs/models/dall-e",
        apiKey: MODEL_API_KEY.OpenAi,
      };
    case MODEL.Dalle3:
      return {
        status: MODEL_STATUS.Full,
        information:
          "An OpenAI image generation algorithm that is very easy to use.",
        learnMoreUrl: "https://platform.openai.com/docs/models/dall-e",
        apiKey: MODEL_API_KEY.OpenAi,
      };
    case MODEL.StableDiffusionSdXl:
      return {
        status: MODEL_STATUS.Full,
        information: "A text-to-image model by Stability AI.",
        learnMoreUrl: "https://replicate.com/blog/run-sdxl-with-an-api",
        apiKey: MODEL_API_KEY.Replicate,
      };
    case MODEL.DeepSeek_67b:
      return {
        status: MODEL_STATUS.Full,
        information: "A 67 billion parameter language model from DeepSeek.",
        learnMoreUrl: "https://replicate.com/deepseek-ai/deepseek-67b-base",
        apiKey: MODEL_API_KEY.Replicate,
      };
    case MODEL.Imagen4:
      return {
        status: MODEL_STATUS.Full,
        information: "Google's flagship image generation model.",
        learnMoreUrl: "https://replicate.com/google/imagen-4/",
        apiKey: MODEL_API_KEY.Replicate,
      };
    case MODEL.Imagen4Fast:
      return {
        status: MODEL_STATUS.Full,
        information:
          "Google's flagship image generation model. Half the price of Imagen 4.",
        learnMoreUrl: "https://replicate.com/google/imagen-4-fast/",
        apiKey: MODEL_API_KEY.Replicate,
      };
    case MODEL.Imagen4Ultra:
      return {
        status: MODEL_STATUS.Full,
        information:
          "Google's flagship image generation model. 50% more expensive than Imagen 4.",
        learnMoreUrl: "https://replicate.com/google/imagen-4-ultra/",
        apiKey: MODEL_API_KEY.Replicate,
      };
    case MODEL.Seedream3:
      return {
        status: MODEL_STATUS.Full,
        information: "An image generation model by ByteDance.",
        learnMoreUrl: "https://replicate.com/bytedance/seedream-3/",
        apiKey: MODEL_API_KEY.Replicate,
      };
    case MODEL.RecraftV3Svg:
      return {
        status: MODEL_STATUS.Full,
        information:
          "Recraft V3 SVG (code-named red_panda) is a text-to-image model with the ability to generate high quality SVG images including logotypes, and icons.",
        learnMoreUrl: "https://replicate.com/recraft-ai/recraft-v3-svg",
        apiKey: MODEL_API_KEY.Replicate,
      };
    case MODEL.Flux11ProUltra:
      return {
        status: MODEL_STATUS.Full,
        information:
          "Creates excellent images. Use raw mode for realism. The images are automatically saved in a gitignored folder in ~/public/ai-images.",
        learnMoreUrl:
          "https://replicate.com/black-forest-labs/flux-1.1-pro-ultra/api",
        apiKey: MODEL_API_KEY.Replicate,
      };
    case MODEL.Flux11Pro:
      return {
        status: MODEL_STATUS.Full,
        information:
          "Great image quality. A little bit cheaper than Pro Ultra. The images are automatically saved in a gitignored folder in ~/public/ai-images.",
        learnMoreUrl:
          "https://replicate.com/black-forest-labs/flux-1.1-pro/api",
        apiKey: MODEL_API_KEY.Replicate,
      };
    case MODEL.FluxSchnell:
      return {
        status: MODEL_STATUS.Full,
        information:
          "Significantly cheaper and faster than Flux Pro and Ultra Pro. The images are automatically saved in a gitignored folder in ~/public/ai-images.",
        learnMoreUrl:
          "https://replicate.com/black-forest-labs/flux-1.1-pro/api",
        apiKey: MODEL_API_KEY.Replicate,
      };
    case MODEL.Llama3_70b_instruct:
      return {
        status: MODEL_STATUS.Full,
        information: "A 70 billion parameter language model from Meta.",
        learnMoreUrl: "https://replicate.com/meta/meta-llama-3-70b-instruct",
        apiKey: MODEL_API_KEY.Replicate,
      };
    case MODEL.Llama3_8b_instruct:
      return {
        status: MODEL_STATUS.Full,
        information: "An 8 billion parameter language model from Meta.",
        learnMoreUrl: "https://replicate.com/meta/meta-llama-3-8b-instruct/api",
        apiKey: MODEL_API_KEY.Replicate,
      };
    case MODEL.Llama2_70b_chat:
      return {
        status: MODEL_STATUS.Full,
        information:
          "A 70 billion parameter language model from Meta, fine tuned for chat completions.",
        learnMoreUrl: "https://replicate.com/meta/llama-2-70b-chat",
        apiKey: MODEL_API_KEY.Replicate,
      };
    case MODEL.Llama2_13b_chat:
      return {
        status: MODEL_STATUS.Full,
        information:
          "A 13 billion parameter language model from Meta, fine tuned for chat completions.",
        learnMoreUrl: "https://replicate.com/meta/llama-2-13b-chat",
        apiKey: MODEL_API_KEY.Replicate,
      };
    case MODEL.Llama2_13b:
      return {
        status: MODEL_STATUS.Full,
        information:
          "Base version of Llama 2, a 13 billion parameter language model from Meta.",
        learnMoreUrl: "https://replicate.com/meta/llama-2-13b",
        apiKey: MODEL_API_KEY.Replicate,
      };
    case MODEL.Llama2_70b:
      return {
        status: MODEL_STATUS.Full,
        information:
          "Base version of Llama 2, a 70 billion parameter language model from Meta.",
        learnMoreUrl: "https://replicate.com/meta/llama-2-70b",
        apiKey: MODEL_API_KEY.Replicate,
      };
    case MODEL.CodeLlama_13b:
      return {
        status: MODEL_STATUS.Full,
        information:
          "A 34 billion parameter Llama tuned for coding and conversation.",
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
        information:
          "An API for generating short animated mp4's. It takes a while to generate, so please be patient. Note that this model may be a bit more expensive to use than the other models in this project.",
        learnMoreUrl: "https://replicate.com/lucataco/animate-diff",
        apiKey: MODEL_API_KEY.Replicate,
      };
    case MODEL.LocalLlm:
      return {
        status: MODEL_STATUS.Full,
        information: `This model runs locally on your machine. See the README for an explanation on how to get set-up.`,
        learnMoreUrl: "https://github.com/withcatai/node-llama-cpp",
        apiKey: MODEL_API_KEY.None,
      };
    case MODEL.LocalOllama:
      return {
        status: MODEL_STATUS.Full,
        information: `This model runs locally on your machine. Unlike local-llm-node-cpp, it requires you to run a separate Ollama server. See the README for an explanation on how to get set-up.`,
        learnMoreUrl: "https://ollama.com/",
        apiKey: MODEL_API_KEY.None,
      };
    case MODEL.OpenAiCompatibleApi:
      return {
        status: MODEL_STATUS.Full,
        information: `Run any OpenAI-compatible API (e.g., DeepSeek) by specifying the URL, API key, and model name in your .env file. This backend may need to be lightly customized for certain API calls.`,
        apiKey: MODEL_API_KEY.Any,
      };
    case MODEL.TransformersSentimentAnalysis:
      return {
        status: MODEL_STATUS.Full,
        information: `This model will perform sentiment analysis on your input. It runs locally in your browser via transformers.js. It will be slow the first time you run it, but it will be cached, and subsequent runs are faster.`,
        learnMoreUrl: "https://huggingface.co/docs/transformers.js/pipelines",
        apiKey: MODEL_API_KEY.None,
      };
    case MODEL.TransformersText2Text:
      return {
        status: MODEL_STATUS.Full,
        information: `This is a conversational model that runs locally in your browser via transformers.js. It will be slow the first time you run it, but it will be cached, and subsequent runs are faster.`,
        learnMoreUrl: "https://huggingface.co/docs/transformers.js/pipelines",
        apiKey: MODEL_API_KEY.None,
      };
    case MODEL.WebLlm:
      return {
        status: MODEL_STATUS.Poor,
        information: `Not yet implemented. WebLlm allows you to run local llm's directly in the browser, but it's still very early and there are technical issues with running it.`,
        learnMoreUrl: "https://github.com/mlc-ai/web-llm/tree/main",
        apiKey: MODEL_API_KEY.None,
      };
    case MODEL.ElevenLabs:
      return {
        status: MODEL_STATUS.Full,
        information: `Generates audio from text. You can write text for it to generate as audio, or ask it to generate audio of any existing text message by clicking on it. The learn more link below goes directly to a page that tells you about the stability and similarity boost settings.`,
        learnMoreUrl:
          "https://docs.elevenlabs.io/speech-synthesis/voice-settings",
        apiKey: MODEL_API_KEY.ElevenLabs,
      };
    case MODEL.FactChecker:
      return {
        status: MODEL_STATUS.Full,
        information: `A custom implementation of a fact-checker using GPT-4 as a basis. Rates the accuracy of any statement. Will always return true, false, or debatable. You can send it at list of statements.`,
        apiKey: MODEL_API_KEY.OpenAi,
        mdNote:
          "A custom implementation of a fact-checker. Uses GPT-4 to rate the accuracy of any statement.",
      };
    case MODEL.WebRetriever:
      return {
        status: MODEL_STATUS.Full,
        information: `A custom implementation of a web retriever using GPT-4 as a basis.`,
        apiKey: MODEL_API_KEY.OpenAi,
        mdNote:
          "A custom implementation of a web retriever. Reads data from the internet and sends it to GPT-4. A form of RAG.",
      };
    case MODEL.GptDataReader:
      return {
        status: MODEL_STATUS.Full,
        information: `Uses RAG and GPT-4o to retrieve data from files in the data folder. Can read PDF, Word, PowerPoint, Excel, and CSV files.`,
        apiKey: MODEL_API_KEY.OpenAi,
        mdNote:
          "Uses RAG and GPT-4o to retrieve data from files in the data folder. Can read PDF, Word, PowerPoint, Excel, and CSV files.",
      };
    case MODEL.ClaudeDataReader:
      return {
        status: MODEL_STATUS.Full,
        information: `Uses RAG and Claude to retrieve data from files in the data folder. Can read PDF, Word, PowerPoint, Excel, and CSV files. While Claude is used to process the data, OpenAI embeddings are used to perform the similarity search, hence both the OpenAI and Anthropic API keys are required.`,
        apiKey: MODEL_API_KEY.Anthropic,
        mdNote:
          "Uses RAG and Claude to retrieve data from files in the data folder. Can read PDF, Word, PowerPoint, Excel, and CSV files.",
      };
    case MODEL.PalmChatBison001:
      return {
        status: MODEL_STATUS.Partial,
        information: `Google PaLM model for chatting. Optimized for multi-turn chats (dialogues). Not using the API fully correctly yet, but the memory still seems to work well.`,
        learnMoreUrl: "https://developers.generativeai.google/models/language",
        apiKey: MODEL_API_KEY.Google,
        mdNote:
          "Google PaLM. No longer available in the `main` branch due to a rough dependency clash. To use Google's API's, run `git checkout google-generativelanguage && npm install`.",
      };
    case MODEL.PalmTextBison001:
      return {
        status: MODEL_STATUS.Full,
        information: `Google PaLM model for generating text. Does not work well with multi-turn chats (e.g., the memory feature), but is great for accomplishing tasks like writing code.`,
        learnMoreUrl: "https://developers.generativeai.google/models/language",
        apiKey: MODEL_API_KEY.Google,
        mdNote:
          "Google PaLM. No longer available in the `main` branch due to a rough dependency clash. To use Google's API's, run `git checkout google-generativelanguage && npm install`.",
      };
    case MODEL.Azure:
      return {
        status: MODEL_STATUS.Full,
        information: `The way LLM's are served through the Azure API is a bit different as you configure your own model id's, hence you configure which AI model you want to use through a .env variable.`,
        learnMoreUrl:
          "https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/openai/openai",
        apiKey: MODEL_API_KEY.Azure,
      };
    case MODEL.Claude35Sonnet:
      return {
        status: MODEL_STATUS.Full,
        information: `An LLM by Anthropic. Opus is smarter than Sonnet which is smarter than Haiku.`,
        learnMoreUrl: "https://www.anthropic.com/claude/sonnet",
        apiKey: MODEL_API_KEY.Anthropic,
      };
    case MODEL.ClaudeCitations:
      return {
        status: MODEL_STATUS.Full,
        information: `Uses RAG and Claude 3.5 Sonnet to read the PDF files in your data folder, answer your instructions, and provide citations of its answer.`,
        learnMoreUrl:
          "https://docs.anthropic.com/en/docs/build-with-claude/citations",
        apiKey: MODEL_API_KEY.Anthropic,
        mdNote: `Uses RAG and Claude 3.5 Sonnet to read the PDF files in your data folder, answer your instructions, and provide citations of its answer.`,
      };
    case MODEL.Claude35Haiku:
      return {
        status: MODEL_STATUS.Full,
        information: `An LLM by Anthropic. Opus is smarter than Sonnet which is smarter than Haiku.`,
        learnMoreUrl: "https://www.anthropic.com/claude/haiku",
        apiKey: MODEL_API_KEY.Anthropic,
      };
    case MODEL.MistralLarge:
      return {
        status: MODEL_STATUS.Full,
        information:
          "Mistral's most capable reasoning model for high-complexity tasks.",
        learnMoreUrl:
          "https://docs.mistral.ai/getting-started/models/models_overview/",
        apiKey: MODEL_API_KEY.Mistral,
      };
    case MODEL.MistralSmall:
      return {
        status: MODEL_STATUS.Full,
        information:
          "A small model that would normally have image understanding capabilities, though that hasn't been implemented in this repository.",
        learnMoreUrl:
          "https://docs.mistral.ai/getting-started/models/models_overview/",
        apiKey: MODEL_API_KEY.Mistral,
      };
    case MODEL.MistralSaba:
      return {
        status: MODEL_STATUS.Full,
        information:
          "A specialized model for languages from the Middle East and South Asia.",
        learnMoreUrl:
          "https://docs.mistral.ai/getting-started/models/models_overview/",
        apiKey: MODEL_API_KEY.Mistral,
      };
    case MODEL.Ministral3B:
      return {
        status: MODEL_STATUS.Full,
        information: "A compact edge model.",
        learnMoreUrl:
          "https://docs.mistral.ai/getting-started/models/models_overview/",
        apiKey: MODEL_API_KEY.Mistral,
      };
    case MODEL.Ministral8B:
      return {
        status: MODEL_STATUS.Full,
        information: "An 8B parameter model with good performance/price ratio.",
        learnMoreUrl:
          "https://docs.mistral.ai/getting-started/models/models_overview/",
        apiKey: MODEL_API_KEY.Mistral,
      };
    case MODEL.MistralModeration:
      return {
        status: MODEL_STATUS.Full,
        information:
          "Mistral's moderation service for detecting harmful text content.",
        learnMoreUrl:
          "https://docs.mistral.ai/getting-started/models/models_overview/",
        apiKey: MODEL_API_KEY.Mistral,
      };
    case MODEL.Codestral:
      return {
        status: MODEL_STATUS.Full,
        information:
          "Mistral's main model for coding tasks, specializing in fill-in-the-middle (FIM), code correction and test generation.",
        learnMoreUrl:
          "https://docs.mistral.ai/getting-started/models/models_overview/",
        apiKey: MODEL_API_KEY.Mistral,
      };
    case MODEL.OpenMistralNemo:
      return {
        status: MODEL_STATUS.Full,
        information: "Multilingual open source model.",
        learnMoreUrl:
          "https://docs.mistral.ai/getting-started/models/models_overview/",
        apiKey: MODEL_API_KEY.Mistral,
      };
    case MODEL.OpenCodestralMamba:
      return {
        status: MODEL_STATUS.Full,
        information: "An open-source model.",
        learnMoreUrl:
          "https://docs.mistral.ai/getting-started/models/models_overview/",
        apiKey: MODEL_API_KEY.Mistral,
      };
    case MODEL.DevstralSmall:
      return {
        status: MODEL_STATUS.Full,
        information:
          "A 24B text model, open source model that excels at using tools to explore codebases, editing multiple files and power software engineering agents.",
        learnMoreUrl: "https://mistral.ai/news/devstral",
        apiKey: MODEL_API_KEY.Mistral,
      };
    case MODEL.Gpt41:
      return {
        status: MODEL_STATUS.Full,
        information: "An OpenAI model. Arguably the OpenAI API default.",
        learnMoreUrl: "https://platform.openai.com/docs/models/gpt-4.1",
        apiKey: MODEL_API_KEY.OpenAi,
      };
    case MODEL.Gpt41_mini:
      return {
        status: MODEL_STATUS.Full,
        information: "An OpenAI model.",
        learnMoreUrl: "https://platform.openai.com/docs/models/gpt-4.1-mini",
        apiKey: MODEL_API_KEY.OpenAi,
      };
    case MODEL.Gpt41_nano:
      return {
        status: MODEL_STATUS.Full,
        information: "An OpenAI model.",
        learnMoreUrl: "https://platform.openai.com/docs/models/gpt-4.1-nano",
        apiKey: MODEL_API_KEY.OpenAi,
      };
    case MODEL.ChatGpt4_o:
      return {
        status: MODEL_STATUS.Full,
        information:
          "ChatGPT-4o points to the GPT-4o snapshot currently used in ChatGPT.",
        learnMoreUrl:
          "https://platform.openai.com/docs/models/chatgpt-4o-latest",
        apiKey: MODEL_API_KEY.OpenAi,
      };
    case MODEL.Claude37Sonnet:
      return {
        status: MODEL_STATUS.Full,
        information:
          "An LLM by Anthropic. Opus is smarter than Sonnet which is smarter than Haiku.",
        learnMoreUrl:
          "https://docs.anthropic.com/en/docs/about-claude/models/overview",
        apiKey: MODEL_API_KEY.Anthropic,
      };
    case MODEL.Claude4Opus:
      return {
        status: MODEL_STATUS.Full,
        information:
          "An LLM by Anthropic. Opus is smarter than Sonnet which is smarter than Haiku.",
        learnMoreUrl:
          "https://docs.anthropic.com/en/docs/about-claude/models/overview",
        apiKey: MODEL_API_KEY.Anthropic,
      };
    case MODEL.Claude4Sonnet:
      return {
        status: MODEL_STATUS.Full,
        information:
          "An LLM by Anthropic. Opus is smarter than Sonnet which is smarter than Haiku.",
        learnMoreUrl:
          "https://docs.anthropic.com/en/docs/about-claude/models/overview",
        apiKey: MODEL_API_KEY.Anthropic,
      };
    case MODEL.O4_mini:
      return {
        status: MODEL_STATUS.Full,
        information: "An OpenAI reasoning model.",
        learnMoreUrl: "https://platform.openai.com/docs/models/o4-mini",
        apiKey: MODEL_API_KEY.OpenAi,
      };
    case MODEL.O3:
      return {
        status: MODEL_STATUS.Full,
        information: "An OpenAI reasoning model.",
        learnMoreUrl: "https://platform.openai.com/docs/models/o3",
        apiKey: MODEL_API_KEY.OpenAi,
      };
    case MODEL.O3_mini:
      return {
        status: MODEL_STATUS.Full,
        information: "An OpenAI reasoning model.",
        learnMoreUrl: "https://platform.openai.com/docs/models/o3-mini",
        apiKey: MODEL_API_KEY.OpenAi,
      };
    case MODEL.O1:
      return {
        status: MODEL_STATUS.Full,
        information: "An OpenAI reasoning model.",
        learnMoreUrl: "https://platform.openai.com/docs/models/o1",
        apiKey: MODEL_API_KEY.OpenAi,
      };
  }

  return {
    status: MODEL_STATUS.Unknown,
    information: "There is no information on this model.",
  };
};

export const ALL_TEXT_MODELS = [
  MODEL.Gpt5,
  MODEL.Gpt5_mini,
  MODEL.Gpt5_nano,
  MODEL.Gpt4,
  MODEL.Gpt4_o,
  MODEL.ChatGpt4_o,
  MODEL.Gpt4_32k,
  MODEL.Gpt4_Turbo,
  MODEL.Gpt4_o_mini,
  MODEL.Gpt41,
  MODEL.Gpt41_mini,
  MODEL.Gpt41_nano,
  MODEL.O4_mini,
  MODEL.O3,
  MODEL.O3_mini,
  MODEL.O1,
  MODEL.Claude4Opus,
  MODEL.Claude4Sonnet,
  MODEL.Claude37Sonnet,
  MODEL.Claude35Sonnet,
  MODEL.Claude35Haiku,
  MODEL.ClaudeCitations,
  MODEL.Azure,
  MODEL.FactChecker,
  MODEL.WebRetriever,
  MODEL.GptDataReader,
  MODEL.ClaudeDataReader,
  MODEL.DeepSeek_67b,
  MODEL.Llama3_70b_instruct,
  MODEL.Llama3_8b_instruct,
  MODEL.Llama2_70b,
  MODEL.Llama2_13b,
  MODEL.Llama2_70b_chat,
  MODEL.Llama2_13b_chat,
  MODEL.CodeLlama_13b,
  MODEL.MistralLarge,
  MODEL.MistralSmall,
  MODEL.MistralSaba,
  MODEL.Ministral3B,
  MODEL.Ministral8B,
  MODEL.Codestral,
  MODEL.DevstralSmall,
  MODEL.OpenMistralNemo,
  MODEL.OpenCodestralMamba,
  MODEL.LocalLlm,
  MODEL.LocalOllama,
  MODEL.OpenAiCompatibleApi,
  MODEL.TransformersSentimentAnalysis,
  MODEL.TransformersText2Text,
  MODEL.PalmTextBison001,
  MODEL.PalmChatBison001,
  MODEL.Debug,
];

export const ALL_VIDEO_MODELS = [MODEL.AnimateDiff];

export const ALL_AUDIO_MODELS = [MODEL.ElevenLabs];

export const ALL_FLUX_MODELS = [
  MODEL.Flux11ProUltra,
  MODEL.Flux11Pro,
  MODEL.FluxSchnell,
];

export const ALL_IMAGEN_MODELS = [
  MODEL.Imagen4,
  MODEL.Imagen4Ultra,
  MODEL.Imagen4Fast,
];

export const ALL_IMAGE_MODELS = [
  MODEL.Dalle2,
  MODEL.Dalle3,
  MODEL.StableDiffusionSdXl,
  MODEL.TextToPokemon,
  ...ALL_FLUX_MODELS,
  ...ALL_IMAGEN_MODELS,
  MODEL.Seedream3,
  MODEL.RecraftV3Svg,
];

export const ALL_OPEN_AI_REASONING_MODELS = [
  MODEL.Gpt5,
  MODEL.Gpt5_mini,
  MODEL.Gpt5_nano,
  MODEL.O4_mini,
  MODEL.O3,
  MODEL.O3_mini,
  MODEL.O1,
];

export const ALL_OPEN_AI_MODELS = [
  ...ALL_OPEN_AI_REASONING_MODELS,
  MODEL.Gpt4,
  MODEL.Gpt4_32k,
  MODEL.Gpt4_Turbo,
  MODEL.Gpt4_o,
  MODEL.Gpt4_o_mini,
  MODEL.Gpt41,
  MODEL.Gpt41_mini,
  MODEL.Gpt41_nano,
  MODEL.ChatGpt4_o,
  MODEL.Dalle2,
  MODEL.Dalle3,
];

// Intentionally not including ClaudeCitations here, as it's a special case (it uses one of these models under the hood)
export const ALL_ANTHROPIC_MODELS = [
  MODEL.Claude35Sonnet,
  MODEL.Claude35Haiku,
  MODEL.Claude37Sonnet,
  MODEL.Claude4Opus,
  MODEL.Claude4Sonnet,
];

export const ALL_MODELS_THROUGH_REPLICATE = [
  MODEL.DeepSeek_67b,
  MODEL.Llama3_70b_instruct,
  MODEL.Llama3_8b_instruct,
  MODEL.Llama2_70b,
  MODEL.Llama2_13b,
  MODEL.Llama2_70b_chat,
  MODEL.Llama2_13b_chat,
  MODEL.CodeLlama_13b,
];

export const ALL_SLOW_MODELS = [
  MODEL.AnimateDiff,
  MODEL.LocalLlm,
  MODEL.LocalOllama,
  MODEL.TransformersSentimentAnalysis,
  MODEL.TransformersText2Text,
];

export const ALL_LOCAL_MODELS = [
  MODEL.LocalLlm,
  MODEL.LocalOllama,
  MODEL.OpenAiCompatibleApi,
];

export const ALL_CUSTOM_WRAPPERS = [
  MODEL.FactChecker,
  MODEL.WebRetriever,
  MODEL.GptDataReader,
  MODEL.ClaudeDataReader,
  MODEL.ClaudeCitations,
];

export const ALL_MISTRAL_MODELS = [
  MODEL.MistralLarge,
  MODEL.MistralSmall,
  MODEL.MistralSaba,
  MODEL.Ministral3B,
  MODEL.Ministral8B,
  MODEL.MistralModeration,
  MODEL.Codestral,
  MODEL.DevstralSmall,
  MODEL.OpenMistralNemo,
  MODEL.OpenCodestralMamba,
];

export enum MEMORY {
  Remember = "On",
  DontRemember = "Off",
}

export const ALL_MEMORY_OPTIONS = [MEMORY.Remember, MEMORY.DontRemember];

export type Message = {
  sender: string;
  id: number;
  content?: string;
  imageUrls?: string[];
  videoUrl?: string;
  videoUrls?: string[];
  audioUrl?: string;
  audioUrls?: string[];
  header?: string;
  fileName?: string;
  shouldAvoidDownloading?: boolean;
};

export enum MODEL_TYPE {
  Text = "Text",
  Image = "Image",
  Video = "Video",
  Audio = "Audio",
}

export const getModelType = (model: MODEL) => {
  if (ALL_TEXT_MODELS.indexOf(model) > -1) {
    return MODEL_TYPE.Text;
  }
  if (ALL_IMAGE_MODELS.indexOf(model) > -1) {
    return MODEL_TYPE.Image;
  }
  if (ALL_VIDEO_MODELS.indexOf(model) > -1) {
    return MODEL_TYPE.Video;
  }
  if (ALL_AUDIO_MODELS.indexOf(model) > -1) {
    return MODEL_TYPE.Audio;
  }

  return MODEL_TYPE.Text;
};

export enum IMAGE_SIZE_DALL_E_2 {
  Small = "256x256",
  Medium = "512x512",
  Large = "1024x1024",
}

export enum IMAGE_SIZE_DALL_E_3 {
  One = "1024x1024",
  Two = "1792x1024",
  Three = "1024x1792",
}

export enum IMAGE_ASPECT_RATIO {
  Landscape = "16:9",
  Portrait = "9:16",
  Square = "1:1",
  SocialMedia = "4:5",
  PhotoPrint = "2:3",
  PhotoPrintAlt = "3:2",
}

export const ALL_IMAGE_ASPECT_RATIOS = [
  IMAGE_ASPECT_RATIO.Landscape,
  IMAGE_ASPECT_RATIO.Portrait,
  IMAGE_ASPECT_RATIO.Square,
  IMAGE_ASPECT_RATIO.SocialMedia,
  IMAGE_ASPECT_RATIO.PhotoPrint,
  IMAGE_ASPECT_RATIO.PhotoPrintAlt,
];

export enum FLUX_MODE {
  Normal = "normal",
  Raw = "raw",
}

export const ALL_FLUX_MODES = [FLUX_MODE.Normal, FLUX_MODE.Raw];

export const getDefaultModel = (): MODEL => {
  if (!!process.env.NEXT_PUBLIC_DEFAULT_MODEL) {
    return process.env.NEXT_PUBLIC_DEFAULT_MODEL as MODEL;
  }
  if (IS_DEBUGGING) {
    return MODEL.Debug;
  }

  return MODEL.Gpt4;
};

export enum INPUT_MODE {
  Chat = "Chat",
  Editor = "Editor",
  Agent = "Agent",
  Reasoning = "Reasoning",
}

export enum TEXTAREA_STYLE {
  Default = 0,
  Code,
}

export type Context = {
  id: number;
  title: string;
  content: string;
};

export const DEFAULT_CONTEXT: Context = {
  id: 1,
  title: "Default",
  content: "",
};

export enum STATUS_CODE {
  Ok = 200,
  Created = 201,
  BadRequest = 400,
  NotFound = 404,
  MethodNotAllowed = 405,
  TooManyRequests = 429,
  InternalServerError = 500,
  NotImplemented = 501,
}

export enum AGENT_TASK_STATUS {
  Pending = "Pending",
  InProgress = "In-progress",
  Completed = "Completed",
}

export enum AGENT_TASK_INDICATION {
  Context = "context",
  Narration = "narration",
  Image = "image",
  Video = "video",
  Code = "code",
}

export type AgentTask = {
  id: number;
  description: string;
  status: AGENT_TASK_STATUS;
  api: MODEL;
  indication?: AGENT_TASK_INDICATION;
};

export enum THEME {
  Default = "Default",
  Colorful = "Colorful",
  Gradient = "Gradient",
  Dark = "Dark",
}

export enum REASONING_ONLINE_SEARCH {
  LetAiChoose = "AI decides",
  Always = "Always",
  Never = "Never",
}

// Much like GPT-4o is bad at understanding the context for agent mode, so too does it
// struggle greatly with reasoning. GPT-4, on the other hand, does an okay job.
// It's quite interesting how GPT-4, which OpenAI is labeling a legacy model, is generally
// better than GPT-4o at anything vaguely complex. Regardless, Claude 3.5 Sonnet appears to
// outperform all versions of GPT-4 and Llama 3 at reasoning.
export const REASONING_FIRST_TAKE_MODELS = [
  MODEL.Claude35Sonnet,
  MODEL.Llama3_70b_instruct,
  MODEL.Gpt4,
  MODEL.MistralLarge,
  MODEL.OpenAiCompatibleApi,
  MODEL.Azure,
  MODEL.LocalLlm,
  MODEL.LocalOllama,
  "None",
];

export const REASONING_ANSWER_MODELS = [
  MODEL.Claude35Sonnet,
  MODEL.Llama3_70b_instruct,
  MODEL.Gpt4,
  MODEL.MistralLarge,
  MODEL.OpenAiCompatibleApi,
  MODEL.Azure,
  MODEL.LocalLlm,
  MODEL.LocalOllama,
];

export enum REASONING_STEP {
  None = "None",
  ThinkingAboutSearching = "Contemplating searching the web",
  ThoughtAboutSearching = "Contemplated searching the web",
  SearchingTheWeb = "Searching the web",
  SearchedTheWeb = "Searched the web",
  ContemplatedAndSearchedTheWeb = "Searched the web after thinking about it",
  DidNotSearchTheWeb = "Did not search the web",
  ContemplatedAndDidNotSearchTheWeb = "Thought about searching the web but didn't",
  Reasoning = "Reasoning",
  FinishedReasoning = "Reasoned",
  FirstTake = "Crafting a first take",
  FinishedFirstTake = "Made a first take",
  Answering = "Determining a final answer",
  FinishedAnswering = "Wrote a final answer",
}

export enum REASONING_EFFORT {
  Minimal = "minimal",
  Low = "low",
  Medium = "medium",
  High = "high",
}

export enum VERBOSITY {
  Low = "low",
  Medium = "medium",
  High = "high",
}
