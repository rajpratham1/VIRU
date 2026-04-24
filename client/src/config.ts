const rawApiBaseUrl = import.meta.env.VITE_API_URL?.trim();

// Default to same-origin so the built frontend can run behind the same backend host.
export const API_BASE_URL = rawApiBaseUrl || '';
