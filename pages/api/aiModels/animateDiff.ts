import { SHOULD_SHOW_ALL_LOGS, STATUS_CODE } from "../../../general/constants";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
});

export const animateDiff = async (res, message) => {
  console.log(`The backend is calling animate-diff through Replicate.`);

  const completion = await replicate.run(
    "lucataco/animate-diff:1531004ee4c98894ab11f8a4ce6206099e732c1da15121987a8eef54828f0663",
    {
      input: {
        // This string concatenation is what the developers use by default, but perhaps
        // it should be optional in this repository.
        // https://replicate.com/lucataco/animate-diff/api
        prompt: message + ", masterpiece, best quality",
      },
    }
  );

  SHOULD_SHOW_ALL_LOGS && console.log("Response from Replicate:", completion);

  res.status(STATUS_CODE.Ok).json({ result: completion });
};
