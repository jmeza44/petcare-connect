import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordsMustDifferValidator(
  currentKey: string,
  newKey: string,
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const current = group.get(currentKey)?.value;
    const next = group.get(newKey)?.value;

    if (current && next && current === next) {
      group.get(newKey)?.setErrors({ sameAsCurrent: true });
      return { sameAsCurrent: true };
    }

    return null;
  };
}
