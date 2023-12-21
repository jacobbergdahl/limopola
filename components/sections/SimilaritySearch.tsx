import { Checkbox } from "../Checkbox";
import styles from "./SimilaritySearch.module.css";

export type SimilaritySearchProps = {
  isUsingSimilaritySearch: boolean;
  setIsUsingSimilaritySearch: (isUsingSimilaritySearch: boolean) => void;
};

export const SimilaritySearch = ({
  isUsingSimilaritySearch,
  setIsUsingSimilaritySearch,
}: SimilaritySearchProps) => {
  return (
    <>
      <h3>Similarity search</h3>
      <span className={styles.span}>
        With similarity search enabled, an algorithm will try to send relevant
        information scrapped from the url's your provided, instead of just
        sending all text.
      </span>
      <Checkbox
        isChecked={isUsingSimilaritySearch}
        onChange={setIsUsingSimilaritySearch}
        label="Use similarity search"
      />
    </>
  );
};
