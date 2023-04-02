import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-notificationdiv',
  templateUrl: './notificationdiv.component.html',
  styleUrls: ['./notificationdiv.component.scss']
})
export class NotificationdivComponent implements OnInit {
  @Input() notification!: any;
  ngOnInit(): void {}
}
