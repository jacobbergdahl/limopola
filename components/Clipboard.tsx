import React from "react";
import styles from "./Clipboard.module.css";
import { CopyToClipboard } from "react-copy-to-clipboard";

type ClipboardProps = {
  title?: string;
  code: string;
};

export const Clipboard = ({ title, code }: ClipboardProps) => {
  return (
    <div className={styles.codeBlockTop}>
      {title && title.length > 0 && (
        <span className={styles.codeBlockTopName}>{title}</span>
      )}
      <CopyToClipboard text={code}>Copy</CopyToClipboard>
    </div>
  );
};
