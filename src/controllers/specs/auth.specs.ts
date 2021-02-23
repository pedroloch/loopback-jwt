import { model, property } from '@loopback/repository'
import { getModelSchemaRef } from '@loopback/rest'

@model()
class UserCredentials {
  @property({
    type: 'string',
    id: false,
    required: true,
  })
  email: string
  @property({
    type: 'string',
    id: false,
    required: true,
    jsonSchema: {
      maxLength: 20,
      minLength: 8,
    },
  })
  password: string
}
export const CredentialsSchema = getModelSchemaRef(UserCredentials)

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': { schema: CredentialsSchema },
  },
}
