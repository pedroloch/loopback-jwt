// Uncomment these imports to begin using these cool features!

import { authenticate, AuthenticationBindings } from '@loopback/authentication'
import { UserRepository } from '@loopback/authentication-jwt'
import { inject } from '@loopback/core'
import { repository } from '@loopback/repository'
import {
  get,
  getJsonSchemaRef,
  getModelSchemaRef,
  HttpErrors,
  post,
  requestBody,
} from '@loopback/rest'
import { SecurityBindings, UserProfile } from '@loopback/security'
import _ from 'lodash'
import { User } from '../models'
import { hashPassword } from '../services/hash.password'
import { JWTService } from '../services/jwt.service'
import { MyUserService } from '../services/user.service'
import { Credentials, validateCredentials } from '../services/validator'
import { CredentialsRequestBody } from './specs/auth.specs'

export class AuthController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject('services.user.service')
    public userService: MyUserService,
    @inject(SecurityBindings.USER, { optional: true })
    public user: UserProfile,
    @inject('service.jwt.service')
    public jwtService: JWTService
  ) {}

  @post('/signup', {
    responses: {
      '200': {
        description: 'Sign Up user',
        content: {
          schema: getJsonSchemaRef(User),
        },
      },
    },
  })
  async signUp(@requestBody() userRequest: Omit<User, 'id'>) {
    validateCredentials(_.pick(userRequest, ['username', 'password']))

    const isUsed = await this.userRepository.findOne({
      where: { username: userRequest.username },
    })

    if (isUsed) throw new HttpErrors.BadRequest('Username already taken')

    userRequest.password = await hashPassword(userRequest.password)

    const savedUser = await this.userRepository.create(userRequest)

    return _.pick(savedUser, ['username', 'email', 'name', 'id'])
  }

  @post('/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials
  ): Promise<{ user: UserProfile; token: string }> {
    const user = await this.userService.verifyCredentials(credentials)

    const userProfile = this.userService.convertToUserProfile(user)

    const token = await this.jwtService.generateToken(userProfile)

    return { user: userProfile, token }
  }

  @get('/me', {
    responses: {
      '200': {
        description: 'User information',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User, {
              exclude: ['password'],
            }),
          },
        },
      },
    },
  })
  @authenticate({ strategy: 'jwt' })
  async me(
    @inject(AuthenticationBindings.CURRENT_USER)
    userId: UserProfile
  ): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findById(userId.id)

    return _.pick(user, ['id', 'role', 'email', 'name', 'username'])
  }
}
