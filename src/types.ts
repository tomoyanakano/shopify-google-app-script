export enum ApiVersion {
  October22 = "2022-10",
  January23 = "2023-01",
  April23 = "2023-04",
  July23 = "2023-07",
  October23 = "2023-10",
  January24 = "2024-01",
  Unstable = "unstable",
}

export const LIBRARY_NAME = "Shopify API Library";
export const LATEST_API_VERSION = ApiVersion.January24;

export type ApiResponse<T> = {
  data?: T;
  statusCode: number;
};
