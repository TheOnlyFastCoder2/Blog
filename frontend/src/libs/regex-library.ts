export const email = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
export const password = /^(?=.*?[A-Za-z0-9]).{8,}$/;
export const username = /^[a-zA-Zа-яА-ЯёЁ0-9_-]{3,15}$/;

const regexLibrary = {
  username: {
    regex: username,
    error: 'Псевдоним должен содержать латинские буквы или кириллицу, и иметь длину от 3 до 15 символов.'
  },
  email: {
    regex: email,
    error: "Неправильный формат email. Пожалуйста, проверьте введенные данные."
  },
  password: {
    regex: password,
    error: "Пароль должен содержать минимум 8 символов."
  },
} as const;

export type TRegexLibraryKeys = keyof typeof regexLibrary;
export default regexLibrary;