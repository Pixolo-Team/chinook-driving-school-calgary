/**
 * Returns today's local date as YYYY-MM-DD.
 */
export const getLocalTodayDateValue = (): string => {
  const todayDateInfo = new Date();
  const yearValue = todayDateInfo.getFullYear();
  const monthValue = String(todayDateInfo.getMonth() + 1).padStart(2, "0");
  const dayValue = String(todayDateInfo.getDate()).padStart(2, "0");

  return `${yearValue}-${monthValue}-${dayValue}`;
};
