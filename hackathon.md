# Hackathon

Welcome to the hackathon branch! This is a branch that contains hackathon starters where you can learn to implement AI-powered features.

Learn more about this repository in the [README](./README.md).

## Project set-up

First time running Limopola? You can find expanded instructions and ways of running the project with local AI models in the [README](./README.md). The instructions below provide a quick start guide for developing with OpenAI's API. You don't need to use OpenAI's API, but it's the default for hackathon starters as it's easy to use, fairly cheap, and simple to get started with.

1. Run:

```bash
git clone git@github.com:jacobbergdahl/limopola.git && cd limopola/ && git checkout hackathon && npm install
```

2. Make a copy of `.env.example`, and name it `.env`. Add an OpenAI API key to it, and leave the rest of the variables as they are.

3. Run:

```bash
npm run dev
```

4. Go to `http://localhost:3000` to see the project running.

## List of hackathons

This is a list of current hackathons in this branch.

### Customer support assistant

> This hackathon is not yet finished being set up.

This is a hackathon for implementing an AI-powered assistant for English-speaking customer support representatives.

All code that you need to write for this hackathon is in `pages\api\aiWrappers\hackathonCustomerSupport.ts`. The front-end code is already written, as is the connection to the back-end endpoint. If you'd like, you can, of course, also make changes to the front-end code, but you don't need to.

After running the project, you can select this hackathon in the chat (default) view by selecting it in the top left.

Imagine that every message you send is one sent as a customer to a fictional company's customer support. The messages returned by the LLM are not sent directly to the customer, but are instead sent to the company's English-speaking customer support representative. This representative may send the LLM's response directly back to the customer, or they may tweak it a little, or they may not send it to the customer at all if they deem it incorrect.

#### Goal

Your goal is to solve all of the instant messages that appear to the right of the screen after you've selected this hackathon.

The first instant message is a freebie: it's just to say "Hello!" and check that your set-up is working.

The second instant message will require a small bit of tweaking on your end. The customer will ask a question in Japanese, and the LLM will naturally also respond in Japanese. However, remember that the message is sent to an English-speaking customer support representative -- not directly to the customer -- and so the customer support representative won't understand it. You will need to solve this issue. Perhaps try to provide the representative with a suggested response in Japanese, a translation of it, and a translation of the customer's message?

The third instant message will require you to implement RAG to give the LLM the ability to read the company's FAQ (in the form of a PDF file) and answer questions about it. All the code you need to solve this has already been implemented in this repository. You can look at code in `pages\api\aiWrappers\dataReader.ts` and `pages\api\retrievalAugmentedGeneration.ts` for inspiration on how to do this.

For the later instant messages, I'll leave it up to you to figure them out. Good luck!

### Talk to your docs

In this hackathon, you'll bring your own documents and ask an AI model to answer questions about them.

Put your files in the `data` folder (create one in the root if it doesn't already exist). This could be code documentation, PDF files for a company's product, or anything else. Currently, this repository supports reading PDF, PPTX, DOCX, Excel, and CSV files. If your files are of a different format, such as `html` or `md`, then you'll need to either a) figure out a way to programmatically load them, or b) convert them to a simpler format such as `txt` and then load them.

The front-end has already been implemented. Most of the code you will need to write will probably be in `pages\api\aiWrappers\hackathonTalkToYourDocs.ts`, where you can also follow the function calls into `pages\api\retrievalAugmentedGeneration.ts` which you may need to edit to support more file formats.

#### Goal

This is an open-ended hackathon, where you can either experiment freely to create something that would be useful to you, or follow specific instructions.

##### I want to experiment

Start by simply trying to get the LLM to answer questions about your documents. Then, try to tweak its behavior, improve its ability to comprehend your files, make it output files instead of messages, or something else you would find useful for your project. You could also change the frontend to allow users to upload files rather than to use the `data` folder, add some kind of analytics, or external API calls, or experiment with other AI models.

##### I don't know what to do

At the start of this hackathon, you'll be given some files to work with. Some of them will be in file formats supported by functions already in this repository, while others will not.

1. Get the project up and running and try to just get a response from the LLM by saying "hello!".
2. Try to get the LLM to answer questions about the PDF files.
3. Try to get the LLM to answer questions about the HTML files, which will require code changes in `pages\api\retrievalAugmentedGeneration.ts` (follow the trail from `pages\api\aiWrappers\hackathonTalkToYourDocs.ts`).

### Test data generator

In this hackathon, you'll try to generate useable test data.

The front-end has already been implemented. Most of your code you will need to write will probably be in `pages\api\aiWrappers\hackathonTestDataGenerator.ts`.

#### Goal

This is an open-ended hackathon, where you can either experiment freely to create something that would be useful to you, or follow specific instructions.

##### I want to experiment

Try to get the LLM to generate test data that would be useful to you. For example, you could try to get the LLM to generate a number of fictional phone numbers in a CSV file format. Out of the box, the LLM will post its output as a message, but you could make it write a file. You could also create an SQL database that stores the data, add some kind of analytics, or external API calls, or experiment with other AI models.

##### I don't know what to do

Follow these tasks:

1. Get the project up and running and try to just get a response from the LLM by saying "hello!".
2. Send this message to the LLM: "Please generate 20 fictional phone numbers with a Swedish country code in a CSV format. Only return CSV with no other comments. Your output will be parsed automatically, which is why it is critical that you return only CSV." The LLM should then return a code-blocked response (with no code changes needed by you).
3. Tweak the system role or the prompt on the back-end to hardcode the LLM to always give you data in a certain format (such as CSV) without the user having to specify it.
4. Automatically save the AI model's output as a CSV file. This will require code changes in `pages\api\aiWrappers\hackathonTestDataGenerator.ts`.
5. Add a step that checks that the LLM's output is valid CSV. LLMs can hallucinate or output non-valid data, which may need to be checked.
6. Make the LLM output data in a JSON format instead of CSV.
