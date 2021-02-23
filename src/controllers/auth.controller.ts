// Uncomment these imports to begin using these cool features!

import { authenticate, AuthenticationBindings } from '@loopback/authentication'
import { inject } from '@loopback/core'
import { repository } from '@loopback/repository'
import {
  get,
  getJsonSchemaRef,
  HttpErrors,
  post,
  requestBody,
} from '@loopback/rest'
import { SecurityBindings, UserProfile } from '@loopback/security'
import _ from 'lodash'
import { Users } from '../models'
import { UsersRepository } from '../repositories'
import { hashPassword } from '../services/hash.password'
import { JWTService } from '../services/jwt.service'
import { MyUserService } from '../services/user.service'
import { Credentials, validateCredentials } from '../services/validator'
import { CredentialsRequestBody } from './specs/auth.specs'

export class AuthController {
  constructor(
    @repository(UsersRepository)
    public usersRepository: UsersRepository,
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
          schema: getJsonSchemaRef(Users),
        },
      },
    },
  })
  async signUp(@requestBody() userData: Users) {
    validateCredentials(userData)

    const isUsed = await this.usersRepository.findOne({
      where: { email: userData.email },
    })

    if (isUsed) throw new HttpErrors.BadRequest('Email already taken')

    userData.password = await hashPassword(userData.password)

    const savedUser = await this.usersRepository.create(userData)
    return _.pick(savedUser, ['email', 'name', 'id'])
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

  @get('/me')
  @authenticate({ strategy: 'jwt' })
  async me(
    @inject(AuthenticationBindings.CURRENT_USER)
    userId: UserProfile
  ): Promise<Omit<Users, 'password'>> {
    const user = await this.usersRepository.findById(userId.id)

    return _.pick(user, ['email', 'role', 'id', 'name'])
  }
}
