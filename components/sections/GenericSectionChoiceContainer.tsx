import { Button } from "../Button";
import styles from "./GenericSectionChoiceContainer.module.css";

type GenericSectionChoiceContainerProps = {
  title: string;
  selectedButton: string;
  buttonTexts: string[];
  handleButtonClick: (value: any) => void;
  disabled?: boolean;
  additionalInformation?: string;
};

export const GenericSectionChoiceContainer = ({
  title,
  selectedButton,
  buttonTexts,
  handleButtonClick,
  disabled = false,
  additionalInformation,
}: GenericSectionChoiceContainerProps) => {
  return (
    <>
      <h3>{title}</h3>
      {buttonTexts.map((buttonText) => {
        return (
          <Button
            value={buttonText}
            onClick={() => handleButtonClick(buttonText)}
            key={buttonText}
            isSelected={selectedButton === buttonText}
            disabled={disabled}
          />
        );
      })}
      {additionalInformation && (
        <i className={styles.additionalInformation}>{additionalInformation}</i>
      )}
    </>
  );
};
