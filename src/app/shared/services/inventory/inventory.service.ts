import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

export interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private items: InventoryItem[] = [];
  private itemsSubject = new BehaviorSubject<InventoryItem[]>(this.items);
  items$ = this.itemsSubject.asObservable();
  private nextId = 1;

  constructor() {}

  getItems() {
    return this.itemsSubject.asObservable();
  }

  addItem(item: InventoryItem) {
    item.id = this.nextId++;
    this.items.push(item);
    this.itemsSubject.next(this.items);
  }

  updateItem(updatedItem: InventoryItem) {
    const index = this.items.findIndex((item) => item.id === updatedItem.id);
    if (index !== -1) {
      this.items[index] = updatedItem;
      this.itemsSubject.next(this.items);
    }
  }

  deleteItem(id: number) {
    this.items = this.items.filter((item) => item.id !== id);
    this.itemsSubject.next(this.items);
  }
}
