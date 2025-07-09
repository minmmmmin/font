export const fetchFontAnalytics = async () => {
  const response = await fetch("/Analytics.json");
  const data = await response.json();
  return data;
};
