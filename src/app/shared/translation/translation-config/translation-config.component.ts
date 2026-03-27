import { ChangeDetectorRef, Component } from '@angular/core';

import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { DialogModule } from 'primeng/dialog';

import { ToasterService } from '../../toaster/toaster.service';
import { TranslationService } from '../translation.service';

@Component({
  selector: 'app-translation-config',
  imports: [FormsModule, ReactiveFormsModule, DialogModule],
  templateUrl: './translation-config.component.html',
  styleUrl: './translation-config.component.css'
})
export class TranslationConfigComponent {

  visible: boolean = false;

  translationForm: FormGroup = new FormGroup({
    key: new FormControl("", [Validators.required])
  });

  constructor(private readonly translationService: TranslationService, private toasterService: ToasterService, private changeDedector: ChangeDetectorRef) {
    this.translationForm.setValue({
      key: translationService.getPersonalKey()
    });
  }

  showConfigDialog() {
    this.visible = true;
    this.changeDedector.detectChanges();
  }

  savePersonalKey() {
    try {
      this.translationService.updateTranslationConfig(this.translationForm.value.key, "deepl");
      this.toasterService.success("Update Personal Key", "New Personal Key set and safed");
      this.visible = false;
    } catch (error: any) {
      this.toasterService.error("Update Personal Key", `Set Personal Key failed, reason: ${error.toString()}`);
    }

    this.changeDedector.detectChanges();
  }

  removePersonalKey() {
    this.translationService.removePersonalKey();

    this.visible = false;
    this.translationForm.setValue({
      key: ""
    });

    this.toasterService.success("Remove Personal Key", "Personal Key deleted, returned to default Key.");
    this.changeDedector.detectChanges();
  }
}
