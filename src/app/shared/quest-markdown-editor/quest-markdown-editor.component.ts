import { ChangeDetectionStrategy, Component, ElementRef, Input, model, ModelSignal, OnInit, ViewChild } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-quest-markdown-editor',
  templateUrl: './quest-markdown-editor.component.html',
  styleUrls: ['./quest-markdown-editor.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgbModule, MarkdownModule
  ]
})
export class QuestMarkdownEditorComponent implements OnInit {

  selectedLanguage = model<'DE' | 'EN' | 'FR'>();

  @Input('title') title: string = "Input";

  dataDe = model<string>();
  dataEn = model<string>();
  dataFr = model<string>();

  @ViewChild('inputTextareaDe') inputTextareaDe!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('inputTextareaEn') inputTextareaEn!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('inputTextareaFr') inputTextareaFr!: ElementRef<HTMLTextAreaElement>;

  constructor() { }

  ngOnInit() {
  }

  getSelectedData(): string {
    if (this.selectedLanguage() == 'DE') {
      return this.dataDe()!;
    } else if (this.selectedLanguage() == 'EN') {
      return this.dataEn()!;
    } else {
      return this.dataFr()!;
    }
  }

  applyMarkdown(type: 'bold' | 'italic' | 'image' | 'list' | 'link' | 'newline') {
    let textarea = this.getActiveTextarea();
    if (!textarea) return;

    let start = textarea.selectionStart;
    let end = textarea.selectionEnd;

    let value = textarea.value;
    let selectedText = value.substring(start, end);

    let replacement = '';

    switch (type) {
      case 'bold':
        replacement = `**${selectedText || 'bold text'}** `;
        break;

      case 'italic':
        replacement = `*${selectedText || 'italic text'}* ` ;
        break;

      case 'image':
        let imgUrl = selectedText || '/assets/sr-avatar.jpg';
        replacement = `![alt text](${imgUrl}) `;
        break;

      case 'list':
        let lines = (selectedText || 'List item').split('\n');
        replacement = '\n' + lines.map(l => `- ${l}`).join('\n');
        break;

      case 'link':
        if (selectedText.startsWith('http')) {
          replacement = `[link text](${selectedText}) `;
        } else {
          replacement = `[${selectedText || 'link text'}](https://example.com) `;
        }
        break;
      case 'newline':
        replacement = '\n\n';
        break;
    }

    let newValue =
      value.substring(0, start) +
      replacement +
      value.substring(end);

    this.updateSignal(newValue);

    let cursorPos = start + replacement.length;
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(cursorPos, cursorPos);
    });
  }

  getActiveTextarea(): HTMLTextAreaElement | null {
    switch (this.selectedLanguage()) {
      case 'DE':
        return this.inputTextareaDe?.nativeElement;
      case 'EN':
        return this.inputTextareaEn?.nativeElement;
      case 'FR':
        return this.inputTextareaFr?.nativeElement;
      default:
        return null;
    }
  }

  updateSignal(value: string) {
    switch (this.selectedLanguage()) {
      case 'DE':
        this.dataDe.set(value);
        break;
      case 'EN':
        this.dataEn.set(value);
        break;
      case 'FR':
        this.dataFr.set(value);
        break;
    }
  }

}
