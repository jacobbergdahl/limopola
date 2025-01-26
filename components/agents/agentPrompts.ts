import { AGENT_TASK_INDICATION } from "./../../general/constants";
import { MODEL } from "../../general/constants";

const TEXT_GENERATING_AI = MODEL.Gpt4; // 4o doesn't work very well for this purpose yet; probably needs more fine-tuning for the individual tasks to use effectively. Claude could work better than GPT-4, but will need adjusted prompts.
const TEXT_SUMMARIZING_AI = MODEL.Gpt4_o_mini;
const IMAGE_GENERATING_AI = MODEL.StableDiffusionSdXl; // DALL-E 3 currently leads to unexpected CORS issues.
const VIDEO_GENERATING_AI = MODEL.AnimateDiff;
const VOICE_GENERATING_AI = MODEL.ElevenLabs;

export const AGENT_PROMPT_TASK_LIST = `
You will be given a mission, and must then create a list of tasks for that mission. You must assign an API to use for each task. These are the API's you have at your disposal:

- [${TEXT_GENERATING_AI}]: Used to write any form of text, including software code. Is also used to generate prompts for image, video, and audio generation.
- [${TEXT_SUMMARIZING_AI}]: Used to summarize text. When you need to write new text, however, you should use ${TEXT_GENERATING_AI}.
- [${IMAGE_GENERATING_AI}]: Used to generate images.
- [${VIDEO_GENERATING_AI}]: Used to generate video.
- [${VOICE_GENERATING_AI}]: Used to generate voices.

You are unable to generate music. If asked to generate music, or if you need to do so to complete a mission, then please use ${TEXT_GENERATING_AI} to write notes or lyrics instead. You are also unable to read or understand images, although you can create them.

In order to generate images, video, or voices, you must first generate the prompts using ${TEXT_GENERATING_AI}. These steps are always done after each other.

The output format must be a numbered list in the format delimited below in quadrupled quotation marks, with no additional text, questions, or suggestions. The output will be parsed by code. Unless there's a specific reason not to, then you should always generate text first, and any potential code, voice, or images later. Each task should be on a single line. You don't need to create voices/narration unless specifically asked for it, or if you're doing a task that obviously requires it (e.g., make a podcast or video).

When using ${TEXT_GENERATING_AI}, you can also use a second set of brackets to indicate if the result of the task will be used by a subsequent task. These are the brackets you can use for a secondary indication:

- [${AGENT_TASK_INDICATION.Context}]: Indicates that this is the primary context for the work. This context will be used to help create images, narrate text, and more. There would typically only be one context and it is often the first task, but there could sometimes be multiple, as in example output 4. Context is information that is vital for other tasks to know about.
- [${AGENT_TASK_INDICATION.Narration}]: If the context is not a story that can be obviously narrated, then you can write text specifically for narration. This is optional, if a context exists but narration doesn't exist, then context will be used instead. Only ${TEXT_GENERATING_AI} can create text for narration.
- [${AGENT_TASK_INDICATION.Image}]: Indicates that this task will create prompts to be used by ${IMAGE_GENERATING_AI} in a subsequent task.
- [${AGENT_TASK_INDICATION.Video}]: Indicates that this task will create prompts to be used by ${VIDEO_GENERATING_AI} in a subsequent task.
- [${AGENT_TASK_INDICATION.Code}]: Indicates that this task will create software code (HTML, CSS, JavaScript, C#, SQL, etc.) which may be used by ${TEXT_GENERATING_AI} in a subsequent task.

Again, this secondary indications can only be used by ${TEXT_GENERATING_AI}.

""""
1. [${TEXT_GENERATING_AI}][${AGENT_TASK_INDICATION.Context}] Write a story.
2. [${VOICE_GENERATING_AI}] Narrate the story created above.
3. [${TEXT_GENERATING_AI}][${AGENT_TASK_INDICATION.Image}] Create prompts for two images.
4. [${IMAGE_GENERATING_AI}] Create the two images.
5. [${TEXT_GENERATING_AI}][${AGENT_TASK_INDICATION.Video}] Create a prompt for generating a video.
6. [${VIDEO_GENERATING_AI}] Make a video.
7. [${TEXT_GENERATING_AI}][${AGENT_TASK_INDICATION.Code}] Write HTML, CSS, and JavaScript for a website.
""""

Please note that some missions can be completed in just one task, while other missions could result in dozens of tasks.

# Example input 1

Create a short illustrated children's book about a young girl named Ellen who befriends a bird. The book should be ten pages long. Each page should be a paragraph long, and illustrated with an image. The book should also be narrated.

# Example output 1

1. [${TEXT_GENERATING_AI}][${AGENT_TASK_INDICATION.Context}] Write the story for the children's book about Ellen who befriends a bird, spread across ten pages. Each page should have only one paragraph of text. The story should include the following: a. Ellen's early life, including her family, friends, and hobbies. b. Ellen's encounter with a bird, and how they become friends. c. Ellen's adventures with the bird, including their travels and experiences. d. Ellen's realization that she must let the bird go, and how she comes to terms with it. e. Ellen's life after the bird, including her new friends and hobbies.
2. [${VOICE_GENERATING_AI}] Create narration of the story.
3. [${TEXT_GENERATING_AI}][${AGENT_TASK_INDICATION.Image}] Create prompts for ten images corresponding to the ten pages of the story.
4. [${IMAGE_GENERATING_AI}] Generate images using the prompts.

# Example input 2

Build a fan website about Beethoven. The website should be a single-page application that is accessible and performant. It should feature facts about Beethoven, along with some photo-realistic generated images of him in modern-day scenarios.

# Example output 2

1. [${TEXT_GENERATING_AI}][${AGENT_TASK_INDICATION.Context}] Write a brief biography about Beethoven including his early life, major works, influence, and legacy.
2. [${TEXT_GENERATING_AI}][${AGENT_TASK_INDICATION.Image}] Create prompts for three modern-day photo-realistic scenarios featuring Beethoven. a. Beethoven giving a concert in a modern cityscape. b. Beethoven wearing headphones and listening to electronic music. c. Beethoven interacting with other famous composers at a modern music festival.
3. [${IMAGE_GENERATING_AI}] Generate images of Beethoven.
4. [${TEXT_GENERATING_AI}] Include a section on the website dedicated to Beethoven's most famous works, along with a brief description and significance of each.
5. [${TEXT_GENERATING_AI}][${AGENT_TASK_INDICATION.Code}] Write the HTML structure for the single-page application, ensuring it adheres to accessibility standards (using semantic elements, alt attributes for images, and aria roles where necessary) and is performant.
6. [${TEXT_GENERATING_AI}][${AGENT_TASK_INDICATION.Code}] Write mobile-first CSS for styling the website to make it responsive across different screen sizes and ensure a performant load time.
7. [${TEXT_GENERATING_AI}][${AGENT_TASK_INDICATION.Code}] If the site needs any JavaScript to handle any interactivity, such as displaying additional information about Beethoven or toggling between images, then create that code. If it doesn't need JavaScript, then don't add any. If you do add JavaScript, then make sure it is accessible and performant.

# Example input 3

Create a short animated film about the frog Albert who befriends the gentle horse Tampere.

# Example output 3

1. [${TEXT_GENERATING_AI}][${AGENT_TASK_INDICATION.Context}] Write a story outline for the animated film about Albert the frog and Tampere the gentle horse, detailing their initial meeting, adventures, challenges, and the climax.
2. [${TEXT_GENERATING_AI}][${AGENT_TASK_INDICATION.Video}] Create prompts for key scenes in the story: a. Albert the frog encountering Tampere for the first time in a meadow. b. Albert and Tampere sharing a laugh while looking at the stars. c. The duo facing a challenge such as a river crossing. d. Albert and Tampere celebrating their friendship at the end.
3. [${VIDEO_GENERATING_AI}] Generate animations for the scenes outlined above.
4. [${TEXT_GENERATING_AI}][${AGENT_TASK_INDICATION.Narration}] Write a narration script for the film to provide context and fill in gaps between animated scenes.
5. [${VOICE_GENERATING_AI}] Generate voice narration using the provided script.

# Example input 4

Make a branding profile for an IT consultancy firm based in Stockholm. The primary color should be indigo.

# Example output 4

1. [${TEXT_GENERATING_AI}][${AGENT_TASK_INDICATION.Context}] Create a company name that reflects IT consultancy and its Stockholm origin. And define the company's mission statement and core values, emphasizing innovation, integrity, and client success.
2. [${TEXT_GENERATING_AI}][${AGENT_TASK_INDICATION.Context}] Write a brief description of the color palette, including: a. Primary color: Indigo (with HEX, RGB, and CMYK values). b. Secondary colors that complement indigo and enhance the brand's visual appeal.
3. [${TEXT_GENERATING_AI}][${AGENT_TASK_INDICATION.Image}] Design a logo concept using indigo as the primary color, incorporating elements that reflect IT, consultancy, and a touch of Stockholm's cultural or architectural identity.
4. [${IMAGE_GENERATING_AI}] Generate a logo based on the provided design concept.
5. [${TEXT_GENERATING_AI}][${AGENT_TASK_INDICATION.Context}] Recommend typography that pairs well with the logo and reflects the company's professional yet innovative identity. This should include a primary font for headings and a secondary font for body text.
6. [${TEXT_GENERATING_AI}][${AGENT_TASK_INDICATION.Context}] Describe brand imagery guidelines, suggesting the use of modern technology imagery, Stockholm landmarks, and collaborative workplace scenarios.
7. [${TEXT_GENERATING_AI}][${AGENT_TASK_INDICATION.Context}] Propose key messaging guidelines that emphasize the company's expertise, Stockholm roots, and commitment to client success.
8. [${TEXT_GENERATING_AI}][${AGENT_TASK_INDICATION.Context}] Outline a social media strategy, focusing on platforms relevant to B2B marketing such as LinkedIn and Twitter, detailing post frequency, content themes, and engagement tactics.
9. [${TEXT_GENERATING_AI}][${AGENT_TASK_INDICATION.Image}] Design a sample business card incorporating the company's name, logo, color palette, and typography.
10. [${IMAGE_GENERATING_AI}] Generate a visual of the business card based on the provided design.
11. [${TEXT_GENERATING_AI}][${AGENT_TASK_INDICATION.Context}] Provide guidelines for website design, ensuring it aligns with the branding profile, is user-friendly, and emphasizes the company's services and Stockholm base.

# Example input 5

Create a tic-tac-toe game with vanilla JavaScript.

# Example output 5

1. [${TEXT_GENERATING_AI}][${AGENT_TASK_INDICATION.Code}] Create a fully functional tic-tac-toe game using vanilla JavaScript. Write all of the code necessary to run the game.

# Example input 6

Create a todo app using SvelteJS.

# Example output 6

1. [${TEXT_GENERATING_AI}][${AGENT_TASK_INDICATION.Code}] Create a fully functional todo app using SvelteJS. Write all of the code, including the HTML, CSS, and JS, necessary to run the app inside of the same codeblock.

# Example input 7

Write a novel called Terraformers of the Void. It should be one hundred pages long.

Story summary: 

In the far future, humanity has mastered the art of terraforming barren planets. The protagonist, a young terraforming engineer named Kael, discovers a seemingly inert, spherical artifact on a new planet. It awakens, revealing itself to be a repository of knowledge from a long-extinct alien race. Kael must navigate interstellar politics, corporate espionage, and the enigmatic "Guardians of the Seed" who seek the sphere, as it begins transforming not just the planet but Kael as well, granting them insight into the universe's greatest mysteries.

# Example output 7

1. [${TEXT_GENERATING_AI}][${AGENT_TASK_INDICATION.Context}] Write a summary of the entire story, from start to finish, of a book called Terraformers of the Void, which is one hundred pages long. Begin the output with the label "Story summary:" and end it with "End of story summary". Details: In the far future, humanity has mastered the art of terraforming barren planets. The protagonist, a young terraforming engineer named Kael, discovers a seemingly inert, spherical artifact on a new planet. It awakens, revealing itself to be a repository of knowledge from a long-extinct alien race. Kael must navigate interstellar politics, corporate espionage, and the enigmatic "Guardians of the Seed" who seek the sphere, as it begins transforming not just the planet but Kael as well, granting them insight into the universe's greatest mysteries.
2. [${TEXT_GENERATING_AI}][${AGENT_TASK_INDICATION.Context}] Write the first five pages of the one hundred page book, following the story summary detailed above.
3. [${TEXT_GENERATING_AI}][${AGENT_TASK_INDICATION.Context}] Write pages six to ten of the one hundred page book, which follow directly after the latest events. The overall story should follow the story summary detailed above.
4. [${TEXT_GENERATING_AI}][${AGENT_TASK_INDICATION.Context}] Write pages eleven to fifteen of the one hundred page book, which follow directly after the latest events. The overall story should follow the story summary detailed above.
5. [${TEXT_GENERATING_AI}][${AGENT_TASK_INDICATION.Context}] Write pages sixteen to twenty of the one hundred page book, which follow directly after the latest events. The overall story should follow the story summary detailed above.
6. [${TEXT_GENERATING_AI}][${AGENT_TASK_INDICATION.Context}] Write pages twenty-one to twenty-five of the one hundred page book, which follow directly after the latest events. The overall story should follow the story summary detailed above.
7. [${TEXT_GENERATING_AI}][${AGENT_TASK_INDICATION.Context}] Write pages twenty-six to thirty of the one hundred page book, which follow directly after the latest events. The overall story should follow the story summary detailed above.
8. [${TEXT_GENERATING_AI}][${AGENT_TASK_INDICATION.Context}] Write pages thirty-one to thirty-five of the one hundred page book, which follow directly after the latest events. The overall story should follow the story summary detailed above.
9. [${TEXT_GENERATING_AI}][${AGENT_TASK_INDICATION.Context}] Write pages thirty-six to forty of the one hundred page book, which follow directly after the latest events. The overall story should follow the story summary detailed above.
10. [${TEXT_GENERATING_AI}][${AGENT_TASK_INDICATION.Context}] Write pages forty-one to forty-five of the one hundred page book, which follow directly after the latest events. The overall story should follow the story summary detailed above.
11. [${TEXT_GENERATING_AI}][${AGENT_TASK_INDICATION.Context}] Write pages forty-six to fifty of the one hundred page book, which follow directly after the latest events. The overall story should follow the story summary detailed above.
12. [${TEXT_GENERATING_AI}][${AGENT_TASK_INDICATION.Context}] Write pages fifty-one to fifty-five of the one hundred page book, which follow directly after the latest events. The overall story should follow the story summary detailed above.
13. [${TEXT_GENERATING_AI}][${AGENT_TASK_INDICATION.Context}] Write pages fifty-six to sixty of the one hundred page book, which follow directly after the latest events. The overall story should follow the story summary detailed above.
14. [${TEXT_GENERATING_AI}][${AGENT_TASK_INDICATION.Context}] Write pages sixty-one to sixty-five of the one hundred page book, which follow directly after the latest events. The overall story should follow the story summary detailed above.
15. [${TEXT_GENERATING_AI}][${AGENT_TASK_INDICATION.Context}] Write pages sixty-six to seventy of the one hundred page book, which follow directly after the latest events. The overall story should follow the story summary detailed above.
16. [${TEXT_GENERATING_AI}][${AGENT_TASK_INDICATION.Context}] Write pages seventy-one to seventy-five of the one hundred page book, which follow directly after the latest events. The overall story should follow the story summary detailed above.
17. [${TEXT_GENERATING_AI}][${AGENT_TASK_INDICATION.Context}] Write pages seventy-six to eighty of the one hundred page book, which follow directly after the latest events. The overall story should follow the story summary detailed above.
18. [${TEXT_GENERATING_AI}][${AGENT_TASK_INDICATION.Context}] Write pages eighty-one to eighty-five of the one hundred page book, which follow directly after the latest events. The overall story should follow the story summary detailed above.
19. [${TEXT_GENERATING_AI}][${AGENT_TASK_INDICATION.Context}] Write pages eighty-six to ninety of the one hundred page book, which follow directly after the latest events. The overall story should follow the story summary detailed above.
20. [${TEXT_GENERATING_AI}][${AGENT_TASK_INDICATION.Context}] Write pages ninety-one to ninety-five of the one hundred page book, which follow directly after the latest events. The overall story should follow the story summary detailed above.
21. [${TEXT_GENERATING_AI}][${AGENT_TASK_INDICATION.Context}] Write pages ninety-six to one hundred of the one hundred page book, which follow directly after the latest events. The overall story should follow the story summary detailed above.

# Instruction

`;

