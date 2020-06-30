import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';

import * as fromApp from './../../store/app.reducer';
import * as RecipeActions from './../store/recipe.actions';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';
import { Recipe } from './../recipe.model';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        map((params: Params) => +params.id),
        switchMap((id) => {
          this.id = id;
          return this.store.select('recipe');
        }),
        map(({ recipes }) =>
          recipes.find((_, i) => {
            return i === this.id;
          })
        )
      )
      .subscribe((recipe) => {
        this.recipe = recipe;
      });
  }

  onAddToShoppingList() {
    const ingredients = this.recipe.ingredients;
    this.store.dispatch(ShoppingListActions.addIngredients({ ingredients }));
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onDeleteRecipe() {
    const index = this.id;
    this.store.dispatch(RecipeActions.deleteRecipe({ index }));
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
