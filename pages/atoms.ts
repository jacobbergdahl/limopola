import { atomWithStorage } from "jotai/utils";
import {
  AgentTask,
  Context,
  DEFAULT_CONTEXT,
  DEFAULT_FREQUENCY_PENALTY,
  DEFAULT_PRESENCE_PENALTY,
  DEFAULT_TECHNICAL_FREQUENCY_PENALTY,
  DEFAULT_TECHNICAL_PRESENCE_PENALTY,
  DEFAULT_TECHNICAL_TEMPERATURE,
  DEFAULT_TECHNICAL_TOP_P,
  DEFAULT_TECHNICAL_VOICE_SIMILARITY_BOOST,
  DEFAULT_TECHNICAL_VOICE_STABILITY,
  DEFAULT_TEMPERATURE,
  DEFAULT_TOP_P,
  DEFAULT_VOICE_SIMILARITY_BOOST,
  DEFAULT_VOICE_STABILITY,
  IMAGE_SIZE_DALL_E_2,
  IMAGE_SIZE_DALL_E_3,
  INPUT_MODE,
  IS_DEBUGGING,
  MEMORY,
  MODEL,
  Message,
  REASONING_ONLINE_SEARCH,
  TEXTAREA_STYLE,
  THEME,
  getDefaultModel,
} from "../general/constants";
import { createPlaceHolderChatHistory } from "../general/helpers";
import { atom } from "jotai";

export const modelAtom = atomWithStorage("MODEL", getDefaultModel());
export const chatInputAtom = atomWithStorage("CHAT_INPUT", "");
export const editorTextAtom = atomWithStorage("EDITOR_TEXT", "");
export const temperatureAtom = atomWithStorage(
  "TEMPERATURE",
  DEFAULT_TEMPERATURE
);
export const technicalTemperatureAtom = atomWithStorage(
  "TECHNICAL_TEMPERATURE",
  DEFAULT_TECHNICAL_TEMPERATURE
);
export const memoryAtom = atomWithStorage("MEMORY", MEMORY.Remember);
export const chatHistoryAtom = atomWithStorage(
  "CHAT_HISTORY",
  (IS_DEBUGGING ? createPlaceHolderChatHistory(6) : []) as Message[]
);
export const messagesInMemoryAtom = atomWithStorage(
  "MESSAGES_MEMORY",
  [] as Message[]
);
export const isLoadingAtom = atomWithStorage("IS_LOADING", false);
export const numberOfImagesToGenerateAtom = atomWithStorage(
  "NUMBER_OF_IMAGES",
  1
);
export const imageSizeDallE2Atom = atomWithStorage(
  "IMAGE_SIZE",
  IMAGE_SIZE_DALL_E_2.Small
);
export const imageSizeDallE3Atom = atomWithStorage(
  "IMAGE_SIZE_DALL_E_3",
  IMAGE_SIZE_DALL_E_3.One
);
export const requestedNumberOfTokensAtom = atomWithStorage(
  "NUMBER_OF_TOKENS",
  0
);
export const maxNumberOfTokensAtom = atomWithStorage("MAX_NUMBER_OF_TOKENS", 0);
export const inputModeAtom = atomWithStorage("INPUT_MODE", INPUT_MODE.Chat);
export const textAreaStyleAtom = atomWithStorage(
  "TEXTAREA_STYLE",
  TEXTAREA_STYLE.Default
);
export const voiceSimilarityBoostAtom = atomWithStorage(
  "VOICE_SIMILARITY_BOOST",
  DEFAULT_VOICE_SIMILARITY_BOOST
);
export const technicalVoiceSimilarityBoostAtom = atomWithStorage(
  "TECHNICAL_VOICE_SIMILARITY_BOOST",
  DEFAULT_TECHNICAL_VOICE_SIMILARITY_BOOST
);

