import { Component } from '@angular/core';

import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-toaster',
    imports: [ToastModule],
    providers: [MessageService],
    templateUrl: './toaster.component.html',
    styleUrl: './toaster.component.css'
})
export class ToasterComponent {
  constructor(private messageService: MessageService) {}

  success(title: string, details: string) {
    this.messageService.add({severity: 'success', summary: title, detail: details, closable: true});
  }

  info(title: string, details: string) {
    this.messageService.add({severity: 'info', summary: title, detail: details, closable: true});
  }

  warn(title: string, details: string) {
    this.messageService.add({severity: 'warn', summary: title, detail: details, closable: true});
  }

  error(title: string, details: string) {
    this.messageService.add({severity: 'error', summary: title, detail: details, closable: true});
  }
}
