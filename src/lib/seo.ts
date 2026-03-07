const normalized = (process.env.NEXT_PUBLIC_SITE_URL || "https://homerestyler.app").replace(/\/$/, "");

export const SITE_URL = normalized;

export const absoluteUrl = (path: string) => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
};
