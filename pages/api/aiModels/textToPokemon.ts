import { SHOULD_SHOW_ALL_LOGS, STATUS_CODE } from "../../../general/constants";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
});

export const textToPokemon = async (res, message, numberOfImages = 1) => {
  console.log(`The backend is calling text-to-pokemon through Replicate.`);

  const completion = await replicate.run(
    "lambdal/text-to-pokemon:ff6cc781634191dd3c49097a615d2fc01b0a8aae31c448e55039a04dcbf36bba",
    {
      input: {
        prompt: message,
        num_outputs: numberOfImages,
      },
    }
  );

  SHOULD_SHOW_ALL_LOGS && console.log("Response from Replicate:", completion);

  res.status(STATUS_CODE.Ok).json({ result: completion });
};
