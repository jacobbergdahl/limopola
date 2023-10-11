import { GenericSpinnerSection } from "../GenericSpinnerSection";

export type PresencePenaltyProps = {
  presencePenalty: number;
  technicalPresencePenalty: number;
  handlePresencePenaltyChange: (event: any) => void;
  isUsingDefault: boolean;
  handleCheckboxChange: (event: any) => void;
};

export const PresencePenalty = ({
  presencePenalty,
  technicalPresencePenalty,
  handlePresencePenaltyChange,
  isUsingDefault,
  handleCheckboxChange,
}: PresencePenaltyProps) => {
  return (
    <GenericSpinnerSection
      sectionName="Presence penalty"
      displayValue={presencePenalty}
      technicalValue={technicalPresencePenalty}
      handleSliderChange={handlePresencePenaltyChange}
      isUsingDefault={isUsingDefault}
      handleCheckboxChange={handleCheckboxChange}
    />
  );
};
