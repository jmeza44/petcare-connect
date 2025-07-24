import { Directive, Input, OnInit, Type, inject } from '@angular/core';
import { DialogConfig } from '../models/dialog-config.model';
import { DialogService } from '../services/dialog.service';

@Directive({
  selector: '[dialogTrigger]',
  standalone: true,
  host: {
    '(click)': 'handleClick()',
  },
})
export class DialogTriggerDirective implements OnInit {
  private dialogService = inject(DialogService);

  @Input() dialogTrigger!: Type<unknown>;
  @Input() dialogConfig?: DialogConfig;

  ngOnInit(): void {
    if (!this.dialogTrigger) {
      throw new Error('dialogTrigger requires a component type');
    }
  }

  handleClick(): void {
    this.dialogService.open(this.dialogTrigger, this.dialogConfig);
  }
}
