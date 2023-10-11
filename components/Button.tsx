import { MouseEventHandler } from "react";
import styles from "./Button.module.css";

type ButtonProps = {
  value: any;
  onClick: MouseEventHandler<HTMLInputElement> | undefined;
  isSelected?: boolean;
  className?: string;
};

export const Button = ({
  value,
  onClick,
  className,
  isSelected = false,
}: ButtonProps) => {
  const classnames = `${styles.button}${className ? ` ${className}` : ""}${
    isSelected ? ` ${styles.selected}` : ""
  }`;
  return (
    <input
      type="button"
      value={value.toString()}
      onClick={onClick}
      className={classnames}
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
