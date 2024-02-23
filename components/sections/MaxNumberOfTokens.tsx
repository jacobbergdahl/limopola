import { NumberTextField } from "../TextField";

export type MaxNumberOfTokensProps = {
  maxNumberOfTokens: number;
  setMaxNumberOfTokens: (numberOfImagesToGenerate: number) => void;
};

export const MaxNumberOfTokens = ({
  maxNumberOfTokens,
  setMaxNumberOfTokens,
}: MaxNumberOfTokensProps) => {
  return (
    <div>
      <h3>Max number of tokens</h3>
      <p>
        This will request the model to write a reply that is less than this
        number of tokens, but it's not guaranteed to follow the instruction. 0 =
        no limit is passed in.
      </p>
      <NumberTextField
        value={maxNumberOfTokens}
        setValue={setMaxNumberOfTokens}
      />
    </div>
  );
};