export const AGENT_PROMPT_GENERATE_IMAGE_PROMPTS = `
I need you to generate prompts for the image generating algorithm ${IMAGE_GENERATING_AI}. At the bottom of this prompt is an instructed which will tell you exactly how many images you should create, and perhaps some information to use as a basis for the image prompts. If there is additional information for you on the prompt(s) you are supposed to create, then it will be wrapped in BEGINCONTEXT and ENDCONTEXT tags below. The final instructions are at the bottom, wrapped in BEGININSTRUCTION and ENDINSTRUCTION tags.

The prompts you create will be given to ${IMAGE_GENERATING_AI}. Unless the instruction below tells you otherwise, it is very important that all of the images you create have the same art style and are consistent. Please note that ${IMAGE_GENERATING_AI} does not understand what art style it used for the previous image it created. Each image exists in a vacuum, so you can't tell it "please use the same art style as the previous image". It doesn't understand that. Therefore, please create as detailed prompts as possible. Don't just describe the image, but also use words describing the art style, colors, and more. You can use terms like "watercolor", "painting", "photography", "4k", "8k", and more to create a very precise prompt. No matter what, unless very specifically asked not to, your prompt should include terms like "best quality".

Furthermore, ${IMAGE_GENERATING_AI} does not understand what the previous image it created was. If you ask it to create a picture of Victoria, a red dragon, and then later just ask it to make another scene with Victoria, then you need to describe Victoria the exact same way again.

The prompts must be in this specific formula, delimited below in quadrupled quotation marks, with no additional text, questions, or suggestions. Do not include the quotation marks in your output, only the list. The output will be parsed by code. Note that sometimes, you only need to generate a single image, but it should still be a numbered list.

""""
1. A watercolor painting in best quality with soft pastel colors depicting Wrayley, the majestic gray wyvern, soaring through a cloudy sky.
2. A watercolor painting in best quality with soft pastel colors depicting Wrayley, the majestic gray wyvern, perched atop a rugged mountain peak, bathed in the light of a setting sun with hues of orange and purple.
3. A watercolor painting in best quality with soft pastel colors depicting Wrayley, the majestic gray wyvern, curled up, sleeping under a canopy of luminous moonlit trees, using shades of blue and silver.
4. A watercolor painting in best quality with soft pastel colors depicting Wrayley, the majestic gray wyvern, breathes fire over a tranquil lake, causing steam to rise, painted with warm reds, golds, and cool blues.
5. A watercolor painting in best quality with soft pastel colors depicting Wrayley, the majestic gray wyvern, chasing after glowing fireflies in a twilight meadow, blending colors of twilight blue, soft green, and luminescent yellow.
""""

# Example input 1

Create prompts for three photo-realistic artificial scenarios featuring Beethoven. a. Beethoven giving a concert in a modern cityscape. b. Beethoven wearing headphones and listening to electronic music. c. Beethoven interacting with other famous composers at a modern music festival.

# Example output 1

1. An 8k photo-realistic photo of Ludwig van Beethoven standing on a stage in the middle of a bustling modern cityscape during the evening. Beethoven is wearing traditional 18th-century attire and passionately playing a grand piano, with skyscrapers illuminated in the background. The city lights reflect off the surface of the buildings, and there's a large crowd of diverse people watching in awe. The art style should resemble a blend of realism and impressionism, with a soft, dreamy color palette dominated by blues, purples, and golden hues.
2. An 8k photo-realistic photo in a detailed semi-realistic style showcasing Ludwig van Beethoven sitting comfortably in a modern living room setting. He's wearing large, sleek, black headphones and seems lost in the world of electronic music, with a subtle smile on his face. The environment is filled with ambient lighting from a nearby window, casting soft shadows. The color palette should be warm and inviting, using shades of amber, beige, and soft whites. The overall feel should be that of a cozy afternoon.
3. An 8k photo-realistic photo illustrating a lively modern music festival setting during the day. The scene captures Ludwig van Beethoven in conversation with other famous composers like Wolfgang Amadeus Mozart, Johann Sebastian Bach, and Franz Schubert. All of them are dressed in a blend of their historical attire with contemporary touches – like modern sunglasses or wristbands. They are surrounded by festival-goers, food stalls, and stages with bands playing. The art style should be vivid and colorful, with a touch of whimsy, capturing the essence of a cheerful, sunny day with a pastel color palette consisting of pinks, yellows, greens, and blues.

# Example input 2

Design a logo concept using indigo as the primary color, incorporating elements that reflect IT, consultancy, and a touch of Stockholm's cultural or architectural identity.

# Example output 2

1. A sharp, modern, high-resolution logo in best quality with an indigo backdrop, combining a minimalist computer mouse and the outline of Stockholm's Djurgården bridge, signifying the blend of IT, consultancy, and Stockholm's heritage.

# Example input 3

Create prompts for four images corresponding to the five pages of the story about a charming little kitten that befriends a lonely dragon, spread across five pages.

# Example output 3

1. A high-quality digital painting portraying Bella, a charming little white kitten with twinkling blue eyes and a vibrant pink bow around her neck, and Draco, a friendly but lonely large red dragon. Bella is curiously observing a lonely dragon named Draco from a hill. It's a sunny day, and Draco is seen sitting quietly, looking over the town with a sorrowful expression.
2. A high-quality digital painting portraying Bella, a charming little white kitten with twinkling blue eyes and a vibrant pink bow around her neck, and Draco, a friendly but lonely large red dragon. Bella is bravely walking up the hill and introducing herself to the dragon, Draco. Draco shares his feelings of isolation and loneliness with Bella, who responds with comfort and reassurance.
3. A high-quality digital painting portraying Bella, a charming little white kitten with twinkling blue eyes and a vibrant pink bow around her neck, and Draco, a friendly but lonely large red dragon. Draco and Bella playing together in the meadow, sharing stories, and enjoying each other's company amidst the awe-struck townsfolk, symbolizing the blossoming of their unusual, yet genuine, friendship.
4. A high-quality digital painting portraying Bella, a charming little white kitten with twinkling blue eyes and a vibrant pink bow around her neck, and Draco, a friendly but lonely large red dragon. An emotional final scene of Bella and Draco living happily in the town. They are surrounded by townsfolk who no longer fear dragons, signifying the changed mindset of the people, captivating not only the beauty of their friendship but also its transformative impact on their world.
`;

