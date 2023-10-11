import { NextApiRequest, NextApiResponse } from "next";
import db from "../database";
import { Context, STATUS_CODE } from "../../../../general/constants";

type ResponseBody = {
  contexts?: Context[];
  error?: string;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseBody>
) => {
  if (req.method !== "GET") {
    return res
      .status(STATUS_CODE.MethodNotAllowed)
      .json({ error: "Method Not Allowed" });
  }

  try {
    const rows: Context[] = await new Promise((resolve, reject) => {
      db.all("SELECT * FROM contexts", [], (error, rows: Context[]) => {
        if (error) reject(error);
        resolve(rows);
      });
    });

    if (!rows || rows.length === 0) {
      return res
        .status(STATUS_CODE.NotFound)
        .json({ error: "No contexts found" });
    }

    return res.status(STATUS_CODE.Ok).json({ contexts: rows });
  } catch (error) {
    return res
      .status(STATUS_CODE.InternalServerError)
      .json({ error: error.message });
  }
};
