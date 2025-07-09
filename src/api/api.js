export const fetchFonts = async (apiKey) => {
  const res = await fetch(
    `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}`
  );
  const data = await res.json();
  return data.items;
};
