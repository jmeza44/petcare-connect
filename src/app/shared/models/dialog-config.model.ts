export interface DialogConfig<T = unknown> {
  data?: T;
  closeOnBackdropClick?: boolean;
  panelClass?: string | string[];
  ariaLabel?: string;
}
