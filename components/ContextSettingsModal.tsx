import React, { useState, useEffect } from "react";
import { Context, SHOULD_SHOW_ALL_LOGS } from "../general/constants";
import { useAtom } from "jotai";
import { currentContextsAtom, isContextModalOpenAtom } from "../pages/atoms";
import styles from "./ContextSettingsModal.module.css";
import { Button } from "./Button";

export const ContextSettingsModal = () => {
  const [contexts, setContexts] = useAtom(currentContextsAtom);
  const [selectedContext, setSelectedContext] = useState<Context | null>(null);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [isOpen, setIsOpen] = useAtom(isContextModalOpenAtom);

  useEffect(() => {
    if (isOpen) {
      fetch("/api/database/contexts/getAll")
        .then((response) => response.json())
        .then(
          (data) => (
            SHOULD_SHOW_ALL_LOGS &&
              console.log("Fetched all contexts", data.contexts),
            setContexts(data.contexts)
          )
        )
        .catch((error) => console.error("Error loading contexts:", error));
    }
  }, [isOpen]);

  const addContext = () => {
    SHOULD_SHOW_ALL_LOGS && console.log("Adding context");
    fetch("/api/database/contexts/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    })
      .then((response) => {
        SHOULD_SHOW_ALL_LOGS &&
          console.log("Response after adding context", response);
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.error || "Error adding context");
          });
        }
        return response.json();
      })
      .then((_context) => {
        SHOULD_SHOW_ALL_LOGS && console.log("Added context", _context);
        setContexts([...contexts, _context]);
        setTitle("");
        setContent("");
      })
      .catch((error) => console.error("Error adding context", error));
  };

  const copyContextContent = (id: number) => {
    const context = contexts.find((_context) => _context.id === id);
    navigator.clipboard.writeText(context.content);
  };

  const editContext = (id: number) => {
    const context = contexts.find((_context) => _context.id === id);
    setSelectedContext(context);
    setTitle(context.title);
    setContent(context.content);
  };

  const cancelEditContext = () => {
    setSelectedContext(null);
    setTitle("");
    setContent("");
  };

  const saveContext = () => {
    SHOULD_SHOW_ALL_LOGS && console.log("Editing context");
    if (selectedContext === null) return;

    fetch(`/api/database/contexts/edit`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: selectedContext.id, title, content }),
    })
      .then((response) => {
        SHOULD_SHOW_ALL_LOGS &&
          console.log("Response after editing context", response);
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.error || "Error editing context");
          });
        }
        return response.json();
      })
      .then((updatedContext) => {
        SHOULD_SHOW_ALL_LOGS && console.log("Edited context", updatedContext);
        setContexts((prevContexts) =>
          prevContexts.map((context) =>
            context.id === updatedContext.id ? updatedContext : context
          )
        );
        setTitle("");
        setContent("");
        setSelectedContext(null);
      })
      .catch((error) => console.error("Error editing context", error));
  };

  const removeContext = (id) => {
    fetch("/api/database/contexts/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })
      .then(() =>
        setContexts(contexts.filter((_context) => _context.id !== id))
      )
      .catch((error) => console.error("Error removing context:", error));
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={() => setIsOpen(false)}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={() => setIsOpen(false)}>
          ×
        </button>
        <h2>Manage Contexts</h2>
        <h3>{selectedContext !== null ? "Save context" : "Add context"}</h3>
        <textarea
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.smallTextarea}
          placeholder="Title"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={styles.largeTextarea}
          placeholder="Content"
        />
        {selectedContext !== null && (
          <div className={styles.buttonWrapper}>
            <Button onClick={saveContext} value="Save" />
            <Button onClick={cancelEditContext} value="Cancel" />
          </div>
        )}
        {selectedContext === null && (
          <div className={styles.buttonWrapper}>
            <Button
              onClick={addContext}
              value="Add"
              className={styles.contextSaveButton}
            />
          </div>
        )}
        <div className={styles.contextList}>
          {contexts.map((context, i) => (
            <div
              className={`${styles.contextListItem}${
                i % 2 === 1 ? " " + styles.contextListItemOdd : ""
              }`}
              key={context.id}
            >
              <span className={styles.contextListItemTitle}>
                {context.title}
              </span>
              <div className={styles.contextListItemButtons}>
                <Button
                  value="Copy content"
                  onClick={() => copyContextContent(context.id)}
                />
                {context.id > 1 && (
                  <>
                    <Button
                      value="Edit"
                      onClick={() => editContext(context.id)}
                    />
                    <Button
                      value="Delete"
                      onClick={() => removeContext(context.id)}
                    />
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContextSettingsModal;
