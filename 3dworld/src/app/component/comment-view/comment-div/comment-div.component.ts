import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-comment-div',
  templateUrl: './comment-div.component.html',
  styleUrls: ['./comment-div.component.scss'],
})
export class CommentDivComponent implements OnInit {
  ngOnInit(): void {
    this.mine = this.comment.author == this.userId;
  }
  mine: boolean = false;
  @Output() deleted = new EventEmitter<string>();
  @Input() userId: string = '';
  @Input() comment: any;

  deleteComment() {
    this.deleted.emit(this.comment._id);
  }
}
