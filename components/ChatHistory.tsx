import { MutableRefObject } from "react";
import { MODEL, MODEL_TYPE, Message, getModelType } from "../general/constants";
import styles from "./ChatHistory.module.css";
import { SPINNER_TYPE, Spinner } from "./Spinner";

type ChatHistoryType = {
  messages: Message[];
  isLoading: boolean;
  chatRef: MutableRefObject<any>;
  scrollAnchorRef: MutableRefObject<any>;
  model: MODEL;
  handleAutoMessage?: (prompt: string) => void;
  timer: number;
  emptyHistoryMessage?: string;
};

export const ChatHistory = ({
  messages,
  isLoading,
  chatRef,
  scrollAnchorRef,
  model,
  handleAutoMessage,
  timer,
  emptyHistoryMessage = "The chat history is empty",
}: ChatHistoryType) => {
  const hasCurrentlySelectedAudioModel =
    getModelType(model) === MODEL_TYPE.Audio;
  const hasCurrentlySelectedFactChecker = model === MODEL.FactChecker;
  const isClickable =
    hasCurrentlySelectedAudioModel || hasCurrentlySelectedFactChecker;

  return (
    <div
      className={`${styles.chatHistory}${
        isClickable ? " " + styles.selectableMessage : ""
      }`}
      ref={chatRef}
    >
      {messages.map((message) => {
        const isTextMessage = !!message.content;
        const getMessageStyle = (sender: string) => {
          const commonClass =
            styles.message + (isTextMessage ? " " + styles.textMessage : "");
          switch (sender.toLocaleLowerCase()) {
            case "you":
              return commonClass + " " + styles.userMessage;
            case "error":
              return commonClass + " " + styles.errorMessage;
          }

          return commonClass + " " + styles.chatGptMessage;
        };

        return (
          <div className={getMessageStyle(message.sender)} key={message.id}>
            <>
              <span className={styles.messageSender}>{message.sender}</span>
              {message.header && (
                <h4 className={styles.header}>{message.header}</h4>
              )}
              {isTextMessage && !isClickable && (
                <div dangerouslySetInnerHTML={{ __html: message.content }} />
              )}
              {isTextMessage && isClickable && (
                <div
                  dangerouslySetInnerHTML={{ __html: message.content }}
                  onClick={() =>
                    handleAutoMessage && handleAutoMessage(message.content)
                  }
                />
              )}
              {message.imageUrls && (
                <div className={styles.imageWrapper}>
                  {message.imageUrls?.map((imageUrl) => (
                    <a
                      href={imageUrl}
                      target="_blank"
                      key={imageUrl}
                      rel="noreferrer"
                    >
                      <img
                        src={imageUrl}
                        alt="AI generated image by the previous message"
                      />
                    </a>
                  ))}
                </div>
              )}
              {message.videoUrl && (
                <video src={message.videoUrl} controls loop></video>
              )}
              {message.videoUrls && (
                <>
                  {message.videoUrls.map((videoUrl) => (
                    <video src={videoUrl} key={videoUrl} controls loop></video>
                  ))}
                </>
              )}
              {message.audioUrl && (
                <audio src={message.audioUrl} controls></audio>
              )}
              {message.audioUrls && (
                <>
                  {message.audioUrls.map((audioUrl) => (
                    <audio src={audioUrl} key={audioUrl} controls></audio>
                  ))}
                </>
              )}
            </>
          </div>
        );
      })}
      {messages.length === 0 && !isLoading && (
        <span className={styles.emptyChat}>{emptyHistoryMessage}</span>
      )}
      <Spinner
        show={isLoading}
        model={model}
        classNames={`${styles.message} ${styles.loadingMessage}`}
        spinnerType={SPINNER_TYPE.BLUE}
        timer={timer}
      />
      <div className={styles.scrollAnchor} ref={scrollAnchorRef}></div>
    </div>
  );
};
