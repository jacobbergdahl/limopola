# Hackathon

Welcome to the hackathon branch! This is a branch that will contain hackathon starters where you can learn to implement AI-powered features. For now, there is only one hackathon starter, but more will (probably) be added in the future.

Learn more about this repository in the [README](./README.md).

## Project set-up

First time running Limopola? You can find expanded instructions and ways of running the project with local AI models in the [README](./README.md). The instructions below provide a quick start guide for developing with OpenAI's API. You don't need to use OpenAI's API, but it's the default for hackathon starters as it's easy to use, fairly cheap, and simple to get started with.

1. Run:

```bash
git clone git@github.com:jacobbergdahl/limopola.git && cd limopola/ && git checkout hackathon && npm install
```

2. Make a copy of `.env.example`, and name it `.env`. Add an OpenAI API key to it. You can leave the rest of the variables as they are.

3. Run:

```bash
npm run dev
```

4. Go to `http://localhost:3000` and see the project running.

## Hackathons

These are all of the hackathon starters available. For now, there's only one, but more will (probably) be added in the future.

### Customer support assistant

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
