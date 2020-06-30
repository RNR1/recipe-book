import * as fromRecipe from './../recipes/store/recipe.reducer';
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';
import * as fromAuth from '../auth/store/auth.reducer';
import { ActionReducerMap } from '@ngrx/store';

export interface AppState {
  recipe: fromRecipe.State;
  shoppingList: fromShoppingList.State;
  auth: fromAuth.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  recipe: fromRecipe.recipeReducer,
  shoppingList: fromShoppingList.shoppingListReducer,
  auth: fromAuth.authReducer,
};
