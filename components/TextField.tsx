import styles from "./TextField.module.css";

type TextFieldProps = {
  value: any;
  setValue: (value: any) => void;
  isNumeric?: boolean;
};

export const TextField = ({ value, setValue, isNumeric }: TextFieldProps) => {
  return (
    <input
      type={isNumeric ? "number" : "text"}
      value={value.toString()}
      onChange={(event) =>
        setValue(isNumeric ? Number(event.target.value) : event.target.value)
      }
      className={styles.textField}
    />
  );
};

export const NumberTextField = ({ value, setValue }: TextFieldProps) => {
  return <TextField value={value} setValue={setValue} isNumeric={true} />;
};
