import {
  ACCESS_TOKEN_HEADER,
  CLIENT,
  DEFAULT_CONTENT_TYPE,
  DEFAULT_RETRY_WAIT_TIME,
  RETRIABLE_STATUS_CODES,
} from "../../constants";
import { getCurrentSupportedApiVersions_ } from "../../libs/api-versions";
import {
  validateApiVersion_,
  validateDomainAndGetStoreUrl_,
  validateRequiredAccessToken_,
  validateRetries_,
} from "../../libs/validations";
import { generateApiUrlFormatter_ } from "../../libs/formatters";
import { ApiResponse, LATEST_API_VERSION } from "../../types";
import {
  GetRequestOptions,
  PostRequestOptions,
  PutRequestOptions,
  DeleteRequestOptions,
} from "./types";
import { generateHttpFetch_ } from "../../libs/http-fetch";

/**
 * @class
 * Admin Rest API Client
 */
export class AdminRestApiClient {
  private storeDomain: string;
  private accessToken: string;
  private apiVersion: string;
  private scheme: "https" | "http";

  constructor(
    storeDomain: string,
    accessToken: string,
    apiVersion?: string,
    scheme?: "https" | "http",
  ) {
    this.storeDomain = storeDomain;
    this.accessToken = accessToken;
    this.apiVersion = apiVersion || LATEST_API_VERSION;
    this.scheme = scheme || "https";
  }

  /**
   * Make a request to the Shopify Admin API
   *
   * @param path
   * @param options
   * @returns {ApiResponse<TResponse>}
   */
  private request<TResponse>(
    path: string,
    {
      method,
      data,
      headers,
      searchParams,
      retries: clientRetries = 0,
      defaultRetryTime = DEFAULT_RETRY_WAIT_TIME,
      formatPaths = true,
    }: {
      method: GoogleAppsScript.URL_Fetch.HttpMethod;
      data?: Record<string, any> | string;
      headers?: Record<string, string | number | string[]>;
      searchParams?: Record<string, any>;
      retries?: number;
      defaultRetryTime?: number;
      apiVersion?: string;
      formatPaths?: boolean;
    },
  ): ApiResponse<TResponse> {
    const currentSupportedApiVersions = getCurrentSupportedApiVersions_();
    //
    const storeUrl = validateDomainAndGetStoreUrl_({
      client: CLIENT,
      storeDomain: this.storeDomain,
    }).replace("https://", `${this.scheme}://`);

    validateApiVersion_({
      client: CLIENT,
      currentSupportedApiVersions,
      apiVersion: this.apiVersion,
    });
    validateRequiredAccessToken_(this.accessToken);
    validateRetries_({ client: CLIENT, retries: clientRetries });

    const apiUrlFormatter = generateApiUrlFormatter_(
      storeUrl,
      this.apiVersion,
      formatPaths,
    );

    const httpFetch = generateHttpFetch_({
      defaultRetryWaitTime: defaultRetryTime,
      client: CLIENT,
      retriableCodes: RETRIABLE_STATUS_CODES,
    });

    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: method,
      muteHttpExceptions: true,
      headers: {
        "Content-Type": DEFAULT_CONTENT_TYPE,
        Accept: DEFAULT_CONTENT_TYPE,
        [ACCESS_TOKEN_HEADER]: this.accessToken,
        ...headers,
      },
      payload: data,
    };

    const url = apiUrlFormatter(path, searchParams ?? {}, this.apiVersion);

    const response: GoogleAppsScript.URL_Fetch.HTTPResponse = httpFetch(
      url,
      options,
      1,
      clientRetries ?? clientRetries,
    );
    const responseObj: TResponse = JSON.parse(response.getContentText());

    return {
      data: responseObj,
      statusCode: response.getResponseCode(),
    };
  }

  /**
   * Get request
   *
   * @param path
   * @param options
   */
  public get<TResponse = unknown>({
    path,
    options,
  }: {
    path: string;
    options?: GetRequestOptions;
  }): ApiResponse<TResponse> {
    return this.request(path, { method: "get", ...options });
  }

  /**
   * Put request
   *
   * @param path
   * @param options
   */
  public put<TResponse = unknown>({
    path,
    options,
  }: {
    path: string;
    options?: PutRequestOptions;
  }): ApiResponse<TResponse> {
    return this.request<TResponse>(path, { method: "put", ...options });
  }

  /**
   * Post request
   *
   * @param path
   * @param options
   */
  public post<TResponse = unknown>({
    path,
    options,
  }: {
    path: string;
    options?: PostRequestOptions;
  }): ApiResponse<TResponse> {
    return this.request<TResponse>(path, { method: "post", ...options });
  }

  /**
   * Delete request
   *
   * @param path
   * @param options
   */
  public delete<TResponse = unknown>({
    path,
    options,
  }: {
    path: string;
    options?: DeleteRequestOptions;
  }): ApiResponse<TResponse> {
    return this.request<TResponse>(path, { method: "delete", ...options });
  }
}
