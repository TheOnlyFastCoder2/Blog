import api from "@/libs/api";
import { AxiosError } from "axios";
import Form, { IFormData } from "@/components/shared/Form";
import { toaster } from "@/components/ui/toaster"
import { useUserStore } from "@/libs/store/User/STUser";
import { useNavigate } from 'react-router-dom';

const fields = [
  { name: 'email', label: 'Электронная почта', placeholder: 'Введите свою почту' },
  { name: 'password', label: 'Пароль', placeholder: 'Введите свой пароль', type: 'password' },
];

const errors = {
  "Invalid password": "Пароль был введен не верно",
  "The user with this email does not exist": "Почта была введен не верно"
} as const;

type TKeyError = keyof typeof errors;

export default function () {
  const user = useUserStore();
  const navigate =  useNavigate();

  async function handleFormSubmit(formData: IFormData) {
    try {
      const resp = await api.AuthService.signIn({
        email: formData.email.value,
        password: formData.password.value,
      });

      await user.setData({
        user_id: resp.data.id,
        token: resp.data.token,
        username: resp.data.username,
        email: resp.data.email
      });

      await toaster.create({
        title: "Вы успешно авторизовались",
        type: "success",
      });
      navigate('/');
    } catch(error) {
      if(!(error instanceof AxiosError)) return;
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
