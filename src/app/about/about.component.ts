import {
  Component,
  OnInit
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TableData } from './table-data';

@Component({
  selector: 'about',
  styles: [`
  `],
  template: `
    <h1>About</h1>
    <div>
      For hot module
       
       <ng-table [config]="config"
          (tableChanged)="onChangeTable(config)"
          (cellClicked)="onCellClick($event)"
          [rows]="rows" [columns]="columns">
        </ng-table>
        <pagination *ngIf="config.paging"
            class="pagination-sm"
            [(ngModel)]="page"
            [totalItems]="length"
            [itemsPerPage]="itemsPerPage"
            [maxSize]="maxSize"
            [boundaryLinks]="true"
            [rotate]="false"
            (pageChanged)="onChangeTable(config, $event)"
            (numPages)="numPages = $event">
        </pagination>
        <pre *ngIf="config.paging" class="card card-block card-header">Page: {{page}} / {{numPages}}</pre>
       
       reloading run
      <pre>npm run start:hmr</pre>
    </div>
    
    <div>
      <h3>
        patrick@AngularClass.com
      </h3>
    </div>
    <pre>this.localState = {{ localState | json }}</pre>
  `
})
export class AboutComponent implements OnInit {

  public rows:Array<any> = [];
  public columns:Array<any> = [
    {title: 'Name', name: 'name', filtering: {filterString: '', placeholder: 'Filter by name'}},
    {
      title: 'Position',
      name: 'position',
      sort: false,
      filtering: {filterString: '', placeholder: 'Filter by position'}
    },
    {title: 'Office', className: ['office-header', 'text-success'], name: 'office', sort: 'asc'},
    {title: 'Extn.', name: 'ext', sort: '', filtering: {filterString: '', placeholder: 'Filter by extn.'}},
    {title: 'Start date', className: 'text-warning', name: 'startDate'},
    {title: 'Salary ($)', name: 'salary'}
  ];
  public page:number = 1;
  public itemsPerPage:number = 10;
  public maxSize:number = 5;
  public numPages:number = 1;
  public length:number = 0;

  public config:any = {
    paging: true,
    sorting: {columns: this.columns},
    filtering: {filterString: ''},
    className: ['table-striped', 'table-bordered']
  };

  private data:Array<any> = TableData;


  public localState: any;
  constructor(
    public route: ActivatedRoute
  ) {
    this.length = this.data.length;
  }

  public ngOnInit() {
    this.route
      .data
      .subscribe((data: any) => {
        // your resolved data from route
        this.localState = data.yourData;
      });

    this.onChangeTable(this.config);

    console.log('hello `About` component');
    // static data that is bundled
    // var mockData = require('assets/mock-data/mock-data.json');
    // console.log('mockData', mockData);
    // if you're working with mock data you can also use http.get('assets/mock-data/mock-data.json')
    this.asyncDataWithWebpack();
  }
  private asyncDataWithWebpack() {
    // you can also async load mock data with 'es6-promise-loader'
    // you would do this if you don't want the mock-data bundled
    // remember that 'es6-promise-loader' is a promise
    setTimeout(() => {

      System.import('../../assets/mock-data/mock-data.json')
        .then((json) => {
          console.log('async mockData', json);
          this.localState = json;
        });

    });
  }

  public changePage(page:any, data:Array<any> = this.data):Array<any> {
    let start = (page.page - 1) * page.itemsPerPage;
    let end = page.itemsPerPage > -1 ? (start + page.itemsPerPage) : data.length;
    return data.slice(start, end);
  }

  public changeSort(data:any, config:any):any {
    if (!config.sorting) {
      return data;
    }

    let columns = this.config.sorting.columns || [];
    let columnName:string = void 0;
    let sort:string = void 0;

    for (let i = 0; i < columns.length; i++) {
      if (columns[i].sort !== '' && columns[i].sort !== false) {
        columnName = columns[i].name;
        sort = columns[i].sort;
      }
    }

    if (!columnName) {
      return data;
    }

    // simple sorting
    return data.sort((previous:any, current:any) => {
      if (previous[columnName] > current[columnName]) {
        return sort === 'desc' ? -1 : 1;
      } else if (previous[columnName] < current[columnName]) {
        return sort === 'asc' ? -1 : 1;
      }
      return 0;
    });
  }

  public changeFilter(data:any, config:any):any {
    let filteredData:Array<any> = data;
    this.columns.forEach((column:any) => {
      if (column.filtering) {
        filteredData = filteredData.filter((item:any) => {
          return item[column.name].match(column.filtering.filterString);
        });
      }
    });

    if (!config.filtering) {
      return filteredData;
    }

    if (config.filtering.columnName) {
      return filteredData.filter((item:any) =>
        item[config.filtering.columnName].match(this.config.filtering.filterString));
    }

    let tempArray:Array<any> = [];
    filteredData.forEach((item:any) => {
      let flag = false;
      this.columns.forEach((column:any) => {
        if (item[column.name].toString().match(this.config.filtering.filterString)) {
          flag = true;
        }
      });
      if (flag) {
        tempArray.push(item);
      }
    });
    filteredData = tempArray;

    return filteredData;
  }

  public onChangeTable(config:any, page:any = {page: this.page, itemsPerPage: this.itemsPerPage}):any {
    if (config.filtering) {
      Object.assign(this.config.filtering, config.filtering);
    }

    if (config.sorting) {
      Object.assign(this.config.sorting, config.sorting);
    }

    let filteredData = this.changeFilter(this.data, this.config);
    let sortedData = this.changeSort(filteredData, this.config);
    this.rows = page && config.paging ? this.changePage(page, sortedData) : sortedData;
    this.length = sortedData.length;
  }

  public onCellClick(data: any): any {
    console.log(data);
  }

}
