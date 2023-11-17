export function isEmail(email: string): boolean {
  const emailFormat =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailFormat.test(String(email));
}
export function isPassword(password: string): boolean {
  // >8 char, numeric, uppercase, lowercase, special char (!@#$%&*()-+=^.), no whitespace
  // const passwordFormat =
  //   /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&-+=()])(?=\\S+$).{8,}$/;

  //8 characters and contain combination of alphabet and number
  const passwordFormat = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
  return passwordFormat.test(String(password));
}
export function isPhone(phone: string): boolean {
  const passwordFormat = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  return passwordFormat.test(String(phone));
}
export function isUrl(address: string): boolean {
  try {
    return Boolean(new URL(address));
  } catch (e) {
    return false;
  }
}
export function isNumber(number: any): boolean {
  return !isNaN(parseFloat(number)) && !isNaN(number - 0);
}
export function isNotEmpty(variable: any): boolean {
  return Boolean(variable);
}
export function isEmpty(variable: any): boolean {
  return !variable;
}
