import { Button } from "../../components/Button";
import { ALL_IMAGE_MODELS, MODEL } from "../../general/constants";

type AllImageModelsProps = {
  handleModelChange: (event: any) => void;
  model: MODEL;
};

export const AllImageModels = ({
  handleModelChange,
  model,
}: AllImageModelsProps) => {
  const allImageModels = ALL_IMAGE_MODELS.map((_model) => (
    <Button
      value={_model}
      onClick={handleModelChange}
      isSelected={_model === model}
      key={_model}
    />
  ));

  return (
    <>
      <h3>Image generation</h3>
      {allImageModels}
    </>
  );
};
