import { Action, createReducer, on } from '@ngrx/store';

import * as RecipeActions from './recipe.actions';
import { Recipe } from './../recipe.model';

export interface State {
  recipes: Recipe[];
}

const initialState: State = {
  recipes: [],
};

export function recipeReducer(
  recipeState: State | undefined,
  recipeAction: Action
) {
  return createReducer(
    initialState,
    on(RecipeActions.addRecipe, (state, action) => ({
      ...state,
      recipes: state.recipes.concat({ ...action.recipe }),
    })),
    on(RecipeActions.updateRecipe, (state, action) => {
      return {
        ...state,
        recipes: state.recipes.map((recipe, index) => {
          return index === action.index ? { ...action.recipe } : recipe;
        }),
      };
    }),
    on(RecipeActions.deleteRecipe, (state, action) => ({
      ...state,
      recipes: state.recipes.filter((_, index) => index !== action.index),
    })),
    on(RecipeActions.setRecipes, (state, action) => ({
      ...state,
      recipes: [...action.recipes],
    }))
  )(recipeState, recipeAction);
}
