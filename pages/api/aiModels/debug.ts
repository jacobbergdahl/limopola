import { STATUS_CODE } from "../../../general/constants";

export const debug = async (res) => {
  console.log("Inside debug API");
  await new Promise((resolve) => setTimeout(resolve, 2000));
  res.status(STATUS_CODE.Ok).json({
    result:
      "Debug response<br/>Second line via breakline\nThird line via newline",
  });
  return;
};
