export function calculateAgeInYears(birth_date: Date): number {
  const days =
    (new Date().getTime() - birth_date.getTime()) / 1000 / 60 / 60 / 24;
  const years = (days / 365).toFixed(0);
  return Number(years);
}

export function calculateBMI(height_cm: number, weight_kg: number): number {
  height_cm = Number(height_cm);
  weight_kg = Number(weight_kg);
  const height_meter = height_cm / 100;
  const bmi = weight_kg / height_meter ** 2;
  return Number(bmi.toFixed(1));
}

export function calculateMeanBP(s_bp: number, d_bp: number): number {
  s_bp = Number(s_bp);
  d_bp = Number(d_bp);
  const mbp = d_bp + (s_bp - d_bp) / 3;
  return Number(mbp.toFixed(2));
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
