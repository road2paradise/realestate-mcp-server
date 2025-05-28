// Helper to build query string from params object
export function buildQuery(params: Record<string, any>) {
  const esc = encodeURIComponent;
  return Object.entries(params)
    .map(([k, v]) =>
      Array.isArray(v)
        ? v.map((val: any) => `${esc(k)}[]=${esc(val)}`).join("&")
        : `${esc(k)}=${esc(v)}`
    )
    .join("&");
}
