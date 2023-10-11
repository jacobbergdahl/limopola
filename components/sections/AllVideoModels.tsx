import { ALL_VIDEO_MODELS, MODEL } from "../../general/constants";
import { Button } from "../Button";

type AllVideoModelsProps = {
  handleModelChange: (event: any) => void;
  model: MODEL;
};

export const AllVideoModels = ({
  handleModelChange,
  model,
}: AllVideoModelsProps) => {
  const allVideoModels = ALL_VIDEO_MODELS.map((_model) => (
    <Button
      value={_model}
      onClick={handleModelChange}
      isSelected={_model === model}
      key={_model}
    />
  ));

  return (
    <>
      <h3>Video generation</h3>
      {allVideoModels}
    </>
  );
};
