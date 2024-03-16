export const contextAddedImages = (numberOfImages?: number): string[] => {
  return [
    `In a previous task, you created ${numberOfImages} images to be used in this project.`,
  ];
};

export const contextAddedVideos = (numberOfVideos?: number): string[] => {
  return [
    `In a previous task, you created ${numberOfVideos} videos to be used in this project.`,
  ];
};

export const contextAddedNarration = (numberOfClips?: number): string[] => {
  return [
    `In a previous task, you created ${numberOfClips} narration sound clips to be used in this project.`,
  ];
};
