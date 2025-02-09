import { useRef, useState } from "react";
import TextArea from "../TextArea";
import { Button, BUTTON_THEME } from "../Button";
import {
  Message,
  MODEL,
  REASONING_ANSWER_MODELS,
  REASONING_FIRST_TAKE_MODELS,
  REASONING_ONLINE_SEARCH,
  REASONING_STEP,
  SHOULD_SHOW_ALL_LOGS,
} from "../../general/constants";
import {
  canReasoningBeStoppedAtom,
  isReasoningRunningAtom,
  reasoningAnswerModelAtom,
  reasoningFinalAnswerResultAtom,
  reasoningFirstTakeModelAtom,
  reasoningFirstTakeResultAtom,
  reasoningMessagesAtom,
  reasoningOngoingStepAtom,
  reasoningOnlineSearchAtom,
  reasoningOnlineSearchResultAtom,
  reasoningReasoningResultAtom,
  reasoningStepsCompletedAtom,
  reasoningTextAtom,
  wasReasoningFinishedAtom,
  wasReasoningStoppedAtom,
} from "../../pages/atoms";
import { useAtom } from "jotai";
import styles from "./ReasoningOverview.module.css";
import { RESET } from "jotai/utils";
import { extractErrorMessage, getCtrlKey } from "../../general/helpers";
import { UiControlsTheming } from "../UiControls";
import { HideableUI } from "../HideableUi";
import {
  getReasoningAnswerPrompt,
  getReasoningPrompt,
} from "./reasoningFunctions";
import { GenericSectionChoiceContainer } from "../sections/GenericSectionChoiceContainer";
import { ReasoningStepsHistory } from "./ReasoningStepsHistory";
import { BackgroundVideo } from "../BackgroundVideo";

const IS_DEBUGGING = false;

