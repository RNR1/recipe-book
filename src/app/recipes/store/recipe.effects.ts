import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';

import * as RecipeActions from './recipe.actions';
import { Recipe } from '../recipe.model';
import * as fromApp from 'src/app/store/app.reducer';

const mapIngredients = (recipes: Recipe[]) => {
  if (!recipes) {
    return [];
  }
  return recipes.map((recipe) => {
    return {
      ...recipe,
      ingredients: recipe.ingredients.length ? recipe.ingredients : [],
    };
  });
};

@Injectable()
export class RecipeEffects {
  @Effect()
  fetchRecipes = this.actions$.pipe(
    ofType(RecipeActions.FETCH_RECIPES),
    switchMap(() => {
      return this.http.get<Recipe[]>(
        'https://recipe-book-45665.firebaseio.com/recipes.json'
      );
    }),
    map(mapIngredients),
    map((recipes) => new RecipeActions.SetRecipes(recipes))
  );

  @Effect({ dispatch: false })
  storeRecipes = this.actions$.pipe(
    ofType(RecipeActions.STORE_RECIPES),
    withLatestFrom(this.store.select('recipe')),
    switchMap(([_, { recipes }]) => {
      return this.http.put(
        'https://recipe-book-45665.firebaseio.com/recipes.json',
        recipes
      );
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}
}
