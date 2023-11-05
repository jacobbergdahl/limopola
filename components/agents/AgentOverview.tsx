import { useRef, useState } from "react";
import TextArea from "../TextArea";
import { Button, BUTTON_THEME } from "../Button";
import {
  AGENT_TASK_INDICATION,
  AGENT_TASK_STATUS,
  AgentTask,
  getModelType,
  Message,
  MODEL,
  MODEL_TYPE,
  SHOULD_SHOW_ALL_LOGS,
} from "../../general/constants";
import {
  agentCodeContextsAtom,
  agentContextsAtom,
  agentImagePromptsAtom,
  agentMessagesAtom,
  agentMissionAtom,
  agentTasksAtom,
  agentToNarrateAtom,
  agentVideoPromptsAtom,
  isAgentRunningAtom,
  wasAgentStoppedAtom,
} from "../../pages/atoms";
import { useAtom } from "jotai";
import { ChatHistory } from "../ChatHistory";
import styles from "./AgentOverview.module.css";
import {
  createListOfTasks,
  getNextPendingTask,
  getTaskWithId,
  hasPendingTasks,
  parseCreativePrompts,
  runTask,
} from "./agentFunctions";
import { prettyLog, subtleLog } from "../../general/logging";
import { RESET } from "jotai/utils";
import { getCtrlKey, saveMessagesAsZip } from "../../general/helpers";
import {
  contextAddedImages,
  contextAddedNarration,
  contextAddedVideos,
} from "./contextCreator";

