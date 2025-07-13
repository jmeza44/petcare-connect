import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordsMatchValidator(
  passwordKey: string,
  confirmPasswordKey: string,
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get(passwordKey)?.value;
    const confirmPassword = group.get(confirmPasswordKey)?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      group.get(confirmPasswordKey)?.setErrors({ mismatch: true });
      return { mismatch: true };
    }

    return null;
  };
}
