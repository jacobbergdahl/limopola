import Head from "next/head";
import { useRef, useEffect, useState, useCallback } from "react";
import {
  ALL_ANTHROPIC_MODELS,
  ALL_MODELS_THROUGH_REPLICATE,
  ALL_LOCAL_MODELS,
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
  ALL_IMAGE_ASPECT_RATIOS,
  ALL_FLUX_MODES,
  ALL_FLUX_MODELS,
} from "../general/constants";
import {
  downloadConversation,
  getCtrlKey,
  getEditorPrompt,
  getLatestMessageByUser,
  postProcessEditorResponse,
  removeOverlap,
} from "../general/helpers";
import styles from "./index.module.css";
import {
  chatHistoryAtom,
  chatInputAtom,
  currentlySelectedContextAtom,
  editorTextAtom,
  fluxModeAtom,
  frequencyPenaltyAtom,
  imageAspectRatioAtom,
  imageSizeDallE2Atom,
  imageSizeDallE3Atom,
  inputModeAtom,
  isContextModalOpenAtom,
  isFrequencyPenaltyDefaultAtom,
  isGivingAiSearchAccessAtom,
  isLoadingAtom,
  isPresencePenaltyDefaultAtom,
  isTemperatureDefaultAtom,
  isTopPDefaultAtom,
  isUsingSimilaritySearchAtom,
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
  urlsToScrapeAtom,
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
import { ImageSizeDallE2 } from "../components/sections/ImageSizeDallE2";
import { VoiceStability } from "../components/sections/VoiceStability";
import { VoiceSimilarityBoost } from "../components/sections/VoiceSimilarityBoost";
import { AllContexts } from "../components/sections/AllContexts";
import { TopP } from "../components/sections/TopP";
import { FrequencyPenalty } from "../components/sections/FrequencyPenalty";
import { PresencePenalty } from "../components/sections/PresencePenalty";
import { MaxNumberOfTokens } from "../components/sections/MaxNumberOfTokens";
import TextArea from "../components/TextArea";
import { AgentOverview } from "../components/agents/AgentOverview";
import { ImageSizeDallE3 } from "../components/sections/ImageSizeDallE3";
import { UrlsToScrape } from "../components/sections/UrlsToScrape";
import { SimilaritySearch } from "../components/sections/SimilaritySearch";
import { SearchAccess } from "../components/sections/SearchAccess";
import {
  UiControlsChatOptions,
  UiControlsTheming,
} from "@/components/UiControls";
import { HideableUI } from "@/components/HideableUi";
import { ReasoningOverview } from "@/components/reasoning/ReasoningOverview";
import { GenericSectionChoiceContainer } from "@/components/sections/GenericSectionChoiceContainer";

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
  const [imageSizeDallE2, setImageSizeDallE2] = useAtom(imageSizeDallE2Atom);
  const [imageSizeDallE3, setImageSizeDallE3] = useAtom(imageSizeDallE3Atom);
  const [imageAspectRatio, setImageAspectRatio] = useAtom(imageAspectRatioAtom);
  const [fluxMode, setFluxMode] = useAtom(fluxModeAtom);
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
  const [urlsToScrape, setUrlsToScrape] = useAtom(urlsToScrapeAtom);
  const [isUsingSimilaritySearch, setIsUsingSimilaritySearch] = useAtom(
    isUsingSimilaritySearchAtom
  );
  const [isGivingAiSearchAccess, setIsGivingAiSearchAccess] = useAtom(
    isGivingAiSearchAccessAtom
  );
  const [timer, setTimer] = useState<number>(-1);
  const scrollAnchorRef = useRef(null);
  const chatRef = useRef(null);
  const textareaRef = useRef(null);

  const isFactChecking = model === MODEL.FactChecker;
  const isUsingWebRetriever = model === MODEL.WebRetriever;
  const isUsingDataReader =
    model === MODEL.GptDataReader || model === MODEL.ClaudeDataReader;
  const isUsingCustomTextGeneratingWrapper =
    isFactChecking ||
    isUsingWebRetriever ||
    isUsingDataReader ||
    model === MODEL.ClaudeCitations;
  const shouldShowUrlsToScrape = isUsingWebRetriever;
  const shouldShowTemperature =
    selectedModelType === MODEL_TYPE.Text &&
    (ALL_MODELS_THROUGH_REPLICATE.includes(model) ||
      ALL_OPEN_AI_MODELS.includes(model) ||
      ALL_ANTHROPIC_MODELS.includes(model) ||
      model === MODEL.PalmChatBison001 ||
      model === MODEL.PalmTextBison001 ||
      model === MODEL.LocalLlm ||
      model === MODEL.LocalOllama ||
      model === MODEL.Azure ||
      model === MODEL.OpenAiCompatibleApi) &&
    !isUsingCustomTextGeneratingWrapper;
  const shouldShowTopP =
    selectedModelType === MODEL_TYPE.Text &&
    model !== MODEL.LocalLlm &&
    (ALL_MODELS_THROUGH_REPLICATE.includes(model) ||
      ALL_OPEN_AI_MODELS.includes(model) ||
      ALL_ANTHROPIC_MODELS.includes(model) ||
      model === MODEL.LocalOllama ||
      model === MODEL.Azure ||
      model === MODEL.OpenAiCompatibleApi) &&
    !isUsingCustomTextGeneratingWrapper;
  const shouldShowFrequencyPenalty =
    selectedModelType === MODEL_TYPE.Text &&
    (ALL_OPEN_AI_MODELS.includes(model) ||
      model === MODEL.Azure ||
      model === MODEL.OpenAiCompatibleApi) &&
    !isUsingCustomTextGeneratingWrapper;
  const shouldShowPresencePenalty =
    selectedModelType === MODEL_TYPE.Text &&
    (ALL_OPEN_AI_MODELS.includes(model) ||
      model === MODEL.Azure ||
      model === MODEL.OpenAiCompatibleApi) &&
    !isUsingCustomTextGeneratingWrapper;
  const shouldShowVoiceSettings = selectedModelType === MODEL_TYPE.Audio;
  const shouldShowRequestedNumberOfTokens = false;
  const shouldShowMaxNumberOfTokens =
    (ALL_OPEN_AI_MODELS.includes(model) &&
      selectedModelType === MODEL_TYPE.Text) ||
    ALL_ANTHROPIC_MODELS.includes(model) ||
    model === MODEL.TransformersText2Text ||
    model === MODEL.LocalLlm ||
    model === MODEL.OpenAiCompatibleApi;
  const shouldShowMemory =
    selectedModelType === MODEL_TYPE.Text &&
    inputMode === INPUT_MODE.Chat &&
    !isUsingCustomTextGeneratingWrapper;
  const shouldShowInstantMessages =
    inputMode === INPUT_MODE.Chat && !isFactChecking;
  const shouldShowContexts =
    inputMode === INPUT_MODE.Chat &&
    !isFactChecking &&
    model !== MODEL.TransformersSentimentAnalysis &&
    model !== MODEL.TransformersText2Text &&
    selectedModelType !== MODEL_TYPE.Audio &&
    selectedModelType !== MODEL_TYPE.Image;
  const shouldShowNumberOfImages =
    selectedModelType === MODEL_TYPE.Image &&
    (model === MODEL.Dalle2 || model === MODEL.FluxSchnell);
  const shouldShowImageSizeDallE2 = model === MODEL.Dalle2;
  const shouldShowImageSizeDallE3 = model === MODEL.Dalle3;
  const shouldShowImageAspectRatio = ALL_FLUX_MODELS.includes(model);
  const shouldShowFluxMode = model === MODEL.Flux11ProUltra;
  const shouldShowSimilaritySearch = model === MODEL.WebRetriever;
  const shouldShowAiSearchAccess =
    selectedModelType === MODEL_TYPE.Text &&
    inputMode === INPUT_MODE.Chat &&
    model !== MODEL.TransformersSentimentAnalysis &&
    !isUsingCustomTextGeneratingWrapper;

  useEffect(() => {
    const handleKeyDown = (event) => {
      const isNotFocusingOnTextArea =
        document.activeElement !== textareaRef?.current;

      const shouldHandleKeyDown =
        !isContextModalOpen &&
        inputMode !== INPUT_MODE.Agent &&
        inputMode !== INPUT_MODE.Reasoning;

      if (!shouldHandleKeyDown) {
        return;
      }

      if (
        isNotFocusingOnTextArea &&
        (event.key === "t" || event.key === "Enter")
      ) {
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

    const modelNameOrEmpty = !ALL_LOCAL_MODELS.includes(model)
      ? `${model}:`
      : "";

    return `${finalMessage.join(
      ""
    )}User: ${currentInput}\n\n${modelNameOrEmpty}`;
  };

  const getFinalPrompt = (prompt: string) => {
    const contextWithPrompt =
      !!currentlySelectedContext.content &&
      currentlySelectedContext.content.length > 0
        ? `BEGINSTATICCONTEXT
          ${currentlySelectedContext.content}
          ENDSTATICCONTEXT
          ${prompt}
        `
        : prompt;

    if (
      selectedModelType === MODEL_TYPE.Text &&
      inputMode === INPUT_MODE.Chat
    ) {
      return generateMessageWithHistory(contextWithPrompt);
    } else if (
      selectedModelType === MODEL_TYPE.Text &&
      inputMode === INPUT_MODE.Editor
    ) {
      return getEditorPrompt(prompt);
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
        urlsToScrape: urlsToScrape,
        isUsingSimilaritySearch: isUsingSimilaritySearch,
        isGivingAiSearchAccess:
          model !== MODEL.TransformersSentimentAnalysis
            ? isGivingAiSearchAccess
            : false,
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
      imageSize: model === MODEL.Dalle2 ? imageSizeDallE2 : imageSizeDallE3,
      model: model,
      aspectRatio: imageAspectRatio,
      fluxMode: fluxMode,
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
          data.error ||
          new Error(`Request failed with status ${response.status}`),
        newChatHistory
      );
    } else {
      const timeToGenerate = `in ${timerValue.toFixed(2)}s`;
      if (selectedModelType === MODEL_TYPE.Text) {
        const formattedContext =
          currentlySelectedContext.title !== DEFAULT_CONTEXT.title
            ? ` (with context ${currentlySelectedContext.title} ${timeToGenerate})`
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
        const result: string | string[] = data.result;
        let imageUrls: string[] = [];
        if (Array.isArray(result)) {
          imageUrls = result;
        } else {
          imageUrls = [result];
        }
        const apiMessage: Message = {
          imageUrls: imageUrls,
          sender: model + ` (${timeToGenerate})`,
          id: newChatHistory.length,
        };

        saveMessage(apiMessage, newChatHistory);
      } else if (selectedModelType === MODEL_TYPE.Video) {
        const apiMessage: Message = {
          videoUrl: data.result,
          sender: model + ` (${timeToGenerate})`,
          id: newChatHistory.length,
        };

        saveMessage(apiMessage, newChatHistory);
      } else if (selectedModelType === MODEL_TYPE.Audio) {
        const audioBlob = new Blob([data], { type: "audio/mpeg" });
        const audioUrl = URL.createObjectURL(audioBlob);
        const apiMessage: Message = {
          audioUrl: audioUrl,
          sender: model + ` (${timeToGenerate})`,
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
      const postProcessedAiResponse = postProcessEditorResponse(data.result);

      const textWithoutOverlap = removeOverlap(
        currentEditorText,
        postProcessedAiResponse
      );

      setCurrentEditorText(textWithoutOverlap.trim());
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

  // make separate for each textarea?
  const handleTextareaKeyPress = (event) => {
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
    // The minimum value is 0, and the maximum is 1
    setTechnicalTopP(event.target.value / 100);
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
    setImageSizeDallE2(RESET);
    setImageSizeDallE3(RESET);
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
    setIsGivingAiSearchAccess(false);
  };
  const handleOneWordMessage = () =>
    onSubmit("Please respond in just one word.");
  const handleRepeatLastMessage = () => {
    const latestMessageByUser = getLatestMessageByUser(chatHistory);
    if (latestMessageByUser) {
      onSubmit(latestMessageByUser.content);
    }
  };

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
          <Button
            value="Agent"
            isSelected={inputMode === INPUT_MODE.Agent}
            onClick={() => {
              setInputMode(INPUT_MODE.Agent);
            }}
          />
          <Button
            value="Reasoning"
            isSelected={inputMode === INPUT_MODE.Reasoning}
            onClick={() => {
              setInputMode(INPUT_MODE.Reasoning);
            }}
          />
        </div>
      </div>
      {inputMode === INPUT_MODE.Agent && (
        <main className={`${styles.conversationContainer}`}>
          <AgentOverview />
        </main>
      )}
      {inputMode === INPUT_MODE.Reasoning && (
        <main className={`${styles.conversationContainer}`}>
          <ReasoningOverview />
        </main>
      )}
      {(inputMode === INPUT_MODE.Chat || inputMode === INPUT_MODE.Editor) && (
        <>
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
              <TextArea
                rows={4}
                name="message"
                placeholder={
                  inputMode === INPUT_MODE.Chat
                    ? "Press T or enter to focus. Hold shift and press enter to add a new line. Press enter to send."
                    : `Press T or enter to focus. Hold ${getCtrlKey()} and press enter to ask the AI to continue from the bottom of your text.`
                }
                value={
                  inputMode === INPUT_MODE.Chat
                    ? currentInput
                    : currentEditorText
                }
                handleChange={(e) =>
                  inputMode === INPUT_MODE.Chat
                    ? setCurrentInput(e.target.value)
                    : setCurrentEditorText(e.target.value)
                }
                handleKeyDown={handleTextareaKeyPress}
                ref={textareaRef}
                disabled={
                  (inputMode === INPUT_MODE.Editor && isLoading) ||
                  isContextModalOpen
                }
                shouldSpellCheck={
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
            {!isContextModalOpen && inputMode !== INPUT_MODE.Editor && (
              <div className={styles.pageBottomColor}></div>
            )}
          </main>

          <HideableUI className={`${styles.sidebar} ${styles.leftSidebar}`}>
            <UiControlsChatOptions
              handleDownload={() =>
                downloadConversation(inputMode, chatHistory, currentEditorText)
              }
              handleScrollToBottom={scrollToBottom}
            />
            <div className={styles.section}>
              <AllTextModels
                model={model}
                handleModelChange={handleModelChange}
              />
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
                value={`Download (${getCtrlKey()} + S)`}
                onClick={() =>
                  downloadConversation(
                    inputMode,
                    chatHistory,
                    currentEditorText
                  )
                }
              />
              {inputMode === INPUT_MODE.Chat && (
                <Button
                  value="Clear chat history"
                  onClick={handleClearChat}
                  shouldAskForConfirmation={true}
                />
              )}
              {inputMode === INPUT_MODE.Editor && (
                <Button value="Clear text" onClick={handleClearEditorText} />
              )}
              <Button
                value="Reset settings"
                onClick={handleResetSettings}
                shouldAskForConfirmation={true}
              />
              {inputMode === INPUT_MODE.Chat && (
                <Button value="Scroll to bottom" onClick={scrollToBottom} />
              )}
            </div>
            <div className={styles.spacing}></div>
          </HideableUI>

          <div className={`${styles.sidebar} ${styles.rightSidebar}`}>
            <UiControlsTheming />
            <HideableUI>
              <div className={styles.section}>
                <ModelInformation model={model} />
              </div>
              {shouldShowUrlsToScrape && (
                <UrlsToScrape
                  urlsToScrape={urlsToScrape}
                  setUrlsToScrape={setUrlsToScrape}
                />
              )}
              {shouldShowSimilaritySearch && (
                <SimilaritySearch
                  isUsingSimilaritySearch={isUsingSimilaritySearch}
                  setIsUsingSimilaritySearch={() =>
                    setIsUsingSimilaritySearch(!isUsingSimilaritySearch)
                  }
                />
              )}
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
                    handleOneWordMessage={handleOneWordMessage}
                    handleRepeatLastMessage={handleRepeatLastMessage}
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
                    handleCheckboxChange={() =>
                      setIsTopPDefault(!isTopPDefault)
                    }
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
              {shouldShowAiSearchAccess && (
                <SearchAccess
                  isGivingAiSearchAccess={isGivingAiSearchAccess}
                  setIsGivingAiSearchAccess={() =>
                    setIsGivingAiSearchAccess(!isGivingAiSearchAccess)
                  }
                />
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
              {shouldShowImageSizeDallE2 && (
                <div className={styles.section}>
                  <ImageSizeDallE2
                    imageSize={imageSizeDallE2}
                    setImageSize={setImageSizeDallE2}
                  />
                </div>
              )}
              {shouldShowImageSizeDallE3 && (
                <div className={styles.section}>
                  <ImageSizeDallE3
                    imageSize={imageSizeDallE3}
                    setImageSize={setImageSizeDallE3}
                  />
                </div>
              )}
              {shouldShowFluxMode && (
                <div className={styles.section}>
                  <GenericSectionChoiceContainer
                    title="Mode"
                    selectedButton={fluxMode}
                    buttonTexts={ALL_FLUX_MODES}
                    handleButtonClick={setFluxMode}
                  />
                </div>
              )}
              {shouldShowImageAspectRatio && (
                <div className={styles.section}>
                  <GenericSectionChoiceContainer
                    title="Image aspect ratio"
                    selectedButton={imageAspectRatio}
                    buttonTexts={ALL_IMAGE_ASPECT_RATIOS}
                    handleButtonClick={setImageAspectRatio}
                  />
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
                      technicalVoiceSimilarityBoost={
                        technicalVoiceSimilarityBoost
                      }
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
            </HideableUI>
            <div className={styles.spacing}></div>
          </div>
        </>
      )}
    </>
  );
}
