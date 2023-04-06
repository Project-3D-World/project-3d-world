import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss'],
})
export class VoteComponent {
  @Input() downvotes!: number;
  @Input() upvotes!: number;

  constructor() {}

  //display the current vote
  //prevent the user from voting more than once
  voteDown() {
    this.downvotes++;
  }

  voteUp() {
    this.upvotes++;
  }
}
