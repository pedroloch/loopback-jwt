import { inject } from '@loopback/core'
import { HttpErrors } from '@loopback/rest'
import { securityId, UserProfile } from '@loopback/security'
import { promisify } from 'util'
const jwt = require('jsonwebtoken')

const signAsync = promisify(jwt.sign)
const verifyAsync = promisify(jwt.verify)

export class JWTService {
  @inject('authentication.jwt.expiresIn')
  public readonly jwtExpiresIn: string
  @inject('authentication.jwt.secret')
  public readonly jwtSecret: string

  async generateToken(userProfile: UserProfile): Promise<string> {
    if (!userProfile) {
      throw new HttpErrors.Unauthorized('Erro ao gerar o token')
    }

    let token = ''
    try {
      token = await signAsync(userProfile, this.jwtSecret, {
        expiresIn: this.jwtExpiresIn,
      })
    } catch (err) {
      throw new HttpErrors.Unauthorized('Error ao gerar o token')
    }
    return token
  }
  async verifyToken(token: string): Promise<UserProfile> {
    if (!token) {
      throw new Error('You need to provide the token')
    }
    let userProfile: UserProfile

    try {
      const decryptedToken = await verifyAsync(token, this.jwtSecret)

      userProfile = Object.assign(
        { [securityId]: '' },
        {
          [securityId]: decryptedToken.id,
          id: decryptedToken.id,
          role: decryptedToken.role,
        }
      )
    } catch (error) {
      throw new HttpErrors.Unauthorized(
        'Error verifying token: ' + error.message
      )
    }
    return userProfile
  }
}
