import { CLIENT, MAX_RETRIES, MIN_RETRIES } from "../admin-api-client/constants";

/**
 * Validate the provided API version
 *
 * @param {string} client - The name of the client
 * @param {string[]} currentSupportedApiVersions - The currently supported API versions
 * @param {string} apiVersion - The API version to validate
 * @returns {void}
 *
 * @throws {Error} - If the provided API version is invalid
 * @throws {Error} - If the provided API version is likely deprecated or not supported
 * */
export const validateApiVersion_ = ({
  client,
  currentSupportedApiVersions,
  apiVersion,
}: {
  client: string;
  currentSupportedApiVersions: string[];
  apiVersion: string;
}) => {
  const versionError = `${client}: the provided apiVersion ("${apiVersion}")`;
  const supportedVersion = `Currently supported API versions: ${currentSupportedApiVersions.join(
    ", ",
  )}`;

  if (!apiVersion || typeof apiVersion !== "string") {
    throw new Error(`${versionError} is invalid. ${supportedVersion}`);
  }

  const trimmedApiVersion = apiVersion.trim();

  if (!currentSupportedApiVersions.includes(trimmedApiVersion)) {
    console.warn(
      `${versionError} is likely deprecated or not supported. ${supportedVersion}`,
    );
  }
};

export function validateDomainAndGetStoreUrl_({
  client,
  storeDomain,
}: {
  client: string;
  storeDomain: string | undefined;
}) {
  try {
    if (!storeDomain || typeof storeDomain !== "string") {
      throw new Error();
    }

    const trimmedDomain = storeDomain.trim();

    const protocolUrl = trimmedDomain.match(/^https?:/)
      ? trimmedDomain
      : `https://${trimmedDomain}`;

    return protocolUrl;
  } catch (_error) {
    console.error(_error);
    throw new Error(
      `${client}: a valid store domain ("${storeDomain}") must be provided`,
    );
  }
}

export function validateRequiredAccessToken_(accessToken: string) {
  if (!accessToken) {
    throw new Error(`${CLIENT}: an access token must be provided`);
  }
}

export function validateServerSideUsage_() {
  if (typeof window !== "undefined") {
    throw new Error(`${CLIENT}: this client should not be used in the browser`);
  }
}

export function validateRetries_({
  client,
  retries,
}: {
  client: string;
  retries?: number;
}) {
  if (
    retries !== undefined &&
    (typeof retries !== "number" ||
      retries < MIN_RETRIES ||
      retries > MAX_RETRIES)
  ) {
    throw new Error(
      `${client}: The provided "retries" value (${retries}) is invalid - it cannot be less than ${MIN_RETRIES} or greater than ${MAX_RETRIES}`,
    );
  }
}
