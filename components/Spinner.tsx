import { ALL_SLOW_MODELS, MODEL } from "../general/constants";
import styles from "./Spinner.module.css";

export enum SPINNER_TYPE {
  TRANSPARENT = 0,
  BLUE,
}

type SpinnerProps = {
  show: boolean;
  model: MODEL;
  timer: number;
  classNames?: string;
  spinnerType?: SPINNER_TYPE;
};

export const Spinner = ({
  show,
  model,
  classNames,
  timer,
  spinnerType = SPINNER_TYPE.TRANSPARENT,
}: SpinnerProps) => {
  if (!show) {
    return null;
  }

  return (
    <div className={classNames}>
      <img
        src={
          spinnerType === SPINNER_TYPE.TRANSPARENT
            ? "./spinner_transparent.gif"
            : "./spinner_bg.gif"
        }
        alt="Loading"
      />
      {ALL_SLOW_MODELS.indexOf(model) > -1 && (
        <i>
          This model may take a very long time to generate a response. Please be
          patient.
        </i>
      )}
      {timer >= 0 && <span className={styles.timer}>{timer.toFixed(2)}s</span>}
    </div>
  );
};
