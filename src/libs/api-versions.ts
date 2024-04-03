const getQuarterMonth_ = (quarter: number) => {
  const month = quarter * 3 - 2;
  return month === 10 ? month : `0${month}`;
};

const getPrevousVersion_ = (
  year: number,
  quarter: number,
  nQuarter: number,
) => {
  const versionQuarter = quarter - nQuarter;

  if (versionQuarter <= 0) {
    return `${year - 1}-${getQuarterMonth_(versionQuarter + 4)}`;
  }

  return `${year}-${getQuarterMonth_(versionQuarter)}`;
};

export const getCurrentApiVersion_ = () => {
  const date = new Date();
  const month = date.getUTCMonth();
  const year = date.getUTCFullYear();

  const quarter = Math.floor(month / 3 + 1);

  return {
    year,
    quarter,
    version: `${year}-${getQuarterMonth_(quarter)}`,
  };
};

export function getCurrentSupportedApiVersions_() {
  const { year, quarter, version: currentVersion } = getCurrentApiVersion_();

  const nextVersion =
    quarter === 4
      ? `${year + 1}-01`
      : `${year}-${getQuarterMonth_(quarter + 1)}`;

  return [
    getPrevousVersion_(year, quarter, 3),
    getPrevousVersion_(year, quarter, 2),
    getPrevousVersion_(year, quarter, 1),
    currentVersion,
    nextVersion,
    "unstable",
  ];
}
