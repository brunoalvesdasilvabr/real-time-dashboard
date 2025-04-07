import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import {
  InventoryService,
  InventoryItem,
} from '../../../shared/services/inventory/inventory.service';
import { CustomTableComponent } from '../../../shared/components/custom-table/custom-table/custom-table.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let inventoryService: InventoryService;
  let fb: FormBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        CustomTableComponent,
        ButtonModule,
        InputTextModule,
        InputNumberModule,
        ReactiveFormsModule,
      ],
      providers: [InventoryService, FormBuilder],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    inventoryService = TestBed.inject(InventoryService);
    fb = TestBed.inject(FormBuilder);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('addItem', () => {
    it('should call inventoryService.addItem with form values and reset newItem', () => {
      const formValue = { name: 'New Product', quantity: 10 };
      component['InventoryForm'].setValue(formValue);
      component['addItem']();
      expect(component['newItem']).toEqual({ id: 0, name: '', quantity: 0 });
    });
  });

  describe('edit', () => {
    it('should set formType to "Edit Item" and populate editItem', () => {
      const itemToEdit: InventoryItem = {
        id: 5,
        name: 'Existing Item',
        quantity: 7,
      };
      component['edit'](itemToEdit);
      expect(component['formType']).toBe('Edit Item');
      expect(component['editItem']).toEqual(itemToEdit);
    });
  });

  describe('updateItem', () => {
    it('should call inventoryService.updateItem with form values and editItem id', () => {
      const updateItemSpy = spyOn(inventoryService, 'updateItem');
      component['editItem'] = { id: 3, name: 'Old Name', quantity: 2 };
      const formValue = { name: 'Updated Name', quantity: 12 };
      component['InventoryForm'].setValue(formValue);
      component['updateItem']();
      expect(updateItemSpy).toHaveBeenCalledWith({ ...formValue, id: 3 });
    });
  });

  describe('deleteItem', () => {
    it('should call inventoryService.deleteItem with the provided id', () => {
      const deleteItemSpy = spyOn(inventoryService, 'deleteItem');
      const itemIdToDelete = 9;
      component['deleteItem'](itemIdToDelete);
      expect(deleteItemSpy).toHaveBeenCalledWith(itemIdToDelete);
    });
  });

  describe('onSubmit', () => {
    it('should call addItem when formType is "Add Item"', () => {
      const addItemSpy = spyOn(component, 'addItem');
      component['formType'] = 'Add Item';
      component['onSubmit']();
      expect(addItemSpy).toHaveBeenCalled();
    });

    it('should call updateItem when formType is "Edit Item"', () => {
      const updateItemSpy = spyOn(component, 'updateItem');
      component['formType'] = 'Edit Item';
      component['onSubmit']();
      expect(updateItemSpy).toHaveBeenCalled();
    });

    it('should not call addItem or updateItem for other formType values', () => {
      const addItemSpy = spyOn(component, 'addItem');
      const updateItemSpy = spyOn(component, 'updateItem');
      component['formType'] = 'Some Other Type' as any;
      component['onSubmit']();
      expect(addItemSpy).not.toHaveBeenCalled();
      expect(updateItemSpy).not.toHaveBeenCalled();
    });
  });
});
