import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  InventoryItem,
  InventoryService,
} from '../../../services/inventory/inventory.service';
import { TableModule } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-custom-table',
  imports: [TableModule],
  templateUrl: './custom-table.component.html',
  styleUrl: './custom-table.component.scss',
})
export class CustomTableComponent implements OnInit, OnDestroy {
  @Input() tableTitle!: string;
  items: InventoryItem[] = [];
  @Output() editItemEmitter = new EventEmitter<InventoryItem>();
  @Output() deleteItemEmitter = new EventEmitter<number>();
  cleaner$: Subject<void> = new Subject();

  constructor(private inventoryService: InventoryService) {}

  ngOnInit() {
    this.inventoryService
      .getItems()
      .pipe(takeUntil(this.cleaner$))
      .subscribe((items) => {
        this.items = items;
      });
  }

  edit(item: InventoryItem) {
    this.editItemEmitter.emit({ ...item });
  }

  deleteItem(id: number) {
    this.deleteItemEmitter.emit(id);
  }
  ngOnDestroy(): void {
    this.cleaner$.next();
    this.cleaner$.complete();
  }
}
