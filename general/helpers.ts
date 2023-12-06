import { INPUT_MODE, Message } from "./constants";
import { marked } from "marked";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import hljs, { Language } from "highlight.js";

const parseMarkdownToHtml = (markdown: string): string => {
  return marked(markdown);
};

export const parseTextResponse = (text: string): string => {
  let processedText = text
    // It's rare that the LLM will output delimiters, but it could happen if it gets confused
    .replace(/BEGINCONTEXT/g, "")
    .replace(/ENDCONTEXT/g, "")
    .replace(/BEGINRESULTS/g, "")
    .replace(/ENDRESULTS/g, "")
    .replace(/BEGINRESULT/g, "")
    .replace(/ENDRESULT/g, "")
    .replace(/BEGINCODE/g, "")
    .replace(/ENDCODE/g, "")
    .replace(/BEGININSTRUCTION/g, "")
    .replace(/ENDINSTRUCTION/g, "")
    .replace(/""""/g, "")
    .replace(/"""/g, "")
    .trim();

  const startsOrEndsWithHtmlTagRegexPattern = /^<[^>]+>[\s\S]*<\/[^>]+>$/;

  const doesTextStartAndEndWithHtml =
    startsOrEndsWithHtmlTagRegexPattern.test(processedText);

  const doesTextStartWithMarkdownHeader = processedText.startsWith("#");
  const doesTextContainMarkdownLinks = /\[.*?\]\(.*?\)/.test(processedText);
  if (doesTextStartWithMarkdownHeader || doesTextContainMarkdownLinks) {
    processedText = parseMarkdownToHtml(processedText);
  }

  // We don't want to escape <pre> or <code> tags. This code
  // temporarily replaces them with placeholders, and then
  // replaces them back after escaping the rest of the text.
  processedText = processedText
    .replace(/<pre>/g, "PRE_TAG_PLACEHOLDER")
    .replace(/<\/pre>/g, "PRE_END_TAG_PLACEHOLDER")
    .replace(/<code>/g, "CODE_TAG_PLACEHOLDER")
    .replace(/<\/code>/g, "CODE_END_TAG_PLACEHOLDER")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/PRE_TAG_PLACEHOLDER/g, "<pre>")
    .replace(/PRE_END_TAG_PLACEHOLDER/g, "</pre>")
    .replace(/CODE_TAG_PLACEHOLDER/g, "<code>")
    .replace(/CODE_END_TAG_PLACEHOLDER/g, "</code>");

  // It is possible to tell LLMs, in plain text, to please use <code> tags
  // instead of the ``` syntax. However, it is very inconsistent, and it also
  // often leads to LLMs wrapping _everything_ in HTML tags.
  const hasCodeBlock = text.includes("```");
  if (hasCodeBlock) {
    processedText = processedText.replace(
      /```([\s\S]+?)```/g,
      "<pre><code>$1</code></pre>"
    );
  }

  const hasInlineCode = processedText.includes("`");
  if (hasInlineCode) {
    processedText = processedText.replace(
      /`([\s\S]+?)`/g,
      `<span class="inline-code">$1</span>`
    );
  }

  const startsWithPreOrCodeRegexPattern = /^(<pre>|<code>)/;
  const doesTextStartWithPreOrCode =
    startsWithPreOrCodeRegexPattern.test(processedText);
  if (doesTextStartAndEndWithHtml && !doesTextStartWithPreOrCode) {
    processedText = `<pre><code>${processedText}</code></pre>`;
  }

  return processedText;
};

export const enum OperatingSystem {
  Windows = 0,
  Mac,
  Unknown,
}

export function getUserOperatingSystem(): OperatingSystem {
  if (typeof window !== "undefined") {
    const userAgent = window.navigator.userAgent;
    if (userAgent.includes("Macintosh")) {
      return OperatingSystem.Mac;
    } else if (userAgent.includes("Windows")) {
      return OperatingSystem.Windows;
    }
  }
  return OperatingSystem.Unknown;
}

export const getCtrlKey = () => {
  return getUserOperatingSystem() === OperatingSystem.Mac ? "⌘" : "CTRL";
};

export const getLatestMessageByUser = (chatHistory: Message[]) => {
  return chatHistory
    .slice()
    .reverse()
    .find((message) => message.sender === "You");
};

