import { NextApiRequest, NextApiResponse } from "next";
import db from "../database";
import {
  SHOULD_SHOW_ALL_LOGS,
  STATUS_CODE,
} from "../../../../general/constants";

type ResponseBody = {
  id?: number;
  title?: string;
  content?: string;
  error?: string;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseBody>
) => {
  if (req.method !== "POST") {
    return res
      .status(STATUS_CODE.MethodNotAllowed)
      .json({ error: "Method Not Allowed" });
  }

  try {
    const { title, content } = req.body as { title: string; content: string };

    const result = await new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO contexts (title, content) VALUES (?, ?)",
        [title, content],
        function (error) {
          if (error) reject(error);
          resolve({ id: this.lastID, title, content });
        }
      );
    });

    SHOULD_SHOW_ALL_LOGS && console.log("Added context", result);

    return res.status(STATUS_CODE.Created).json(result);
  } catch (error) {
    return res
      .status(STATUS_CODE.InternalServerError)
      .json({ error: error.message });
  }
};
