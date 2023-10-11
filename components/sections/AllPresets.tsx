import { ALL_IMAGE_PRESETS, IMAGE_PRESET } from "../../general/constants";
import { Button } from "../Button";

type AllImagePresetsProps = {
  handlePresetChange: (event: any) => void;
  imagePreset: IMAGE_PRESET;
};

export const AllImagePresets = ({
  handlePresetChange,
  imagePreset,
}: AllImagePresetsProps) => {
  return (
    <>
      <h3>Presets</h3>
      {ALL_IMAGE_PRESETS.map((_preset) => {
        return (
          <Button
            value={_preset}
            onClick={handlePresetChange}
            isSelected={_preset === imagePreset}
            key={_preset}
          />
        );
      })}
    </>
  );
};
