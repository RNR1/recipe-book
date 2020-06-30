import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import * as fromApp from '../../store/app.reducer';
import * as ShoppingListActions from '../store/shopping-list.actions';
import { Ingredient } from './../../shared/ingredient.model';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') shoppingListForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItem: Ingredient;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.subscription = this.store
      .select('shoppingList')
      .subscribe(({ ingredients, editIndex: index }) => {
        if (index > -1) {
          this.editMode = true;
          this.editedItem = ingredients[index];
          const { name, amount } = this.editedItem;
          this.shoppingListForm.setValue({ name, amount });
        }
      });
  }

  onSubmit(form: NgForm) {
    const { name, amount } = form.value;
    const ingredient = new Ingredient(name, amount);
    if (this.editMode) {
      this.store.dispatch(ShoppingListActions.updateIngredient({ ingredient }));
    } else {
      this.store.dispatch(ShoppingListActions.addIngredient({ ingredient }));
    }
    this.editMode = false;
    form.reset();
  }
  onDelete() {
    this.store.dispatch(ShoppingListActions.deleteIngredient());
    this.onClear();
  }
  onClear() {
    this.shoppingListForm.reset();
    this.editMode = false;
    this.store.dispatch(ShoppingListActions.stopEdit());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.store.dispatch(ShoppingListActions.stopEdit());
  }
}
