import { SHOULD_SHOW_ALL_LOGS, STATUS_CODE } from "../../../general/constants";
import { parseTextResponse } from "../../../general/helpers";

/**
 * For legacy OpenAI models. Not currently in use.
 */
export const davinci = async (res, openai, message, model, temperature) => {
  const completion = await openai.createCompletion({
    model: model,
    prompt: message,
    temperature: temperature,
  });

  SHOULD_SHOW_ALL_LOGS && console.log("Response from OpenAI:", completion);

  const text = completion.data.choices[0].text;
  res.status(STATUS_CODE.Ok).json({ result: parseTextResponse(text) });
  return;
};
