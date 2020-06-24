import { DataStorageService } from './../shared/data-storage.service';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor(private dataStorageService: DataStorageService) {}

  ngOnInit(): void {}

  onSaveData() {
    this.dataStorageService.storeRecipes().subscribe((response) => {
      console.log(response);
    });
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
  }
}
