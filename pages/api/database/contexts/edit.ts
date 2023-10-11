import { NextApiRequest, NextApiResponse } from "next";
import db from "../database";
import { STATUS_CODE } from "../../../../general/constants";

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
  if (req.method !== "PUT") {
    return res.status(STATUS_CODE.MethodNotAllowed).end();
  }

  try {
    const { id, title, content } = req.body as {
      id: number;
      title: string;
      content: string;
    };

    const result = await new Promise((resolve, reject) => {
      db.run(
        "UPDATE contexts SET title = ?, content = ? WHERE id = ?",
        [title, content, id],
        function (error) {
          if (error) reject(error);
          if (this.changes === 0) reject(new Error("Context not found"));
          resolve({ id, title, content });
        }
      );
    });

    return res.status(STATUS_CODE.Ok).json(result);
  } catch (error) {
    return res
      .status(
        error.message === "Context not found"
          ? STATUS_CODE.NotFound
          : STATUS_CODE.InternalServerError
      )
      .json({ error: error.message });
  }
};
