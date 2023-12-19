import TextArea from "../TextArea";
import { TextField } from "../TextField";

export type UrlsToScrapeProps = {
  urlsToScrape: string;
  setUrlsToScrape: (urlsToScrape: string) => void;
};

export const UrlsToScrape = ({
  urlsToScrape,
  setUrlsToScrape,
}: UrlsToScrapeProps) => {
  return (
    <>
      <h3>Urls</h3>
      <span>
        Enter the urls that you wish for the AI model to read information from.
        You can add any number of urls by separating them with commas. The AI
        will not crawl through the urls you add, but instead only visit the
        absolute url you point towards.
      </span>
      <TextArea
        value={urlsToScrape}
        handleChange={(e) => setUrlsToScrape(e.target.value)}
        name="urls-to-scrape"
        placeholder=""
        isInSidebar={true}
      />
    </>
  );
};
