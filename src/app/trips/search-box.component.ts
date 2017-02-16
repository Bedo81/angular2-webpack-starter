import {
  Component,
  OnInit,
  ElementRef,
  EventEmitter
} from '@angular/core';

import {Trip} from '../shared/models/trip';
import {DataService} from '../shared/services/data.service';
import {Observable} from 'rxjs/Rx';

/**
 * SearchBox displays the search box and emits events based on the results
 */

@Component({
  outputs: ["loading", "results"],
  template: `
    <input type="text" class="form-control" placeholder="Search" autofocus>
  `,
  selector: "search-box"
})

export class SearchBoxComponent implements OnInit {
  loading: EventEmitter<boolean> = new EventEmitter<boolean>();
  results: EventEmitter<any[]> = new EventEmitter<any>();

  constructor(public dataService: DataService,
              private el: ElementRef) {
  }

  //
  // Note:
  // The (<any>Rx) syntax below is a temporary hack to disable type checking
  // because the Typescript definition files bundled with angular for rx don't
  // include `fromEvent`. See:
  // http://stackoverflow.com/questions/23217334/how-do-i-extend-a-typescript-class-definition-in-a-separate-definition-file
  //
  ngOnInit(): void {
    // convert the `keyup` event into an observable stream
    Observable.fromEvent(this.el.nativeElement, "keyup")
              .map((e: any) => e.target.value) // extract the value of the input
              .filter((text: string) => text.length > 1) // filter out if empty
              .debounceTime(250)                             // only once every 250ms
              .do(() => this.loading.next(true))         // enable loading
              // search, discarding old events if new input comes in
              .map((query: string) => this.dataService.getTrips(query))
              .switch()
              // act on the return of the search
              .subscribe(
                (results: any[]) => { // on sucesss
                  this.loading.next(false);
                  this.results.next(results);
                },
                (err: any) => { // on error
                  console.log(err);
                  this.loading.next(false);
                },
                () => { // on completion
                  this.loading.next(false);
                }
              );

  }
}
