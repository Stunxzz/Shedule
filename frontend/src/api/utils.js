// api/utils.js
export const unwrapResults = (data) => {
  if (Array.isArray(data)) return data;       // старият случай
  if (data && data.results) return data.results; // новият DRF pagination
  return [];
};