import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-worlds',
  templateUrl: './worlds.component.html',
  styleUrls: ['./worlds.component.scss'],
})
export class WorldsComponent {
  worlds: any[] = [];

  constructor(private api: ApiService) {}
  ngOnInit() {
    this.api.getAllWorlds().subscribe((response) => {
      this.worlds = Object.values(response)[0];
    });
  }

}
