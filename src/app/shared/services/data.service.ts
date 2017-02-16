import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Trip} from '../models/trip';
import {Observable} from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class DataService {

  private apiUrl = 'http://demo8168260.mockable.io/';

  constructor(private http: Http) {
  }

  getTrips(search?: string) : Observable<Trip[]> {
    return this.http.get(this.apiUrl + 'trips' + (search ? '?search='+search : ''))
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }
}
