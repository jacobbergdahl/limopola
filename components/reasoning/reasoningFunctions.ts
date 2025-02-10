import { REASONING_PROMPT } from "./reasoningPrompts";

const getDelimitedOnlineSearchResult = (
  onlineSearchResult?: string
): string => {
  if (!onlineSearchResult) {
    return "";
  }

  return `
  BEGINONLINESEARCHRESULTS
  ${onlineSearchResult}
  ENDONLINESEARCHRESULTS
  `;
};

export const getReasoningPrompt = (
  instruction: string,
  onlineSearchResult?: string
): string => {
  return `
  ${getDelimitedOnlineSearchResult(onlineSearchResult)}
  ${REASONING_PROMPT}
  ${instruction}
  `;
};

export const getReasoningAnswerPrompt = (
  instruction: string,
  reasoning: string,
  onlineSearchResult?: string,
  firstTake?: string
): string => {
  let prompt = `
  BEGININSTRUCTION
  ${instruction}
  ENDINSTRUCTION
  `;

  prompt += getDelimitedOnlineSearchResult(onlineSearchResult);

  if (!!firstTake) {
    prompt += `
    BEGINFIRSTTAKE
    This answer has been written by a different LLM. It may or may not be accurate. I must be careful when considering it. Good thing this has been delimited so I know when this other answer ends.

    ${firstTake}
    ENDFIRSTTAKE    
    `;
  }

  // The instruction is intentionally included at both the top and bottom.
  return (
    prompt +
    `
  BEGINREASONING
  ${reasoning}
  ENDREASONING
  
  # Instruction

  I am a highly advanced expert reasoning AI model. I have already reasoned my way through the user instruction. I must now craft a final answer. I should assume that none of my prior reasoning will be presented to the user, and so I shouldn't refer back to the reasoning in my final answer, as the user may not understand what I mean. To remind myself, the user's instruction is at the bottom once again, which I must answer as accurately as possible. Oh, and I should remember that today's date is ${new Date().toLocaleDateString()} in ISO format. Okay, I got this!

  ${instruction}
  `
  );
};
