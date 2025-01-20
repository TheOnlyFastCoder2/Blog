import {t} from 'elysia'; 

export const AuthDTO = {
  signIn: t.Object({
    password: t.String(),
    email: t.String(),
  }),

  signUp: t.Object({
    username: t.String(),
    email: t.String(),
    password: t.String(),
  }),

  sample: t.Object({
    id: t.String(),
    password: t.String(),
    email: t.String(),
    username: t.String(),
    created_at: t.Date(),
  }), 
}

export type AuthDTOSignIn = typeof AuthDTO.signIn.static;
export type AuthDTOSignUp = typeof AuthDTO.signUp.static;
export type AuthDTOReturned = typeof AuthDTO.sample.static;
