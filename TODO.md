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
- Fix local-maintainer (LLaMa).
- Improve and speed up local (LLaMa).
- Add a streaming option.
- Add API to describe images. From that, can also make it possible to make another image from the description of the first.
- Add a "fact-checker" option to all text API's. Call the API twice; the second time asking it to rate the accuracy of the previous message. Show the accurate next to the name (e.g. `Gpt-3.5-turbo (in 1.92s, 90% accurate)`).

## Core

- Improve the UI of managing contexts.
- Make it possible to retroactively create memory (click on posts to add to memory).
- Make it possible to use contexts in Editor mode.
- Add button to quickly copy code from code blocks.
- Improve the "code style" mode with syntax highlighting.
- Add syntax highlighting to code returned from the API.

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
