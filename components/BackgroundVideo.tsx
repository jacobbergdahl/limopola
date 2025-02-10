import styles from "./BackgroundVideo.module.css";

type BackgroundVideoProps = {
  isRunning: boolean;
  type: "reasoning" | "agent";
};

const getVideoSrc = (type: "reasoning" | "agent") => {
  if (type === "reasoning") {
    return process.env.NEXT_PUBLIC_REASONING_BACKGROUND_VIDEO_SRC;
  }
  return process.env.NEXT_PUBLIC_AGENT_BACKGROUND_VIDEO_SRC;
};

export const BackgroundVideo = ({ isRunning, type }: BackgroundVideoProps) => {
  const src = getVideoSrc(type);
  return (
    <>
      {!!src && (
        <video
          key={`${type}-bg-video`}
          ref={(video) => {
            if (video && isRunning) {
              video.play();
            }
          }}
          onEnded={(event) => {
            if (!isRunning) {
              return;
            }
            const video = event.target as HTMLVideoElement;
            video.currentTime = 0;
            video.play();
          }}
          muted
          crossOrigin="anonymous"
          controls={false}
          className={`${styles.backgroundVideo} ${
            type === "agent"
              ? styles.backgroundVideoAgent
              : styles.backgroundVideoReasoning
          }`}
          src={src}
        />
      )}
    </>
  );
};
