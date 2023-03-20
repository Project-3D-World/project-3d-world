import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-commentform',
  templateUrl: './commentform.component.html',
  styleUrls: ['./commentform.component.scss'],
})
export class CommentformComponent {
  @Output() newComment = new EventEmitter<string>();
  worldId: string = '';
  chunkX: number = 0;
  chunkY: number = 0;
  authorId: string = '';
  commentForm: FormGroup;
  formGroup: any;

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.commentForm = this.fb.group({
      comment: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  postComment() {
    this.newComment.emit(this.commentForm.value.comment);

    this.api
      .postComment(
        this.worldId,
        this.chunkX,
        this.chunkY,
        this.authorId,
        this.commentForm.value.comment
      )
      .subscribe();
  }
}
