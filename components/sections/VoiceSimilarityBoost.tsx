export type VoiceSimilarityBoostProps = {
  voiceSimilarityBoost: number;
  technicalVoiceSimilarityBoost: number;
  handleVoiceSimilarityBoostChange: (event: any) => void;
};

export const VoiceSimilarityBoost = ({
  voiceSimilarityBoost,
  technicalVoiceSimilarityBoost,
  handleVoiceSimilarityBoostChange,
}: VoiceSimilarityBoostProps) => {
  return (
    <>
      <h3>Similarity Boost ({technicalVoiceSimilarityBoost.toFixed(2)})</h3>
      <input
        type="range"
        min="0"
        max="100"
        value={voiceSimilarityBoost}
        onChange={handleVoiceSimilarityBoostChange}
      />
    </>
  );
};
