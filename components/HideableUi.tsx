import { useAtom } from "jotai";
import { isHidingUiAtom } from "@/pages/atoms";
import { ReactNode } from "react";
import styles from "./HideableUi.module.css";

type HideableUIProps = {
  children: ReactNode;
  className?: string;
};

export const HideableUI = ({ children, className = "" }: HideableUIProps) => {
  const [isHidingUi] = useAtom(isHidingUiAtom);

  return (
    <div className={`${className}${isHidingUi ? " " + styles.hidden : ""}`}>
      {children}
    </div>
  );
};
