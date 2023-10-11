import { Button } from "../../components/Button";
import { ALL_AUDIO_MODELS, MODEL } from "../../general/constants";

type AllAudioModelsProps = {
  handleModelChange: (event: any) => void;
  model: MODEL;
};

export const AllAudioModels = ({
  handleModelChange,
  model,
}: AllAudioModelsProps) => {
  const allAudioModels = ALL_AUDIO_MODELS.map((_model) => (
    <Button
      value={_model}
      onClick={handleModelChange}
      isSelected={_model === model}
      key={_model}
    />
  ));

  return (
    <>
      <h3>Audio generation</h3>
      {allAudioModels}
    </>
  );
};
