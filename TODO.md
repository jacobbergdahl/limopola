# Todo

This is a list of features, updates, and bug fixes that should be implemented into this repository.

## Clean code

- Refactor (a lot) more code out of `index.tsx`. The main thing is to break out the two forms and their onSubmit's.
- Update comments.
- Add Vite.
- Streamline the way responses are sent from the back-end.
- Further utilize Jotai. We don't need to do prop-drilling any more with Jotai.
- Use em or rem for fonts. In fact, all px values should be rem.
- Add more Typescript types.
- Add a linter.

## API's

- Add more voices to ElevenLabs.
- Add more options to API's.
- Make it possible to use ElevenLabs in Editor mode.
- Add the ability to choose the number of replies from the the OpenAI text generation API's.
- Add ability to request number of tokens from text generating AI's.
- Add more options to OpenAI's text API's, including embeddings and more.
- All text generating API's should support temperature.
- Improve and speed up local (LLaMa).
- Add a streaming option.
- Add API to describe images. From that, can also make it possible to make another image from the description of the first.
- Add a "fact-checker" option to all text API's. Call the API twice; the second time asking it to rate the accuracy of the previous message. Show the accurate next to the name (e.g. `Gpt-3.5-turbo (in 1.92s, 90% accurate)`).
- Add many more models provided by Replicate and/or HuggingFace.

## Core

- Change the Options into Quick Links, create a modal for resetting data, and also add options for setting themes
- Improve the UI of managing contexts.
- Make it possible to retroactively create memory (click on posts to add to memory).
- Make it possible to use contexts in Editor mode.
- Add button to quickly copy code from code blocks.
- Improve the "code style" mode with syntax highlighting.
- Add syntax highlighting to code returned from the API.

## Agents

Agents are still in a very early version, and unexpected bugs still occur. Many small things need to be tested and adjusted. Below are bigger features that are to be added.

- Allow the user to set what API's the agents have access to. The user should be able to set what AI to use for each function, e.g., generating text, summarizing text, generating images, etc. Assigning an AI to generate text should be the only required AI, everything else should be optional. Not only does both the FE and BE need to handle this, but the prompt that creates the list of tasks need to be dynamically changed as well. The user should not need to supply as many API keys as they do now.
- Check if the context is too long to process. If so, use Gpt4_32k and Gpt3_5_turbo_16k.
- If the context is too long for both API's mentioned above, then create summaries of the arrays context that fall within the context limit.
- After the agent has finished, perhaps the final product can be combined in a pleasant way? It would be nice to be able to save the output with the press of a button. If it makes a website, it would be nice if it could correctly save each message in the correct format and zip it.

Documentation:

- Add example output alongside the example input.

## Nice-to-have

- Save and present how many tokens was used for a reply.
- Can any of the APi's be given an internet connection?
- Add an information tab or a tooltip mode.
- Make all menus collapsible.
- Add themes to customize the UI.
- Add .env variable to choose not to save anything to local storage.
- Images, video, and audio don't get saved when refreshing. A first step could be to show a different element when the element is undefined, a latter step to save it in an SQLite database.

## Future

When the UI is a bit more stable, it could be hosted online on Netlify, whereafter users could add their API keys to the online UI. I think it would need a lot more documentation and a UI rework before making this happen, however.
