import { useEffect, useState } from "react";
import { REASONING_STEP } from "../../general/constants";
import styles from "./ReasoningStepsHistory.module.css";
import { useAtom } from "jotai";
import {
  reasoningFinalAnswerResultAtom,
  reasoningFirstTakeResultAtom,
  reasoningOngoingStepAtom,
  reasoningOnlineSearchResultAtom,
  reasoningReasoningResultAtom,
  reasoningStepsCompletedAtom,
  wasReasoningFinishedAtom,
} from "../../pages/atoms";
import { Spinner } from "../Spinner";

type ReasoningStepsHistoryType = {
  totalTimerValue?: number;
  currentStepTimerValue?: number;
  errorMessage?: string;
};

export const ReasoningStepsHistory = ({
  totalTimerValue,
  currentStepTimerValue,
  errorMessage,
}: ReasoningStepsHistoryType) => {
  const [reasoningStepsCompleted] = useAtom(reasoningStepsCompletedAtom);
  const [reasoningOngoingStep] = useAtom(reasoningOngoingStepAtom);
  const [wasReasoningFinished] = useAtom(wasReasoningFinishedAtom);
  const [reasoningOnlineSearchResult] = useAtom(
    reasoningOnlineSearchResultAtom
  );
  const [reasoningFirstTakeResult] = useAtom(reasoningFirstTakeResultAtom);
  const [reasoningReasoningResult] = useAtom(reasoningReasoningResultAtom);
  const [reasoningFinalAnswerResult] = useAtom(reasoningFinalAnswerResultAtom);
  const [, setStepTimers] = useState<{ [key: string]: number }>({});
  const [totalTimer, setTotalTimer] = useState<number>(0);
  const [expandedItems, setExpandedItems] = useState({
    onlineSearch: false,
    reasoning: false,
    firstTake: false,
  });

  useEffect(() => {
    if (currentStepTimerValue && reasoningOngoingStep) {
      setStepTimers((prev) => ({
        ...prev,
        [reasoningOngoingStep]: currentStepTimerValue,
      }));
    }
  }, [currentStepTimerValue, reasoningOngoingStep]);

  useEffect(() => {
    if (totalTimerValue > 0 && totalTimerValue !== totalTimer) {
      setTotalTimer(totalTimerValue);
    }
  }, [totalTimerValue, totalTimer]);

  return (
    <div className={styles.reasoningStepsHistory}>
      {!wasReasoningFinished && !errorMessage && (
        <div className={styles.reasoningStepsHistoryInner}>
          {reasoningStepsCompleted.map((reasoningStep: REASONING_STEP) => {
            return (
              <span
                key={reasoningStep}
                className={styles.reasoningStepListItem}
              >
                <img src="../../icons/mdi--check-bold.svg" alt="Checkmark" />
                <span>{reasoningStep}</span>
              </span>
            );
          })}
          {!!reasoningOngoingStep && (
            <span className={styles.reasoningStepListItem}>
              <Spinner
                show={true}
                classNames={`${styles.message} ${styles.loadingMessage}`}
              />
              <span>
                {reasoningOngoingStep} (
                {currentStepTimerValue.toFixed(2) || "0.00"}
                s)
              </span>
            </span>
          )}
          {totalTimer > 0 && (
            <span className={styles.reasoningStepTotal}>
              {totalTimer.toFixed(2)}s
            </span>
          )}
        </div>
      )}
      {wasReasoningFinished && !errorMessage && (
        <div className={styles.finishedReasoning}>
          <div className="collapsedInformation">
            {!!reasoningOnlineSearchResult && (
              <div
                className={`${styles.collapsedInformationItem} ${expandedItems.onlineSearch ? styles.expanded : ""}`}
              >
                <div
                  className={styles.collapsibleHeader}
                  onClick={() =>
                    setExpandedItems((prev) => ({
                      ...prev,
                      onlineSearch: !prev.onlineSearch,
                    }))
                  }
                >
                  <img
                    src="../../icons/mdi--arrow-right-bold.svg"
                    alt="Toggle"
                    className={`${styles.arrow} ${expandedItems.onlineSearch ? styles.expanded : ""}`}
                  />
                  <span>Online search</span>
                </div>
                <div className={styles.collapsibleContent}>
                  <div
                    className={`${styles.collapsibleContentInner} ${styles.formattedText}`}
                    dangerouslySetInnerHTML={{
                      __html: reasoningOnlineSearchResult
                        // The results are not necessarily from Google; but we always tell the LLM that they are.
                        // This would be neither the first nor the last time we lie to an AI.
                        .replaceAll("Google Search Results", "")
                        .trim(),
                    }}
                  />
                </div>
              </div>
            )}
            {!!reasoningReasoningResult && (
              <div
                className={`${styles.collapsedInformationItem} ${expandedItems.reasoning ? styles.expanded : ""}`}
              >
                <div
                  className={styles.collapsibleHeader}
                  onClick={() =>
                    setExpandedItems((prev) => ({
                      ...prev,
                      reasoning: !prev.reasoning,
                    }))
                  }
                >
                  <img
                    src="../../icons/mdi--arrow-right-bold.svg"
                    alt="Toggle"
                    className={`${styles.arrow} ${expandedItems.reasoning ? styles.expanded : ""}`}
                  />
                  <span>Reasoning</span>
                </div>
                <div className={styles.collapsibleContent}>
                  <div
                    className={`${styles.collapsibleContentInner} ${styles.formattedText}`}
                    dangerouslySetInnerHTML={{
                      __html: reasoningReasoningResult,
                    }}
                  />
                </div>
              </div>
            )}
            {!!reasoningFirstTakeResult && (
              <div
                className={`${styles.collapsedInformationItem} ${expandedItems.firstTake ? styles.expanded : ""}`}
              >
                <div
                  className={styles.collapsibleHeader}
                  onClick={() =>
                    setExpandedItems((prev) => ({
                      ...prev,
                      firstTake: !prev.firstTake,
                    }))
                  }
                >
                  <img
                    src="../../icons/mdi--arrow-right-bold.svg"
                    alt="Toggle"
                    className={`${styles.arrow} ${expandedItems.firstTake ? styles.expanded : ""}`}
                  />
                  <span>First take</span>
                </div>
                <div className={styles.collapsibleContent}>
                  <div
                    className={`${styles.collapsibleContentInner} ${styles.formattedText}`}
                    dangerouslySetInnerHTML={{
                      __html: reasoningFirstTakeResult,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          <div
            className={`${styles.reasoningFinalAnswer} ${styles.formattedText}`}
            dangerouslySetInnerHTML={{
              __html: reasoningFinalAnswerResult,
            }}
          />
        </div>
      )}
      {!!errorMessage && (
        <div className={styles.errorContainer}>
          <h1>An error occurred</h1>
          <p>{errorMessage}</p>
          <p>
            There is likely more information in the console (both client and
            server side).
          </p>
        </div>
      )}
    </div>
  );
};
