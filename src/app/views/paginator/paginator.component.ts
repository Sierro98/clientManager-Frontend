import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'paginator-nav',
  templateUrl: './paginator.component.html',
})
export class PaginatorComponent implements OnInit, OnChanges {
  @Input()
  paginator: any;
  pages: number[];
  from: number;
  to: number;

  ngOnInit() {
    this.initPaginator();
  }

  ngOnChanges(changes: SimpleChanges): void {
    let updatedPaginator = changes['paginator'];
    if (updatedPaginator.previousValue) {
      this.initPaginator();
    }
  }

  private initPaginator(): void {
    if (this.paginator.totalPages > 5) {
      this.from = Math.min(
        Math.max(1, this.paginator.number - 4),
        this.paginator.totalPages - 5
      );
      this.to = Math.max(
        Math.min(this.paginator.totalPages, this.paginator.number + 4),
        6
      );
    } else {
      this.from = 1;
      this.to = this.paginator.totalPages;
    }
    this.pages = new Array(this.to - this.from + 1)
      .fill(0)
      .map((_value, index) => index + this.from);
  }
}
