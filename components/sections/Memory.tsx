import { ALL_MEMORY_OPTIONS, MEMORY, Message } from "../../general/constants";
import { Button } from "../Button";
import styles from "./Memory.module.css";

export type MemoryProps = {
  memory: MEMORY;
  messagesInMemory: Message[];
  handleMemoryChange: (event: any) => void;
  handleClearMemory: (event: any) => void;
};

export const Memory = ({
  memory,
  messagesInMemory,
  handleMemoryChange,
  handleClearMemory,
}: MemoryProps) => {
  return (
    <>
      <h3>Memory</h3>
      <div className={styles.memoryButtonWrapper}>
        {ALL_MEMORY_OPTIONS.map((_memory) => {
          return (
            <Button
              value={_memory}
              onClick={handleMemoryChange}
              isSelected={_memory === memory}
              key={_memory}
            />
          );
        })}
      </div>
      <h4>Messages in memory: {messagesInMemory.length}</h4>
      <Button value="Clear memory" onClick={handleClearMemory} />
    </>
  );
};
