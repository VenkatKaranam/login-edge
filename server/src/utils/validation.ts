import { CustomResponse } from '../types/commonTypes';

/**
 * Validate email format and required fields
 */
export function validateEmailAndPassword(email: string, password: string): CustomResponse {
  if (email.length <= 0 || password.length <= 0) {
    return {
      success: false,
      message: 'Missing required fields'
    };
  }

  const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emailReg.test(email)) {
    return {
      success: false,
      message: 'Invalid email'
    };
  }

  return {
    success: true,
    message: 'Successfully validated'
  };
}
