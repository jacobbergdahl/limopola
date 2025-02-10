import { useState, useEffect } from "react";
import { Context } from "../../general/constants";
import { Button, SubtleButton } from "../Button";
import { useAtom } from "jotai";
import {
  currentlySelectedContextAtom,
  currentContextsAtom,
  isContextModalOpenAtom,
} from "../../pages/atoms";
import styles from "./AllContexts.module.css";
import ContextSettingsModal from "../ContextSettingsModal";

const useContexts = () => {
  const [contexts, setContexts] = useAtom(currentContextsAtom);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/database/contexts/getAll");
        if (!response.ok) {
          throw new Error("Error fetching contexts");
        }
        const data = await response.json();
        const fetchedContexts: Context[] = data.contexts;
        setContexts(fetchedContexts);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setContexts]);

  return { contexts, loading, error };
};

export const AllContexts = () => {
  const { contexts, loading, error } = useContexts();
  const [currentlySelectedContext, setCurrentlySelectedContext] = useAtom(
    currentlySelectedContextAtom
  );
  const [isContextModalOpen, setIsContextModalOpen] = useAtom(
    isContextModalOpenAtom
  );

  if (loading) return <p>Fetching contexts...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <h3>Context</h3>
      {contexts.map((context) => {
        return (
          <Button
            value={context.title}
            onClick={() => setCurrentlySelectedContext(context)}
            isSelected={currentlySelectedContext.id === context.id}
            key={context.id}
          />
        );
      })}
      <div className={styles.modalButtonWrapper}>
        <SubtleButton
          value="Manage"
          onClick={() => setIsContextModalOpen(true)}
        />
      </div>
      <ContextSettingsModal />
    </>
  );
};
