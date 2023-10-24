import Head from "next/head";
import { useRef, useEffect, useState, useCallback } from "react";
import {
  ALL_LLAMA_MODELS,
  ALL_OPEN_AI_MODELS,
  DEFAULT_CONTEXT,
  getModelType,
  INPUT_MODE,
  MEMORY,
  Message,
  MODEL,
  MODEL_TYPE,
  SHOULD_SHOW_ALL_LOGS,
  STATUS_CODE,
  TEXTAREA_STYLE,
} from "../general/constants";
import {
  downloadConversation,
  getLatestMessageByUser,
  getUserOperatingSystem,
  OperatingSystem,
} from "../general/helpers";
import styles from "./index.module.css";
import {
  chatHistoryAtom,
  chatInputAtom,
  currentlySelectedContextAtom,
  editorTextAtom,
  frequencyPenaltyAtom,
  imageSizeAtom,
  inputModeAtom,
  isContextModalOpenAtom,
  isFrequencyPenaltyDefaultAtom,
  isLoadingAtom,
  isPresencePenaltyDefaultAtom,
  isTemperatureDefaultAtom,
  isTopPDefaultAtom,
  maxNumberOfTokensAtom,
  memoryAtom,
  messagesInMemoryAtom,
  modelAtom,
  numberOfImagesToGenerateAtom,
  presencePenaltyAtom,
  requestedNumberOfTokensAtom,
  technicalFrequencyPenaltyAtom,
  technicalPresencePenaltyAtom,
  technicalTemperatureAtom,
  technicalTopPAtom,
  technicalVoiceSimilarityBoostAtom,
  technicalVoiceStabilityAtom,
  temperatureAtom,
  textAreaStyleAtom,
  topPAtom,
  voiceSimilarityBoostAtom,
  voiceStabilityAtom,
} from "./atoms";
import { useAtom } from "jotai";
import { RESET } from "jotai/utils";
import { AllAudioModels } from "../components/sections/AllAudioModels";
import { prettyLog, subtleLog } from "../general/logging";
import { Button } from "../components/Button";
import { ChatHistory } from "../components/ChatHistory";
import { Spinner } from "../components/Spinner";
import { TextAreaStyleSelector } from "../components/TextAreaStyleSelector";
import { AllTextModels } from "../components/sections/AllTextModels";
import { AllImageModels } from "../components/sections/AllImageModels";
import { AllVideoModels } from "../components/sections/AllVideoModels";
import { ModelInformation } from "../components/sections/ModelInformation";
import { Memory } from "../components/sections/Memory";
import { InstantMessages } from "../components/sections/InstantMessages";
import { Temperature } from "../components/sections/Temperature";
import { RequestedNumberOfTokens } from "../components/sections/RequestedNumberOfTokens";
import { NumberOfImages } from "../components/sections/NumberOfImages";
import { ImageSize } from "../components/sections/ImageSize";
import { VoiceStability } from "../components/sections/VoiceStability";
import { VoiceSimilarityBoost } from "../components/sections/VoiceSimilarityBoost";
import { AllContexts } from "../components/sections/AllContexts";
import { TopP } from "../components/sections/TopP";
import { FrequencyPenalty } from "../components/sections/FrequencyPenalty";
import { PresencePenalty } from "../components/sections/PresencePenalty";
import { MaxNumberOfTokens } from "../components/sections/MaxNumberOfTokens";

