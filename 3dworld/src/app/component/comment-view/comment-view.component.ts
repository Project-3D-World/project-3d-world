import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-comment-view',
  templateUrl: './comment-view.component.html',
  styleUrls: ['./comment-view.component.scss'],
})
export class CommentViewComponent {
  @Input() comments: [] = [];
}
