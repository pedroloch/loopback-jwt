import { UserService } from '@loopback/authentication'
import { repository } from '@loopback/repository'
import { HttpErrors } from '@loopback/rest'
import { securityId, UserProfile } from '@loopback/security'
import { User } from '../models'
import { UserRepository } from '../repositories'
import { comparePassword } from './hash.password'
import { Credentials } from './validator'

export class MyUserService implements UserService<User, Credentials> {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository
  ) {}
  async verifyCredentials(credentials: Credentials): Promise<User> {
    // if (!IsEmail.validate(credentials.username)) {
    //   throw new HttpErrors.UnprocessableEntity('Invalid Email')
    // }

    const foundUser = await this.userRepository.findOne({
      where: {
        username: credentials.username,
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
  convertToUserProfile(user: User): UserProfile {
    return {
      [securityId]: `${user.id}`,
      email: user.email,
      name: user.name,
      id: user.id,
      role: user.role,
    }
  }
}
