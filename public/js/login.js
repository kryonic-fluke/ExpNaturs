/*eslint-disable*/
import { showAlert } from './alert';
export const login = async (email, password) => {
  try {
    const response = await fetch('http://127.0.0.1:4000/api/v1/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    if (response.ok && data && data.status === 'success') {
      showAlert('success', 'login successfull!!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    showAlert('error', error.message);
  }
};

// Inside login.js
export const logout = async () => {
  try {
    const response = await fetch('http://127.0.0.1:4000/api/v1/users/logout', {
      method: 'GET',
    });

    if (response.status == 200) {
      showAlert('success', 'logout successfull');
      window.setTimeout(() => location.reload(true), 1200);
    } else {
      let errorMessage = 'Logout failed';
      try {
        const data = await response.json();
        if (data && data.message) {
          errorMessage = data.message;
        }
      } catch (jsonError) {
        console.warn(
          '--- logout() FAILED (non-200), could not parse JSON error ---',
        ); // ADD THIS
      }
      throw new Error(errorMessage);
    }
  } catch (error) {
    showAlert('error', error);
  }
};
