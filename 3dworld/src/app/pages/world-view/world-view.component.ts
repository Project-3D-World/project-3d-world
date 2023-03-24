import { AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-world-view',
  templateUrl: './world-view.component.html',
  styleUrls: ['./world-view.component.scss']
})
export class WorldViewComponent implements OnInit{
  
    constructor(private route: ActivatedRoute,) {
      
    }
    worldId!: string;

    ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
        this.worldId = params['worldId'];
      });
    }
}
