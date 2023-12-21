import { MODEL, STATUS_CODE } from "../../../general/constants";

export const palm = async (
  res,
  message,
  model: MODEL.PalmChatBison001 | MODEL.PalmTextBison001,
  temperature
) => {
  res.status(STATUS_CODE.NotImplemented).json({
    error: {
      message:
        "Due to a gnarly dependency clash, Google's API's can no longer be used on the main branch. More information is available in the README.md file.",
    },
  });
  return;
};
