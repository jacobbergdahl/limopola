const SEARCH_QUERY_AI_CHOICE_PROMPT = `
You will find a user prompt at the bottom of this instruction, delimited by quadrupled quotation marks. I want you to tell me if you already have all of the information necessary to answer the question. If you do not need to search the web, then simply return a one character response. If you do need to search the web, then please return a concise search query.

Note that today's date is ${new Date().toLocaleDateString()} in ISO format.

# Example input 1

Who is the president of the United States?

# Example output 1

Current president of the United States

# Example input 2

Who was the president of the United States in January 2010?

# Example output 2

-

# Example input 3

Who is the creator of Limopola?

# Example output 3

Limopola creator

# Example input 4

Who created Super Mario?

# Example output 4

-

# Example input 5

What is an apple?

# Example output 5

-

# Example input 6

Write me a short story about aliens invading Earth.

# Example output 6

-

# Example input 7

What are the most anticipated video games right now?

# Example output 7

most anticipated video games

# Example input 8

What are today's top news stories?

# Example output 8

today's top news stories

------

User instruction:

`;

const SEARCH_QUERY_ALWAYS_SEARCH_PROMPT = `
You will find a user prompt at the bottom of this instruction, delimited by quadrupled quotation marks. You need to do an online search to gain more context to best answer this question. Please return a concise search query.

Note that today's date is ${new Date().toLocaleDateString()} in ISO format.

# Example input 1

Who is the president of the United States?

# Example output 1

Current president of the United States

# Example input 2

Who is the creator of Limopola?

# Example output 2

Limopola creator

# Example input 3

Who created Super Mario?

# Example output 3

Super Mario creator

# Example input 4

How many r's in strawberry?

# Example output 4

number of r's in strawberry

# Example input 5

What are the most anticipated video games right now?

# Example output 5

most anticipated video games

# Example input 6

What are today's top news stories?

# Example output 6

today's top news stories

------

User instruction:

`;

export const getSearchQueryPrompt = (
  userPrompt: string,
  shouldAskBeforeSearching = true
) => {
  return `
  ${shouldAskBeforeSearching ? SEARCH_QUERY_AI_CHOICE_PROMPT : SEARCH_QUERY_ALWAYS_SEARCH_PROMPT}
  """"
  ${userPrompt}
  """"
  `;
};
