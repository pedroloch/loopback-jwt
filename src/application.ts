import {
  AuthenticationComponent,
  registerAuthenticationStrategy,
} from '@loopback/authentication'
import {
  JWTAuthenticationComponent,
  UserServiceBindings,
} from '@loopback/authentication-jwt'
import { BootMixin } from '@loopback/boot'
import { ApplicationConfig } from '@loopback/core'
import { RepositoryMixin } from '@loopback/repository'
import { RestApplication, RestBindings } from '@loopback/rest'
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer'
import { ServiceMixin } from '@loopback/service-proxy'
import path from 'path'
import { JWTStrategy } from './authentication-strategies/jwt.strategy'
import { MysqlDataSource } from './datasources'
import { MySequence } from './sequence'
import { JWTService } from './services/jwt.service'
import { MyUserService } from './services/user.service'

export { ApplicationConfig }

export class BackendApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication))
) {
  constructor(options: ApplicationConfig = {}) {
    super(options)

    // Set up the custom sequence
    this.sequence(MySequence)

    // // Set up frontend
    // this.static('/', path.join(__dirname, '../client'))

    // Set Api page
    this.static('/', path.join(__dirname, '../public'))

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    })

    this.component(RestExplorerComponent)

    this.component(AuthenticationComponent)

    registerAuthenticationStrategy(this, JWTStrategy)

    this.component(JWTAuthenticationComponent)

    this.dataSource(MysqlDataSource, UserServiceBindings.DATASOURCE_NAME)

    this.setupBindings()

    this.projectRoot = __dirname
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    }
  }
  setupBindings(): void {
    this.bind('services.user.service').toClass(MyUserService)
    this.bind('service.jwt.service').toClass(JWTService)
    this.bind('authentication.jwt.secret').to('908248csdcas98')
    this.bind('authentication.jwt.expiresIn').to(1000 * 60 * 60 * 7)
    this.bind(RestBindings.ERROR_WRITER_OPTIONS).to({
      debug: process.env.NODE_ENV !== 'production',
    })
    // this.bind(RestExplorerBindings.CONFIG).to({
    //   path: '/api/v1',
    // })
  }
}