// I know, I know, this file is too long. It should, and will, be refactored 🙏
// ... (maybe)
export default function Home() {
  const [currentInput, setCurrentInput] = useAtom(chatInputAtom);
  const [currentEditorText, setCurrentEditorText] = useAtom(editorTextAtom);
  const [temperature, setTemperature] = useAtom(temperatureAtom);
  const [technicalTemperature, setTechnicalTemperature] = useAtom(
    technicalTemperatureAtom
  );
  const [voiceSimilarityBoost, setVoiceSimilarityBoost] = useAtom(
    voiceSimilarityBoostAtom
  );
  const [technicalVoiceSimilarityBoost, setTechnicalVoiceSimilarityBoost] =
    useAtom(technicalVoiceSimilarityBoostAtom);

  const [voiceStability, setVoiceStability] = useAtom(voiceStabilityAtom);
  const [technicalVoiceStability, setTechnicalVoiceStability] = useAtom(
    technicalVoiceStabilityAtom
  );

  const [model, setModel] = useAtom(modelAtom);
  const [memory, setMemory] = useAtom(memoryAtom);
  const [currentlySelectedContext, setCurrentlySelectedContext] = useAtom(
    currentlySelectedContextAtom
  );
  const [chatHistory, setChatHistory] = useAtom(chatHistoryAtom);
  const [messagesInMemory, setMessagesInMemory] = useAtom(messagesInMemoryAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
  const selectedModelType = getModelType(model);
  const [numberOfImagesToGenerate, setNumberOfImagesToGenerate] = useAtom(
    numberOfImagesToGenerateAtom
  );
  const [imageSize, setImageSize] = useAtom(imageSizeAtom);
  const [requestedNumberOfTokens, setRequestedNumberOfTokens] = useAtom(
    requestedNumberOfTokensAtom
  );
  const [maxNumberOfTokens, setMaxNumberOfTokens] = useAtom(
    maxNumberOfTokensAtom
  );
  const [inputMode, setInputMode] = useAtom(inputModeAtom);
  const [textAreaStyle, setTextAreaStyle] = useAtom(textAreaStyleAtom);
  const [isContextModalOpen] = useAtom(isContextModalOpenAtom);
  const [topP, setTopP] = useAtom(topPAtom);
  const [technicalTopP, setTechnicalTopP] = useAtom(technicalTopPAtom);
  const [frequencyPenalty, setFrequencyPenalty] = useAtom(frequencyPenaltyAtom);
  const [technicalFrequencyPenalty, setTechnicalFrequencyPenalty] = useAtom(
    technicalFrequencyPenaltyAtom
  );
  const [presencePenalty, setPresencePenalty] = useAtom(presencePenaltyAtom);
  const [technicalPresencePenalty, setTechnicalPresencePenalty] = useAtom(
    technicalPresencePenaltyAtom
  );
  const [isTemperatureDefault, setIsTemperatureDefault] = useAtom(
    isTemperatureDefaultAtom
  );
  const [isTopPDefault, setIsTopPDefault] = useAtom(isTopPDefaultAtom);
  const [isFrequencyPenaltyDefault, setIsFrequencyPenaltyDefault] = useAtom(
    isFrequencyPenaltyDefaultAtom
  );
  const [isPresencePenaltyDefault, setIsPresencePenaltyDefault] = useAtom(
    isPresencePenaltyDefaultAtom
  );
  const [timer, setTimer] = useState<number>(-1);
  const scrollAnchorRef = useRef(null);
  const chatRef = useRef(null);
  const textareaRef = useRef(null);

  const isFactChecking = model === MODEL.FactChecker;
  const shouldShowTemperature =
    selectedModelType === MODEL_TYPE.Text &&
    (ALL_LLAMA_MODELS.includes(model) ||
      ALL_OPEN_AI_MODELS.includes(model) ||
      model === MODEL.PalmChatBison001 ||
      model === MODEL.PalmTextBison001) &&
    !isFactChecking;
  const shouldShowTopP =
    selectedModelType === MODEL_TYPE.Text &&
    model !== MODEL.LocalLlama &&
    (ALL_LLAMA_MODELS.includes(model) || ALL_OPEN_AI_MODELS.includes(model)) &&
    !isFactChecking;
  const shouldShowFrequencyPenalty =
    selectedModelType === MODEL_TYPE.Text &&
    ALL_OPEN_AI_MODELS.includes(model) &&
    !isFactChecking;
  const shouldShowPresencePenalty =
    selectedModelType === MODEL_TYPE.Text &&
    ALL_OPEN_AI_MODELS.includes(model) &&
    !isFactChecking;
  const shouldShowVoiceSettings = selectedModelType === MODEL_TYPE.Audio;
  const shouldShowRequestedNumberOfTokens = model === MODEL.LocalLlama;
  const shouldShowMaxNumberOfTokens = ALL_OPEN_AI_MODELS.includes(model);
  const shouldShowMemory =
    selectedModelType === MODEL_TYPE.Text &&
    inputMode === INPUT_MODE.Chat &&
    !isFactChecking;
  const shouldShowInstantMessages =
    selectedModelType === MODEL_TYPE.Text &&
    inputMode === INPUT_MODE.Chat &&
    !isFactChecking;
  // TODO: Enable for editor
  const shouldShowContexts =
    inputMode === INPUT_MODE.Chat &&
    !isFactChecking &&
    selectedModelType !== MODEL_TYPE.Audio;
  const shouldShowNumberOfImages = selectedModelType === MODEL_TYPE.Image;
  const shouldShowImageSize = model === MODEL.Dalle;

  useEffect(() => {
    const handleKeyDown = (event) => {
      const isNotFocusingOnTextArea =
        document.activeElement !== textareaRef?.current;
      const shouldHandleKeyDown =
        isNotFocusingOnTextArea && !isContextModalOpen;
      if (shouldHandleKeyDown && (event.key === "t" || event.key === "Enter")) {
        event.preventDefault();
        textareaRef.current.focus();
      } else if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        downloadConversation(inputMode, chatHistory, currentEditorText);
      }
    };

    textareaRef.current && textareaRef.current.focus();
    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inputMode, isContextModalOpen]);

  const saveMessage = (
    message: Message,
    mutableChatHistory?: Message[],
    shouldSaveMessageToMemory: boolean = false,
    mutableMessagesToRemember?: Message[]
  ): [Message[], Message[]] => {
    const newChatHistory = mutableChatHistory
      ? [...mutableChatHistory, message]
      : [...chatHistory, message];

    setChatHistory(newChatHistory);

    let newMemoryHistory = [];

    if (shouldSaveMessageToMemory) {
      newMemoryHistory =
        mutableMessagesToRemember != null
          ? [...mutableMessagesToRemember, message]
          : [...messagesInMemory, message];

      setMessagesInMemory(newMemoryHistory);
    }

    return [newChatHistory, newMemoryHistory];
  };

  const generateMessageWithHistory = (currentInput: string) => {
    if (messagesInMemory.length === 0) {
      return currentInput;
    }

    const finalMessage = messagesInMemory.map(
      (message) =>
        `${message.sender.replace("You", "User")}: ${message.content}\n\n`
    );

    const modelNameOrEmpty = model !== MODEL.LocalLlama ? `${model}:` : "";

    return `${finalMessage.join(
      ""
    )}User: ${currentInput}\n\n${modelNameOrEmpty}`;
  };

  const getFinalPrompt = (prompt: string) => {
    const contextWithPrompt =
      !!currentlySelectedContext.content &&
      currentlySelectedContext.content.length > 0
        ? currentlySelectedContext.content + "\n\n" + prompt
        : prompt;

    if (isFactChecking) {
      return prompt;
    } else if (
      selectedModelType === MODEL_TYPE.Text &&
      inputMode === INPUT_MODE.Chat
    ) {
      return generateMessageWithHistory(contextWithPrompt);
    } else if (
      selectedModelType === MODEL_TYPE.Text &&
      inputMode === INPUT_MODE.Editor
    ) {
      return prompt;
    }

    return contextWithPrompt;
  };

  const getRequestBody = (prompt: string) => {
    if (selectedModelType === MODEL_TYPE.Text) {
      return JSON.stringify({
        message: prompt,
        temperature: technicalTemperature,
        model: model,
        frequencyPenalty: technicalFrequencyPenalty,
        presencePenalty: technicalPresencePenalty,
        topP: technicalTopP,
        requestedNumberOfTokens: requestedNumberOfTokens,
        maxNumberOfTokens: shouldShowMaxNumberOfTokens
          ? maxNumberOfTokens
          : undefined,
        isTemperatureDefault: isTemperatureDefault,
        isTopPDefault: isTopPDefault,
        isFrequencyPenaltyDefault: isFrequencyPenaltyDefault,
        isPresencePenaltyDefault: isPresencePenaltyDefault,
      });
    } else if (selectedModelType === MODEL_TYPE.Audio) {
      return JSON.stringify({
        message: prompt,
        model: model,
        voiceStability: technicalVoiceStability,
        voiceSimilarityBoost: technicalVoiceSimilarityBoost,
      });
    }

    return JSON.stringify({
      message: prompt,
      numberOfImages: numberOfImagesToGenerate,
      imageSize: imageSize,
      model: model,
    });
  };

  const scrollToBottom = () => {
    if (scrollAnchorRef?.current != null) {
      scrollAnchorRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  let timerValue = 0;
  const startTimer = () => {
    timerValue = 0;
    const interval = setInterval(() => {
      timerValue += 0.01;
      setTimer(timerValue);
    }, 10);
    return interval;
  };

  async function chatRequest(prompt: string) {
    const userMessage: Message = {
      content:
        prompt.trim().length === 0
          ? "You sent an empty message. You can do this while using the debug model."
          : prompt,
      sender: "You",
      id: chatHistory.length,
    };

    const [newChatHistory, newMemoryHistory] = saveMessage(
      userMessage,
      null,
      shouldShowMemory && memory === MEMORY.Remember
    );
    setCurrentInput("");
    setIsLoading(true);
    scrollToBottom();

    const finalPrompt = getFinalPrompt(prompt);
    const body = getRequestBody(finalPrompt);

    prettyLog(`Asking the backend to call API model ${model}.`);

    if (SHOULD_SHOW_ALL_LOGS) {
      console.log("This message got sent to the backend:");
      console.log(finalPrompt);
    }

    let data = null;
    let response = null;

    const handleError = (errorMessage: string, newChatHistory?: Message[]) => {
      const errorChatMessage: Message = {
        content:
          errorMessage + "\n\nThere is likely more information in the console.",
        sender: "Error",
        id: newChatHistory.length,
      };

      saveMessage(errorChatMessage, newChatHistory);
    };

    const interval = startTimer();
    try {
      response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });

      data =
        selectedModelType === MODEL_TYPE.Audio
          ? await response.arrayBuffer()
          : await response.json();
    } catch (error) {
      console.error(error);
      console.log(
        "Back-end response (check the NodeJS console output for a more detailed response): ",
        response
      );

      handleError(error?.message || "An error occurred", newChatHistory);

      setIsLoading(false);
      return;
    } finally {
      clearInterval(interval);
    }

    setIsLoading(false);

    prettyLog("Response from the backend:");
    console.log(data);
    if (SHOULD_SHOW_ALL_LOGS) {
      subtleLog("See the full response from the API in the NodeJS console.");
    }

    if (response.status !== STATUS_CODE.Ok) {
      handleError(
        data.error?.message ||
          new Error(`Request failed with status ${response.status}`),
        newChatHistory
      );
    } else {
      const timeToGenerate = `in ${timerValue.toFixed(2)}s`;
      if (selectedModelType === MODEL_TYPE.Text) {
        const formattedContext =
          currentlySelectedContext.title !== DEFAULT_CONTEXT.title
            ? ` (as ${currentlySelectedContext.title} ${timeToGenerate})`
            : ` (${timeToGenerate})`;
        const sender = model + formattedContext;

        const apiMessage: Message = {
          content: data.result,
          sender: sender,
          id: newChatHistory.length,
        };

        saveMessage(
          apiMessage,
          newChatHistory,
          memory === MEMORY.Remember,
          newMemoryHistory
        );
      } else if (selectedModelType === MODEL_TYPE.Image) {
        const imageUrls = data.result;
        const apiMessage: Message = {
          imageUrls: imageUrls,
          sender:
            model.charAt(0).toUpperCase() +
            model.slice(1) +
            ` (${timeToGenerate})`,
          id: newChatHistory.length,
        };

        saveMessage(apiMessage, newChatHistory);
      } else if (selectedModelType === MODEL_TYPE.Video) {
        const apiMessage: Message = {
          videoUrl: data.result,
          sender:
            model.charAt(0).toUpperCase() +
            model.slice(1) +
            ` (${timeToGenerate})`,
          id: newChatHistory.length,
        };

        saveMessage(apiMessage, newChatHistory);
      } else if (selectedModelType === MODEL_TYPE.Audio) {
        const audioBlob = new Blob([data], { type: "audio/mpeg" });
        const audioUrl = URL.createObjectURL(audioBlob);
        const apiMessage: Message = {
          audioUrl: audioUrl,
          sender:
            model.charAt(0).toUpperCase() +
            model.slice(1) +
            ` (${timeToGenerate})`,
          id: newChatHistory.length,
        };

        saveMessage(apiMessage, newChatHistory);
      }
    }

    scrollToBottom();
  }

  async function editorRequest(prompt: string) {
    setIsLoading(true);

    const finalPrompt = getFinalPrompt(prompt);

    const body = JSON.stringify({
      message: finalPrompt,
      temperature: technicalTemperature,
      model: model,
    });

    prettyLog(`Asking the backend to call API model ${model}.`);

    if (SHOULD_SHOW_ALL_LOGS) {
      console.log("This message got sent to the backend:");
      console.log(finalPrompt);
    }

    let data = null;
    let response = null;

    const handleError = (errorMessage: string) => {
      // Show as UI element?
      console.error(errorMessage);
    };

    const interval = startTimer();
    try {
      response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });

      data = await response.json();
    } catch (error) {
      console.error(error);
      console.log(
        "Back-end response (check the NodeJS console output for a more detailed response): ",
        response
      );

      handleError(error?.message || "An error occurred");

      setIsLoading(false);
      return;
    } finally {
      clearInterval(interval);
    }

    setIsLoading(false);

    prettyLog("Response from the backend:");
    console.log(data);
    if (SHOULD_SHOW_ALL_LOGS) {
      subtleLog("See the full response from the API in the NodeJS console.");
    }

    if (response.status !== STATUS_CODE.Ok) {
      handleError(
        data.error?.message ||
          new Error(`Request failed with status ${response.status}`)
      );
    } else {
      const isTheLastCharacterASpace = currentEditorText.slice(-1) === " ";
      setCurrentEditorText(
        currentEditorText +
          (isTheLastCharacterASpace ? "" : " ") +
          data.result.trim()
      );
    }

    scrollToBottom();
  }

  async function onSubmit(customPrompt?: string) {
    const prompt =
      customPrompt ||
      (inputMode === INPUT_MODE.Chat ? currentInput : currentEditorText);

    if (prompt.trim().length === 0 && model !== MODEL.Debug) {
      return;
    }

    if (inputMode === INPUT_MODE.Chat) {
      chatRequest(prompt);
    } else if (inputMode === INPUT_MODE.Editor) {
      editorRequest(prompt);
    }
  }

  const handleKeyPress = (event) => {
    const isChatModeAndPressedEnterWithoutHoldingShift =
      inputMode === INPUT_MODE.Chat && !event.shiftKey && event.key === "Enter";
    const isEditorModeAndPressedEControlEnter =
      inputMode === INPUT_MODE.Editor &&
      (event.ctrlKey || event.metaKey) &&
      event.key === "Enter";

    if (
      isChatModeAndPressedEnterWithoutHoldingShift ||
      isEditorModeAndPressedEControlEnter
    ) {
      event.preventDefault();
      if (!isLoading) {
        onSubmit();
      }
    }
  };

  const handleModelChange = (event) => {
    event.preventDefault();
    setModel(event.target.value);
  };

  const handleMemoryChange = (event) => {
    event.preventDefault();
    setMemory(event.target.value);
  };

  const handleTemperatureChange = (event) => {
    event.preventDefault();
    setTemperature(event.target.value);
    // The minimum value is 0, and the maximum is 2
    setTechnicalTemperature(event.target.value / 50);
  };

  const handleTopPChange = (event) => {
    event.preventDefault();
    setTopP(event.target.value);
    // The minimum value is 0, and the maximum is 2
    setTechnicalTopP(event.target.value / 50);
  };

  const handleFrequencyPenaltyChange = (event) => {
    event.preventDefault();
    setFrequencyPenalty(event.target.value);
    // The minimum value is -2, and the maximum is 2
    setTechnicalFrequencyPenalty(event.target.value / 25 - 2);
  };

  const handlePresencePenaltyChange = (event) => {
    event.preventDefault();
    setPresencePenalty(event.target.value);
    // The minimum value is -2, and the maximum is 2
    setTechnicalPresencePenalty(event.target.value / 25 - 2);
  };

  const handleVoiceStabilityChange = (event) => {
    event.preventDefault();
    setVoiceStability(event.target.value);
    // The minimum value is 0, and the maximum is 1
    setTechnicalVoiceStability(event.target.value / 100);
  };

  const handleVoiceSimilarityBoostChange = (event) => {
    event.preventDefault();
    setVoiceSimilarityBoost(event.target.value);
    // The minimum value is 0, and the maximum is 1
    setTechnicalVoiceSimilarityBoost(event.target.value / 100);
  };

  const handleClearMemory = () => setMessagesInMemory([]);
  const handleClearEditorText = () => {
    setCurrentEditorText(RESET);
  };
  const handleClearChat = () => {
    setChatHistory(RESET);
    setMessagesInMemory(RESET);
  };
  const handleResetSettings = () => {
    setTemperature(RESET);
    setTechnicalTemperature(RESET);
    setModel(RESET);
    setMemory(RESET);
    setCurrentlySelectedContext(RESET);
    setMessagesInMemory(RESET);
    setIsLoading(RESET);
    setNumberOfImagesToGenerate(RESET);
    setImageSize(RESET);
    setRequestedNumberOfTokens(RESET);
    setMaxNumberOfTokens(RESET);
    setInputMode(RESET);
    setTextAreaStyle(RESET);
    setTopP(RESET);
    setTechnicalTopP(RESET);
    setPresencePenalty(RESET);
    setTechnicalPresencePenalty(RESET);
    setFrequencyPenalty(RESET);
    setTechnicalFrequencyPenalty(RESET);
    setIsTemperatureDefault(true);
    setIsTopPDefault(true);
    setIsFrequencyPenaltyDefault(true);
    setIsPresencePenaltyDefault(true);
  };
  const handleElaborate = () =>
    onSubmit(
      "Please elaborate on your previous message. Explain in greater detail what you just wrote."
    );
  const handleContinue = () => onSubmit("Please continue on your last post.");
  const handleRepeatLastMessage = () =>
    onSubmit(getLatestMessageByUser(chatHistory).content);

  // This logic exists due to the hydration mismatch caused by Jotai's functions for saving to local storage
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleAutoMessage = useCallback(
    (prompt: string) => {
      onSubmit(prompt);
    },
    [onSubmit]
  );

  // This if-statement exists because of the state management used in Jotai.
  // One would normally avoid doing this, but because this project is only used locally
  // by developers, it doesn't really matter. The issue is related to how SSR affects hydration,
  // given that state is stored in localStorage.
  if (!hasMounted) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Limopola</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      {inputMode === INPUT_MODE.Chat && (
        <div className={styles.pageTopColor}></div>
      )}
      <div className={styles.modeSelectionContainer}>
        <div className={styles.modeSelectionContainerInner}>
          <Button
            value="Chat"
            isSelected={inputMode === INPUT_MODE.Chat}
            onClick={() => {
              setInputMode(INPUT_MODE.Chat);
              // Show and hide instead of mounting and unmounting to retain scroll position?
              // setTimeout(() => scrollToBottom(), 0);
            }}
          />
          <Button
            value="Editor"
            isSelected={inputMode === INPUT_MODE.Editor}
            onClick={() => {
              setInputMode(INPUT_MODE.Editor);
              if (getModelType(model) !== MODEL_TYPE.Text) {
                setModel(MODEL.Debug);
              }
            }}
          />
        </div>
      </div>

      <main
        className={`${styles.conversationContainer} ${
          inputMode === INPUT_MODE.Chat
            ? styles.chatContainer
            : styles.editorContainer
        }`}
      >
        {inputMode === INPUT_MODE.Chat && (
          <ChatHistory
            messages={chatHistory}
            isLoading={isLoading}
            chatRef={chatRef}
            scrollAnchorRef={scrollAnchorRef}
            handleAutoMessage={handleAutoMessage}
            model={model}
            timer={timer}
          />
        )}
        <div
          className={`${styles.textAreaContainer}${
            textAreaStyle === TEXTAREA_STYLE.Code &&
            inputMode === INPUT_MODE.Editor
              ? " " + styles.textAreaCode
              : ""
          }${isContextModalOpen ? " " + styles.hidden : ""}`}
        >
          {/* Should probably just render two different textareas for each mode now */}
          <textarea
            rows={4}
            name="message"
            placeholder={
              inputMode === INPUT_MODE.Chat
                ? "Press T or enter to focus. Hold shift and press enter to add a new line. Press enter to send."
                : "Press T or enter to focus. Hold CTRL / CMD and press enter to ask the AI to continue from the bottom of your text."
            }
            value={
              inputMode === INPUT_MODE.Chat ? currentInput : currentEditorText
            }
            onChange={(e) =>
              inputMode === INPUT_MODE.Chat
                ? setCurrentInput(e.target.value)
                : setCurrentEditorText(e.target.value)
            }
            onKeyDown={handleKeyPress}
            ref={textareaRef}
            disabled={
              (inputMode === INPUT_MODE.Editor && isLoading) ||
              isContextModalOpen
            }
            spellCheck={
              textAreaStyle !== TEXTAREA_STYLE.Code &&
              inputMode === INPUT_MODE.Editor
            }
          />
          {inputMode === INPUT_MODE.Editor && (
            <TextAreaStyleSelector
              textAreaStyle={textAreaStyle}
              setTextAreaStyle={setTextAreaStyle}
            />
          )}
          <Spinner
            show={inputMode === INPUT_MODE.Editor && isLoading}
            model={model}
            classNames={styles.editorSpinner}
            timer={timer}
          />
        </div>
        {!isContextModalOpen && <div className={styles.pageBottomColor}></div>}
      </main>

      <div className={`${styles.sidebar} ${styles.leftSidebar}`}>
        <div className={styles.section}>
          <AllTextModels model={model} handleModelChange={handleModelChange} />
        </div>
        {inputMode === INPUT_MODE.Chat && (
          <>
            <div className={styles.section}>
              <AllImageModels
                model={model}
                handleModelChange={handleModelChange}
              />
            </div>
            <div className={styles.section}>
              <AllVideoModels
                model={model}
                handleModelChange={handleModelChange}
              />
            </div>
            <div className={styles.section}>
              <AllAudioModels
                model={model}
                handleModelChange={handleModelChange}
              />
            </div>
          </>
        )}
        <div className={styles.section}>
          <h3>Options</h3>
          <Button
            value={
              getUserOperatingSystem() === OperatingSystem.Mac
                ? "Download (CMD + S)"
                : "Download (CTRL + S)"
            }
            onClick={() =>
              downloadConversation(inputMode, chatHistory, currentEditorText)
            }
          />
          {inputMode === INPUT_MODE.Chat && (
            <Button value="Clear chat history" onClick={handleClearChat} />
          )}
          {inputMode === INPUT_MODE.Editor && (
            <Button value="Clear text" onClick={handleClearEditorText} />
          )}
          <Button value="Reset settings" onClick={handleResetSettings} />
          {inputMode === INPUT_MODE.Chat && (
            <Button value="Scroll to bottom" onClick={scrollToBottom} />
          )}
        </div>
        <div className={styles.spacing}></div>
      </div>

      <div className={`${styles.sidebar} ${styles.rightSidebar}`}>
        <div className={styles.section}>
          <ModelInformation model={model} />
        </div>
        {shouldShowMemory && (
          <div className={styles.section}>
            <Memory
              memory={memory}
              handleMemoryChange={handleMemoryChange}
              messagesInMemory={messagesInMemory}
              handleClearMemory={handleClearMemory}
            />
          </div>
        )}
        {shouldShowInstantMessages && (
          <div className={styles.section}>
            <InstantMessages
              handleElaborate={handleElaborate}
              handleRepeatLastMessage={handleRepeatLastMessage}
              handleContinue={handleContinue}
            />
          </div>
        )}
        {shouldShowTemperature && (
          <div className={styles.section}>
            <Temperature
              temperature={temperature}
              technicalTemperature={technicalTemperature}
              handleTemperatureChange={handleTemperatureChange}
              isUsingDefault={isTemperatureDefault}
              handleCheckboxChange={() =>
                setIsTemperatureDefault(!isTemperatureDefault)
              }
            />
          </div>
        )}
        {shouldShowTopP && (
          <div className={styles.section}>
            <TopP
              topP={topP}
              technicalTopP={technicalTopP}
              handleTopPChange={handleTopPChange}
              isUsingDefault={isTopPDefault}
              handleCheckboxChange={() => setIsTopPDefault(!isTopPDefault)}
            />
          </div>
        )}
        {shouldShowFrequencyPenalty && (
          <div className={styles.section}>
            <FrequencyPenalty
              frequencyPenalty={frequencyPenalty}
              technicalFrequencyPenalty={technicalFrequencyPenalty}
              handleFrequencyPenaltyChange={handleFrequencyPenaltyChange}
              isUsingDefault={isFrequencyPenaltyDefault}
              handleCheckboxChange={() =>
                setIsFrequencyPenaltyDefault(!isFrequencyPenaltyDefault)
              }
            />
          </div>
        )}
        {shouldShowPresencePenalty && (
          <div className={styles.section}>
            <PresencePenalty
              presencePenalty={presencePenalty}
              technicalPresencePenalty={technicalPresencePenalty}
              handlePresencePenaltyChange={handlePresencePenaltyChange}
              isUsingDefault={isPresencePenaltyDefault}
              handleCheckboxChange={() =>
                setIsPresencePenaltyDefault(!isPresencePenaltyDefault)
              }
            />
          </div>
        )}
        {shouldShowRequestedNumberOfTokens && (
          <div className={styles.section}>
            <RequestedNumberOfTokens
              requestedNumberOfTokens={requestedNumberOfTokens}
              setRequestedNumberOfTokens={setRequestedNumberOfTokens}
            />
          </div>
        )}
        {shouldShowMaxNumberOfTokens && (
          <div className={styles.section}>
            <MaxNumberOfTokens
              maxNumberOfTokens={maxNumberOfTokens}
              setMaxNumberOfTokens={setMaxNumberOfTokens}
            />
          </div>
        )}
        {shouldShowNumberOfImages && (
          <div className={styles.section}>
            <NumberOfImages
              numberOfImagesToGenerate={numberOfImagesToGenerate}
              setNumberOfImagesToGenerate={setNumberOfImagesToGenerate}
            />
          </div>
        )}
        {shouldShowImageSize && (
          <div className={styles.section}>
            <ImageSize imageSize={imageSize} setImageSize={setImageSize} />
          </div>
        )}
        {shouldShowVoiceSettings && (
          <>
            <div className={styles.section}>
              <VoiceStability
                voiceStability={voiceStability}
                technicalVoiceStability={technicalVoiceStability}
                handleVoiceStabilityChange={handleVoiceStabilityChange}
              />
            </div>
            <div className={styles.section}>
              <VoiceSimilarityBoost
                voiceSimilarityBoost={voiceSimilarityBoost}
                technicalVoiceSimilarityBoost={technicalVoiceSimilarityBoost}
                handleVoiceSimilarityBoostChange={
                  handleVoiceSimilarityBoostChange
                }
              />
            </div>
          </>
        )}
        {shouldShowContexts && (
          <div className={styles.section}>
            <AllContexts />
          </div>
        )}
        <div className={styles.spacing}></div>
      </div>
    </>
  );
}
