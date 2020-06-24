import { RecipesResolverService } from './recipe-book/recipes-resolver.service';
import { RecipeDetailComponent } from './recipe-book/recipe-detail/recipe-detail.component';

import { RecipeBookComponent } from './recipe-book/recipe-book.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { NoRecipeSelectedComponent } from './recipe-book/no-recipe-selected/no-recipe-selected.component';
import { RecipeEditComponent } from './recipe-book/recipe-edit/recipe-edit.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'recipes',
    component: RecipeBookComponent,
    children: [
      {
        path: '',
        component: NoRecipeSelectedComponent,
        resolve: [RecipesResolverService],
      },
      { path: 'new', component: RecipeEditComponent },
      {
        path: ':id',
        component: RecipeDetailComponent,
        resolve: [RecipesResolverService],
      },
      {
        path: ':id/edit',
        component: RecipeEditComponent,
        resolve: [RecipesResolverService],
      },
    ],
  },
  { path: 'shopping-list', component: ShoppingListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
