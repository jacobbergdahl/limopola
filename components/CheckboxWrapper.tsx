import { Checkbox, CheckboxProps } from "./Checkbox";
import styles from "./CheckboxWrapper.module.css";

export type CheckboxWrapperProps = CheckboxProps & {
  title: string;
  description: string;
};

export const CheckboxWrapper = ({
  isChecked,
  onChange,
  label,
  title,
  description,
}: CheckboxWrapperProps) => {
  return (
    <>
      <h3>{title}</h3>
      <span className={styles.span}>{description}</span>
      <Checkbox isChecked={isChecked} onChange={onChange} label={label} />
    </>
  );
};
