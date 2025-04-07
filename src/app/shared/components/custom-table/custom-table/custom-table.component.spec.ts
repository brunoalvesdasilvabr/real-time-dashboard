import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomTableComponent } from './custom-table.component';
import {
  InventoryService,
  InventoryItem,
} from '../../../services/inventory/inventory.service';
import { TableModule } from 'primeng/table';
import { of, Subject, takeUntil } from 'rxjs';

describe('CustomTableComponent', () => {
  let component: CustomTableComponent;
  let fixture: ComponentFixture<CustomTableComponent>;
  let inventoryService: InventoryService;
  const mockInventoryItems: InventoryItem[] = [
    { id: 1, name: 'Item 1', quantity: 10 },
    { id: 2, name: 'Item 2', quantity: 5 },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TableModule, CustomTableComponent],
      providers: [InventoryService],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomTableComponent);
    component = fixture.componentInstance;
    inventoryService = TestBed.inject(InventoryService);
    inventoryService.addItem({ id: 1, name: 'Item 1', quantity: 10 });
    inventoryService.addItem({ id: 2, name: 'Item 2', quantity: 5 });
    fixture.detectChanges();
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize items$ and populate items array on ngOnInit', () => {
    const getItemsSpy = spyOn(inventoryService, 'getItems').and.returnValue(
      of(mockInventoryItems)
    );
    component.ngOnInit();
    expect(getItemsSpy).toHaveBeenCalled();
    expect(component.items).toEqual(mockInventoryItems);
  });

  it('should emit the correct item on edit', () => {
    spyOn(component.editItemEmitter, 'emit');
    const itemToEdit = mockInventoryItems[0];
    component.edit(itemToEdit);
    expect(component.editItemEmitter.emit).toHaveBeenCalledWith(itemToEdit);
  });

  it('should emit the correct id on deleteItem', () => {
    spyOn(component.deleteItemEmitter, 'emit');
    const idToDelete = 2;
    component.deleteItem(idToDelete);
    expect(component.deleteItemEmitter.emit).toHaveBeenCalledWith(idToDelete);
  });

  it('should complete the cleaner$ subject on ngOnDestroy', () => {
    spyOn(component.cleaner$, 'next');
    spyOn(component.cleaner$, 'complete');
    component.ngOnDestroy();
    expect(component.cleaner$.next).toHaveBeenCalled();
    expect(component.cleaner$.complete).toHaveBeenCalled();
  });

  it('should render the table title correctly', () => {
    const testTitle = 'Product List';
    component.tableTitle = testTitle;
    fixture.detectChanges();
    const titleElement = fixture.nativeElement.querySelector('h2');
    if (titleElement) {
      expect(titleElement.textContent).toContain(testTitle);
    } else {
      fail('Table title element not found in the template.');
    }
  });
});
