import { MouseEventHandler } from "react";
import styles from "./Button.module.css";

export enum BUTTON_THEME {
  Positive = "positive",
  Negative = "negative",
  Neutral = "neutral",
  Default = "default",
}

type ButtonProps = {
  value: any;
  onClick: MouseEventHandler<HTMLInputElement> | undefined;
  isSelected?: boolean;
  disabled?: boolean;
  className?: string;
  theme?: BUTTON_THEME;
};

export const Button = ({
  value,
  onClick,
  className,
  isSelected = false,
  disabled = false,
  theme = BUTTON_THEME.Default,
}: ButtonProps) => {
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
  return (
    <input
      type="button"
      value={value.toString()}
      onClick={onClick}
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
