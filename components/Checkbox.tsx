import styles from "./Checkbox.module.css";

export type CheckboxProps = {
  isChecked: boolean;
  onChange: (event: any) => void;
  label: string;
};

export const Checkbox = ({ isChecked, onChange, label }: CheckboxProps) => {
  return (
    <label className={styles.checkBox}>
      <input type="checkbox" checked={isChecked} onChange={onChange} />
      <span>{label}</span>
    </label>
  );
};
