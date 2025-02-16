import { CheckboxWrapper } from "../CheckboxWrapper";

export type SearchAccessProps = {
  isGivingAiSearchAccess: boolean;
  setIsGivingAiSearchAccess: (isGivingAiSearchAccess: boolean) => void;
};

export const SearchAccess = ({
  isGivingAiSearchAccess,
  setIsGivingAiSearchAccess,
}: SearchAccessProps) => {
  return (
    <CheckboxWrapper
      isChecked={isGivingAiSearchAccess}
      onChange={setIsGivingAiSearchAccess}
      label="Give AI search access"
      title="Online connection"
      description="You can give the AI the ability for it to autonomously figure out if it needs to search online for information to handle your request. If so, it will look for information online. This will make two calls to the LLM, and require a (free) search API key (see .env.example)."
    />
  );
};
