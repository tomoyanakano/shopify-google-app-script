import { Store } from "../store/store";

export class ShopifyService {
  public request<TResponse = unknown>({
    store,
    method,
    path,
    payload,
  }: {
    store: Store;
    method: "post" | "get" | "put" | "delete";
    path: string;
    payload?: object;
  }): TResponse {
    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: method,
      muteHttpExceptions: true,
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": store.accessToken,
      },
      payload: JSON.stringify(payload),
    };

    const response = UrlFetchApp.fetch(`https://${store.url}${path}`, options);
    const json = JSON.parse(response.getContentText());

    if (json.errors) {
      throw new Error(JSON.stringify(json.errors));
    }

    return json as TResponse;
  }

  public query<TResponse = unknown, TVariables = unknown>({
    store,
    query,
    variables,
  }: {
    store: Store;
    query: string;
    variables: TVariables;
  }): TResponse {
    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: "post",
      muteHttpExceptions: true,
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": store.accessToken,
      },
      payload: JSON.stringify({
        query: query,
        variables: variables,
      }),
    };

    const response = UrlFetchApp.fetch(
      `https://${store.url}/admin/api/2023-07/graphql.json`,
      options,
    );
    const json = JSON.parse(response.getContentText());

    if (json.errors) {
      throw new Error(JSON.stringify(json.errors));
    }

    return json.data as TResponse;
  }
}
