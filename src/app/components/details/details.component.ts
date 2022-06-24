import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { of, Subscriber, Subscription } from 'rxjs';
import { Game } from 'src/app/models/gameModels';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  public gameRating = 0;
  gameId: string = '';
  game: any;
  routeSub: Subscription = of(null).subscribe();
  gameSub: Subscription = of(null).subscribe();

  constructor(
    private activateRoute: ActivatedRoute,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.routeSub = this.activateRoute.params.subscribe((params: Params) => {
      this.gameId = params['id'];
      this.getGameDetails(this.gameId);
    });
  }

  getColor(value: number): string {
    if (value > 75) {
      return '#5ee432';
    } else if (value > 50) {
      return '#ffa50';
    } else if (value > 30) {
      return '#f7aa38';
    } else {
      return '#ef4655';
    }
  }
  getGameDetails(id:string): void{
  this.gameSub =  this.dataService.getGameDetails(id).
  subscribe((gameResp:Game) =>{
    this.game = gameResp;

    setTimeout(async (params:any) => {
      this.gameRating = this.game?.metacritic;
    },1000)
  })
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.routeSub.unsubscribe();
    this.gameSub.unsubscribe();
  }
}
