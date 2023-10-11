import { Database } from "sqlite3";
import { DEFAULT_CONTEXT } from "../../../general/constants";
import path from "path";

const dbPath = path.join(process.cwd(), "database.db");
const db = new Database(dbPath, (error) => {
  if (error) console.error("Error opening database:", error);
});

db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS contexts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT)",
    [],
    function (createError: Error | null) {
      if (createError) {
        console.error("Error creating table:", createError);
        return;
      }

      db.get(
        "SELECT COUNT(*) as count FROM contexts",
        [],
        (countError: Error | null, row: { count: number }) => {
          if (countError) {
            console.error("Error counting rows:", countError);
            return;
          }

          // If the table is empty, insert the default context
          if (row.count === 0) {
            const { title, content } = DEFAULT_CONTEXT;
            db.run(
              "INSERT INTO contexts (title, content) VALUES (?, ?)",
              [title, content],
              function (insertError: Error | null) {
                if (insertError) {
                  console.error(
                    "Error inserting default context:",
                    insertError
                  );
                }
              }
            );
          }
        }
      );
    }
  );
});

export default db;
