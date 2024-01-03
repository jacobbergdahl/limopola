import { Checkbox, CheckboxProps } from "./Checkbox";
import styles from "./CheckBoxWrapper.module.css";

export type CheckBoxWrapperProps = CheckboxProps & {
  title: string;
  description: string;
};

export const CheckBoxWrapper = ({
  isChecked,
  onChange,
  label,
  title,
  description,
}: CheckBoxWrapperProps) => {
  return (
    <>
      <h3>{title}</h3>
      <span className={styles.span}>{description}</span>
      <Checkbox isChecked={isChecked} onChange={onChange} label={label} />
    </>
  );
};
