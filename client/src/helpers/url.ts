export const queryString = (params: Record<string, unknown>) => {
  return Object.keys(params)
    .map((key) => {
      if (Array.isArray(params[key])) {
        return params[key]
          .map((item, index) => {
            return (
              encodeURIComponent(key) +
              '[' +
              index +
              ']=' +
              encodeURIComponent(item)
            );
          })
          .join('&');
      } else {
        if (params[key] || Number.isInteger(params[key])) {
          // return `${key}=${params[key]}`;
          return (
            encodeURIComponent(key) +
            '=' +
            encodeURIComponent(params[key] as string | number)
          );
        }
        return null;
      }
    })
    .filter((item) => item)
    .join('&');
};

export const replaceObjectValue = (
  exists: Record<string, unknown>,
  fresh: Record<string, unknown>
) => {
  return Object.keys(exists).forEach((key) => {
    if (key in fresh) {
      exists[key] = fresh[key];
    }
  });
};
