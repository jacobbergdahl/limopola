# Limopola: An AI Platform

![Banner](./public/banner.png)

Limopola is an AI platform for interacting with large language models (LLMs) and other forms of generative AI. It allows you to communicate with text, image, video, and audio AI through numerous modes, such as chat, editor, and agent. Limopola is made for power users, and thus offers advanced features that mainstream platforms do not.

The name is a silly portmanteau of the words link (li), model (mo), portal (po), and language (la). Limopola is indeed a portal or a link that allows you to communicate with a wide range of AI's.

The project is built with NextJS (a meta-framework of ReactJS). It uses TypeScript for typing and Jotai for state management. It has a tiny SQLite database that is only used for one table of information. Most information is stored in the client's local storage.

Limopola is made to be run locally, but in the future it might be hosted online on a platform like Netlify.

Originally (regrettably) based on a [simple starter repository by OpenAI](https://github.com/openai/openai-quickstart-node) that grew bigger than planned. Hence the license is inherited from that project.

- [Planned updates to this repository](https://github.com/jacobbergdahl/limopola/blob/main/TODO.md).

## Quickstart

This will download the repository, install dependencies, install [this AI model](https://huggingface.co/TheBloke/dolphin-2.6-mistral-7B-dpo-laser-GGUF/blob/main/dolphin-2.6-mistral-7b-dpo-laser.Q4_K_M.gguf), and run the project.

```bash
git clone git@github.com:jacobbergdahl/limopola.git && cd limopola/ && npm run quickstart
```

## Set-up

The project is very quick and easy to set-up. You can run LLMs in one of four ways:

- Locally, by pointing to an already installed LLM on your machine or by installing one in this project (`npm run install-local-llm` to quickly download a default model).
- Also locally, by serving an LLM through Ollama.
- Locally, just using your web browser.
- Remotely, by using a service provider such as OpenAI.

### Installation

```bash
npm i
```

### Set up a local LLM

You can easily use [llama](https://ai.meta.com/resources/models-and-libraries/llama/) locally on your machine in this project. Depending on your OS and your prior set-ups, you may need to set-up environments using [this guide](https://github.com/cocktailpeanut/dalai#quickstart).

To set up a local LLM for this project, follow these steps:

1. Download an LLM from HuggingFace. You can download a recommended model by simply running `npm run install-local-llm`. If you want to download an LLM manually, then I recommend downloading [this model](https://huggingface.co/TheBloke/dolphin-2.6-mistral-7B-dpo-laser-GGUF/blob/main/dolphin-2.6-mistral-7b-dpo-laser.Q4_K_M.gguf). If you want to download a different model, I recommend downloading a 7B version with the `gguf` extension from [TheBloke](https://huggingface.co/TheBloke?search_models=GGUF). Place the model in the `models/` folder (this is done automatically by the `install-local-llm` script).
2. Validate the model by running `npm run validate-local-llm`. Try saying "Hello" just to check that you get a reasonable output.
3. Run `npm i` and `npm run local`. If it's not already selected by default, then `local-llm` in the left sidebar, and start interacting with the model.

#### Troubleshooting the local LLM

- [Documentation](https://github.com/withcatai/node-llama-cpp).
- [Get started with node-llama-cpp](https://withcatai.github.io/node-llama-cpp/guide/).
- [Helpful guide](https://blog.devgenius.io/how-to-generate-html-content-with-ai-using-llama-node-and-express-e1b1e0e1a55b).

#### Alternatively, use Ollama

If you have Ollama on your machine, then you can simply run `ollama serve` to host a server to be used in this project. Change `LOCAL_OLLAMA_MODEL_NAME` in your `.env` file to the LLM you want to use (see `.env.example` for details). If you don't have the LLM installed, you will need to get it using `ollama pull`.

### Get API keys

_You don't actually need any API keys to use Limopola. All of these keys are optional if you choose to run an LLM locally._

Create a `.env` file from the `.env.example` file, and add API keys. There are instructions in the file for where to get the keys.

- `OPENAI_API_KEY`: Used for all versions of GPT and DALL-E. Using OpenAI costs money. Generate the API key at [https://platform.openai.com/account/api-keys](https://platform.openai.com/account/api-keys).
- `ANTHROPIC_API_KEY`: Used for Claude. Using Claude costs money. Generate the API key at [https://console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys).
- `REPLICATE_API_KEY`: Used for several API's. These API's are free to use for a while, but eventually you'll be asked to pay to continue using them. Generate the API key for free at [https://replicate.com/account](https://replicate.com/account).
- `ELEVEN_LABS_API_KEY`: Used to generate text-to-speech. This API is also free to use for a while. Generate the API key at [https://docs.elevenlabs.io/api-reference/quick-start/authentication](https://docs.elevenlabs.io/api-reference/quick-start/authentication).
- `SEARCH_API_KEY`: Used by one of the RAG functions. Could likely be replaced with Tavily now. Either way, it's also free to use for a while. Generate the API key at [https://www.searchapi.io/](https://www.searchapi.io/).
- `GOOGLE_API_KEY`: _Not currently in use on the main branch_. Used for Google's text-to-speech LLMs (PaLM). This API is also free to use for a while, but may be region-locked. Generate the API key at [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey).
- `AZURE_API_KEY`: Used for Azure OpenAI. You can run any LLM supported by Azure OpenAI by configuring `AZURE_MODEL_ID`, `AZURE_ENDPOINT`, and `AZURE_API_VERSION` in your `.env` file.

In the future, this project will likely also give you the option of adding an API key to HuggingFace.

### Run project

```bash
npm run dev
```

## Models

This is a list of models currently included in this AI interface. More models will be added in the future. Note that `local-node-llama-cpp` and `local-ollama` allow you to run essentially any open-source LLM. The former allows you to run AI model by just pointing at its filepath, while the latter lets you run whatever LLM you are serving through Ollama.

| Model                    | Type  | API Source |
| ------------------------ | ----- | ---------- |
| gpt-4                    | Text  | OpenAI     |
| gpt-4o                   | Text  | OpenAI     |
| gpt-4-32k                | Text  | OpenAI     |
| gpt-4-turbo              | Text  | OpenAI     |
| gpt-4o-mini              | Text  | OpenAI     |
| claude-3-5-sonnet-latest | Text  | Anthropic  |
| claude-3-5-haiku-latest  | Text  | Anthropic  |
| dall-e                   | Image | OpenAI     |
| dall-e-3                 | Image | OpenAI     |
| flux-1.1-pro-ultra       | Image | Replicate  |
| flux-1.1-pro             | Image | Replicate  |
| flux-schnell             | Image | Replicate  |
| stable-diffusion-xl      | Image | Replicate  |
| deepseek-67b-base        | Text  | Replicate  |
| llama-2-70b              | Text  | Replicate  |
| llama-2-13b              | Text  | Replicate  |
| llama-3-70b-instruct     | Text  | Replicate  |
| llama-3-8b-instruct      | Text  | Replicate  |
| llama-2-70b-chat         | Text  | Replicate  |
| llama-2-13b-chat         | Text  | Replicate  |
| codellama-34b            | Text  | Replicate  |
| text-to-pokemon          | Image | Replicate  |
| animate-diff             | Video | Replicate  |
| eleven-labs              | Audio | ElevenLabs |
| text-bison-001\*         | Text  | Google     |
| chat-bison-001\*         | Text  | Google     |
| azure\*\*                | Text  | Azure      |
| local-node-llama-cpp     | Text  | None       |
| local-ollama             | Text  | None       |
| web-llm                  | Text  | None       |
| t-sentiment-analysis     | Text  | None       |
| t-text2text              | Text  | None       |

\* Google PaLM. No longer available in the `main` branch due to a rough dependency clash. To use Google's API's, run `git checkout google-generativelanguage && npm install`.

\*\* Supports any LLM served through Azure OpenAI. Due to how you configure your own model id's in Azure, you will need to enter the actual your LLM model into your `.env` file (using `.env.example` as a reference).

### Custom wrappers of AI models

| Model               | Type | API Source | Note                                                                                                                                     |
| ------------------- | ---- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| claude-citations    | Text | Anthropic  | Uses RAG and Claude 3.5 Sonnet to read the PDF files in your data folder, answer your instructions, and provide citations of its answer. |
| gpt-4-fact-checker  | Text | OpenAI     | A custom implementation of a fact-checker. Uses GPT-4 to rate the accuracy of any statement.                                             |
| gpt-4-web-retriever | Text | OpenAI     | A custom implementation of a web retriever. Reads data from the internet and sends it to GPT-4. A form of RAG.                           |
| gpt-data-reader     | Text | OpenAI     | Uses RAG and GPT-4o to retrieve data from files in the data folder. Can read PDF, Word, PowerPoint, Excel, and CSV files.                |
| claude-data-reader  | Text | Anthropic  | Uses RAG and Claude to retrieve data from files in the data folder. Can read PDF, Word, PowerPoint, Excel, and CSV files.                |

## Modes

Limopola supports three different modes for you to interact with agents.

Note that no matter which mode you choose, Limopola's UI is intentionally made for power users. One example of what this means, is that the UI does not provide confirmation prompts when selecting to reset settings or to clear chat history, and there are currently no tooltips that explain what parameters like "temperature" mean. The UI is meant to be quick and efficient to use for power users.

### Chat

![image](https://github.com/user-attachments/assets/cb031d5a-d6be-4b65-abeb-b69f26205bb6)

This is the default mode, and the mode where you have the largest number of options. Chat allows you to communicate with AI's in a chat-like format.

Unlike most chat services, this project uses a single chat window for all conversations. This means that you can initiate a conversation with one API, and continue it with another. Your entire chat history is kept in a single instance. On the right-hand side sidebar, you can disable memory, which will make it so that your next message is as if it was an entirely new conversation. You can also clear the memory on the right, or the entire chat history on the left. Note that error messages are not added to your memory.

It's important to really understand the memory setting. With it turned off, the AI will treat all of your messages as the start of a whole new conversation.

Tips:

- The left-hand sidebar is static to each mode (modes being Chat, Editor, and Agent and are selected at the top of the screen), while the right-hand sidebar changes depending on your selected AI model.
- Context, found in the right-hand sidebar, is a saved piece of text that is added above your message. You can use this to have the AI write in your style, learn your tech stack, remember details about you, and much more. The context's are saved in a database that is created in the root directory of this project and is not hosted online.
- Some AI's, like `gpt-4-fact-checker` and `eleven-labs`, allow you to click on any text chat message to instantly send that message to the AI.
- The "reset settings" option will reset everything except for your saved contexts and your chat history.
- You can jump to the textarea by just pressing enter or T.
- You can download and save the conversation as a `.txt` file by pressing CTRL + S / ⌘ + S.
- Any text-generating AI can be given the ability to browse the world wide web by pressing the checkbox under "Online connection" in the right-hand sidebar. This requires a (free) API key to [SearchAPI](https://www.searchapi.io/).

### Editor

![image](https://github.com/user-attachments/assets/37b8c167-3dca-4b5c-85ad-260fd0ffadd4)

The editor mode offers a primitive textarea that you can use to autocomplete text, and only text. In this mode, the text generated by the AI is output into a textarea that you control, so you can edit the text generated by the AI, and then keep generating more text. This is very useful if you want to work together with an AI.

For most purposes in this mode, I would recommend you to _not_ use an LLM fine-tuned for chat. For instance, use `llama-2-70b` instead of `llama-2-70b-chat`.

### Agent

https://github.com/user-attachments/assets/353c1d19-de7c-43f3-943f-b13ceca465d4

The agent mode is still a work in progress. It may crash, and does not yet offer much customization without making code changes. The agent will continuously report its progress in the console.

**Please be careful when using the agent mode. It still needs much testing, and it could potentially make very expensive API calls. Even if you stop it, it will still try to finish whatever API call it has started on its current task.**

This mode allows you to give a mission to an AI agent, after which it will autonomously create a list of tasks to solve, assign an AI model for each task, and solve them one at a time. When it's done, it will return a final product that you can download as a zip file.

Here's how it works:

1. You enter a mission.
2. The AI will always start by making a list of tasks to accomplish. It also assigns an AI model for solving each task.
3. It will go through the list of tasks from top to bottom, and output a message as it goes down the list.
4. You can save its output as a zip file.

Examples of missions:

- Create a short illustrated children's book for eight-year olds about a young girl named Ellen who befriends a bird. The book should be ten pages long, and each page should be illustrated with an image. The book should also be narrated.
- Build a fan website about Ludwig van Beethoven. The website should be a single-page application that is accessible and performant. It should feature facts about Beethoven, along with some generated images of him in modern-day scenarios.
- Create a short animated film about the frog Albert who befriends the gentle horse Tampere.
- Make a branding profile for an IT consultancy firm based in Stockholm. The primary color should be indigo.

Currently, this mode _requires_ you to have a number of API keys. It may crash if you don't have `OPENAI_API_KEY`, `REPLICATE_API_KEY`, and `ELEVEN_LABS_API_KEY` set. In the future, users should be able to choose what API's the AI has access to. Currently, that list is limited to a small number of API's.

### Reasoning

https://github.com/user-attachments/assets/039f39ad-3a6f-4b68-8995-6c83e010e8c3

The reasoning mode (or Chain of Thought (CoT) mode) is the most recent addition to Limopola. This is still very much a work in progress and may not function correctly, and is missing some [obvious features](https://github.com/jacobbergdahl/limopola/blob/main/TODO.md). This mode is an architecture for applying model-agnostic o1/R1-level of reasoning onto (in theory) any LLM. I just love the way R1 reasons, and wanted to try to apply that to other LLMs. This mode is hence heavily inspired by DeepSeek R1.

In the video above, you are seeing advanced reasoning applied to Claude 3.5 Sonnet. I have no doubt that we'll get actual reasoning models from Anthropic soon, but in the meantime, my code tricks Claude into mimicking R1 to the best of its ability. The platform also works well with other performant LLMs, such as Llama 3. You can use any LLM regardless of whether it is a local model (you can either just point to a model's file path or serve a model through Ollama) or accessed through an API.

I should note that LLMs also gain the ability to search the internet, and users can also ask for a first take by a separate AI model.

The code is quite simple – it’s mainly few-shot prompting. In theory, it can be applied to any LLM, but in practice, it will not work for all LLMs, especially less accurate models or models too heavily tuned for chat.

Interestingly, much like GPT-4o is useless for the agent mode, so too does it appear incapable of being manipulated into reasoning, whereas GPT-4 (which is considered a legacy model by OpenAI, likely because it's far less energy-efficient than GPT-4o and not multimodal) is quite capable. Claude 3.5 Sonnet does a great job at mimicking R1 at times, and is thus the default for this mode for now, but Llama 3 70b is not too far off.

Here's how it works:

1. You enter a prompt.
2. If you have given the AI access to do an online search, then it will either always do a search or decide for itself whether to do a search. This can be configured by you through the settings to the right (when you are on the page of this mode).
3. The AI starts to reason like R1. In this step, it is not attempting to directly answer your prompt, but to reason through the problem.
4. If you have enabled first take, then your chosen first take AI model will attempt to answer the question. This is not the final answer, but one that will be considered in the final step.
5. Finally, the main reasoning model will use all of the context provided by the above steps to provide a final answer to the question.

The reasoning mode is most definitely a work in progress. Some very obvious features are missing, probably most notably the ability to continue the conversation. More features are planned (see [TODO.md](https://github.com/jacobbergdahl/limopola/blob/main/TODO.md)).

To use online search, you need the `SEARCH_API_KEY` key (in the future, we should support other search API's too). Other AI models need their respective API's unless you run local LLM's. Info on how to acquire API keys is found in the `.env.example` file, as well as at the top of this README.

You may also notice that there is a background video in the demo I added above. This background video is not included in the project itself (just become of its size and that it would be a silly thing to add to a repository like this; but it's actually a royalty-free video), but you can download a video of your own and add it to the `env` file (follow `.env.example` as reference).

## Upcoming features

This is a work in progress. You can find a list of planned features and updates in the [TODO.md](https://github.com/jacobbergdahl/limopola/blob/main/TODO.md) file. Please let me know if there are other features you'd like to see added or if you run into any issues. Feel free to open a pull request through a fork with any changes you'd like to make.

## Limopola logos

The logo for Limopola by Midjourney v5:

<img src="./public/logo.png" width="400" height="400">

Alternate logo of Limopola in text by DALL-E 3:

<img src="./public/limopola.png" width="400" height="400">
