import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';

@Component({
  selector: 'app-worlddiv',
  templateUrl: './worlddiv.component.html',
  styleUrls: ['./worlddiv.component.scss'],
})
export class WorlddivComponent implements OnInit {
  @Input() world!: any;
  ngOnInit(): void {}

  constructor(private route: Router) {}

  visitWorld(worldId: string) {
    this.route.navigate(['world-view'], { queryParams: { worldId: worldId } });
  }
}
