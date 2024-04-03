import { AdminRestApiClient } from "./admin-api-client/rest/client";

const restCliet = ({
  storeDomain,
  accessToken,
  apiVersion,
}: {
  storeDomain: string;
  accessToken: string;
  apiVersion: string;
}) => {
  return new AdminRestApiClient(storeDomain, accessToken, apiVersion);
};
