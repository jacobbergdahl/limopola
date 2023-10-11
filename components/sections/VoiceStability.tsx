export type VoiceStabilityProps = {
  voiceStability: number;
  technicalVoiceStability: number;
  handleVoiceStabilityChange: (event: any) => void;
};

export const VoiceStability = ({
  voiceStability,
  technicalVoiceStability,
  handleVoiceStabilityChange,
}: VoiceStabilityProps) => {
  return (
    <>
      <h3>Stability ({technicalVoiceStability.toFixed(2)})</h3>
      <input
        type="range"
        min="0"
        max="100"
        value={voiceStability}
        onChange={handleVoiceStabilityChange}
      />
    </>
  );
};