const getMessageTextForDownload = (message: Message) => {
  if (!!message.content) {
    return message.content;
  } else if (!!message.imageUrls) {
    return message.imageUrls.join("\n");
  } else if (!!message.videoUrl) {
    return message.videoUrl;
  } else if (!!message.audioUrl) {
    return message.audioUrl;
  }
};

export const downloadConversation = (
  inputMode: INPUT_MODE,
  chatHistory: Message[],
  currentEditorText: string
) => {
  return inputMode === INPUT_MODE.Chat
    ? saveMessagesAsZip(chatHistory, "conversation", true)
    : downloadText(currentEditorText);
};

const getTextToDownload = (
  inputMode: INPUT_MODE,
  chatHistory: Message[],
  currentEditorText: string
) => {
  if (inputMode === INPUT_MODE.Chat) {
    return chatHistory
      .map(
        (message) =>
          `${message.sender}: ${getMessageTextForDownload(message)}\n\n`
      )
      .join("")
      .trim();
  } else if (inputMode === INPUT_MODE.Editor) {
    return currentEditorText;
  }
};

export const downloadText = (textToDownload: string) => {
  if (textToDownload.length === 0) {
    return;
  }

  // Create a blob object representing the data as a text file
  const blob = new Blob([textToDownload], { type: "text/plain" });

  // Create a temporary anchor element to enable the download
  const url = window.URL.createObjectURL(blob);
  const temporaryElement = document.createElement("a");
  temporaryElement.href = url;
  temporaryElement.download = "text.txt";
  document.body.appendChild(temporaryElement);

  // Trigger the download
  temporaryElement.click();

  // Clean up
  window.URL.revokeObjectURL(url);
  document.body.removeChild(temporaryElement);
};

