export const formatDateVN = (timestamp: string | number) => {
  return new Date(timestamp).toLocaleDateString();
};

export const randomNumber = () => Math.trunc(Math.random() * 10);

export const genrateTrackingNum = (tracking = "GHNXXXXXXXXVN") => {
  return tracking.replace(/X/g, randomNumber().toString());
};
