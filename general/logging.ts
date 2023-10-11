export const prettyLog = (message: string) => {
  const styling =
    "background-color: #003366; padding: 0.3rem 1.5rem; font-size: 1.2em; line-height: 1.4em; color: white;";
  console.log("%c" + message, styling);
};

export const subtleLog = (message: string) => {
  const styling =
    "padding: 0.3rem 1.5rem; font-size: 1.2em; line-height: 1.4em; font-style: italic; border: 1px solid white; display: inline-block;";
  console.log("%c" + message, styling);
};
