import { Recipe } from './../recipe-book/recipe.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, tap } from 'rxjs/operators';
import { RecipeService } from './../recipe-book/recipe.service';

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
        map((recipes) => {
          return recipes.map((recipe) => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : [],
            };
          });
        }),
        tap((recipes) => {
          this.recipeService.setRecipes(recipes);
        })
      );
  }
}
