import { NextApiRequest, NextApiResponse } from "next";
import db from "../database";
import { STATUS_CODE } from "../../../../general/constants";

type ResponseBody = {
  error?: string;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseBody>
) => {
  if (req.method !== "DELETE") {
    res
      .status(STATUS_CODE.MethodNotAllowed)
      .json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const { id } = req.body as { id: number };
    const result = await new Promise<{ changes: number }>((resolve, reject) => {
      db.run("DELETE FROM contexts WHERE id = ?", [id], function (error) {
        if (error) reject(error);
        resolve({ changes: this.changes });
      });
    });

    if (result.changes === 0) {
      res.status(STATUS_CODE.NotFound).json({ error: "Context not found" });
      return;
    }

    res.status(204).end();
  } catch (error) {
    res.status(STATUS_CODE.InternalServerError).json({ error: error.message });
  }
};
