import { AdminGraphQLApiClient, createAdminGraphQLApiClient_ } from "./admin-api-client/graphql/client";
import { AdminRestApiClient, createAdminRestApiClient_ } from "./admin-api-client/rest/client";

/**
 * Create a new instance of the AdminRestApiClient
 *
 * @param {string} storeDomain - The domain of the store
 * @param {string} accessToken - The access token to authenticate the requests
 * @param {string} [apiVersion=Latest Api Version] - The version of the API to use
 * @returns {AdminRestApiClient} - The instance of the AdminRestApiClient
 * */
function adminRestClient(
  storeDomain: string,
  accessToken: string,
  apiVersion: string,
): AdminRestApiClient {
  return createAdminRestApiClient_({
    storeDomain,
    accessToken,
    apiVersion,
  })
}

/**
 * Create a new instance of the AdminGraphQLApiClient
 *
 * @param {string} storeDomain - The domain of the store
 * @param {string} accessToken - The access token to authenticate the requests
 * @param {string} [apiVersion=Latest Api Version] - The version of the API to use
 * @returns {AdminGraphQLApiClient} - The instance of the AdminGraphQLApiClient
 * */
function adminGraphQLClient(
  storeDomain: string,
  accessToken: string,
  apiVersion: string,
): AdminGraphQLApiClient {
  return createAdminGraphQLApiClient_({
    storeDomain,
    accessToken,
    apiVersion,
  })
}
