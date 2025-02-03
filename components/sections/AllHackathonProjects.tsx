import { Button } from "../Button";
import { ALL_HACKATHON_MODELS, MODEL } from "../../general/constants";

type AllHackathonProjectsProps = {
  handleModelChange: (event: any) => void;
  model: MODEL;
};

export const AllHackathonProjects = ({
  handleModelChange,
  model,
}: AllHackathonProjectsProps) => {
  const allHackathonProjects = ALL_HACKATHON_MODELS.map((_model) => (
    <Button
      value={_model}
      onClick={handleModelChange}
      isSelected={_model === model}
      key={_model}
    />
  ));

  return (
    <>
      <h3>Hackathons</h3>
      {allHackathonProjects}
    </>
  );
};
