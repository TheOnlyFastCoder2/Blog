import Form, { IFormData } from "@/components/shared/Form";
import { toaster } from "@/components/ui/toaster";
import api from "@/libs/api";
import { AxiosError } from "axios";

const fields = [
  { name: 'username', label: 'Имя пользователя', placeholder: 'Введите свое имя' },
  { name: 'email', label: 'Электронная почта', placeholder: 'Введите свою почту' },
  { name: 'password', label: 'Пароль', placeholder: 'Введите свой пароль', type: 'password' },
  { name: 'confirmPassword', label: 'Подтвердить пароль', placeholder: 'Подтвердите свой пароль', type: 'password' },
];

const errors = {
  "A user with this email already exists": "Пользователь с такой почтой уже существует",
} as const;

type TKeyError = keyof typeof errors;

export default function ({goToSignIn}: {goToSignIn: Function}) {

  async function handleFormSubmit(formData: IFormData) {
    try {
      await api.AuthService.signUp({
        username: formData.username.value,
        email: formData.email.value,
        password: formData.password.value,
      });
      goToSignIn();
    } catch(error) {
      if(!(error instanceof AxiosError)) return;
      console.error(error)
      if(!errors[error.response?.data as TKeyError]) return;
      toaster.create({
        title: errors[error.response?.data as TKeyError],
        type: "error",
      })
    }
  }

  return (
    <Form fields={fields} onSubmit={handleFormSubmit} />
  )
}