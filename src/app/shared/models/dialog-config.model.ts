export interface DialogConfig<T = unknown> {
  data?: T;
  closeOnBackdropClick?: boolean;
  panelClass?: string | string[];
  ariaLabel?: string;
  /**
   * Responsive size preset for common dialog sizes.
   * - 'small': max-w-sm (384px)
   * - 'medium': max-w-md (448px)
   * - 'large': max-w-lg (512px)
   * - 'extra-large': max-w-xl (576px)
   * - 'full': Uses panelClass for custom sizing
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large' | 'extra-large' | 'full';
  /**
   * Whether the dialog should be full-screen on mobile devices
   * @default false
   */
  fullScreenOnMobile?: boolean;
}
