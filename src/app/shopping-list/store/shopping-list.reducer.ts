import { Action, createReducer, on } from '@ngrx/store';

import { Ingredient } from './../../shared/ingredient.model';
import * as Actions from './shopping-list.actions';

export interface State {
  ingredients: Ingredient[];
  editIndex: number;
}

const initialState: State = {
  ingredients: [],
  editIndex: -1,
};

export function shoppingListReducer(
  shoppingListState: State | undefined,
  shoppingListAction: Action
) {
  return createReducer(
    initialState,
    on(Actions.addIngredient, (state, action) => ({
      ...state,
      ingredients: state.ingredients.concat(action.ingredient),
    })),
    on(Actions.addIngredients, (state, action) => ({
      ...state,
      ingredients: state.ingredients.concat(...action.ingredients),
    })),
    on(Actions.updateIngredient, (state, action) => ({
      ...state,
      editIndex: -1,
      ingredients: state.ingredients.map((ingredient, index) =>
        index === state.editIndex ? { ...action.ingredient } : ingredient
      ),
    })),
    on(Actions.deleteIngredient, (state) => ({
      ...state,
      editIndex: -1,
      ingredients: state.ingredients.filter(
        (_, index) => index !== state.editIndex
      ),
    })),
    on(Actions.startEdit, (state, action) => ({
      ...state,
      editIndex: action.index,
    })),
    on(Actions.stopEdit, (state) => ({
      ...state,
      editIndex: -1,
    }))
  )(shoppingListState, shoppingListAction);
}
