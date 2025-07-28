import { CustomResponse } from '../types/commonTypes';

const PASSWORD_MAX_LENGTH = 15;
const PASSWORD_MIN_LENGTH = 6;

function isEmailValid(email: string): boolean {
  const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailReg.test(email);
}

function hasRequiredFields(email: string, password: string): boolean {
  return email.trim().length > 0 && password.trim().length > 0;
}

export function validateEmailAndPassword(email: string, password: string): CustomResponse {
  if (!hasRequiredFields(email, password)) {
    return {
      success: false,
      message: 'Missing required fields'
    };
  }

  if (!isEmailValid(email)) {
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


export function validateEmailAndPasswordWithLengths(email: string, password: string): CustomResponse {
  if (!hasRequiredFields(email, password)) {
    return {
      success: false,
      message: 'Missing required fields'
    };
  }

  if (!isEmailValid(email)) {
    return {
      success: false,
      message: 'Invalid email'
    };
  }

  if (password.length < PASSWORD_MIN_LENGTH || password.length > PASSWORD_MAX_LENGTH){
    return {
      success: false,
      message: 'Invalid length of password'
    }
  }

  return {
    success: true,
    message: 'Successfully validated'
  }
}

