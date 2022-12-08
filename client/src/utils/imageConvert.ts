export const convertHttps = (url?: string) => {
  if (!url) return '';

  if (url.startsWith('http://')) {
    return 'https' + url.substring(4);
  }

  return url;
}