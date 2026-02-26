import Cookies from 'js-cookie';

/**
 * Get the value of a cookie by name
 * @param {string} name - The name of the cookie
 * @returns {string|null} - The cookie value or null if not found
 */
export function getCookie(name) {
  return Cookies.get(name) || null;
}

/**
 * Get the authentication token from cookies
 * @returns {string|null} - The token value or null if not found
 */
export function getToken() {
  return getCookie('token');
}