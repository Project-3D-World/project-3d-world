import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-comment-view',
  templateUrl: './comment-view.component.html',
  styleUrls: ['./comment-view.component.scss'],
})
export class CommentViewComponent {
  @Output() deleted = new EventEmitter<string>();
  @Input() userId: string = '';
  @Input() comments: any = [];
  @Input() x: number = 0;
  @Input() z: number = 0;

  deleteComment(commentId: string) {
    this.deleted.emit(commentId);
  }
}
