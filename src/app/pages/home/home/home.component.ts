import { Component, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CustomTableComponent } from '../../../shared/components/custom-table/custom-table/custom-table.component';
import {
  InventoryItem,
  InventoryService,
} from '../../../shared/services/inventory/inventory.service';
import { ButtonModule } from 'primeng/button';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [
    CustomTableComponent,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    ReactiveFormsModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  editItem!: InventoryItem;
  newItem!: InventoryItem;
  InventoryForm!: FormGroup;
  formType: 'Add Item' | 'Edit Item' = 'Add Item';
  constructor(
    private inventoryService: InventoryService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.InventoryForm = this.fb.group({
      name: ['', Validators.required],
      quantity: [null, Validators.required],
    });
  }
  addItem() {
    this.inventoryService.addItem({ ...this.InventoryForm.value });
    this.newItem = { id: 0, name: '', quantity: 0 };
  }
  edit(item: InventoryItem) {
    this.formType = 'Edit Item';
    this.editItem = { ...item };
  }
  updateItem() {
    this.inventoryService.updateItem({
      ...this.InventoryForm.value,
      id: this.editItem.id,
    });
  }
  deleteItem(id: number) {
    this.inventoryService.deleteItem(id);
  }
  onSubmit() {
    switch (this.formType) {
      case 'Add Item':
        this.addItem();
        break;
      case 'Edit Item':
        this.updateItem();
        break;
      default:
        break;
    }
  }
}
