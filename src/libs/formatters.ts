export const generateApiUrlFormatter_ = (
  storeUrl: string,
  defaultApiVersion: string,
  formatPaths: boolean = true,
) => {
  const convertSearchParamsToString = (
    params: Record<string, any>,
    prefix: string = "",
  ): string[] => {
    let parts: string[] = [];
    Object.keys(params).forEach((key) => {
      const fullKey = prefix ? `${prefix}[${key}]` : key;
      const value = params[key];
      if (value !== null && typeof value === "object") {
        parts = parts.concat(convertSearchParamsToString(value, fullKey));
      } else {
        parts.push(
          `${encodeURIComponent(fullKey)}=${encodeURIComponent(String(value))}`,
        );
      }
    });
    return parts;
  };

  return (
    path: string,
    searchParams: Record<string, any>,
    apiVersion: string = defaultApiVersion,
  ): string => {
    const urlApiVersion = apiVersion.trim();
    let cleanPath = path.replace(/^\//, "");
    if (formatPaths) {
      if (!cleanPath.startsWith("admin")) {
        cleanPath = `admin/api/${urlApiVersion}/${cleanPath}`;
      }
      if (!cleanPath.endsWith(".json")) {
        cleanPath = `${cleanPath}.json`;
      }
    }

    const paramsString = convertSearchParamsToString(searchParams).join("&");
    const queryString = paramsString ? `?${paramsString}` : "";

    return `${storeUrl}/${cleanPath}${queryString}`;
  };
};
