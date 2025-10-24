import { useAtom } from "jotai";
import { shouldModelReasonAtom } from "../../pages/atoms";
import { CheckboxWrapper } from "../CheckboxWrapper";

export const ModelReasoning = () => {
  const [shouldModelReason, setShouldModelReason] = useAtom(
    shouldModelReasonAtom
  );

  const handleReasoningToggle = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setShouldModelReason(event.target.checked);
  };

  return (
    <CheckboxWrapper
      isChecked={shouldModelReason}
      onChange={handleReasoningToggle}
      label="Enable model reasoning"
      title="Model Reasoning"
      description="When enabled, the model will use advanced reasoning capabilities to provide more thoughtful and analytical responses."
    />
  );
};
