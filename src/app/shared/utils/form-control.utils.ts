import { FormControl, FormGroup } from '@angular/forms';

export function getFormControlAndState<T = unknown>(
  form: FormGroup,
  controlName: string,
): {
  control: FormControl<T>;
  state: { touched: boolean; invalid: boolean; errors: any };
} {
  const control = form.get(controlName) as FormControl<T>;
  return {
    control,
    state: {
      touched: control.touched,
      invalid: control.invalid,
      errors: control.errors,
    },
  };
}
