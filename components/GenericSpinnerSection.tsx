import { Checkbox } from "./Checkbox";

export type GenericSpinnerSectionProps = {
  sectionName: string;
  displayValue: number;
  technicalValue: number;
  isUsingDefault: boolean;
  handleCheckboxChange: (event: any) => void;
  handleSliderChange: (event: any) => void;
  min?: number;
  max?: number;
};

export const GenericSpinnerSection = ({
  sectionName,
  displayValue,
  technicalValue,
  handleSliderChange,
  isUsingDefault,
  handleCheckboxChange,
  min = 0,
  max = 100,
}: GenericSpinnerSectionProps) => {
  return (
    <>
      <h3>
        {sectionName} ({technicalValue.toFixed(2)})
      </h3>
      <Checkbox
        isChecked={isUsingDefault}
        onChange={handleCheckboxChange}
        label="Use default"
      />
      <input
        type="range"
        min={min}
        max={max}
        value={displayValue}
        onChange={handleSliderChange}
        disabled={isUsingDefault}
      />
    </>
  );
};
