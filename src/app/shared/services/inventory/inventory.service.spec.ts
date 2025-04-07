import { TestBed } from '@angular/core/testing';
import { InventoryService, InventoryItem } from './inventory.service';
import { BehaviorSubject } from 'rxjs';

describe('InventoryService', () => {
  let service: InventoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryService);
    service['items'] = [];
    service['nextId'] = 1;
    service['itemsSubject'] = new BehaviorSubject<InventoryItem[]>([]);
    service.items$ = service['itemsSubject'].asObservable();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getItems', () => {
    it('should emit the current items when subscribed', (done) => {
      const initialItems: InventoryItem[] = [
        { id: 1, name: 'Initial Item', quantity: 2 },
      ];
      service['items'] = [...initialItems];
      service['itemsSubject'].next(service['items']);

      service.getItems().subscribe((items) => {
        expect(items).toEqual(initialItems);
        done();
      });
    });
  });

  describe('addItem', () => {
    it('should add a new item with an incrementing ID', () => {
      const newItem1: InventoryItem = { id: 0, name: 'Item A', quantity: 3 };
      service.addItem(newItem1);
      expect(service['items'].length).toBe(1);
      expect(service['items'][0].id).toBe(1);
      expect(service['items'][0].name).toBe('Item A');
      expect(service['items'][0].quantity).toBe(3);
      expect(service['nextId']).toBe(2);

      const newItem2: InventoryItem = { id: 0, name: 'Item B', quantity: 5 };
      service.addItem(newItem2);
      expect(service['items'].length).toBe(2);
      expect(service['items'][1].id).toBe(2);
      expect(service['nextId']).toBe(3);
    });

    it('should emit the updated items array', (done) => {
      const newItem: InventoryItem = { id: 0, name: 'Test Item', quantity: 1 };
      const nextSpy = spyOn(service['itemsSubject'], 'next');

      service.addItem(newItem);

      expect(nextSpy).toHaveBeenCalledWith(service['items']);
      done();
    });
  });

  describe('updateItem', () => {
    beforeEach(() => {
      service['items'] = [{ id: 1, name: 'Existing Item', quantity: 10 }];
      service['itemsSubject'].next(service['items']);
      service['nextId'] = 2;
    });

    it('should update an existing item if the ID exists', () => {
      const updatedItem: InventoryItem = {
        id: 1,
        name: 'Updated Item',
        quantity: 15,
      };
      service.updateItem(updatedItem);
      expect(service['items'].length).toBe(1);
      expect(service['items'][0]).toEqual(updatedItem);
    });

    it('should not update if the ID does not exist', () => {
      const updatedItem: InventoryItem = {
        id: 99,
        name: 'Non-existent',
        quantity: 1,
      };
      const initialItems = [...service['items']];
      service.updateItem(updatedItem);
      expect(service['items']).toEqual(initialItems);
    });

    it('should emit the updated items array when an item is updated', (done) => {
      const updatedItem: InventoryItem = {
        id: 1,
        name: 'Updated Item',
        quantity: 20,
      };
      const nextSpy = spyOn(service['itemsSubject'], 'next');

      service.updateItem(updatedItem);

      expect(nextSpy).toHaveBeenCalledWith(service['items']);
      done();
    });

    it('should not emit if the ID does not exist', () => {
      const updatedItem: InventoryItem = {
        id: 99,
        name: 'Non-existent',
        quantity: 1,
      };
      const nextSpy = spyOn(service['itemsSubject'], 'next');

      service.updateItem(updatedItem);

      expect(nextSpy).not.toHaveBeenCalled();
    });
  });

  describe('deleteItem', () => {
    beforeEach(() => {
      service['items'] = [
        { id: 1, name: 'Item One', quantity: 5 },
        { id: 2, name: 'Item Two', quantity: 8 },
      ];
      service['itemsSubject'].next(service['items']);
      service['nextId'] = 3;
    });

    it('should delete an item with the given ID', () => {
      service.deleteItem(1);
      expect(service['items'].length).toBe(1);
      expect(service['items'][0].id).toBe(2);
    });

    it('should not change the items array if the ID does not exist', () => {
      const initialItems = [...service['items']];
      service.deleteItem(99);
      expect(service['items']).toEqual(initialItems);
    });

    it('should emit the updated items array when an item is deleted', (done) => {
      const nextSpy = spyOn(service['itemsSubject'], 'next');

      service.deleteItem(1);

      expect(nextSpy).toHaveBeenCalledWith(service['items']);
      done();
    });

    it('should emit the same items array if the ID does not exist', (done) => {
      const nextSpy = spyOn(service['itemsSubject'], 'next');
      const initialItems = [...service['items']];

      service.deleteItem(99);

      expect(nextSpy).toHaveBeenCalledWith(initialItems);
      done();
    });
  });
});
