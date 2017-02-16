import {
  Component,
  OnInit,
  ElementRef
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {Trip} from '../shared/models/trip';
import {DataService} from '../shared/services/data.service';
import {Observable} from 'rxjs/Rx';

import * as moment from 'moment';

// import * as Rx from "rxjs/Rx";

@Component({
  selector: 'trips',
  // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: ['./trips.component.css'],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './trips.component.html'
})
export class TripsComponent implements OnInit {
  public categories: any;
  public localState: any;
  public trips: Trip[];
  public search: string;

  // datepicker ----

  public dt: Date = new Date();
  public minDate: Date = void 0;
  public events: any[];
  public tomorrow: Date;
  public afterTomorrow: Date;
  public dateDisabled: {date: Date, mode: string}[];
  public formats: string[] = ['DD-MM-YYYY', 'YYYY/MM/DD', 'DD.MM.YYYY',
    'shortDate'];
  public format: string = this.formats[0];
  public dateOptions: any = {
    formatYear: 'YY',
    startingDay: 1
  };
  private opened: boolean = false;

  // -----

  constructor(public route: ActivatedRoute,
              public dataService: DataService,
              private el: ElementRef) {
    // datepicker ----

    (this.tomorrow = new Date()).setDate(this.tomorrow.getDate() + 1);
    (this.afterTomorrow = new Date()).setDate(this.tomorrow.getDate() + 2);
    (this.minDate = new Date()).setDate(this.minDate.getDate() - 1000);
    (this.dateDisabled = []);
    this.events = [
      {date: this.tomorrow, status: 'full'},
      {date: this.afterTomorrow, status: 'partially'}
    ];

    // ----
  }

  public ngOnInit() {
    this.getTrips();

    // Observable.fromEvent(this.el.nativeElement, 'keyup')
    //           .map((e: any) => e.target.value)
    //           .filter((text: string) => text.length > 1)
    //           .debounceTime(250)
    //           .do(() => console.log('fbdfbdfbdfb'))
    //           .map((query: string) => this.dataService.getTrips((query)))
    //           .switch()
    //           .subscribe(
    //             trips => {
    //               this.trips = trips;
    //             },
    //             error => {
    //               console.log('ERROR');
    //             }
    //           );
  }

  updateResults(results: any) {
    this.trips = results;
  }

  getTrips(): void {
    this.dataService.getTrips().subscribe(
      trips => {
        debugger;
        this.trips = trips;
      }
    )
  }

  // public onConfirm(): void {
  //   this.dataService.getTrips(this.search).subscribe(
  //     trips => {
  //       this.trips = trips;
  //     }
  //   )
  // }

  // getHeroes(): void {
  //   this.heroService
  //       .getHeroes()
  //       .then(heroes => this.heroes = heroes)
  //       .catch(error => this.error = error);
  // }
  
  // datepicker -----

  public getDate(): number {
    return this.dt && this.dt.getTime() || new Date().getTime();
  }

  public today(): void {
    this.dt = new Date();
  }

  public d20090824(): void {
    this.dt = moment('2009-08-24', 'YYYY-MM-DD')
      .toDate();
  }

  public disableTomorrow(): void {
    this.dateDisabled = [{date: this.tomorrow, mode: 'day'}];
  }

  // todo: implement custom class cases
  public getDayClass(date: any, mode: string): string {
    if (mode === 'day') {
      let dayToCheck = new Date(date).setHours(0, 0, 0, 0);

      for (let event of this.events) {
        let currentDay = new Date(event.date).setHours(0, 0, 0, 0);

        if (dayToCheck === currentDay) {
          return event.status;
        }
      }
    }

    return '';
  }

  public disabled(date: Date, mode: string): boolean {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  }

  public open(): void {
    this.opened = !this.opened;
  }

  public clear(): void {
    this.dt = void 0;
    this.dateDisabled = undefined;
  }

  public toggleMin(): void {
    this.dt = new Date(this.minDate.valueOf());
  }
  
  // -----

}
