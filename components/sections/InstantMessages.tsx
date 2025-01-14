import { Button } from "../../components/Button";

export type InstantMessagesProps = {
  handleRepeatLastMessage: (event: any) => void;
  handleOneWordMessage: (event: any) => void;
};

export const InstantMessages = ({
  handleRepeatLastMessage,
  handleOneWordMessage,
}: InstantMessagesProps) => {
  return (
    <>
      <h3>Instant messages</h3>
      <Button value="One word response" onClick={handleOneWordMessage} />
      <Button
        value="Repeat your last message"
        onClick={handleRepeatLastMessage}
      />
    </>
  );
};
