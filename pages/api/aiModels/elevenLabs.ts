import { SHOULD_SHOW_ALL_LOGS, STATUS_CODE } from "../../../general/constants";
import { extractErrorMessage } from "../../../general/helpers";

// Get voice id's by running this query:
// https://api.elevenlabs.io/v1/voices?accept=application/json&xi-api-key=YOUR_API_KEY
// In the future, we should add more voices, and let users add them themselves
const VOICE_ID = "flq6f7yk4E4fJM5XTYuZ";

export const elevenLabs = async (
  res,
  message,
  voiceSimilarityBoost,
  voiceStability
) => {
  console.log(
    `The backend is calling ElevenLabs with voiceStability ${voiceStability} and voiceSimilarityBoost ${voiceSimilarityBoost}.`
  );

  try {
    const completion = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: "POST",
        headers: {
          Accept: "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": process.env.ELEVEN_LABS_API_KEY,
        },
        body: JSON.stringify({
          text: message,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: voiceStability,
            similarity_boost: voiceSimilarityBoost,
          },
        }),
      }
    );

    SHOULD_SHOW_ALL_LOGS &&
      console.log("Response from ElevenLabs:", completion);

    if (completion.ok) {
      const audioArrayBuffer = await completion.arrayBuffer();
      const audioBuffer = Buffer.from(audioArrayBuffer);
      res.setHeader("Content-Type", "audio/mpeg");
      res.status(STATUS_CODE.Ok).send(audioBuffer);
    } else {
      const errorData = await completion.json();
      console.error("Error from ElevenLabs:", errorData);
      res.status(STATUS_CODE.InternalServerError).json({ error: errorData });
    }
  } catch (error) {
    let errorMessage = extractErrorMessage(error);
    console.error(error);
    res
      .status(STATUS_CODE.InternalServerError)
      .json({ error: { message: errorMessage } });
  }
};
