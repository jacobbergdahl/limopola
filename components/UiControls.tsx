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

export const UiControls = () => {
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
          alt="Select default theme"
          onClick={() => handleThemeChange(THEME.Default)}
          isSelected={theme === THEME.Default}
        />
        <ClickableIcon
          icon="./icons/mdi--color.svg"
          alt="Select default theme"
          onClick={() => handleThemeChange(THEME.Colorful)}
          isSelected={theme === THEME.Colorful}
        />
        <ClickableIcon
          icon="./icons/mdi--surfing.svg"
          alt="Select default theme"
          onClick={() => handleThemeChange(THEME.Gradient)}
          isSelected={theme === THEME.Gradient}
        />
        <ClickableIcon
          icon="./icons/mdi--moon-and-stars.svg"
          alt="Select default theme"
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
