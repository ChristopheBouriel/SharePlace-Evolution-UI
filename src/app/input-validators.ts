import { AbstractControl } from '@angular/forms';
import { ValidatorFn } from '@angular/forms';

export function forbiddenCharactersValidator(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const forbidden = nameRe.test(control.value);
      return forbidden ? {forbiddenCharacter: {value: control.value}} : null;
    };
  }
