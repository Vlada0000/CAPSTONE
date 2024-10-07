export const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
    if (password.length < minLength) {
      return {
        valid: false,
        message: 'La password deve essere di almeno 8 caratteri.',
      };
    }
  
    if (!hasUpperCase) {
      return {
        valid: false,
        message: 'La password deve contenere almeno una lettera maiuscola.',
      };
    }
  
    if (!hasLowerCase) {
      return {
        valid: false,
        message: 'La password deve contenere almeno una lettera minuscola.',
      };
    }
  
    if (!hasNumber) {
      return {
        valid: false,
        message: 'La password deve contenere almeno un numero.',
      };
    }
  
    if (!hasSpecialChar) {
      return {
        valid: false,
        message: 'La password deve contenere almeno un carattere speciale.',
      };
    }
  
    return { valid: true };
  };
  