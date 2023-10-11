import { Button } from "../../components/Button";
import { ALL_TEXT_MODELS, MODEL } from "../../general/constants";

type AllTextModelsProps = {
  handleModelChange: (event: any) => void;
  model: MODEL;
};

export const AllTextModels = ({
  handleModelChange,
  model,
}: AllTextModelsProps) => {
  const allTextModels = ALL_TEXT_MODELS.map((_model) => (
    <Button
      value={_model}
      onClick={handleModelChange}
      isSelected={_model === model}
      key={_model}
    />
  ));

  return (
    <>
      <h3>Text generation</h3>
      {allTextModels}
    </>
  );
};
