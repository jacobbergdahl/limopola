import styles from "./NumberTextField.module.css";

type NumberTextFieldProps = {
  value: any;
  setValue: (value: any) => void;
};

export const NumberTextField = ({ value, setValue }: NumberTextFieldProps) => {
  return (
    <input
      type="number"
      value={value.toString()}
      onChange={(event) => setValue(Number(event.target.value))}
      className={styles.textField}
    />
  );
};
