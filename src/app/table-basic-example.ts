import { Component, Inject } from "@angular/core";
import { CdkDragDrop } from "@angular/cdk/drag-drop";
import { VIRTUAL_SCROLL_STRATEGY } from "@angular/cdk/scrolling";
import { combineLatest, Observable, of } from "rxjs";
import { TableVirtualScrollStrategy } from "./table-scroll-strat";
import { map } from "rxjs/operators";

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = Array.from({ length: 1000 }, () =>
  Math.floor(Math.random() * 40)
).map((_, i) => ({
  position: i,
  name: "Hydrogen",
  weight: 1.0079 * i,
  symbol: "H"
}));

/**
 * @title Basic use of `<table mat-table>`
 */
@Component({
  selector: "table-basic-example",
  styleUrls: ["table-basic-example.css"],
  templateUrl: "table-basic-example.html",
  providers: [
    {
      provide: VIRTUAL_SCROLL_STRATEGY,
      useClass: TableVirtualScrollStrategy
    }
  ]
})
export class TableBasicExample {
  displayedColumns: string[] = ["position", "name", "weight", "symbol"];
  rows = ELEMENT_DATA;
  dataSource: Observable<Array<any>>;

  static BUFFER_SIZE = 3;
  rowHeight = 48;
  headerHeight = 56;

  gridHeight = 400;

  constructor(
    @Inject(VIRTUAL_SCROLL_STRATEGY)
    private readonly scrollStrategy: TableVirtualScrollStrategy
  ) {}

  public ngOnInit() {
    const range =
      Math.ceil(this.gridHeight / this.rowHeight) +
      TableBasicExample.BUFFER_SIZE;
    this.scrollStrategy.setScrollHeight(this.rowHeight, this.headerHeight);

    this.dataSource = combineLatest([
      of(this.rows),
      this.scrollStrategy.scrolledIndexChange
    ]).pipe(
      map((value: any) => {
        // Determine the start and end rendered range
        const start = Math.max(0, value[1] - TableBasicExample.BUFFER_SIZE);
        const end = Math.min(value[0].length, value[1] + range);

        // Update the datasource for the rendered range of data
        return value[0].slice(start, end);
      })
    );
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log(event);
  }
}

/**  Copyright 2019 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
