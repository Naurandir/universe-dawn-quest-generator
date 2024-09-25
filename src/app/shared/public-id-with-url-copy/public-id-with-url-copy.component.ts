import { Component, Input } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { ToasterService } from '../toaster/toaster.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReduceTextPipe } from "../reduce-text.pipe";

@Component({
    selector: 'public-id-with-url-copy',
    standalone: true,
    providers: [Clipboard],
    templateUrl: './public-id-with-url-copy.component.html',
    styleUrl: './public-id-with-url-copy.component.css',
    imports: [NgbModule, ReduceTextPipe]
})
export class PublicIdwithUrlCopyComponent {

  @Input() publicId!: string;
  @Input() queryParameter: string = "id";

  constructor(private clipboard: Clipboard, private readonly toasterService: ToasterService) {
  }

  copyContent() {
    let baseUrl = window.location.href.split('?')[0];
    let url = `${baseUrl}?${this.queryParameter}=${this.publicId}`;
    this.clipboard.copy(url);
    this.toasterService.success(`Copy Url`,`Copied URL for ${this.publicId} to Clipboard.`);
  }
}
