import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-recipe-selected',
  template: '<p>Please select a recipe!</p>',
  styleUrls: ['./no-recipe-selected.component.css'],
})
export class NoRecipeSelectedComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
