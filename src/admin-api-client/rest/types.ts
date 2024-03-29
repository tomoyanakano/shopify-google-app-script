type SearchParamField = string | number;
export type SearchParamFields =
  | SearchParamField
  | SearchParamField[]
  | Record<string, SearchParamField | SearchParamField[]>;
export type SearchParams = Record<string, SearchParamFields>;

export type HeaderOptions = Record<string, string | number | string[]>;

export interface GetRequestOptions {
  headers?: HeaderOptions;
  data?: Record<string, any> | string;
  searchParams?: SearchParams;
  retries?: number;
  apiVersion?: string;
}

export interface PostRequestOptions extends GetRequestOptions {
  data: Required<GetRequestOptions>["data"];
}

export interface PutRequestOptions extends PostRequestOptions {}

export interface DeleteRequestOptions extends GetRequestOptions {}

export type RequestOptions = (GetRequestOptions | PostRequestOptions) & {
  method: GoogleAppsScript.URL_Fetch.HttpMethod;
};

export interface AdminRestApiClientOptions extends AdminApiClientOptions {
  scheme?: "https" | "http";
  defaultRetryTime?: number;
  formatPaths?: boolean;
}
