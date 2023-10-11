import { GenericSpinnerSection } from "../GenericSpinnerSection";

export type TemperatureProps = {
  temperature: number;
  technicalTemperature: number;
  handleTemperatureChange: (event: any) => void;
  isUsingDefault: boolean;
  handleCheckboxChange: (event: any) => void;
};

export const Temperature = ({
  temperature,
  technicalTemperature,
  handleTemperatureChange,
  isUsingDefault,
  handleCheckboxChange,
}: TemperatureProps) => {
  return (
    <GenericSpinnerSection
      sectionName="Temperature"
      displayValue={temperature}
      technicalValue={technicalTemperature}
      handleSliderChange={handleTemperatureChange}
      isUsingDefault={isUsingDefault}
      handleCheckboxChange={handleCheckboxChange}
    />
  );
};
