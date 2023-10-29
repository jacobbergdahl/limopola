import { INPUT_MODE, Message } from "./constants";

export const parseTextResponse = (text: string): string => {
  const htmlTagPattern = /^<[^>]+>[\s\S]*<\/[^>]+>$/;
  const hasCodeBlock = text.includes("```");
  // The user may ask for raw HTML output
  const doesTextStartAndEndWithHtml = htmlTagPattern.test(text);
  const startsWithPreOrCodePattern = /^(<pre>|<code>)/;
  const doesTextStartWithPreOrCode = startsWithPreOrCodePattern.test(text);
  let processedText = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  if (doesTextStartAndEndWithHtml && !doesTextStartWithPreOrCode) {
    processedText = `<pre><code>${processedText}</code></pre>`;
  }

  // It is possible to tell LLMs, in plain text, to please use <code> tags
  // instead of the ``` syntax. However, it is very inconsistent, and it also
  // often leads to LLMs wrapping _everything_ in HTML tags.
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
