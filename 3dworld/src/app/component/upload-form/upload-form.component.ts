import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.scss'],
})
export class UploadFormComponent {
  @Output() file = new EventEmitter<File>();
  @Input() worldId: string = '';
  @Input() chunkX: number = 0;
  @Input() chunkZ: number = 0;
  realFile!: File;
  uploadForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.uploadForm = this.fb.group({
      GLTFfile: [null, Validators.required],
    });
  }

  newUpload(): void {
    this.file.emit(this.realFile);
    this.uploadForm.reset();
  }

  fileChange(event: any): void {
    this.realFile = event.target.files[0];
  }
}
