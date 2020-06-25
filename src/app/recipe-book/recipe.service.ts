import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model';
import { Recipe } from './recipe.model';
import { ShoppingListService } from './../shopping-list/shopping-list.service';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();
  constructor(private shoppingListService: ShoppingListService) {}

  private recipes: Recipe[] = [];

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.getRecipes());
  }

  getRecipe(id: number): Recipe {
    return this.recipes[id];
  }

  getRecipes(): Recipe[] {
    return [...this.recipes];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.getRecipes());
  }

  updateRecipe(index: number, recipe: Recipe) {
    this.recipes[index] = recipe;
    this.recipesChanged.next(this.getRecipes());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.getRecipes());
  }
}
