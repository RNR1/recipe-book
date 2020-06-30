import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, catchError, map, tap } from 'rxjs/operators';

import * as AuthActions from './auth.actions';
import { AuthService } from './../auth.service';
import { environment } from 'src/environments/environment';
import { AuthResponseData } from './../authResponseData.model';
import { User } from './../user.model';

const handleAuthentication = ({ email, localId, idToken, expiresIn }) => {
  const expirationTime = +expiresIn * 1000;
  const expirationDate = new Date(new Date().getTime() + expirationTime);
  const user = new User(email, localId, idToken, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return new AuthActions.Authenticate(user, true);
};

const handleError = ({ error }) => {
  let errorMessage = 'An Unknown message occurred';
  if (!error || !error.error) {
    return of(new AuthActions.AuthenticateFail(errorMessage));
  }
  switch (error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'This email already exists';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'This password is invalid';
      break;
  }
  return of(new AuthActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {
  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap(({ payload: { email, password } }: AuthActions.SignupStart) => {
      return this.http
        .post<AuthResponseData>(
          'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
            environment.apiKey,
          {
            email,
            password,
            returnSecureToken: true,
          }
        )
        .pipe(
          tap(({ expiresIn }) => {
            this.authService.setLogoutTimer(+expiresIn * 1000);
          }),
          map(handleAuthentication),
          catchError(handleError)
        );
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap(({ payload: { email, password } }: AuthActions.LoginStart) => {
      return this.http
        .post<AuthResponseData>(
          'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
            environment.apiKey,
          {
            email,
            password,
            returnSecureToken: true,
          }
        )
        .pipe(
          tap(({ expiresIn }) => {
            this.authService.setLogoutTimer(+expiresIn * 1000);
          }),
          map(handleAuthentication),
          catchError(handleError)
        );
    })
  );

  @Effect({ dispatch: false })
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE),
    tap(({ redirect }: AuthActions.Authenticate) => {
      if (redirect) {
        this.router.navigate(['/']);
      }
    })
  );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData) {
        return { type: 'REFRESH' };
      }

      const loadedUser = new User(
        userData.email,
        userData.id,
        userData._token,
        new Date(userData.tokenExpirationDate)
      );

      if (loadedUser.token) {
        const expirationDuration =
          new Date(userData.tokenExpirationDate).getTime() -
          new Date().getTime();
        this.authService.setLogoutTimer(expirationDuration);
        return new AuthActions.Authenticate(loadedUser);
      }

      return { type: 'REFRESH' };
    })
  );

  @Effect({ dispatch: false })
  authLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem('userData');
      this.router.navigate(['/auth']);
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}
}
