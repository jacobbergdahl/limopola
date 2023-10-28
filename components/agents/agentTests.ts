import { parseAgentTasks } from "./agentFunctions";

const testParseTaskString = () => {
  const input = `
    1. [gpt-4][context] Create a company name that reflects IT consultancy and its Stockholm origin. And define the company's mission statement and core values, emphasizing innovation, integrity, and client success.
    2. [gpt-4][context] Write a brief description of the color palette, including: a. Primary color: Indigo (with HEX, RGB, and CMYK values). b. Secondary colors that complement indigo and enhance the brand's visual appeal.
    3. [gpt-4][image] Design a logo concept using indigo as the primary color, incorporating elements that reflect IT, consultancy, and a touch of Stockholm's cultural or architectural identity.
    4. [dall-e] Generate a logo based on the provided design concept.
    5. [gpt-4][context] Recommend typography that pairs well with the logo and reflects the company's professional yet innovative identity. This should include a primary font for headings and a secondary font for body text.
    6. [gpt-4][context] Describe brand imagery guidelines, suggesting the use of modern technology imagery, Stockholm landmarks, and collaborative workplace scenarios.
    7. [gpt-4][context] Propose key messaging guidelines that emphasize the company's expertise, Stockholm roots, and commitment to client success.
    8. [gpt-4][context] Outline a social media strategy, focusing on platforms relevant to B2B marketing such as LinkedIn and Twitter, detailing post frequency, content themes, and engagement tactics.
    9. [gpt-4][image] Design a sample business card incorporating the company's name, logo, color palette, and typography.
    10. [dall-e] Generate a visual of the business card based on the provided design.
    11. [gpt-4][context] Provide guidelines for website design, ensuring it aligns with the branding profile, is user-friendly, and emphasizes the company's services and Stockholm base.
  `;

  const taskStrings = input.trim().split("\n");
  const tasks = taskStrings.map(parseAgentTasks);

  console.log(tasks);
};
