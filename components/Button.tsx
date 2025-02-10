import { MouseEventHandler, useEffect, useRef, useState } from "react";
import styles from "./Button.module.css";

export enum BUTTON_THEME {
  Positive = "positive",
  Negative = "negative",
  Neutral = "neutral",
  Default = "default",
}

type ButtonProps = {
  value: any;
  onClick?: MouseEventHandler<HTMLInputElement> | (() => void);
  isSelected?: boolean;
  disabled?: boolean;
  className?: string;
  theme?: BUTTON_THEME;
  shouldAskForConfirmation?: boolean;
};

export const Button = ({
  value,
  onClick,
  className,
  isSelected = false,
  disabled = false,
  theme = BUTTON_THEME.Default,
  shouldAskForConfirmation = false,
}: ButtonProps) => {
  const [isAskingForConfirmation, setIsAskingForConfirmation] = useState(false);
  const clearAskingForConfirmationTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isAskingForConfirmation) {
      const timeoutId = setTimeout(() => {
        setIsAskingForConfirmation(false);
      }, 1000 * 5);
      clearAskingForConfirmationTimer.current = timeoutId;
    } else if (clearAskingForConfirmationTimer.current) {
      clearTimeout(clearAskingForConfirmationTimer.current);
      clearAskingForConfirmationTimer.current = null;
    }

    return () => {
      if (clearAskingForConfirmationTimer.current) {
        clearTimeout(clearAskingForConfirmationTimer.current);
      }
    };
  }, [isAskingForConfirmation]);

  let classnames = `${styles.button}${className ? ` ${className}` : ""}${
    isSelected ? ` ${styles.selected}` : ""
  }`;

  switch (theme) {
    case BUTTON_THEME.Positive:
      classnames += ` ${styles.positive}`;
      break;
    case BUTTON_THEME.Negative:
      classnames += ` ${styles.negative}`;
      break;
    case BUTTON_THEME.Neutral:
      classnames += ` ${styles.neutral}`;
      break;
    default:
      break;
  }

  if (isAskingForConfirmation) {
    classnames += ` ${styles.negative}`;
  }

  const handleClick = (event) => {
    if (!isAskingForConfirmation && shouldAskForConfirmation) {
      setIsAskingForConfirmation(true);
    } else {
      setIsAskingForConfirmation(false);
      onClick?.(event);
    }
  };

  return (
    <input
      type="button"
      value={
        isAskingForConfirmation ? "Press again to confirm" : value.toString()
      }
      onClick={(event) => handleClick(event)}
      className={classnames}
      disabled={disabled}
    />
  );
};

type SubtleButtonProps = Omit<ButtonProps, "className">;

export const SubtleButton = ({
  value,
  onClick,
  isSelected = false,
}: SubtleButtonProps) => {
  return (
    <Button
      value={value}
      onClick={onClick}
      className={styles.subtleButton}
      isSelected={isSelected}
    />
  );
};
