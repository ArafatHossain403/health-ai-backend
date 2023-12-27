export function calculateAgeInYears(birth_date: Date): number {
  const days =
    (new Date().getTime() - birth_date.getTime()) / 1000 / 60 / 60 / 24;
  const years = (days / 365).toFixed(0);
  return Number(years);
}

export function generateRandPedigree(decimal = 3): number {
  const rand = Math.random();
  return Number(rand.toFixed(decimal));
}

export const getMLServerBaseUrl = () => {
  let url = process.env.ML_SERVER_BASE_URL || 'http://localhost:8080';
  url = cleanEndSlash(url);
  return url;
};

export function cleanMultiSlash(endpoint, replaceWith = '/') {
  endpoint = endpoint.replace(/\/{2,}/g, replaceWith);
  return endpoint;
}

export function cleanStartingSlash(endpoint: string): string {
  endpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  return endpoint;
}

export function cleanEndSlash(endpoint: string): string {
  endpoint = endpoint.endsWith('/')
    ? endpoint.substring(0, endpoint.length - 1)
    : endpoint;
  return endpoint;
}

export async function callFetcher(
  base_url: string,
  endpoint: string,
  method: string,
  data?: any,
  headers?: any,
): Promise<any> {
  endpoint = cleanMultiSlash(endpoint);
  endpoint = cleanStartingSlash(endpoint);

  const response = await fetch(`${base_url}/${endpoint}`, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}
