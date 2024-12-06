import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FaIconComponent, IconDefinition } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'pet-button',
  standalone: true,
  imports: [CommonModule, FaIconComponent],
  templateUrl: './button.component.html',
  styles: `:host {display: contents;}`,
})
export class ButtonComponent {
  @Input() text: string = 'Click me!';
  @Input() loadingText: string = 'Loading...';
  @Input() icon: IconDefinition | null = null;
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() color: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'information' = 'primary';
  @Input() styling: 'filled' | 'outline' | 'link' = 'filled';
  @Input() isLoading = false;
  @Input() isDisabled = false;
  @Output() click = new EventEmitter<void>();

  spinnerIcon = faSpinner;

  handleClick() {
    if (!this.isDisabled && !this.isLoading) {
      this.click.emit();
    }
  }

  getButtonClasses(): string {
    const baseClasses = 'font-medium py-2 px-4 rounded-md outline-none transition-all ease-in-out duration-100 focus:outline-none active:ring-0 active:scale-[.98] disabled:font-normal disabled:text-neutral-400 disabled:cursor-default disabled:pointer-events-none';

    // Size classes
    const sizeClasses = this.size === 'small' ? 'text-sm' : this.size === 'large' ? 'text-lg' : 'text-base';

    // Color classes for primary, secondary, danger, success, warning, and information buttons
    const colorClasses = {
      primary: {
        filled: 'bg-primary-500 text-white hover:bg-primary-600 hover:shadow-md focus:ring-2 focus:ring-primary-500 active:bg-primary-700 disabled:bg-neutral-200',
        outline: 'bg-transparent text-primary-500 border-2 border-primary-500 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-600 hover:shadow-md active:bg-primary-100 active:text-primary-700 active:border-primary-700 focus:ring-2 focus:ring-primary-500 disabled:border-neutral-400',
        link: 'bg-transparent text-primary-500 uppercase hover:bg-primary-50 hover:text-primary-600 active:bg-primary-200 active:text-primary-700 active:scale-[.98] focus:outline-none focus:bg-primary-100'
      },
      secondary: {
        filled: 'bg-secondary-500 text-white hover:bg-secondary-600 hover:shadow-md focus:ring-2 focus:ring-secondary-500 active:bg-secondary-700 disabled:bg-neutral-200',
        outline: 'bg-transparent text-secondary-500 border-2 border-secondary-500 hover:bg-secondary-50 hover:text-secondary-600 hover:border-secondary-600 hover:shadow-md active:bg-secondary-100 active:text-secondary-700 active:border-secondary-700 focus:ring-2 focus:ring-secondary-500 disabled:border-neutral-400',
        link: 'bg-transparent text-secondary-500 uppercase hover:bg-secondary-50 hover:text-secondary-600 active:bg-secondary-200 active:text-secondary-700 active:scale-[.98] focus:outline-none focus:bg-secondary-100'
      },
      danger: {
        filled: 'bg-red-500 text-white hover:bg-red-600 hover:shadow-md focus:ring-2 focus:ring-red-500 active:bg-red-700 disabled:bg-neutral-200',
        outline: 'bg-transparent text-red-500 border-2 border-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-600 hover:shadow-md active:bg-red-100 active:text-red-700 active:border-red-700 focus:ring-2 focus:ring-red-500 disabled:border-neutral-400',
        link: 'bg-transparent text-red-500 uppercase hover:bg-red-50 hover:text-red-600 active:bg-red-200 active:text-red-700 active:scale-[.98] focus:outline-none focus:bg-red-100'
      },
      success: {
        filled: 'bg-green-500 text-white hover:bg-green-600 hover:shadow-md focus:ring-2 focus:ring-green-500 active:bg-green-700 disabled:bg-neutral-200',
        outline: 'bg-transparent text-green-500 border-2 border-green-500 hover:bg-green-50 hover:text-green-600 hover:border-green-600 hover:shadow-md active:bg-green-100 active:text-green-700 active:border-green-700 focus:ring-2 focus:ring-green-500 disabled:border-neutral-400',
        link: 'bg-transparent text-green-500 uppercase hover:bg-green-50 hover:text-green-600 active:bg-green-200 active:text-green-700 active:scale-[.98] focus:outline-none focus:bg-green-100'
      },
      warning: {
        filled: 'bg-amber-500 text-white hover:bg-amber-600 hover:shadow-md focus:ring-2 focus:ring-amber-500 active:bg-amber-700 disabled:bg-neutral-200',
        outline: 'bg-transparent text-amber-500 border-2 border-amber-500 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-600 hover:shadow-md active:bg-amber-100 active:text-amber-700 active:border-amber-700 focus:ring-2 focus:ring-amber-500 disabled:border-neutral-400',
        link: 'bg-transparent text-amber-500 uppercase hover:bg-amber-50 hover:text-amber-600 active:bg-amber-200 active:text-amber-700 active:scale-[.98] focus:outline-none focus:bg-amber-100'
      },
      information: {
        filled: 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-md focus:ring-2 focus:ring-blue-500 active:bg-blue-700 disabled:bg-neutral-200',
        outline: 'bg-transparent text-blue-500 border-2 border-blue-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-600 hover:shadow-md active:bg-blue-100 active:text-blue-700 active:border-blue-700 focus:ring-2 focus:ring-blue-500 disabled:border-neutral-400',
        link: 'bg-transparent text-blue-500 uppercase hover:bg-blue-50 hover:text-blue-600 active:bg-blue-200 active:text-blue-700 active:scale-[.98] focus:outline-none focus:bg-blue-100'
      }
    };

    const styleClasses = colorClasses[this.color][this.styling];

    // Loading classes (spinner and text changes)
    const loadingClasses = this.isLoading
      ? 'opacity-75 pointer-events-none cursor-default'
      : '';

    // Final classes by combining everything
    return `${baseClasses} ${sizeClasses} ${styleClasses} ${loadingClasses}`;
  }
}
