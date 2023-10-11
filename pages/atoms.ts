import { atomWithStorage } from "jotai/utils";
import {
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
  IMAGE_SIZE,
  INPUT_MODE,
  IS_DEBUGGING,
  MEMORY,
  Message,
  TEXTAREA_STYLE,
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
export const imageSizeAtom = atomWithStorage("IMAGE_SIZE", IMAGE_SIZE.Small);
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
