import { createAction, props } from '@ngrx/store';
import { User } from './../user.model';

export const loginStart = createAction(
  '[Auth] Login Start',
  props<{ email: string; password: string }>()
);

export const signupStart = createAction(
  '[Auth] Signup Start',
  props<{ email: string; password: string }>()
);

export const authenticate = createAction(
  '[Auth] Authenticate',
  props<{ user: User; redirect?: boolean }>()
);

export const authenticateFail = createAction(
  '[Auth] Authenticate Fail',
  props<{ errorMessage: string }>()
);

export const handleError = createAction('[Auth] Handle Error');

export const autoLogin = createAction('[Auth] Auto Login');

export const logout = createAction('[Auth] Logout');
