import { MODEL, getModelInformation } from "../../general/constants";
import styles from "./ModelInformation.module.css";

export type ModelInformationProps = {
  model: MODEL;
};

export const ModelInformation = ({ model }: ModelInformationProps) => {
  const modelInformation = getModelInformation(model);

  return (
    <>
      <h3>Model information</h3>
      <div className={styles.sectionInner}>
        <span className={styles.status}>{modelInformation.status}</span>
        <span className={styles.information}>
          {modelInformation.information}
        </span>
        {!!modelInformation.apiKey && (
          <span>API key: {modelInformation.apiKey}</span>
        )}
        {!!modelInformation.learnMoreUrl && (
          <a
            className={styles.information}
            target="_blank"
            rel="noopener noreferrer"
            href={modelInformation.learnMoreUrl}
          >
            Learn more
          </a>
        )}
      </div>
    </>
  );
};
