import { Action } from '@ngrx/store';

import { User } from './../user.model';

export const SIGNUP_START = '[Auth] Signup Start';
export const LOGIN_START = '[Auth] Login Start';
export const AUTHENTICATE = '[Auth] Authenticate';
export const AUTHENTICATE_FAIL = '[Auth] Authenticate Fail';
export const HANDLE_ERROR = '[Auth] Handle Error';
export const AUTO_LOGIN = '[Auth] Auto Login';
export const LOGOUT = '[Auth] Logout';

export class SignupStart implements Action {
  readonly type = SIGNUP_START;

  constructor(public payload: { email: string; password: string }) {}
}

export class LoginStart implements Action {
  readonly type = LOGIN_START;

  constructor(public payload: { email: string; password: string }) {}
}

export class Authenticate implements Action {
  readonly type = AUTHENTICATE;
  constructor(public payload: User, public redirect: boolean = false) {}
}

export class AuthenticateFail implements Action {
  readonly type = AUTHENTICATE_FAIL;

  constructor(public payload: string) {}
}

export class HandleError implements Action {
  readonly type = HANDLE_ERROR;
}

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export type AuthActions =
  | SignupStart
  | LoginStart
  | Authenticate
  | AuthenticateFail
  | HandleError
  | AutoLogin
  | Logout;
