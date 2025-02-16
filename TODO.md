# Todo

This is a list of features, updates, and bug fixes that may be implemented into this repository.

## Clean code

- Refactor (a lot) more code out of `index.tsx`. The main thing is to break out the two forms and their onSubmit's.
- Update comments.
- Streamline the way responses are sent from the back-end. Create helper functions that append the `res` object instead of doing it in each model.
- Create systemic re-usable function for calling AI models.
- Further utilize Jotai. We don't need to do prop-drilling any more with Jotai.
- Use em or rem for fonts. In fact, all px values should be rem.
- Add more Typescript types.
- Add a linter.
- Use ProcessedBody and getProcessedBodyForAiApiCalls in all AI calls.

## API's

- Add more voices to ElevenLabs.
- Add more options to API's.
- Make it possible to use ElevenLabs in Editor mode.
- Add a streaming option.
- Add API to describe images. From that, can also make it possible to make another image from the description of the first.
- Add more models provided by Replicate and/or HuggingFace.
- Add option to always provide LLM's with the current date and time.
- Add structured outputs API.
- Add abort/cancel button to API's (the choice of abort or cancel would depend on whether the AI has abort signals).
- Improve the styling of the citations created by Claude Citations. (Make citations collapsible?).

## Core

- Add a reasoning mode.
- Add LangGraph.
- Add Tavily.
- Add LangSmith.
- Make it possible to retroactively create memory (click on posts to add to memory).
- Make it possible to use contexts in Editor mode.
- Add button to quickly copy code from code blocks.
- Add syntax highlighting to code blocks.

## Agents

Agents are still in a very early version, and unexpected bugs still occur. Many small things need to be tested and adjusted. Below are bigger features that are to be added.

- Allow the user to set what API's the agents have access to. The user should be able to set what AI to use for each function, e.g., generating text, summarizing text, generating images, etc. Assigning an AI to generate text should be the only required AI, everything else should be optional. Not only does both the FE and BE need to handle this, but the prompt that creates the list of tasks need to be dynamically changed as well. The user should not need to supply as many API keys as they do now.
- Check if the context is too long to process. If so, use chunks.
- If the context is too long for both API's mentioned above, then create summaries of the arrays context that fall within the context limit.
- The user should have an option that makes it so that the agent waits after having generated the list of tasks, and asks the user to confirm the tasks before continuing. The user can then choose to edit the list of tasks before the AI continues, or just approve the tasks the AI made.

## Reasoning

The model-agnostic reasoning mode is in an extremely early stage. A lot of basic features are yet to be implemented, and bugs may occur.

- Make it possible to continue the conversation with the reasoning AI. (The most obvious major missing feature.)
- Make it possible to choose what LLM to use for online search.
- Make it possible to search through other API's than searchapi.io.
- Add fact-checking (auto or manual (e.g., post result)).
- Show how long it took for each step not just during the generation but after the final result has returned.
- Test local AI more with reasoning.
- After stopping the AI, it should be possible to resume it again. Unfortunately, because I have 0 IQ, I kind of built it in a way where's it non-trivial to be able to resume it again (unlike the agents, which I built before this, which is further evidence of my lack of IQ). Still, this shouldn't be too difficult to fix. Probably just need to extract the steps in startReasoning() into individual functions and badabing badaboom.

## Nice-to-have

- Save and present how many tokens was used for a reply.
- Add an information tab or a tooltip mode.
- Make all menus collapsible.
- Add setting to choose not to save anything to local storage (likely through a .env variable, otherwise this setting itself would be required to be saved somewhere).
- Images, video, and audio don't get saved when refreshing. A first step could be to show a different element when the element is undefined, a latter step to save the objects.
- Add method for requesting model lists from a service (request from https://github.com/jacobbergdahl/limopola/issues/4#issuecomment-2656498289).
