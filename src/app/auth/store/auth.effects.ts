import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Actions, ofType, createEffect } from '@ngrx/effects';
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
  return AuthActions.authenticate({ user, redirect: true });
};

const handleError = ({ error }) => {
  let errorMessage = 'An Unknown message occurred';
  if (!error || !error.error) {
    return of(AuthActions.authenticateFail({ errorMessage }));
  }
  switch (error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'This email already exists';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'This password is invalid';
      break;
  }
  return of(AuthActions.authenticateFail({ errorMessage }));
};

@Injectable()
export class AuthEffects {
  authSignup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signupStart),
      switchMap(({ email, password }) => {
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
    )
  );

  authLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginStart),
      switchMap(({ email, password }) => {
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
    )
  );

  authRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.authenticate),
        tap(({ redirect }) => redirect && this.router.navigate(['/']))
      ),
    { dispatch: false }
  );

  autoLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.autoLogin),
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
          return AuthActions.authenticate({ user: loadedUser });
        }

        return { type: 'REFRESH' };
      })
    )
  );

  authLogout = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.authService.clearLogoutTimer();
          localStorage.removeItem('userData');
          this.router.navigate(['/auth']);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}
}
