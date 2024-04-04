import {
  CLIENT,
  DEFAULT_RETRY_WAIT_TIME,
  RETRIABLE_STATUS_CODES,
} from "../admin-api-client/constants";

interface GenerateHttpFetchOptions {
  client?: string;
  defaultRetryWaitTime?: number;
  retriableCodes?: number[];
}

export const generateHttpFetch_ = ({
  client = CLIENT,
  defaultRetryWaitTime = DEFAULT_RETRY_WAIT_TIME,
  retriableCodes = RETRIABLE_STATUS_CODES,
}: GenerateHttpFetchOptions) => {
  const httpFetch = (
    url: string,
    requestParams: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions,
    count: number,
    maxRetries: number,
  ): GoogleAppsScript.URL_Fetch.HTTPResponse => {
    const nextCount = count + 1;
    const maxTries = maxRetries + 1;
    let response: GoogleAppsScript.URL_Fetch.HTTPResponse | undefined;

    try {
      response = UrlFetchApp.fetch(url, requestParams);
      const responseCode = response.getResponseCode();

      if (
        responseCode != 200 &&
        retriableCodes.includes(responseCode) &&
        nextCount <= maxTries
      ) {
        throw new Error();
      }

      return response;
    } catch (error) {
      if (nextCount <= maxTries) {
        const headers = response?.getHeaders() as Record<string, string> | null;
        if (!headers) {
          Utilities.sleep(defaultRetryWaitTime);

          return httpFetch(url, requestParams, nextCount, maxRetries);
        }
        const retryAfter = headers["Retry-After"];
        Utilities.sleep(
          retryAfter ? parseInt(retryAfter, 10) : defaultRetryWaitTime,
        );

        return httpFetch(url, requestParams, nextCount, maxRetries);
      }

      console.error(
        `${client}: failed to fetch data after ${maxTries} attempts`,
      );

      console.error(error);

      throw new Error();
    }
  };

  return httpFetch;
};
