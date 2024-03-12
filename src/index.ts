type ShopifyAdminAPIVersion = "2023-04" | "2023-07" | "2023-10" | "2024-01" | "2024-04" | "unstable";
const LATEST_API_VERSION: ShopifyAdminAPIVersion = "2024-01";

class ShopifyApp {
  constructor(
    private domain: string,
    private apiKey: string,
    private accessToken: string,
    private version: ShopifyAdminAPIVersion = LATEST_API_VERSION,
  ) {}

  public request<TResponse = unknown, TPayload = unknown>({
    method,
    path,
    payload,
  }: {
    method: "post" | "get" | "put" | "delete";
    path: string;
    payload: TPayload;
  }) {
    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: method,
      muteHttpExceptions: true,
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": this.accessToken,
      },
      payload: JSON.stringify(payload),
    };

    const response = UrlFetchApp.fetch(
      `https://${this.domain}${path}`,
      options,
    );
    const json = JSON.parse(response.getContentText());

    if (json.errors) {
      console.error(JSON.stringify(json.errors));
      throw new Error(JSON.stringify(json.errors));
    }

    return json as TResponse;
  }

  public query<TResponse = unknown, TVariables = object>({
    query,
    variables,
  }: {
    query: string;
    variables?: TVariables;
  }): TResponse {
    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: "post",
      muteHttpExceptions: true,
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": this.accessToken,
      },
      payload: JSON.stringify({
        query: query,
        variables: variables,
      }),
    };

    const response = UrlFetchApp.fetch(
      `https://${this.domain}/admin/api/${this.version}/graphql.json`,
      options,
    );
    const json = JSON.parse(response.getContentText());

    if (json.errors) {
      console.error(JSON.stringify(json.errors));
      throw new Error(JSON.stringify(json.errors));
    }

    return json.data as TResponse;
  }
}
