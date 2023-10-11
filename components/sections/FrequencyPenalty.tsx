import { GenericSpinnerSection } from "../GenericSpinnerSection";

export type FrequencyPenaltyProps = {
  frequencyPenalty: number;
  technicalFrequencyPenalty: number;
  handleFrequencyPenaltyChange: (event: any) => void;
  isUsingDefault: boolean;
  handleCheckboxChange: (event: any) => void;
};

export const FrequencyPenalty = ({
  frequencyPenalty,
  technicalFrequencyPenalty,
  handleFrequencyPenaltyChange,
  isUsingDefault,
  handleCheckboxChange,
}: FrequencyPenaltyProps) => {
  return (
    <GenericSpinnerSection
      sectionName="Frequency penalty"
      displayValue={frequencyPenalty}
      technicalValue={technicalFrequencyPenalty}
      handleSliderChange={handleFrequencyPenaltyChange}
      isUsingDefault={isUsingDefault}
      handleCheckboxChange={handleCheckboxChange}
    />
  );
};
