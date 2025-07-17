import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import {
  FaIconComponent,
  FontAwesomeModule,
  IconDefinition,
  SizeProp,
} from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { DropdownTriggerDirective } from '../../directives/dropdown-trigger.directive';
import { MenuOption } from '../../models/menu-option';
import { TooltipDirective } from '../../directives/tooltip.directive';

@Component({
  selector: 'pet-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    FaIconComponent,
    FontAwesomeModule,
    DropdownTriggerDirective,
    TooltipDirective,
  ],
  template: `
    <button
      (click)="handleClick()"
      [appTooltip]="tooltip() ?? ''"
      [appDropdownTrigger]="appDropdownTrigger()"
      [dropdownPosition]="dropdownPosition()"
      [attr.aria-busy]="isLoading()"
      [attr.aria-disabled]="isDisabled() || isLoading()"
      [attr.aria-label]="
        ariaLabel() || text() || icon()?.iconName || loadingText()
      "
      [disabled]="isDisabled() || isLoading()"
      [type]="type()"
      [class]="classes()"
      class="inline-flex items-center justify-center gap-2"
    >
      @if (iconPosition() === 'left' && (isLoading() || icon())) {
        <fa-icon
          [animation]="isLoading() ? 'spin' : undefined"
          [attr.aria-hidden]="true"
          [icon]="isLoading() ? spinnerIcon : icon()!"
          [size]="iconSize[size()]"
          [class.mr-2]="text()"
        ></fa-icon>
      }

      @if (text()) {
        <span [class.sr-only]="hideText()">
          {{ isLoading() ? loadingText() : text() }}
        </span>
      }

      @if (iconPosition() === 'right' && (isLoading() || icon())) {
        <fa-icon
          [animation]="isLoading() ? 'spin' : undefined"
          [attr.aria-hidden]="true"
          [icon]="isLoading() ? spinnerIcon : icon()!"
          [size]="iconSize[size()]"
          [class.ml-2]="text()"
        ></fa-icon>
      }
    </button>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class ButtonComponent {
  // Inputs
  readonly text = input<string | null>(null);
  readonly loadingText = input<string>('Loading...');
  readonly ariaLabel = input<string | null>(null);
  readonly icon = input<IconDefinition | null>(null);
  readonly iconPosition = input<'left' | 'right'>('left');
  readonly type = input<'button' | 'submit'>('button');
  readonly size = input<'small' | 'medium' | 'large'>('medium');
  readonly color = input<
    | 'primary'
    | 'secondary'
    | 'basic'
    | 'danger'
    | 'success'
    | 'warning'
    | 'information'
  >('primary');
  readonly styling = input<'filled' | 'outline' | 'link'>('filled');
  readonly isLoading = input<boolean>(false);
  readonly isDisabled = input<boolean>(false);
  readonly hideText = input<boolean>(false);
  readonly customClass = input<string>('');
  readonly tooltip = input<string | undefined>(undefined);
  readonly appDropdownTrigger = input<MenuOption[] | undefined>(undefined);
  readonly dropdownPosition = input<'bottom-left' | 'bottom-right'>(
    'bottom-left',
  );

  // Output
  readonly clickTriggered = output<void>();

  // Internal
  readonly spinnerIcon = faSpinner;

  readonly iconSize: Record<
    'small' | 'medium' | 'large',
    SizeProp | undefined
  > = {
    small: 'sm',
    medium: undefined,
    large: 'lg',
  };

  readonly classes = computed(() => {
    const base =
      'font-medium py-2 px-4 rounded-md outline-none transition-all ease-in-out duration-100 focus:outline-none active:ring-0 active:scale-[.98] disabled:font-normal disabled:text-neutral-400 disabled:cursor-default disabled:pointer-events-none';

    const sizeClass =
      this.size() === 'small'
        ? 'text-sm'
        : this.size() === 'large'
          ? 'text-lg'
          : 'text-base';

    const styleClass = this.getColorClass(this.color(), this.styling());

    const loadingClass = this.isLoading()
      ? 'opacity-75 pointer-events-none cursor-default'
      : '';

    return `${base} ${sizeClass} ${styleClass} ${loadingClass} ${this.customClass()}`.trim();
  });

  handleClick(): void {
    if (!this.isDisabled() && !this.isLoading()) {
      this.clickTriggered.emit();
    }
  }

  private getColorClass(
    color: NonNullable<ReturnType<typeof this.color>>,
    style: NonNullable<ReturnType<typeof this.styling>>,
  ): string {
    const colorMap = {
      primary: {
        filled:
          'bg-primary-500 text-white hover:bg-primary-600 hover:shadow-md focus:ring-2 focus:ring-primary-500 active:bg-primary-700 disabled:bg-neutral-200',
        outline:
          'bg-transparent text-primary-500 border-2 border-primary-500 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-600 hover:shadow-md active:bg-primary-100 active:text-primary-700 active:border-primary-700 focus:ring-2 focus:ring-primary-500 disabled:border-neutral-400',
        link: 'bg-transparent text-primary-500 uppercase underline-offset-2 hover:bg-primary-50 hover:text-primary-600 active:bg-primary-200 active:text-primary-700 focus:outline-none focus-visible:bg-primary-50 focus-visible:underline focus-visible:decoration-2 focus-visible:offset-2 focus-visible:outline-none',
      },
      secondary: {
        filled:
          'bg-secondary-500 text-white hover:bg-secondary-600 hover:shadow-md focus:ring-2 focus:ring-secondary-500 active:bg-secondary-700 disabled:bg-neutral-200',
        outline:
          'bg-transparent text-secondary-500 border-2 border-secondary-500 hover:bg-secondary-50 hover:text-secondary-600 hover:border-secondary-600 hover:shadow-md active:bg-secondary-100 active:text-secondary-700 active:border-secondary-700 focus:ring-2 focus:ring-secondary-500 disabled:border-neutral-400',
        link: 'bg-transparent text-secondary-500 uppercase underline-offset-2 hover:bg-secondary-50 hover:text-secondary-600 active:bg-secondary-200 active:text-secondary-700 focus:outline-none focus-visible:bg-secondary-50 focus-visible:underline focus-visible:decoration-2 focus-visible:offset-2 focus-visible:outline-none',
      },
      basic: {
        filled:
          'bg-gray-500 text-white hover:bg-gray-600 hover:shadow-md focus:ring-2 focus:ring-gray-500 active:bg-gray-700 disabled:bg-neutral-200',
        outline:
          'bg-transparent text-gray-500 border-2 border-gray-500 hover:bg-gray-50 hover:text-gray-600 hover:border-gray-600 hover:shadow-md active:bg-gray-100 active:text-gray-700 active:border-gray-700 focus:ring-2 focus:ring-gray-500 disabled:border-neutral-400',
        link: 'bg-transparent text-gray-500 uppercase underline-offset-2 hover:bg-gray-50 hover:text-gray-600 active:bg-gray-200 active:text-gray-700 focus:outline-none focus-visible:bg-gray-50 focus-visible:underline focus-visible:decoration-2 focus-visible:offset-2 focus-visible:outline-none',
      },
      danger: {
        filled:
          'bg-red-500 text-white hover:bg-red-600 hover:shadow-md focus:ring-2 focus:ring-red-500 active:bg-red-700 disabled:bg-neutral-200',
        outline:
          'bg-transparent text-red-500 border-2 border-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-600 hover:shadow-md active:bg-red-100 active:text-red-700 active:border-red-700 focus:ring-2 focus:ring-red-500 disabled:border-neutral-400',
        link: 'bg-transparent text-red-500 uppercase underline-offset-2 hover:bg-red-50 hover:text-red-600 active:bg-red-200 active:text-red-700 focus:outline-none focus-visible:bg-red-50 focus-visible:underline focus-visible:decoration-2 focus-visible:offset-2 focus-visible:outline-none',
      },
      success: {
        filled:
          'bg-green-500 text-white hover:bg-green-600 hover:shadow-md focus:ring-2 focus:ring-green-500 active:bg-green-700 disabled:bg-neutral-200',
        outline:
          'bg-transparent text-green-500 border-2 border-green-500 hover:bg-green-50 hover:text-green-600 hover:border-green-600 hover:shadow-md active:bg-green-100 active:text-green-700 active:border-green-700 focus:ring-2 focus:ring-green-500 disabled:border-neutral-400',
        link: 'bg-transparent text-green-500 uppercase underline-offset-2 hover:bg-green-50 hover:text-green-600 active:bg-green-200 active:text-green-700 focus:outline-none focus-visible:bg-green-50 focus-visible:underline focus-visible:decoration-2 focus-visible:offset-2 focus-visible:outline-none',
      },
      warning: {
        filled:
          'bg-amber-500 text-white hover:bg-amber-600 hover:shadow-md focus:ring-2 focus:ring-amber-500 active:bg-amber-700 disabled:bg-neutral-200',
        outline:
          'bg-transparent text-amber-500 border-2 border-amber-500 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-600 hover:shadow-md active:bg-amber-100 active:text-amber-700 active:border-amber-700 focus:ring-2 focus:ring-amber-500 disabled:border-neutral-400',
        link: 'bg-transparent text-amber-500 uppercase underline-offset-2 hover:bg-amber-50 hover:text-amber-600 active:bg-amber-200 active:text-amber-700 focus:outline-none focus-visible:bg-amber-50 focus-visible:underline focus-visible:decoration-2 focus-visible:offset-2 focus-visible:outline-none',
      },
      information: {
        filled:
          'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-md focus:ring-2 focus:ring-blue-500 active:bg-blue-700 disabled:bg-neutral-200',
        outline:
          'bg-transparent text-blue-500 border-2 border-blue-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-600 hover:shadow-md active:bg-blue-100 active:text-blue-700 active:border-blue-700 focus:ring-2 focus:ring-blue-500 disabled:border-neutral-400',
        link: 'bg-transparent text-blue-500 uppercase underline-offset-2 hover:bg-blue-50 hover:text-blue-600 active:bg-blue-200 active:text-blue-700 focus:outline-none focus-visible:bg-blue-50 focus-visible:underline focus-visible:decoration-2 focus-visible:offset-2 focus-visible:outline-none',
      },
    };

    return colorMap[color][style];
  }
}
