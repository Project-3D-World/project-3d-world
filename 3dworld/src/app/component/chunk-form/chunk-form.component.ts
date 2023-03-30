import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-chunk-form',
  templateUrl: './chunk-form.component.html',
  styleUrls: ['./chunk-form.component.scss'],
})
export class ChunkFormComponent {
  @Output() answer = new EventEmitter<boolean>();
  @Input() worldId: string = '';
  @Input() chunkX: number = 0;
  @Input() chunkZ: number = 0;
  userInput = false;
  form = new FormGroup({
    answer: new FormControl(false),
  });

  onSubmit() {
    if (this.userInput) {
      console.log('User answered yes.');
      this.answer.emit(true);
    } else {
      console.log('User answered no.');
      this.answer.emit(false);
    }
  }

  claimPlot(event: any): void {
    this.userInput = event.target.checked;
  }
}
