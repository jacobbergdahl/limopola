import {
  MODEL,
  SHOULD_SHOW_ALL_LOGS,
  STATUS_CODE,
} from "../../../general/constants";
import { parseTextResponse } from "../../../general/helpers";
import Replicate from "replicate";
import { NextApiResponse } from "next";
import { ProcessedBody } from "../../../general/apiHelper";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
});

const getReplicateEndpoint = (model: MODEL) => {
  if (model === MODEL.Llama2_13b_chat) {
    return "a16z-infra/llama-2-13b-chat:2a7f981751ec7fdf87b5b91ad4db53683a98082e9ff7bfd12c8cd5ea85980a52";
  } else if (model === MODEL.Llama2_70b_chat) {
    return "replicate/llama-2-70b-chat:2c1608e18606fad2812020dc541930f2d0495ce32eee50074220b87300bc16e1";
  } else if (model === MODEL.Llama2_13b) {
    return "meta/llama-2-13b:078d7a002387bd96d93b0302a4c03b3f15824b63104034bfa943c63a8f208c38";
  } else if (model === MODEL.Llama2_70b) {
    return "meta/llama-2-70b:a52e56fee2269a78c9279800ec88898cecb6c8f1df22a6483132bea266648f00";
  } else if (model === MODEL.CodeLlama_13b) {
    return "meta/codellama-34b:ffccbaa0d78e4dea7a9d46f29debaf390c2087c357e0632381f127382d3bf2fd";
  } else if (model === MODEL.Llama3_8b_instruct) {
    return "meta/meta-llama-3-8b-instruct";
  } else if (model === MODEL.Llama3_70b_instruct) {
    return "meta/meta-llama-3-70b-instruct";
  } else if (model === MODEL.DeepSeek_67b) {
    return "deepseek-ai/deepseek-67b-base:0f2469607b150ffd428298a6bb57874f3657ab04fc980f7b5aa8fdad7bd6b46b";
  }

  return "replicate/llama-2-70b-chat:2c1608e18606fad2812020dc541930f2d0495ce32eee50074220b87300bc16e1";
};

export const replicateService = async (
  res: NextApiResponse | undefined,
  message: string,
  model: MODEL,
  processedBody: ProcessedBody
) => {
  console.log(`The backend is calling ${model} through Replicate.`);
  const { temperature, topP } = processedBody;
  try {
    const completion = await replicate.run(getReplicateEndpoint(model), {
      input: {
        prompt: message,
        temperature: temperature,
        top_p: topP,
      },
    });

    if (SHOULD_SHOW_ALL_LOGS) {
      console.log("Response from Replicate:", completion);
    }

    const textArray = completion as string[];
    const text = textArray.join("");
    const processedOutput = parseTextResponse(text).trim();

    if (!res) {
      return processedOutput;
    }

    return res.status(STATUS_CODE.Ok).json({ result: processedOutput });
  } catch (error) {
    const errorMessage = error.message;
    console.error(errorMessage);
    res
      .status(STATUS_CODE.InternalServerError)
      .json({ error: { message: errorMessage } });
  }
};
