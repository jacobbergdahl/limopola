import { mkdir, writeFile } from "node:fs/promises";

// This is a NextJS convention. These two paths point to the same place in the end.
// Since these static files are served on the frontend, they need to be in the public directory.
const IMAGES_SAVED_IN_DIRECTORY = "public/ai-images";
const IMAGES_ACCESSED_THROUGH_DIRECTORY = "ai-images";

const getRandomString = (length: number = 12): string => {
  return Math.random().toString(36).slice(-length);
};

export const saveMedia = async (
  message: string,
  media: any,
  fileFormat: string = "jpg"
): Promise<string[]> => {
  const fileName = message
    .toLowerCase()
    // Replaces any character that's not a letter or number with a dash
    .replace(/[^a-z0-9]/g, "-")
    .substring(0, 20)
    // Removes dashes at the very start and end
    .replace(/^-+|-+$/g, "");

  // Creates the images directory if it doesn't already exist
  await mkdir(IMAGES_SAVED_IN_DIRECTORY, { recursive: true });

  const mediaFromApi = Array.isArray(media) ? media : [media];
  const filePaths = await Promise.all(
    mediaFromApi.map(async (apiOutput) => {
      // The filename needs a random suffix to avoid overwriting past images.
      // This could also be solved by checking if a file with this fileName already exists,
      // but this is more efficient. Using the index wouldn't work in case the image(s)
      // were created in a different API call as users re-use prompts.
      const finalFilenameWithFileExtension = `${fileName}-${getRandomString()}.${fileFormat}`;

      await writeFile(
        `${IMAGES_SAVED_IN_DIRECTORY}/${finalFilenameWithFileExtension}`,
        apiOutput
      );
      return `${IMAGES_ACCESSED_THROUGH_DIRECTORY}/${finalFilenameWithFileExtension}`;
    })
  );

  return filePaths;
};
