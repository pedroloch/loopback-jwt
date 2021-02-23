import { HttpErrors } from '@loopback/rest'
import isEmail from 'isemail'

export type Credentials = {
  email: string
  password: string
}

export const validateCredentials = (credentails: Credentials) => {
  if (!isEmail.validate(credentails.email)) {
    throw new HttpErrors.UnprocessableEntity('Invalid Email')
  }

  if (credentails.password.length < 8) {
    throw new HttpErrors.UnprocessableEntity(
      'Passworld length should be greater then 8'
    )
  }
}
