import { INPUT_MODE, Message } from "./constants";
import { marked } from "marked";

const parseMarkdownToHtml = (markdown: string): string => {
  return marked(markdown);
};

export const parseTextResponse = (text: string): string => {
  let processedText = text
    // It's rare that the LLM will output delimiters, but it could happen if it gets confused
    .replace("BEGINCONTEXT", "")
    .replace("ENDCONTEXT", "")
    .replace("BEGINRESULTS", "")
    .replace("ENDRESULTS", "")
    .replace("BEGINRESULT", "")
    .replace("ENDRESULT", "")
    .replace("BEGINCODE", "")
    .replace("ENDCODE", "")
    .replace("BEGININSTRUCTION", "")
    .replace("ENDINSTRUCTION", "")
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

export const getCorrectCtrlKey = () => {
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

export const downloadConversation = (
  inputMode: INPUT_MODE,
  chatHistory: Message[],
  currentEditorText: string
) => {
  const textToSave = getTextToDownload(
    inputMode,
    chatHistory,
    currentEditorText
  );

  if (textToSave.length === 0) {
    return;
  }

  // Create a blob object representing the data as a text file
  const blob = new Blob([textToSave], { type: "text/plain" });

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
