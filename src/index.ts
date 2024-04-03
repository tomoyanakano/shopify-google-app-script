import { AdminRestApiClient } from "./admin-api-client/rest/client";

/**
 * Create a new instance of the AdminRestApiClient
 *
 * @param {string} storeDomain - The domain of the store
 * @param {string} accessToken - The access token to authenticate the requests
 * @param {string} apiVersion - The version of the API to use
 * @returns {AdminRestApiClient} - The instance of the AdminRestApiClient
 * */
function restClient(
  storeDomain: string,
  accessToken: string,
  apiVersion: string,
) {
  return new AdminRestApiClient(storeDomain, accessToken, apiVersion);
}
