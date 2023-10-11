import { NumberTextField } from "../NumberTextField";

export type RequestedNumberOfTokensProps = {
  requestedNumberOfTokens: number;
  setRequestedNumberOfTokens: (numberOfImagesToGenerate: number) => void;
};

export const RequestedNumberOfTokens = ({
  requestedNumberOfTokens,
  setRequestedNumberOfTokens,
}: RequestedNumberOfTokensProps) => {
  return (
    <div>
      <h3>Number of tokens</h3>
      <p>
        This will request the model to write a reply in roughly this number of
        tokens, but it's not guaranteed to follow the instruction. 0 = the
        default is used.
      </p>
      <NumberTextField
        value={requestedNumberOfTokens}
        setValue={setRequestedNumberOfTokens}
      />
    </div>
  );
};
