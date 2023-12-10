import { DateTime, DurationObjectUnits } from "luxon";

export function useStringLimiter(str: string | undefined, size: number) {
  return !str ? "" : str.length <= size ? str : str.substring(0, size) + "...";
}

export function useThousandSeparator(number: number): string {
  const thousandSeparator = Intl.NumberFormat("id");
  return thousandSeparator.format(number);
}

export function useIsoToLocalTimeFormat(isoTime: string): string {
  return DateTime.fromISO(isoTime).toFormat("yyyy-MM-dd HH:mm");
}

export function useTimeIntervalDifferenceCounter(
  isoStartTime: string,
  isoEndTime: string
) {
  const currentTime = DateTime.now();
  const startTimeToCompare = DateTime.fromISO(isoStartTime);
  const endTimeToCompare = DateTime.fromISO(isoEndTime);

  const diffStatus: string =
    currentTime < startTimeToCompare
      ? "UPCOMING"
      : currentTime > endTimeToCompare
      ? "PAST"
      : "ONGOING";
  const difference: DurationObjectUnits | undefined =
    diffStatus === "UPCOMING"
      ? currentTime
          .diff(startTimeToCompare, [
            "years",
            "months",
            "weeks",
            "days",
            "hours",
            "minutes",
          ])
          .toObject()
      : diffStatus === "PAST"
      ? currentTime
          .diff(endTimeToCompare, [
            "years",
            "months",
            "weeks",
            "days",
            "hours",
            "minutes",
          ])
          .toObject()
      : undefined;

  const differenceLenght: string = difference?.years
    ? difference.years + " years"
    : difference?.months
    ? difference.months + " months"
    : difference?.weeks
    ? difference.weeks + " weeks"
    : difference?.days
    ? difference.days + " days"
    : difference?.hours
    ? difference.hours + " hours"
    : (difference?.minutes ?? 0) + " minutes";

  const differenceDescription =
    diffStatus === "UPCOMING"
      ? `in ${differenceLenght}`
      : diffStatus === "PAST"
      ? `${differenceLenght} ago`
      : "ONGOING";
  return { diffStatus, difference, differenceLenght, differenceDescription };
}
