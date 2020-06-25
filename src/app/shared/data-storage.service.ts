import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

import { Recipe } from './../recipes/recipe.model';
import { RecipeService } from './../recipes/recipe.service';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(private http: HttpClient, private recipeService: RecipeService) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    return this.http.put(
      'https://recipe-book-45665.firebaseio.com/recipes.json',
      recipes
    );
  }

  fetchRecipes() {
    return this.http
      .get<Recipe[]>('https://recipe-book-45665.firebaseio.com/recipes.json')
      .pipe(
        map((recipes) => this.mapIngredients(recipes)),
        tap((recipes) => {
          this.recipeService.setRecipes(recipes);
        })
      );
  }

  private mapIngredients(recipes: Recipe[]) {
    if (!recipes) {
      return [];
    }
    return recipes.map((recipe) => {
      return {
        ...recipe,
        ingredients: recipe.ingredients.length ? recipe.ingredients : [],
      };
    });
  }
}
