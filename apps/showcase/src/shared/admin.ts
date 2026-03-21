const fallbackAdminBaseUrl = "https://admin.art.solofarm.ru";

export function getAdminLoginHref() {
  const baseUrl = process.env.NEXT_PUBLIC_ADMIN_BASE_URL || fallbackAdminBaseUrl;
  return `${baseUrl.replace(/\/$/, "")}/login/`;
}
