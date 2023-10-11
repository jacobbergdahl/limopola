import { Button } from "../../components/Button";

export type InstantMessagesProps = {
  handleRepeatLastMessage: (event: any) => void;
  handleElaborate: (event: any) => void;
  handleContinue: (event: any) => void;
};

export const InstantMessages = ({
  handleRepeatLastMessage,
  handleElaborate,
  handleContinue,
}: InstantMessagesProps) => {
  return (
    <>
      <h3>Instant messages</h3>
      <Button value="Ask the AI to elaborate" onClick={handleElaborate} />
      <Button
        value="Repeat your last message"
        onClick={handleRepeatLastMessage}
      />
      <Button value="Ask the AI to continue" onClick={handleContinue} />
    </>
  );
};
