import { AuthenticationStrategy } from '@loopback/authentication'
import { inject } from '@loopback/core'
import { HttpErrors, Request } from '@loopback/rest'
import { UserProfile } from '@loopback/security'
import { JWTService } from '../services/jwt.service'

export class JWTStrategy implements AuthenticationStrategy {
  constructor(
    @inject('service.jwt.service')
    public jwtService: JWTService
  ) {}

  name = 'jwt'

  async authenticate(request: Request): Promise<UserProfile> {
    const token: string = this.extractCredentials(request)
    const userProfile = await this.jwtService.verifyToken(token)
    return Promise.resolve(userProfile)
  }

  extractCredentials(request: Request): string {
    if (!request.headers.authorization) {
      throw new HttpErrors.Unauthorized('Authorization header is missing')
    }

    const authHeader = request.headers.authorization

    if (!authHeader.startsWith('Bearer')) {
      throw new HttpErrors.Unauthorized(
        'Authorization header has no type Bearer'
      )
    }

    const parts = authHeader.split(' ')
    if (parts.length !== 2) {
      throw new HttpErrors.Unauthorized(
        'Authorization header has too many parts and must follow the pattern "Bearer xx..yy..zz"'
      )
    }

    const token = parts[1]
    return token
  }
}