export const AGENT_PROMPT_GENERATE_VIDEO_PROMPTS = `
I need you to generate prompts for the video generating algorithm ${VIDEO_GENERATING_AI}. At the bottom of this prompt is an instructed which will tell you exactly how many videos you should create, and perhaps some information to use as a basis for the image prompts. If there is additional information for you on the prompt(s) you are supposed to create, then it will be wrapped in BEGINCONTEXT and ENDCONTEXT tags below. The final instructions are at the bottom, wrapped in BEGININSTRUCTION and ENDINSTRUCTION tags.

The prompts you create will be given to ${VIDEO_GENERATING_AI}. Unless the instruction below tells you otherwise, it is very important that all of the videos you create have the same art style and are consistent. Please note that ${VIDEO_GENERATING_AI} does not understand what art style it used for the previous video it created. Each video exists in a vacuum, so you can't tell it "please use the same art style as the previous video". It doesn't understand that. Therefore, please create as detailed prompts as possible. Don't just describe the video, but also use words describing the art style, colors, and more. You can use terms like "watercolor", "painting", "photography", "4k", "8k", and more to create a very precise prompt. No matter what, unless very specifically asked not to, your prompt should include terms like "best quality".

The prompts must be in this specific formula, delimited below in quadrupled quotation marks, with no additional text, questions, or suggestions. Do not include the quotation marks in your output, only the list. The output will be parsed by code. Note that sometimes, you only need to generate a single video, but it should still be a numbered list.

""""
1. In 8k Disney style, best quality, depict Katsuru, Misato, and Masahiro, vibrant birds, taking flight against Japan's Mount Fuji at sunrise.
2. Showcase the trio of birds, Katsuru, Misato, and Masahiro, in vibrant 8k Disney style, soaring over bustling Tokyo cityscapes in best quality.
3. With a 8k Disney artistry at its best quality, portray Katsuru, Misato, and Masahiro gliding gracefully over the azure seas, with tropical islands dotting their path.
4. In the distinctive 8k Disney style, capture Katsuru, Misato, and Masahiro navigating through a sudden tropical storm, their feathers glistening with rain.
5. Depict Katsuru, Misato, and Masahiro, in 8k Disney style best quality, joyously descending upon Indonesia's lush rainforests, welcomed by a chorus of exotic wildlife.
""""

# Example input 1

Create prompts for key scenes in the story: a. Albert the frog encountering Tampere for the first time in a meadow. b. Albert and Tampere sharing a laugh while looking at the stars. c. The duo facing a challenge such as a river crossing. d. Albert and Tampere celebrating their friendship at the end.

# Example output 1

1. A watercolor-styled video. Albert, a vibrant green frog, curiously gazes at Tampere amidst a sunlit, flower-filled meadow.
2. A starry night setting rendered in watercolor. Albert and Tampere lay on a grassy hill, chuckling together as they gaze up at the twinkling stars.
3. Depict Albert and Tampere in watercolor, working in tandem to navigate the challenges of a swift, rock-strewn river crossing.
4. Using a watercolor aesthetic, showcase a jubilant Albert and Tampere, side by side, celebrating their deep bond against a backdrop of golden sunset.

# Example input 2

A viking man sailing from Norway to England in an anime art style

# Example output 2

1. In a vivid 8k anime art style, depict a determined Viking man with piercing eyes, steering a grand longship across the roaring North Sea, with Norway's snowy peaks behind and England's rugged coastline ahead in best quality.
`;
