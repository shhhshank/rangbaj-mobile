import { store } from './store';
import { fetchAuthToken, setToken } from './slices/authSlice';

// Credentials can be loaded from env, secure storage, or config in a real app
const ADMIN_EMAIL = 'shhhshank-admin@gmail.com';
const ADMIN_PASSWORD = 'password';

/**
 * Call this on app start to refresh the admin token.
 * Returns a promise that resolves when done.
 */
export async function refreshAdminToken() {
  try {
    const resultAction = await store.dispatch(
      fetchAuthToken({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
    );
    if (fetchAuthToken.fulfilled.match(resultAction)) {
      // Token is set in Redux by extraReducer
      return true;
    } else {
      // Optionally handle error
      return false;
    }
  } catch (err) {
    // Optionally handle error
    return false;
  }
}
