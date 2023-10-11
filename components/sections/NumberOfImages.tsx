import { Button } from "../Button";
import styles from "./NumberOfImages.module.css";

export type NumberOfImagesProps = {
  numberOfImagesToGenerate: number;
  setNumberOfImagesToGenerate: (numberOfImagesToGenerate: number) => void;
};

export const NumberOfImages = ({
  numberOfImagesToGenerate,
  setNumberOfImagesToGenerate,
}: NumberOfImagesProps) => {
  return (
    <>
      <h3>Number of images</h3>
      <div className={styles.fourButtonsContainer}>
        <Button
          value="1"
          onClick={() => setNumberOfImagesToGenerate(1)}
          isSelected={numberOfImagesToGenerate === 1}
        />
        <Button
          value="2"
          onClick={() => setNumberOfImagesToGenerate(2)}
          isSelected={numberOfImagesToGenerate === 2}
        />
        <Button
          value="3"
          onClick={() => setNumberOfImagesToGenerate(3)}
          isSelected={numberOfImagesToGenerate === 3}
        />
        <Button
          value="4"
          onClick={() => setNumberOfImagesToGenerate(4)}
          isSelected={numberOfImagesToGenerate === 4}
        />
      </div>
    </>
  );
};
