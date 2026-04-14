const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Core fetch wrapper with error handling
 * @param {string} endpoint - The API path (e.g., '/user')
 * @param {object} options - Fetch options (method, body, headers)
 */
export async function apiRequest(endpoint, options = {}) {
  const { method = "GET", body, headers, ...extraOptions } = options;

  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...extraOptions,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    // Parse JSON response
    const data = await response.json();

    // fetch doesn't throw on 404/500, so we check response.ok manually
    if (!response.ok) {
      throw new Error(data.message || `Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    // Log the error for debugging or send to a logging service
    console.error("API Request Error:", error.message);
    throw error; // Re-throw so the calling component can handle it
  }
}