export const saveMessagesAsZip = async (
  messages: Message[],
  zipFileName: string = "messages",
  saveAllMessagesTogether: boolean = false
) => {
  const zip = new JSZip();
  let finalMessage = "";

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    if (message.shouldAvoidDownloading) {
      continue;
    }
    let fileName = message.fileName || "message";
    if (message.content) {
      const messageContent = message.content
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'");

      if (saveAllMessagesTogether) {
        finalMessage += `${message.sender}: ${messageContent}\n\n`;
        continue;
      }

      const codeBlockRegex = /<pre><code>([\s\S]*?)<\/code><\/pre>/g;
      let match;
      const codeBlocks = [];
      while ((match = codeBlockRegex.exec(messageContent)) !== null) {
        let unescapedCode = match[1];

        const firstWord = unescapedCode.split("\n")[0];
        const firstWordLowercase: string =
          firstWord && firstWord.length > 0
            ? firstWord.toLowerCase().trim()
            : "";

        const detectedLanguageByFirstWord: Language | undefined =
          hljs.getLanguage(firstWordLowercase);
        const detectedLanguage: Language = detectedLanguageByFirstWord
          ? detectedLanguageByFirstWord
          : hljs.getLanguage(hljs.highlightAuto(unescapedCode).language);

        if (detectedLanguageByFirstWord) {
          unescapedCode = unescapedCode.substring(firstWord.length).trim();
        }

        const alias =
          detectedLanguage &&
          detectedLanguage.aliases &&
          detectedLanguage.aliases.length > 0
            ? detectedLanguage.aliases[0].toLowerCase()
            : "";

        const name =
          detectedLanguage && detectedLanguage.name
            ? detectedLanguage.name.toLowerCase()
            : "";

        const extensionExtractedFromCode = alias || name;

        const extension = extensionExtractedFromCode
          ? `.${extensionExtractedFromCode}`
          : ".txt";

        codeBlocks.push({ code: unescapedCode, extension });
      }

      if (codeBlocks.length > 0) {
        codeBlocks.forEach(({ code, extension }, index) => {
          zip.file(`${fileName}${i}_code${index}${extension}`, code);
        });
      }

      let fullFileName =
        codeBlocks.length > 0 ? `${fileName}${i}_full` : `${fileName}${i}`;

      zip.file(`${fullFileName}.txt`, messageContent);
    } else if (message.imageUrls) {
      for (let j = 0; j < message.imageUrls.length; j++) {
        const imageUrl = message.imageUrls[j];
        try {
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const fileNameSuffix = message.imageUrls.length > 1 ? `_${j}` : "";
          const finalFileName = `${fileName}${i}${fileNameSuffix}.png`;
          if (saveAllMessagesTogether) {
            finalMessage += `${message.sender}: ${finalFileName}\n\n`;
          }
          zip.file(finalFileName, blob);
        } catch (error) {
          console.error(
            `Could not save image with imageUrl ${imageUrl}. This can happen if the image is generated by dall-e 3 due to CORS headers. You may have to manually download the image to save it.`,
            error
          );
        }
      }
    } else if (message.videoUrl) {
      try {
        const response = await fetch(message.videoUrl);
        if (!response.ok) {
          console.error("Could not download video", response);
          continue;
        }
        const blob = await response.blob();
        const finalFileName = `${fileName}${i}.mp4`;
        if (saveAllMessagesTogether) {
          finalMessage += `${message.sender}: ${finalFileName}\n\n`;
        }
        zip.file(finalFileName, blob);
      } catch (error) {
        console.error("Could not download audio", error);
      }
    } else if (message.audioUrl) {
      try {
        const response = await fetch(message.audioUrl);
        if (!response.ok) {
          console.error("Could not download audio", response);
          continue;
        }
        const blob = await response.blob();
        const finalFileName = `${fileName}${i}.mp3`;
        if (saveAllMessagesTogether) {
          finalMessage += `${message.sender}: ${finalFileName}\n\n`;
        }
        zip.file(finalFileName, blob);
      } catch (error) {
        console.error("Could not download audio", error);
      }
    } else if (message.videoUrls) {
      for (let j = 0; j < message.videoUrls.length; j++) {
        const videoUrl = message.videoUrls[j];
        try {
          const response = await fetch(videoUrl);
          if (!response.ok) {
            console.error("Could not download video", response);
            continue;
          }
          const blob = await response.blob();
          const fileNameSuffix = message.videoUrls.length > 1 ? `_${j}` : "";
          const finalFileName = `${fileName}${i}${fileNameSuffix}.mp4`;
          if (saveAllMessagesTogether) {
            finalMessage += `${message.sender}: ${finalFileName}\n\n`;
          }
          zip.file(finalFileName, blob);
        } catch (error) {
          console.error("Could not download video", error);
        }
      }
    } else if (message.audioUrls) {
      for (let j = 0; j < message.audioUrls.length; j++) {
        const audioUrl = message.audioUrls[j];
        try {
          const response = await fetch(audioUrl);
          if (!response.ok) {
            console.error("Could not download audio", response);
            continue;
          }
          const blob = await response.blob();
          const fileNameSuffix = message.audioUrls.length > 1 ? `_${j}` : "";
          const finalFileName = `${fileName}${i}${fileNameSuffix}.mp3`;
          if (saveAllMessagesTogether) {
            finalMessage += `${message.sender}: ${finalFileName}\n\n`;
          }
          zip.file(finalFileName, blob);
        } catch (error) {
          console.error("Could not download audio", error);
        }
      }
    }
  }

  if (saveAllMessagesTogether) {
    zip.file(`textMessages.txt`, finalMessage);
  }

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `${zipFileName}.zip`);
};

export const createPlaceHolderChatHistory = (numberOfMessages: number) => {
  const messages = [];
  for (let i = 0; i < numberOfMessages; i++) {
    messages.push({
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Pretium aenean pharetra magna ac placerat vestibulum lectus mauris. Mattis pellentesque id nibh tortor id. Dignissim sodales ut eu sem. At in tellus integer feugiat scelerisque varius morbi. Mauris in aliquam sem fringilla ut. Quisque id diam vel quam. Quis viverra nibh cras pulvinar mattis nunc sed. Pellentesque elit ullamcorper dignissim cras tincidunt lobortis feugiat. Tortor at auctor urna nunc id cursus metus. Consectetur a erat nam at lectus urna. Pellentesque nec nam aliquam sem et tortor consequat id porta. Quam adipiscing vitae proin sagittis nisl. Fusce id velit ut tortor pretium viverra suspendisse potenti nullam. Pretium vulputate sapien nec sagittis aliquam malesuada bibendum. Tristique nulla aliquet enim tortor at auctor. Porta lorem mollis aliquam ut porttitor leo. Convallis aenean et tortor at risus viverra adipiscing at in. Sodales neque sodales ut etiam sit amet nisl purus in.",
      sender: "Debug",
      id: i,
    });
  }
  return messages;
};

export const clearLocalStorage = () => {
  localStorage.clear();
};
