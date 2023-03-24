import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-comment-div',
  templateUrl: './comment-div.component.html',
  styleUrls: ['./comment-div.component.scss'],
})
export class CommentDivComponent {
  @Input() comment: any;
}
