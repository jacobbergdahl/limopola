import { CheckBoxWrapper } from "../CheckboxWrapper";

export type SimilaritySearchProps = {
  isUsingSimilaritySearch: boolean;
  setIsUsingSimilaritySearch: (isUsingSimilaritySearch: boolean) => void;
};

export const SimilaritySearch = ({
  isUsingSimilaritySearch,
  setIsUsingSimilaritySearch,
}: SimilaritySearchProps) => {
  return (
    <CheckBoxWrapper
      isChecked={isUsingSimilaritySearch}
      onChange={setIsUsingSimilaritySearch}
      label="Use similarity search"
      title="Similarity search"
      description="With similarity search enabled, an algorithm will try to send relevant information scrapped from the url's your provided, instead of just sending all text."
    />
  );
};
