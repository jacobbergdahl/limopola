import { isHidingUiAtom, themeAtom } from "@/pages/atoms";
import styles from "./UiControls.module.css";
import { useAtom } from "jotai";
import { THEME } from "@/general/constants";
import { useEffect } from "react";

const ClickableIcon = ({
  icon,
  alt,
  onClick,
  isSelected,
}: {
  icon: string;
  alt: string;
  onClick: () => void;
  isSelected?: boolean;
}) => {
  return (
    <button
      className={`${styles.clickableIcon}${isSelected ? " " + styles.selected : ""}`}
      onClick={onClick}
      type="button"
    >
      <img src={icon} alt={alt} />
    </button>
  );
};

export const UiControlsTheming = () => {
  const [isHidingUi, setIsHidingUi] = useAtom(isHidingUiAtom);
  const [theme, setTheme] = useAtom(themeAtom);

  const handleThemeChange = (theme: THEME) => {
    setTheme(theme);
    document.documentElement.setAttribute("data-theme", theme);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className={styles.uiControls}>
      <div
        className={`${styles.uiGroup}${isHidingUi ? " " + styles.invisible : ""}`}
      >
        <ClickableIcon
          icon="./icons/mdi--theme.svg"
          alt="Select theme: default"
          onClick={() => handleThemeChange(THEME.Default)}
          isSelected={theme === THEME.Default}
        />
        <ClickableIcon
          icon="./icons/mdi--color.svg"
          alt="Select theme: colorful"
          onClick={() => handleThemeChange(THEME.Colorful)}
          isSelected={theme === THEME.Colorful}
        />
        <ClickableIcon
          icon="./icons/mdi--surfing.svg"
          alt="Select theme: gradient"
          onClick={() => handleThemeChange(THEME.Gradient)}
          isSelected={theme === THEME.Gradient}
        />
        <ClickableIcon
          icon="./icons/mdi--moon-and-stars.svg"
          alt="Select theme: dark"
          onClick={() => handleThemeChange(THEME.Dark)}
          isSelected={theme === THEME.Dark}
        />
      </div>
      <div className={styles.uiGroup}>
        <ClickableIcon
          icon={
            isHidingUi ? "./icons/mdi--eye-off.svg" : "./icons/mdi--eye.svg"
          }
          alt={isHidingUi ? "Show UI" : "Hide UI"}
          onClick={() => setIsHidingUi(!isHidingUi)}
        />
      </div>
    </div>
  );
};

type UiControlsChatOptionsProps = {
  handleDownload: () => void;
  handleScrollToBottom: () => void;
};

export const UiControlsChatOptions = ({
  handleDownload,
  handleScrollToBottom,
}: UiControlsChatOptionsProps) => {
  return (
    <div className={styles.uiControls}>
      <div className={styles.uiGroup}>
        <ClickableIcon
          icon="./icons/mdi--download.svg"
          alt="Download"
          onClick={handleDownload}
        />
      </div>
      <div className={styles.uiGroup}>
        <ClickableIcon
          icon="./icons/mdi--chevron-double-down.svg"
          alt="Scroll to bottom"
          onClick={handleScrollToBottom}
        />
      </div>
    </div>
  );
};
