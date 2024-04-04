import { ACCESS_TOKEN_HEADER, CLIENT, DEFAULT_CONTENT_TYPE, DEFAULT_RETRY_WAIT_TIME, RETRIABLE_STATUS_CODES } from "../constants";
import { getCurrentSupportedApiVersions_ } from "../../libs/api-versions";
import { validateApiVersion_, validateDomainAndGetStoreUrl_, validateRequiredAccessToken_, validateRetries_, validateServerSideUsage_ } from "../../libs/validations";
import { ApiResponse, LATEST_API_VERSION } from "../../types";
import { generateHttpFetch_ } from "../../libs/http-fetch";
import { generateGraphQLApiUrlFormatter_ } from "../../libs/formatters";

/**
 * @class
 * Admin GraphQL API Client
 */
export class AdminGraphQLApiClient {
  private storeUrl: string;
  private accessToken: string;
  private apiVersion: string;


  /**
   * @constructor
   * @param storeUrl
   * @param accessToken
   * @param apiVersion
   */
  constructor(storeDomain: string, accessToken: string, apiVersion?: string) {
    this.storeUrl = storeDomain;
    this.accessToken = accessToken;
    this.apiVersion = apiVersion || LATEST_API_VERSION;
  }


  public query<TResponse = unknown>({
    query,
    variables,
    headers,
    retries: clientRetries = 0,
    defaultRetryTime = DEFAULT_RETRY_WAIT_TIME,
  }: {
    query: string,
    variables?: Record<string, any>,
    headers?: Record<string, string | number | string[]>,
    retries?: number,
    defaultRetryTime?: number,
  }): ApiResponse<TResponse> {

    validateRetries_({ client: CLIENT, retries: clientRetries });
    const baseApiVersionValidationParams = {
      client: CLIENT,
      currentSupportedApiVersions: getCurrentSupportedApiVersions_(),
    };

    const apiUrlFormatter = generateGraphQLApiUrlFormatter_(
      this.storeUrl,
      this.apiVersion,
      baseApiVersionValidationParams,
    );

    const httpFetch = generateHttpFetch_({
      defaultRetryWaitTime: defaultRetryTime,
      client: CLIENT,
      retriableCodes: RETRIABLE_STATUS_CODES,
    });

    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: "post",
      muteHttpExceptions: true,
      headers: {
        "Content-Type": DEFAULT_CONTENT_TYPE,
        Accept: DEFAULT_CONTENT_TYPE,
        [ACCESS_TOKEN_HEADER]: this.accessToken,
        ...headers,
      },
      payload: JSON.stringify({
        query,
        variables,
      }),
    };

    const url = apiUrlFormatter(this.apiVersion);
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
}


/**
 * Create a new instance of the AdminGraphQLApiClient
 *
 * @param {string} storeDomain - The domain of the store
 * @param {string} accessToken - The access token to authenticate the requests
 * @param {string} [apiVersion=Latest Api Version] - The version of the API to use
 * @returns {AdminGraphQLApiClient} - The instance of the AdminGraphQLApiClient
 * */
export const createAdminGraphQLApiClient_ = ({
  storeDomain,
  accessToken,
  apiVersion = LATEST_API_VERSION,
}: {
  storeDomain: string;
  accessToken: string;
  apiVersion?: string;
}): AdminGraphQLApiClient => {
  const currentSupportedApiVersions = getCurrentSupportedApiVersions_();
  const storeUrl = validateDomainAndGetStoreUrl_({
    client: CLIENT,
    storeDomain: storeDomain,
  });

  validateServerSideUsage_();
  validateApiVersion_({
    client: CLIENT,
    currentSupportedApiVersions,
    apiVersion: apiVersion,
  });
  validateRequiredAccessToken_(accessToken);

  return new AdminGraphQLApiClient(storeUrl, accessToken, apiVersion);
} 