export const AgentOverview = () => {
  const [mission, setMission] = useAtom(agentMissionAtom);
  const [tasks, setTasks] = useAtom(agentTasksAtom);
  const [isRunning, setIsRunning] = useAtom(isAgentRunningAtom);
  const [wasStopped, setWasStopped] = useAtom(wasAgentStoppedAtom);
  const [messages, setMessages] = useAtom(agentMessagesAtom);
  const [contexts, setContexts] = useAtom(agentContextsAtom);
  const [codeContexts, setCodeContexts] = useAtom(agentCodeContextsAtom);
  const [toNarrate, setToNarrate] = useAtom(agentToNarrateAtom);
  const [imagePrompts, setImagePrompts] = useAtom(agentImagePromptsAtom);
  const [videoPrompts, setVideoPrompts] = useAtom(agentVideoPromptsAtom);
  const [timer, setTimer] = useState<number>(-1);
  const isStoppingRef = useRef(false);

  let timerValue = 0;
  const startTimer = () => {
    timerValue = 0;
    const interval = setInterval(() => {
      timerValue += 0.01;
      setTimer(timerValue);
    }, 10);
    return interval;
  };

  const startNewMission = () => {
    handleClearMissionDetails();
    // This looks absolutely ridiculous, I know
    handleTaskStart(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      true
    );
  };

  const handleTextareaKeyPress = (event) => {
    const hasPressedControlEnter =
      (event.ctrlKey || event.metaKey) && event.key === "Enter";

    if (hasPressedControlEnter) {
      event.preventDefault();
      if (!isRunning) {
        startNewMission();
      }
    }
  };

  const handleMissionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setMission(event.target.value);
  };

  const handleMissionStop = () => {
    isStoppingRef.current = true;
  };

  const handleMissionResume = () => {
    if (!hasPendingTasks(tasks)) {
      setWasStopped(false);
      isStoppingRef.current = false;
      return;
    }
    const idOfTaskToStart = getNextPendingTask(tasks).id;
    handleTaskStart(idOfTaskToStart);
  };

  const handleClearChat = () => {
    setMessages(RESET);
  };

  const handleClearMissionDetails = () => {
    setTasks(RESET);
    setIsRunning(RESET);
    isStoppingRef.current = false;
    setWasStopped(RESET);
    setContexts(RESET);
    setCodeContexts(RESET);
    setToNarrate(RESET);
    setImagePrompts(RESET);
    setVideoPrompts(RESET);
  };

  const runMultiplePromptsInSameTask = async (
    task: AgentTask,
    prompts: string[],
    context?: string
  ) => {
    const results: string[] = [];
    for (const prompt of prompts) {
      if (prompt.trim().length === 0) {
        continue;
      }
      console.log(
        "Waiting for the back-end to generate content based on the following prompt"
      );
      console.log(prompt);
      const response = await runTask(task, context, undefined, prompt);
      const data = await response.json();
      const result = data.result;
      results.push(result[0]);
    }
    SHOULD_SHOW_ALL_LOGS &&
      console.log("Created the following result(s)", results);
    return results;
  };

  const fetchNarration = async (task: AgentTask, prompts: string[]) => {
    const dataArray = [];
    for (const prompt of prompts) {
      console.log(
        "Waiting for the back-end to generate narration based of the following text"
      );
      console.log(prompt);
      const response = await runTask(task, undefined, undefined, prompt);
      const data = await response.arrayBuffer();
      dataArray.push(data);
    }
    const audioUrls = [];
    for (const data of dataArray) {
      const audioBlob = new Blob([data], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);
      audioUrls.push(audioUrl);
    }
    SHOULD_SHOW_ALL_LOGS &&
      console.log("Created the following audio URL's", audioUrls);

    return audioUrls;
  };

  const handleTaskStart = async (
    idOfNextTask?: number,
    allTasks?: AgentTask[],
    allMessages?: Message[],
    allTextsToNarrate?: string[],
    allImagePrompts?: string[],
    allVideoPrompts?: string[],
    allContexts?: string[],
    allCodeContexts?: string[],
    shouldStartWithNewState?: boolean
  ) => {
    if (mission.length === 0) {
      return;
    }
    setIsRunning(true);
    setWasStopped(false);
    const interval = startTimer();
    let currentMessages =
      allMessages !== undefined && allMessages.length > 0
        ? allMessages
        : messages;
    let idOfCurrentTask = idOfNextTask || undefined;
    let currentTasks =
      allTasks !== undefined && allTasks.length > 0 ? allTasks : tasks;
    let currentTextsToNarrate =
      allTextsToNarrate !== undefined && allTextsToNarrate.length > 0
        ? allTextsToNarrate
        : toNarrate;
    let currentImagePrompts =
      allImagePrompts !== undefined && allImagePrompts.length > 0
        ? allImagePrompts
        : imagePrompts;
    let currentVideoPrompts =
      allVideoPrompts !== undefined && allVideoPrompts.length > 0
        ? allVideoPrompts
        : videoPrompts;
    let currentContexts =
      allContexts !== undefined && allContexts.length > 0
        ? allContexts
        : contexts;
    let currentCodeContexts =
      allCodeContexts !== undefined && allCodeContexts.length > 0
        ? allCodeContexts
        : codeContexts;

    if (shouldStartWithNewState) {
      currentTasks = [];
      currentTextsToNarrate = [];
      currentImagePrompts = [];
      currentVideoPrompts = [];
      currentContexts = [];
    }

    if (idOfCurrentTask === undefined && hasPendingTasks(currentTasks)) {
      idOfCurrentTask = getNextPendingTask(currentTasks).id;
    }
    try {
      if (currentTasks.length === 0) {
        prettyLog("Sending an AI agent on a new mission");
        console.log(mission);
        currentTasks = [...(await createListOfTasks(mission, tasks.length))];
        subtleLog("These tasks were created for the mission");
        console.log(currentTasks);
        setTasks(currentTasks);
        const firstTaskAsMessage: Message = {
          content: currentTasks[0].description,
          sender: `Agent (in ${timerValue.toFixed(2)}s)`,
          id: currentMessages.length,
          header: mission,
          fileName: "tasks",
        };
        currentMessages = [...currentMessages, firstTaskAsMessage];
        setMessages(currentMessages);
        idOfCurrentTask = 0;
      } else if (hasPendingTasks(currentTasks)) {
        const currentTask = getTaskWithId(currentTasks, idOfCurrentTask);
        prettyLog("Starting work on the following task");
        console.log(currentTask);
        const modelType = getModelType(currentTask.api);

        if (modelType === MODEL_TYPE.Text) {
          const response = await runTask(
            currentTask,
            currentContexts.join("\n"),
            currentCodeContexts.join("\n")
          );
          const data = await response.json();
          subtleLog("The back-end generated the following result");
          console.log(data.result);
          const sender = `Agent (in ${timerValue.toFixed(2)}s)`;
          let fileName = "text";
          if (currentTask.indication === AGENT_TASK_INDICATION.Context) {
            currentContexts = [...currentContexts, data.result];
            subtleLog("Added new context");
            console.log(currentContexts);
            setContexts(currentContexts);
          } else if (currentTask.indication === AGENT_TASK_INDICATION.Code) {
            currentCodeContexts = [...currentCodeContexts, data.result];
            subtleLog("Added new code context");
            console.log(currentCodeContexts);
            setCodeContexts(currentCodeContexts);
            fileName = "full_code";
          } else if (currentTask.indication === AGENT_TASK_INDICATION.Image) {
            currentImagePrompts = [
              ...currentImagePrompts,
              ...parseCreativePrompts(data.result),
            ];
            subtleLog("Added new image prompts");
            console.log(currentImagePrompts);
            setImagePrompts(currentImagePrompts);
            fileName = "image_prompts";
          } else if (currentTask.indication === AGENT_TASK_INDICATION.Video) {
            currentVideoPrompts = [
              ...currentVideoPrompts,
              ...parseCreativePrompts(data.result),
            ];
            subtleLog("Added new video prompts");
            console.log(currentVideoPrompts);
            setVideoPrompts(currentVideoPrompts);
            fileName = "video_prompts";
          } else if (
            currentTask.indication === AGENT_TASK_INDICATION.Narration
          ) {
            currentTextsToNarrate = [...currentTextsToNarrate, data.result];
            subtleLog("Added new texts to narrate");
            console.log(currentTextsToNarrate);
            setToNarrate(currentTextsToNarrate);
          }
          const apiMessage: Message = {
            content: data.result,
            sender: sender,
            id: currentMessages.length,
            header: `${currentTask.id}. ${currentTask.description}`,
            fileName: fileName,
          };
          currentMessages = [...currentMessages, apiMessage];
          setMessages(currentMessages);
        } else if (modelType === MODEL_TYPE.Image) {
          const imageUrls = await runMultiplePromptsInSameTask(
            currentTask,
            currentImagePrompts,
            currentContexts.join("\n")
          );
          currentImagePrompts = [];
          setImagePrompts(currentImagePrompts);
          currentContexts = [
            ...currentContexts,
            ...contextAddedImages(imageUrls.length),
          ];
          setContexts(currentContexts);
          const sender = `Agent (in ${timerValue.toFixed(2)}s)`;
          const apiMessage: Message = {
            imageUrls: imageUrls,
            sender: sender,
            id: currentMessages.length,
            header: `${currentTask.id}. ${currentTask.description}`,
          };
          currentMessages = [...currentMessages, apiMessage];
          setMessages(currentMessages);
        } else if (modelType === MODEL_TYPE.Video) {
          const videoUrls = await runMultiplePromptsInSameTask(
            currentTask,
            currentVideoPrompts,
            currentContexts.join("\n")
          );
          currentVideoPrompts = [];
          setVideoPrompts(currentVideoPrompts);
          currentContexts = [
            ...currentContexts,
            ...contextAddedVideos(videoUrls.length),
          ];
          setContexts(currentContexts);
          const sender = `Agent (in ${timerValue.toFixed(2)}s)`;
          const apiMessage: Message = {
            videoUrls: videoUrls,
            sender: sender,
            id: currentMessages.length,
            header: `${currentTask.id}. ${currentTask.description}`,
          };
          currentMessages = [...currentMessages, apiMessage];
          setMessages(currentMessages);
        } else if (modelType === MODEL_TYPE.Audio) {
          const audioUrls = await fetchNarration(currentTask, [
            ...currentContexts,
            ...currentTextsToNarrate,
          ]);
          currentTextsToNarrate = [];
          setToNarrate(currentTextsToNarrate);
          currentContexts = [
            ...currentContexts,
            ...contextAddedNarration(audioUrls.length),
          ];
          setContexts(currentContexts);
          const sender = `Agent (in ${timerValue.toFixed(2)}s)`;
          const apiMessage: Message = {
            audioUrls: audioUrls,
            sender: sender,
            id: currentMessages.length,
            header: `${currentTask.id}. ${currentTask.description}`,
          };
          currentMessages = [...currentMessages, apiMessage];
          setMessages(currentMessages);
        }
        currentTask.status = AGENT_TASK_STATUS.Completed;
        currentTasks = currentTasks.map((task) =>
          task.id === idOfCurrentTask ? currentTask : task
        );
        setTasks(currentTasks);
      } else {
        setIsRunning(false);
      }
      if (isStoppingRef.current) {
        console.log("The agent has intentionally stopped per your request");
        isStoppingRef.current = false;
        setWasStopped(true);
        setIsRunning(false);
        clearInterval(interval);
        return;
      }
      if (hasPendingTasks(currentTasks)) {
        clearInterval(interval);
        setTimeout(() => {
          let nextTask = getTaskWithId(currentTasks, idOfCurrentTask + 1);
          if (!nextTask) {
            nextTask = getNextPendingTask(currentTasks);
          }
          handleTaskStart(
            nextTask.id,
            currentTasks,
            currentMessages,
            currentTextsToNarrate,
            currentImagePrompts,
            currentVideoPrompts,
            currentContexts,
            currentCodeContexts
          );
        }, 1000);
      } else {
        console.log("The mission has now been finished.");
        const finishedMessage: Message = {
          content: "The mission has now been finished.",
          sender: "Agent",
          id: currentMessages.length,
          shouldAvoidDownloading: true,
        };
        currentMessages = [...currentMessages, finishedMessage];
        setMessages(currentMessages);
        saveMessagesAsZip(currentMessages, "agent");
        handleClearMissionDetails();
        setIsRunning(false);
      }
    } catch (error) {
      console.error(error);
      let errorMessage: string =
        error?.message ||
        "An error occurred. Please check the console for more information.";
      if (errorMessage.indexOf("Invalid task string") > -1) {
        errorMessage =
          "The agent could not create a task list for the mission. This could happen if the mission is too vague. There is more information on the error in the console.";
      }
      const errorChatMessage: Message = {
        content: errorMessage,
        sender: `Error (in ${timerValue.toFixed(2)}s)`,
        id: currentMessages.length,
        shouldAvoidDownloading: true,
      };
      currentMessages = [...currentMessages, errorChatMessage];
      setMessages(currentMessages);
      setIsRunning(false);
    } finally {
      clearInterval(interval);
    }
  };

  return (
    <div>
      <div className={styles.pageTopColor}></div>
      <div className={styles.fixedContentContainer}>
        <div className={styles.fixedContentTopRow}>
          <TextArea
            value={mission}
            handleChange={handleMissionChange}
            disabled={isRunning}
            name="mission"
            placeholder={
              isRunning
                ? mission
                : `Enter the agent's mission. Press ${getCtrlKey()} + Enter, or the button below, to dispatch the agent.`
            }
            handleKeyDown={handleTextareaKeyPress}
          />
        </div>
        <div className={styles.fixedContentSecondRow}>
          {!isRunning && (
            <Button
              onClick={() => startNewMission()}
              value={`Dispatch${
                wasStopped || isStoppingRef.current ? " new " : " "
              }agent`}
              theme={BUTTON_THEME.Positive}
            />
          )}
          {!isRunning && messages.length > 0 && (
            <Button
              onClick={() => saveMessagesAsZip(messages, "agent")}
              value={`Download all messages`}
              theme={BUTTON_THEME.Default}
            />
          )}
          {(wasStopped || isStoppingRef.current) && (
            <Button
              onClick={handleMissionResume}
              value="Resume agent"
              theme={BUTTON_THEME.Neutral}
            />
          )}
          {!isRunning && (
            <Button
              onClick={handleClearMissionDetails}
              value="Clear mission details"
            />
          )}
          {!isRunning && (
            <Button onClick={handleClearChat} value="Clear chat" />
          )}
          {isRunning && !isStoppingRef.current && (
            <Button
              onClick={handleMissionStop}
              value="Stop agent"
              theme={BUTTON_THEME.Negative}
            />
          )}
        </div>
        {isStoppingRef.current && (
          <div className={styles.fixedContentThirdRow}>
            <i>The agent will stop after finishing the current task.</i>
          </div>
        )}
      </div>
      <ChatHistory
        messages={messages}
        emptyHistoryMessage="The Agent mode is a work in progress. Make sure to carefully read the README before using it."
        isLoading={isRunning}
        model={MODEL.Debug}
        timer={timer}
      />
      <div className={styles.pageBottomColor}></div>
    </div>
  );
};
