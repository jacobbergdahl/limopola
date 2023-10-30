import {
  AGENT_TASK_INDICATION,
  AGENT_TASK_STATUS,
  AgentTask,
  MODEL,
} from "../../general/constants";
import {
  AGENT_PROMPT_GENERATE_IMAGE_PROMPTS,
  AGENT_PROMPT_GENERATE_VIDEO_PROMPTS,
} from "./agentPrompts";
import {
  LONG_TASK_LIST,
  ONLY_IMAGE_TASK_LIST,
  SHORT_TASK_LIST,
} from "./mockData";

export const getTaskWithId = (tasks: AgentTask[], id: number) => {
  return tasks.find((task) => task.id === id);
};

export const parseAgentTasks = (
  taskString: string,
  initialIndex: number
): AgentTask => {
  let regex = /(\d+)\.\s\[(.*?)\]\[(.*?)\] (.*)/;
  let match = taskString.match(regex);

  let id, api, indication, description;

  if (!match) {
    regex = /(\d+)\.\s\[(.*?)\] (.*)/;
    match = taskString.match(regex);
    if (!match) {
      throw new Error(`Invalid task string: ${taskString}`);
    }
    [, id, api, description] = match;
    indication = undefined;
  } else {
    [, id, api, indication, description] = match;
  }

  return {
    id: parseInt(id, 10) + initialIndex,
    description: description || indication,
    status: AGENT_TASK_STATUS.Pending,
    api: api as MODEL,
    indication: indication ? (indication as AGENT_TASK_INDICATION) : undefined,
  };
};

const parseAgentTask = (
  taskString: string,
  initialIndex: number
): AgentTask[] => {
  const tasks = taskString.trim().split("\n");
  return tasks
    .filter((task) => task.trim() !== "")
    .map((task) => parseAgentTasks(task, initialIndex));
};

export const parseCreativePrompts = (input: string): string[] => {
  const lines = input.trim().split("\n");

  const processedLines = lines.reduce((accumulator, line) => {
    const trimmedLine = line.trim();
    if (trimmedLine !== "") {
      const processedLine = trimmedLine.replace(/^\d+\.\s/, "");
      accumulator.push(processedLine);
    }
    return accumulator;
  }, [] as string[]);

  return processedLines;
};

export const createListOfTasks = async (
  prompt: string,
  initialIndex: number
) => {
  let response = null;
  let data = null;
  let taskString: string = "";

  if (process.env.NEXT_PUBLIC_AGENT_TASKS_DATA === "MOCK_LONG_TASK_LIST") {
    taskString = LONG_TASK_LIST;
  } else if (
    process.env.NEXT_PUBLIC_AGENT_TASKS_DATA === "MOCK_SHORT_TASK_LIST"
  ) {
    taskString = SHORT_TASK_LIST;
  } else if (
    process.env.NEXT_PUBLIC_AGENT_TASKS_DATA === "MOCK_ONLY_IMAGE_TASK_LIST"
  ) {
    taskString = ONLY_IMAGE_TASK_LIST;
  } else {
    response = await fetch("/api/createAgentTasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
      }),
    });

    data = await response.json();

    console.log("Response from the backend for api/createAgentTasks", data);

    taskString = data.result;
  }

  const thisTask: AgentTask = {
    id: 0 + initialIndex,
    description: taskString.trim(),
    status: AGENT_TASK_STATUS.Completed,
    api: MODEL.Gpt4,
  };
  const tasks = [thisTask, ...parseAgentTask(taskString, initialIndex)];
  return tasks;
};

export const hasPendingTasks = (tasksToCheck: AgentTask[]) => {
  if (tasksToCheck === undefined || tasksToCheck.length === 0) {
    return false;
  }

  return tasksToCheck.some((task) => task.status === AGENT_TASK_STATUS.Pending);
};

export const getNextPendingTask = (tasksToCheck: AgentTask[]) => {
  return tasksToCheck.find((task) => task.status === AGENT_TASK_STATUS.Pending);
};

export const runTask = async (
  task: AgentTask,
  context?: string,
  codeContext?: string,
  specificPrompt?: string
) => {
  if (task.status !== AGENT_TASK_STATUS.Pending) {
    console.log("Returning due to the task not being pending");
    return;
  }

  const response = await fetch("/api/runAgentTask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      description: specificPrompt || task.description,
      api: task.api,
      indication: task.indication,
      context: context,
      codeContext: codeContext,
    }),
  });

  return response;
};

const getBaseInstructions = (indication: AGENT_TASK_INDICATION) => {
  if (indication === AGENT_TASK_INDICATION.Image) {
    return AGENT_PROMPT_GENERATE_IMAGE_PROMPTS;
  } else if (indication === AGENT_TASK_INDICATION.Video) {
    return AGENT_PROMPT_GENERATE_VIDEO_PROMPTS;
  } else if (indication === AGENT_TASK_INDICATION.Code) {
    return "";
  }

  return "";
};

export const getAgentPromptForRequestingPrompts = (
  prompt: string,
  indication: AGENT_TASK_INDICATION,
  context?: string,
  codeContext?: string
) => {
  const baseInstructions = getBaseInstructions(indication);
  let thisCodeContext = "";
  if (indication === AGENT_TASK_INDICATION.Code) {
    thisCodeContext += `\n
    Below is the code for this project. Please use this code as basis for the code you write next.\n
    ${codeContext}\n`;
  }

  if (!!context && context.length > 0) {
    return `
    ${baseInstructions}
    BEGINCONTEXT
    ${context}
    ENDCONTEXT
    ${thisCodeContext}
    BEGININSTRUCTION
    ${prompt}
    ENDINSTRUCTION
    `;
  }

  return `
  ${baseInstructions}
  ${thisCodeContext}
  BEGININSTRUCTION
  ${prompt}
  ENDINSTRUCTION
  `;
};

export const appendContextToTextPrompt = (
  prompt: string,
  context: string,
  codeContext?: string,
  indication?: AGENT_TASK_INDICATION
) => {
  const hasContext = context && context.trim().length > 0;
  const hasRelevantIndication =
    indication &&
    indication !== AGENT_TASK_INDICATION.Context &&
    indication !== AGENT_TASK_INDICATION.Narration;

  if (!hasContext && !hasRelevantIndication) {
    return prompt;
  }

  if (hasContext && !hasRelevantIndication) {
    return `
    BEGINCONTEXT
    ${context}
    ENDCONTEXT
    BEGININSTRUCTION
    ${prompt}
    ENDINSTRUCTION
    `;
  }

  return getAgentPromptForRequestingPrompts(
    prompt,
    indication!,
    context,
    codeContext
  );
};
