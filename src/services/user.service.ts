import { UserService } from '@loopback/authentication'
import { repository } from '@loopback/repository'
import { HttpErrors } from '@loopback/rest'
import { securityId, UserProfile } from '@loopback/security'
import IsEmail from 'isemail'
import { Users } from '../models'
import { UsersRepository } from '../repositories'
import { comparePassword } from './hash.password'
import { Credentials } from './validator'

export class MyUserService implements UserService<Users, Credentials> {
  constructor(
    @repository(UsersRepository)
    public usersRepository: UsersRepository
  ) {}
  async verifyCredentials(credentials: Credentials): Promise<Users> {
    if (!IsEmail.validate(credentials.email)) {
      throw new HttpErrors.UnprocessableEntity('Invalid Email')
    }

    const foundUser = await this.usersRepository.findOne({
      where: {
        email: credentials.email,
      },
    })
    if (!foundUser) throw new HttpErrors.BadRequest('Email not found')

    const passwordMatched = await comparePassword(
      credentials.password,
      foundUser.password
    )

    if (!passwordMatched)
      throw new HttpErrors.BadRequest('Password is not valid')

    return foundUser
  }
  convertToUserProfile(user: Users): UserProfile {
    return {
      [securityId]: `${user.id}`,
      email: user.email,
      name: user.name,
      id: user.id,
      role: user.role,
    }
  }
}
