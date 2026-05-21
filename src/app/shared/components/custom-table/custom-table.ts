import { Component, ElementRef, EventEmitter, HostListener, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { actionHandler } from './interfaces/actionHandler';
import { tableHeader } from './interfaces/tableHeader';
import { tableMenuInterface } from './interfaces/tableMenu.interface';

@Component({
  selector: 'app-custom-table',
  imports: [CommonModule, FormsModule],
  templateUrl: './custom-table.html',
  styleUrl: './custom-table.scss',
})
export class CustomTable {
  @Input() headers: tableHeader[] = [];
  @Input() products: any[] = [];
  @Input() menuActions: tableMenuInterface[] = [];
  @Input() scrollHeight: string | null = null; // e.g. "300px"
  @Input() showIndex: boolean = true;
  @Input() itemsPerPage: number = 7;
  /** Optional: per-row menu generator — takes the row item and returns tailored menu items */
  @Input() menuFn: ((item: any) => tableMenuInterface[]) | null = null;

  /** Resolve the correct menu items for a given row */
  getMenuItems(item: any): tableMenuInterface[] {
    return this.menuFn ? this.menuFn(item) : this.menuActions;
  }

  @ViewChildren('menu') menus!: QueryList<ElementRef<HTMLUListElement>>;
  @ViewChildren('menuBtn') buttons!: QueryList<ElementRef<HTMLElement>>;

  selectedIndex: number | null = null;
  menuStyles: any = {};

  // Expose Math to template
  Math = Math;

  // Pagination properties
  currentPage: number = 1;

  // Computed property for paginated products
  get paginatedProducts(): any[] {
    const list = this.products || [];
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return list.slice(startIndex, endIndex);
  }

  // Computed property for total pages
  get totalPages(): number {
    return Math.ceil((this.products || []).length / this.itemsPerPage);
  }

  // Computed property for page numbers array
  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  trackByIndex(index: number): number {
    return index;
  }

  toggleMenu(index: number, btnEl: HTMLElement, event: MouseEvent) {
    event.stopPropagation();

    if (this.selectedIndex === index) {
      // close
      this.selectedIndex = null;
      return;
    }

    // open this index
    this.selectedIndex = index;

    // wait for Angular to render the ul via *ngIf
    setTimeout(() => {
      const maybeMenu = btnEl.nextElementSibling as HTMLElement | null;
      const menuEl =
        maybeMenu && maybeMenu.classList && maybeMenu.classList.contains('menu')
          ? maybeMenu
          : null;

      if (!menuEl) return;

      menuEl.classList.remove('animate', 'shown');

      const viewportHeight = window.innerHeight;
      const btnRect = btnEl.getBoundingClientRect();

      menuEl.classList.add('shown');

      const menuHeight = menuEl.offsetHeight;
      const spaceBelow = viewportHeight - btnRect.bottom;

      const left = Math.max(8, btnRect.left);
      if (spaceBelow < menuHeight) {
        this.menuStyles = {
          position: 'fixed',
          top: 'auto',
          left: `${left}px`,
          bottom: `${viewportHeight - btnRect.top}px`,
        };
      } else {
        this.menuStyles = {
          position: 'fixed',
          top: `${btnRect.bottom}px`,
          left: `${left}px`,
          bottom: 'auto',
        };
      }

      requestAnimationFrame(() => {
        menuEl.classList.add('animate');
      });
    });
  }

  @Output() onClick = new EventEmitter<actionHandler>();
  handleAction(item: any, menuId: number) {
    this.onClick.emit({
      item: item,
      menuId: menuId,
    });
    this.selectedIndex = null;
  }

  openLink(url: string): void {
    if (!url) return;

    const fullUrl = url.startsWith('http') ? url : `https://${url}`;

    window.open(fullUrl, '_blank');
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (!target.closest('.menu')) {
      this.selectedIndex = null;
    }
  }

  // Pagination methods
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.selectedIndex = null;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.selectedIndex = null;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.selectedIndex = null;
    }
  }

  // Checkbox helpers
  isAllSelected(): boolean {
    const checkboxHeader = this.headers.find(h => h.isCheckbox);
    if (!checkboxHeader) return false;
    const key = checkboxHeader.key;
    const list = this.products || [];
    return list.length > 0 && list.every(item => item[key]);
  }

  toggleSelectAll(event: any): void {
    const checkboxHeader = this.headers.find(h => h.isCheckbox);
    if (!checkboxHeader) return;
    const key = checkboxHeader.key;
    const checked = event.target.checked;
    const list = this.products || [];
    list.forEach(item => {
      item[key] = checked;
    });
  }
}
