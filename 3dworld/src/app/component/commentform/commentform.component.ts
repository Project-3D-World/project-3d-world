import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-commentform',
  templateUrl: './commentform.component.html',
  styleUrls: ['./commentform.component.scss'],
})
export class CommentformComponent {
  @Output() newComment = new EventEmitter<any>();
  @Input() worldId: string = '';
  @Input() chunkX: number = 0;
  @Input() chunkZ: number = 0;
  authorId: string = '';
  authorName: string = '';
  commentForm: FormGroup;
  formGroup: any;

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.commentForm = this.fb.group({
      comment: ['', Validators.required],
      ratings: [0, Validators.required],
    });
  }

  ngOnInit(): void {
    this.api.getMe().subscribe({
      next: (x: any) => {
        this.authorId = x.userId;
        this.authorName = x.displayName;
      },
      error: (err: any) => console.error(err),
      complete: () => console.log('finished init'),
    });
  }

  postComment() {
    this.newComment.emit({
      comment: this.commentForm.value.comment,
      rating: this.commentForm.value.ratings,
    });

    this.commentForm.reset();
  }
}
