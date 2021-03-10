import { AbstractControl } from '@angular/forms';
import { ValidatorFn } from '@angular/forms';

export function forbiddenCharactersValidator(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const forbidden = nameRe.test(control.value);
      return forbidden ? {forbiddenCharacter: {value: control.value}} : null;
    };
  }

  export function emailValidator(emailRe: RegExp): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const valid = emailRe.test(control.value);
      return valid ? null : {validEmail: {value: control.value}};
    };
  }