export const voiceStabilityAtom = atomWithStorage(
  "VOICE_STABILITY",
  DEFAULT_VOICE_STABILITY
);
export const technicalVoiceStabilityAtom = atomWithStorage(
  "TECHNICAL_VOICE_STABILITY",
  DEFAULT_TECHNICAL_VOICE_STABILITY
);
export const currentlySelectedContextAtom = atomWithStorage(
  "CURRENTLY_SELECTED_CONTEXT",
  DEFAULT_CONTEXT
);
export const isContextModalOpenAtom = atomWithStorage(
  "IS_CONTEXT_MODAL_OPEN",
  false
);
export const currentContextsAtom = atom([] as Context[]);
export const frequencyPenaltyAtom = atomWithStorage(
  "FREQUENCY_PENALTY",
  DEFAULT_FREQUENCY_PENALTY
);
export const technicalFrequencyPenaltyAtom = atomWithStorage(
  "TECHNICAL_FREQUENCY_PENALTY",
  DEFAULT_TECHNICAL_FREQUENCY_PENALTY
);
export const presencePenaltyAtom = atomWithStorage(
  "PRESENCE_PENALTY",
  DEFAULT_PRESENCE_PENALTY
);
export const technicalPresencePenaltyAtom = atomWithStorage(
  "TECHNICAL_PRESENCE_PENALTY",
  DEFAULT_TECHNICAL_PRESENCE_PENALTY
);
export const topPAtom = atomWithStorage("TOP_P", DEFAULT_TOP_P);
export const technicalTopPAtom = atomWithStorage(
  "TECHNICAL_TOP_P",
  DEFAULT_TECHNICAL_TOP_P
);
export const isTemperatureDefaultAtom = atomWithStorage(
  "IS_TEMPERATURE_DEFAULT",
  true
);
export const isTopPDefaultAtom = atomWithStorage("IS_TOP_P_DEFAULT", true);
export const isFrequencyPenaltyDefaultAtom = atomWithStorage(
  "IS_FREQUENCY_PENALTY_DEFAULT",
  true
);
export const isPresencePenaltyDefaultAtom = atomWithStorage(
  "IS_PRESENCE_PENALTY_DEFAULT",
  true
);
export const urlsToScrapeAtom = atomWithStorage("URLS_TO_SCRAPE", "");
export const isUsingSimilaritySearchAtom = atomWithStorage(
  "IS_USING_SIMILARITY_SEARCH",
  false
);
export const isGivingAiSearchAccessAtom = atomWithStorage(
  "IS_GIVING_AI_SEARCH_ACCESS",
  false
);
export const isHidingUiAtom = atomWithStorage("IS_HIDING_UI_ATOM", false);
export const themeAtom = atomWithStorage("THEME", THEME.Default);

/******************************************
 *
 *                AGENT
 *
 ******************************************/

export const agentMessagesAtom = atomWithStorage(
  "AGENT_MESSAGES",
  [] as Message[]
);
export const agentMissionAtom = atomWithStorage("AGENT_MISSION", "");
export const agentTasksAtom = atomWithStorage("AGENT_TASKS", [] as AgentTask[]);
export const agentContextsAtom = atomWithStorage(
  "AGENT_CONTEXTS",
  [] as string[]
);
export const agentCodeContextsAtom = atomWithStorage(
  "AGENT_CODE_CONTEXTS",
  [] as string[]
);
export const agentToNarrateAtom = atomWithStorage(
  "AGENT_TO_NARRATE",
  [] as string[]
);
export const agentImagePromptsAtom = atomWithStorage(
  "AGENT_IMAGE_PROMPTS",
  [] as string[]
);
export const agentVideoPromptsAtom = atomWithStorage(
  "AGENT_VIDEO_PROMPTS",
  [] as string[]
);
export const isAgentRunningAtom = atomWithStorage("AGENT_RUNNING", false);
export const wasAgentStoppedAtom = atomWithStorage("AGENT_STOPPED", false);

/******************************************
 *
 *                REASONING
 *
 ******************************************/

export const reasoningTextAtom = atomWithStorage("REASONING_TEXT", "");

export const reasoningAnswerModelAtom = atomWithStorage(
  "REASONING_ANSWER_MODEL",
  MODEL.Claude35Sonnet
);
export const reasoningFirstTakeModelAtom = atomWithStorage(
  "REASONING_FIRST_TAKE_MODEL",
  MODEL.Llama3_70b_instruct as MODEL | "None"
);
export const reasoningOnlineSearchAtom = atomWithStorage(
  "REASONING_ONLINE_SEARCH",
  REASONING_ONLINE_SEARCH.LetAiChoose
);
export const reasoningStepsCompletedAtom = atomWithStorage(
  "REASONING_STEPS_COMPLETED",
  [] as string[]
);
export const reasoningOngoingStepAtom = atomWithStorage(
  "REASONING_ONGOING_STEP",
  ""
);
export const reasoningOnlineSearchResultAtom = atomWithStorage(
  "REASONING_ONLINE_SEARCH_RESULT",
  ""
);
export const reasoningFirstTakeResultAtom = atomWithStorage(
  "REASONING_FIRST_TAKE_RESULT",
  ""
);
export const reasoningReasoningResultAtom = atomWithStorage(
  "REASONING_REASONING_RESULT",
  ""
);
export const reasoningFinalAnswerResultAtom = atomWithStorage(
  "REASONING_FINAL_ANSWER_RESULT",
  ""
);
export const isReasoningRunningAtom = atomWithStorage(
  "REASONING_RUNNING",
  false
);
export const wasReasoningStoppedAtom = atomWithStorage(
  "REASONING_STOPPED",
  false
);
export const canReasoningBeStoppedAtom = atomWithStorage(
  "REASONING_CAN_BE_STOPPED",
  false
);
export const wasReasoningFinishedAtom = atomWithStorage(
  "WAS_REASONING_FINISHED",
  false
);
export const reasoningMessagesAtom = atomWithStorage(
  "REASONING_MESSAGES",
  [] as Message[]
);
