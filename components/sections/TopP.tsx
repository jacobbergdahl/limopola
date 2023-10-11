import { GenericSpinnerSection } from "../GenericSpinnerSection";

export type TopPProps = {
  topP: number;
  technicalTopP: number;
  handleTopPChange: (event: any) => void;
  isUsingDefault: boolean;
  handleCheckboxChange: (event: any) => void;
};

export const TopP = ({
  topP,
  technicalTopP,
  handleTopPChange,
  isUsingDefault,
  handleCheckboxChange,
}: TopPProps) => {
  return (
    <GenericSpinnerSection
      sectionName="Top p"
      displayValue={topP}
      technicalValue={technicalTopP}
      handleSliderChange={handleTopPChange}
      isUsingDefault={isUsingDefault}
      handleCheckboxChange={handleCheckboxChange}
    />
  );
};
