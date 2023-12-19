import { ForwardedRef } from "react";
import styles from "./TextArea.module.css";
import React from "react";

type TextAreaProps = {
  rows?: number;
  name: string;
  placeholder: string;
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  shouldSpellCheck?: boolean;
  className?: string;
  isInSidebar?: boolean;
};

const TextArea = (
  {
    rows = 4,
    name,
    placeholder,
    value,
    handleChange,
    handleKeyDown,
    className,
    disabled = false,
    shouldSpellCheck = true,
    isInSidebar = false,
  }: TextAreaProps,
  ref?: ForwardedRef<HTMLTextAreaElement>
) => {
  const classes = `${styles.textarea}${isInSidebar ? " " + styles.textareaSidebar : ""}${className ? " " + className : ""}`;

  return (
    <textarea
      rows={rows}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      ref={ref}
      disabled={disabled}
      spellCheck={shouldSpellCheck}
      className={classes}
    />
  );
};

export default React.forwardRef<HTMLTextAreaElement, TextAreaProps>(TextArea);
