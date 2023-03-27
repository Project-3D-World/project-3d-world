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
  uploadForm: FormGroup;
  constructor(private fb: FormBuilder, private api: ApiService) {
    this.uploadForm = this.fb.group({
      GLTFfile: [null, Validators.required],
    });
  }

  newUpload() {
    const selectedFile = this.uploadForm.get('GLTFfile')?.value;
    if (selectedFile) {
      const file = new File([selectedFile], selectedFile.name, {
        type: selectedFile.type,
      });
      console.log(file);
      this.file.emit(file);
      this.uploadForm.reset();
    }
  }
}
