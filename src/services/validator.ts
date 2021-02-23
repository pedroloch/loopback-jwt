import { HttpErrors } from '@loopback/rest'

export type Credentials = {
  username: string
  password: string
}

export const validateCredentials = (credentails: Credentials) => {
  // if (!isEmail.validate(credentails.username)) {
  //   throw new HttpErrors.UnprocessableEntity('Invalid Email')
  // }

  if (credentails.password.length < 8) {
    throw new HttpErrors.UnprocessableEntity(
      'Passworld length should be greater then 8'
    )
  }
}
