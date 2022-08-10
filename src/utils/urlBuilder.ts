const urlBuilder = (
  url: string,
  params: { [key: string]: any } | null
): string => {
  if (params === null) return url;

  const entries = Object.entries(params).filter(
    ([key, _]) => key !== undefined && key !== null
  );
  if (Object.keys(params).length > 0) {
    url += "?";

    for (let i = 0; i < entries.length; i++) {
      const [key, value] = entries[i];
      if (i !== 0) {
        url += "&";
      }

      url += `${key}=${value}`;
    }
  }

  return url;
};

export default urlBuilder;
