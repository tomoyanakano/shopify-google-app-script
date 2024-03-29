export const generateApiUrlFormatter = (
  storeUrl: string,
  defaultApiVersion: string,
  formatPaths = true,
) => {
  return (
    path: string,
    searchParams: Record<string, any>,
    apiVersion?: string,
  ) => {
    function convertValue(params: URLSearchParams, key: string, value: any) {
      if (Array.isArray(value)) {
        value.forEach((arrayValue) =>
          convertValue(params, `${key}[]`, arrayValue),
        );
        return;
      } else if (typeof value === "object") {
        Object.entries(value).forEach(([objKey, objValue]) =>
          convertValue(params, `${key}[${objKey}]`, objValue),
        );
        return;
      }

      params.append(key, String(value));
    }

    const urlApiVersion = (apiVersion ?? defaultApiVersion).trim();
    let cleanPath = path.replace(/^\//, "");
    if (formatPaths) {
      if (!cleanPath.startsWith("admin")) {
        cleanPath = `admin/api/${urlApiVersion}/${cleanPath}`;
      }
      if (!cleanPath.endsWith(".json")) {
        cleanPath = `${cleanPath}.json`;
      }
    }

    const params = new URLSearchParams();
    if (searchParams) {
      for (const [key, value] of Object.entries(searchParams)) {
        convertValue(params, key, value);
      }
    }
    const queryString = params.toString() ? `?${params.toString()}` : "";

    return `${storeUrl}/${cleanPath}${queryString}`;
  };
};