export const ReasoningOverview = () => {
  const [userInstruction, setUserInstruction] = useAtom(reasoningTextAtom);
  const [isRunning, setIsRunning] = useAtom(isReasoningRunningAtom);
  const [wasStopped, setWasStopped] = useAtom(wasReasoningStoppedAtom);
  const [messages, setMessages] = useAtom(reasoningMessagesAtom);

  const [reasoningAnswerModel, setReasoningAnswerModel] = useAtom(
    reasoningAnswerModelAtom
  );
  const [reasoningFirstTakeModel, setReasoningFirstTakeModel] = useAtom(
    reasoningFirstTakeModelAtom
  );
  const [reasoningOnlineSearch, setReasoningOnlineSearch] = useAtom(
    reasoningOnlineSearchAtom
  );
  const [reasoningStepsCompleted, setReasoningStepsCompleted] = useAtom(
    reasoningStepsCompletedAtom
  );
  const [reasoningOngoingStep, setReasoningOngoingStep] = useAtom(
    reasoningOngoingStepAtom
  );
  const [, setReasoningOnlineSearchResult] = useAtom(
    reasoningOnlineSearchResultAtom
  );
  const [, setReasoningFirstTakeResult] = useAtom(reasoningFirstTakeResultAtom);
  const [, setReasoningReasoningResult] = useAtom(reasoningReasoningResultAtom);
  const [canReasoningBeStopped, setCanReasoningBeStopped] = useAtom(
    canReasoningBeStoppedAtom
  );
  const [, setReasoningFinalAnswerResult] = useAtom(
    reasoningFinalAnswerResultAtom
  );
  const [wasReasoningFinished, setWasReasoningFinished] = useAtom(
    wasReasoningFinishedAtom
  );
  const [totalTimer, setTotalTimer] = useState<number>(-1);
  const [thisStepTimer, setThisStepTimer] = useState<number>(-1);
  const isStoppingRef = useRef(false);

  let totalTimerValue = 0;
  const startTotalTimer = () => {
    totalTimerValue = 0;
    const interval = setInterval(() => {
      totalTimerValue += 0.01;

      setTotalTimer(totalTimerValue);
    }, 10);
    return interval;
  };
  let thisStepTimerValue = 0;
  const startThisStepTimer = () => {
    thisStepTimerValue = 0;
    const interval = setInterval(() => {
      thisStepTimerValue += 0.01;

      setThisStepTimer(thisStepTimerValue);
    }, 10);
    return interval;
  };

  const addCurrentTimerToStep = (
    currentReasoningStep: REASONING_STEP
  ): string => {
    return `${currentReasoningStep} (${thisStepTimerValue.toFixed(2)}s)`;
  };

  const stopReasoning = (
    interval1: NodeJS.Timeout,
    interval2: NodeJS.Timeout
  ) => {
    console.log("The AI has intentionally stopped per your request");
    isStoppingRef.current = false;
    setWasStopped(true);
    setIsRunning(false);
    setCanReasoningBeStopped(false);
    clearInterval(interval1);
    clearInterval(interval2);
    setReasoningOngoingStep(RESET);
    setWasReasoningFinished(RESET);
  };

  const handleTextareaKeyPress = (event: any) => {
    const hasPressedControlEnter =
      (event.ctrlKey || event.metaKey) && event.key === "Enter";

    if (hasPressedControlEnter) {
      event.preventDefault();
      if (!isRunning) {
        handleClearCurrentTask();
        startReasoning();
      }
    }
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInstruction(event.target.value);
  };

  const handleMissionStop = () => {
    isStoppingRef.current = true;
  };

  const handleClearCurrentTask = () => {
    isStoppingRef.current = false;
    setMessages(RESET);
    setWasStopped(RESET);
    setIsRunning(RESET);
    setReasoningStepsCompleted(RESET);
    setReasoningOngoingStep(RESET);
    setReasoningOnlineSearchResult(RESET);
    setReasoningFirstTakeResult(RESET);
    setReasoningReasoningResult(RESET);
    setReasoningFinalAnswerResult(RESET);
    setWasReasoningFinished(RESET);
    setTotalTimer(-1);
    setThisStepTimer(-1);
  };

  const resetSettingsToDefault = () => {
    setReasoningAnswerModel(RESET);
    setReasoningFirstTakeModel(RESET);
    setReasoningOnlineSearch(RESET);
  };

  const apiSearchOnline = async (
    prompt: string,
    model: MODEL
  ): Promise<string> => {
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: prompt,
          model: IS_DEBUGGING ? MODEL.Debug : model,
          temperature: 0,
          isGivingAiSearchAccess: true,
          shouldAskBeforeSearching:
            reasoningOnlineSearch === REASONING_ONLINE_SEARCH.LetAiChoose,
          returnEmptyStringIfNoSearch: true,
          returnOnlineSearchResultsWithoutAskingLLM: true,
        }),
      });

      SHOULD_SHOW_ALL_LOGS &&
        console.log("Response from back-end request\n", response);

      const data = await response.json();
      const result = data.result as string;

      return result;
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      console.error(errorMessage);
      return errorMessage as string;
    }
  };

  const apiGeneric = async (prompt: string, model: MODEL): Promise<string> => {
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: prompt,
          model: IS_DEBUGGING ? MODEL.Debug : model,
        }),
      });

      SHOULD_SHOW_ALL_LOGS &&
        console.log("Response from back-end request\n", response);

      const data = await response.json();
      const result = data.result as string;

      return result;
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      console.error(errorMessage);
      return errorMessage as string;
    }
  };

  // 👋 If you're just visiting to see how I built model-agnostic reasoning,
  // then this is the function you want to see. Just follow the trail of function
  // calls from here and you'll get pretty much the full picture.
  const startReasoning = async () => {
    if (userInstruction.trim() === "" || isRunning) {
      return;
    }

    setIsRunning(true);
    setCanReasoningBeStopped(true);

    const totalInterval = startTotalTimer();
    let thisStepInterval: NodeJS.Timeout | null = null;

    let currentReasoningOnlineSearchResult = "";
    let currentReasoningStep = REASONING_STEP.None;
    let currentReasoningStepsCompleted: string[] = [];

    try {
      // 1. Unless the user has explicitly said to never search the web, the first step is
      // to either search the web for sure, or let the AI decide whether to search the web.
      if (reasoningOnlineSearch !== REASONING_ONLINE_SEARCH.Never) {
        thisStepInterval = startThisStepTimer();
        if (reasoningOnlineSearch === REASONING_ONLINE_SEARCH.LetAiChoose) {
          currentReasoningStep = REASONING_STEP.ThinkingAboutSearching;
        } else {
          currentReasoningStep = REASONING_STEP.SearchingTheWeb;
        }

        setReasoningOngoingStep(currentReasoningStep);
        currentReasoningOnlineSearchResult = await apiSearchOnline(
          userInstruction,
          MODEL.Gpt4_o
        );

        if (reasoningOnlineSearch === REASONING_ONLINE_SEARCH.LetAiChoose) {
          if (currentReasoningOnlineSearchResult.length > 0) {
            currentReasoningStepsCompleted.push(
              addCurrentTimerToStep(
                REASONING_STEP.ContemplatedAndSearchedTheWeb
              )
            );
          } else {
            currentReasoningStepsCompleted.push(
              addCurrentTimerToStep(
                REASONING_STEP.ContemplatedAndDidNotSearchTheWeb
              )
            );
          }
        } else {
          currentReasoningStepsCompleted.push(
            addCurrentTimerToStep(REASONING_STEP.SearchedTheWeb)
          );
        }

        setReasoningStepsCompleted(currentReasoningStepsCompleted);
        setReasoningOnlineSearchResult(currentReasoningOnlineSearchResult);
        clearInterval(thisStepInterval);

        if (isStoppingRef.current) {
          stopReasoning(totalInterval, thisStepInterval);
          return;
        }
      }

      // 2. The next step is always to start reasoning
      currentReasoningStep = REASONING_STEP.Reasoning;
      setReasoningOngoingStep(currentReasoningStep);
      thisStepInterval = startThisStepTimer();

      const reasoningReasoningResult = await apiGeneric(
        getReasoningPrompt(userInstruction, currentReasoningOnlineSearchResult),
        reasoningAnswerModel
      );

      setReasoningReasoningResult(reasoningReasoningResult);

      currentReasoningStep = REASONING_STEP.FinishedReasoning;
      currentReasoningStepsCompleted.push(
        addCurrentTimerToStep(REASONING_STEP.FinishedReasoning)
      );
      setReasoningStepsCompleted(currentReasoningStepsCompleted);
      clearInterval(thisStepInterval);

      if (isStoppingRef.current) {
        stopReasoning(totalInterval, thisStepInterval);
        return;
      }

      // 3. The model will optionally make a first take
      let reasoningFirstTakeResult = "";
      if (reasoningFirstTakeModel !== "None") {
        thisStepInterval = startThisStepTimer();
        currentReasoningStep = REASONING_STEP.FirstTake;
        setReasoningOngoingStep(currentReasoningStep);

        reasoningFirstTakeResult = await apiGeneric(
          getReasoningAnswerPrompt(
            userInstruction,
            reasoningReasoningResult,
            currentReasoningOnlineSearchResult
          ),
          reasoningFirstTakeModel
        );

        setReasoningFirstTakeResult(reasoningFirstTakeResult);
        currentReasoningStep = REASONING_STEP.FinishedFirstTake;
        currentReasoningStepsCompleted.push(
          addCurrentTimerToStep(REASONING_STEP.FinishedFirstTake)
        );
        setReasoningStepsCompleted(currentReasoningStepsCompleted);
        clearInterval(thisStepInterval);

        if (isStoppingRef.current) {
          stopReasoning(totalInterval, thisStepInterval);
          return;
        }
      }

      // This is the final step, so it can't be stopped (since it will stop after this anyway)
      setCanReasoningBeStopped(false);

      // 4. The model will make a final answer
      currentReasoningStep = REASONING_STEP.Answering;
      setReasoningOngoingStep(currentReasoningStep);
      thisStepInterval = startThisStepTimer();

      let reasoningFinalAnswerResult = await apiGeneric(
        getReasoningAnswerPrompt(
          userInstruction,
          reasoningReasoningResult,
          currentReasoningOnlineSearchResult,
          reasoningFirstTakeResult
        ),
        reasoningAnswerModel
      );

      setReasoningFinalAnswerResult(reasoningFinalAnswerResult);
      currentReasoningStep = REASONING_STEP.FinishedAnswering;
      currentReasoningStepsCompleted.push(
        addCurrentTimerToStep(REASONING_STEP.FinishedAnswering)
      );
      setReasoningOngoingStep("");
      setReasoningStepsCompleted(currentReasoningStepsCompleted);
      setWasReasoningFinished(true);

      clearInterval(thisStepInterval);

      setIsRunning(false);
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      console.error(errorMessage);
      const errorChatMessage: Message = {
        content: errorMessage,
        sender: `Error (in ${totalTimerValue.toFixed(2)}s)`,
        id: messages.length,
        shouldAvoidDownloading: true,
      };
      setMessages([...messages, errorChatMessage]);
      setIsRunning(false);
    } finally {
      clearInterval(totalInterval);
    }
  };

  return (
    <>
      <div>
        {!process.env.NEXT_PUBLIC_REASONING_BACKGROUND_VIDEO_SRC && (
          <div className={styles.pageTopColor}></div>
        )}
        <div className={styles.fixedContentContainer}>
          <div className={styles.missionTextArea}>
            <TextArea
              value={userInstruction}
              handleChange={handleTextChange}
              disabled={isRunning}
              name="mission"
              placeholder={
                isRunning
                  ? userInstruction
                  : `Ask anything. Press ${getCtrlKey()} + Enter, or the button in the top right, to start the AI.`
              }
              handleKeyDown={handleTextareaKeyPress}
            />
          </div>
        </div>
        {(reasoningStepsCompleted.length > 0 || !!reasoningOngoingStep) && (
          <ReasoningStepsHistory
            totalTimerValue={totalTimer}
            currentStepTimerValue={thisStepTimer}
          />
        )}
        <div className={`${styles.sidebar} ${styles.rightSidebar}`}>
          <UiControlsTheming />
          <div className={`${styles.section} ${styles.sectionFirst}`}>
            <div className={styles.fixedContentRow}>
              {!wasStopped && !isRunning && !wasReasoningFinished && (
                <Button
                  onClick={() => startReasoning()}
                  value="Start"
                  theme={BUTTON_THEME.Positive}
                />
              )}
              {!isRunning && reasoningStepsCompleted.length > 0 && (
                <Button
                  onClick={handleClearCurrentTask}
                  value={wasStopped ? "Start over" : "Start new chat"}
                />
              )}
              {isRunning && !isStoppingRef.current && canReasoningBeStopped && (
                <Button
                  onClick={handleMissionStop}
                  value="Stop"
                  theme={BUTTON_THEME.Negative}
                />
              )}
            </div>
            {isStoppingRef.current && (
              <div className={styles.fixedContentRow}>
                <i>The AI will stop after finishing the current step.</i>
              </div>
            )}
            <HideableUI className={styles.section}>
              <GenericSectionChoiceContainer
                title="Main model"
                buttonTexts={REASONING_ANSWER_MODELS}
                selectedButton={reasoningAnswerModel}
                handleButtonClick={setReasoningAnswerModel}
                disabled={isRunning}
              />
              <GenericSectionChoiceContainer
                title="First take model"
                buttonTexts={REASONING_FIRST_TAKE_MODELS}
                selectedButton={reasoningFirstTakeModel}
                handleButtonClick={setReasoningFirstTakeModel}
                disabled={isRunning}
              />
              <GenericSectionChoiceContainer
                title="Online search"
                buttonTexts={[
                  REASONING_ONLINE_SEARCH.LetAiChoose,
                  REASONING_ONLINE_SEARCH.Always,
                  REASONING_ONLINE_SEARCH.Never,
                ]}
                selectedButton={reasoningOnlineSearch}
                handleButtonClick={setReasoningOnlineSearch}
                disabled={isRunning}
                additionalInformation="Online search currently always uses GPT-4o, but will support any LLM in the future. Also only uses searchapi.io, but will allow for other search engines in the future."
              />
              <h3>Other options</h3>
              <Button
                onClick={() => resetSettingsToDefault()}
                value="Reset to default"
                theme={BUTTON_THEME.Default}
                disabled={isRunning}
              />
            </HideableUI>
            <div className={styles.spacing}></div>
          </div>
        </div>
        {!process.env.NEXT_PUBLIC_REASONING_BACKGROUND_VIDEO_SRC && (
          <div className={styles.pageBottomColor}></div>
        )}
      </div>
      <BackgroundVideo isRunning={isRunning} type="reasoning" />
    </>
  );
};

export default ReasoningOverview;
