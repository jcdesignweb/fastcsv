const isValidUrl = (value: string) => {
  const urlPattern = new RegExp(
    "^(https?:\\/\\/)?" +
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
      "((\\d{1,3}\\.){3}\\d{1,3}))" +
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
      "(\\?[;&a-z\\d%_.~+=-]*)?" +
      "(\\#[-a-z\\d_]*)?$",
    "i",
  );
  return !!urlPattern.test(value);
};

const sanitizeString = (str: string) =>
  str.replace(/(\r+)|(^\n+)|(\n{2,})|(\n+$)/g, "");

const removeQuotes = (str: string) => str.replace(/['"]+/g, "");

export { isValidUrl, sanitizeString, removeQuotes };
