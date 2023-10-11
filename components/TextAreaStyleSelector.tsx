import { SetStateAction } from "react";
import { TEXTAREA_STYLE } from "../general/constants";
import { SubtleButton } from "./Button";
import styles from "./TextAreaStyleSelector.module.css";

type TextAreaStyleSelectorProps = {
  textAreaStyle: TEXTAREA_STYLE;
  setTextAreaStyle: (value: SetStateAction<TEXTAREA_STYLE>) => void;
};

export const TextAreaStyleSelector = ({
  textAreaStyle,
  setTextAreaStyle,
}: TextAreaStyleSelectorProps) => {
  return (
    <div className={styles.textAreaStyleSelectorButtonWrapper}>
      <SubtleButton
        value="Default style"
        onClick={() => setTextAreaStyle(TEXTAREA_STYLE.Default)}
        isSelected={textAreaStyle === TEXTAREA_STYLE.Default}
      />
      <SubtleButton
        value="Code style"
        onClick={() => setTextAreaStyle(TEXTAREA_STYLE.Code)}
        isSelected={textAreaStyle === TEXTAREA_STYLE.Code}
      />
    </div>
  );
};
