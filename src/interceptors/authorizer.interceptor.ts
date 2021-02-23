import {
  AuthenticationBindings,
  AuthenticationMetadata,
} from '@loopback/authentication'
import {
  Getter,
  globalInterceptor,
  inject,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
} from '@loopback/core'
import { HttpErrors } from '@loopback/rest'
import { Users } from '../models'

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@globalInterceptor('', { tags: { name: 'authorizer' } })
export class AuthorizerInterceptor implements Provider<Interceptor> {
  constructor(
    @inject(AuthenticationBindings.METADATA)
    public metadata: AuthenticationMetadata[],
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public getUser: Getter<Users>
  ) {}

  /**
   * This method is used by LoopBack context to produce an interceptor function
   * for the binding.
   *
   * @returns An interceptor function
   */
  value() {
    return this.intercept.bind(this)
  }
  /**
   * The logic to intercept an invocation
   * @param invocationCtx - Invocation context
   * @param next - A function to invoke next interceptor or the target method
   */
  async intercept(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>
  ) {
    // Add pre-invocation logic here

    if (!this.metadata) {
      return next()
    }

    const required = this.metadata[0].options?.required
    const user = await this.getUser()

    if (required && required !== user.role)
      throw new HttpErrors.Unauthorized(
        "You don't have the permission to access this endpoint"
      )

    const result = await next()
    // Add post-invocation logic here
    return result
  }
}
