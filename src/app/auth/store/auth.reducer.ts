import { Action, createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { User } from './../user.model';

export interface State {
  user: User;
  authError: string;
  loading: boolean;
}

const initialState: State = {
  user: null,
  authError: null,
  loading: false,
};

export function authReducer(authState: State | undefined, authAction: Action) {
  return createReducer(
    initialState,
    on(AuthActions.loginStart, AuthActions.signupStart, (state) => ({
      ...state,
      authError: null,
      loading: true,
    })),
    on(AuthActions.authenticate, (state, action) => ({
      ...state,
      authError: null,
      user: action.user,
      loading: false,
    })),
    on(AuthActions.authenticateFail, (state, action) => ({
      ...state,
      user: null,
      authError: action.errorMessage,
      loading: false,
    })),
    on(AuthActions.logout, (state) => ({ ...state, user: null })),
    on(AuthActions.handleError, (state) => ({ ...state, authError: null }))
  )(authState, authAction);
}
