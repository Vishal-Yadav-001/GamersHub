import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { APIResponse, Game } from '../models/gameModels';


@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  getGameList(
    ordering: string,
    search?: string
  ): Observable<APIResponse<Game>> {
    let params = new HttpParams().set('ordering', ordering);
    if(search){
       params = new HttpParams().set('ordering', ordering).set('search', search);
    }
    return this.http.get<APIResponse<Game>>(`${environment.BASE_URL}`,{
      params:params,
    });
  }

  getGameDetails(id:string):Observable<Game>{
    const gameInfoRequest = this.http.get(`${environment.BASE_URL}/${id}`);
    const gameTrailersRequest = this.http.get(`${environment.BASE_URL}/${id}/movies`);
    const gameScreenshotsRequest = this.http.get(`${environment.BASE_URL}/${id}/screenshots`);
    return forkJoin({
      gameInfoRequest,
      gameScreenshotsRequest,
      gameTrailersRequest
    }).pipe(
      map((resp:any) => {
        return {
          ...resp['gameInfoRequest'],
          screenshots: resp['gameScreenshotsRequest']?.results,
          trailers: resp['gameTrailersRequest']?.results,
        }
      } )
    )
  }
}
