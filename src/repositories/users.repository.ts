import {DefaultCrudRepository} from '@loopback/repository';
import {Users, UsersRelations} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class UsersRepository extends DefaultCrudRepository<
  Users,
  typeof Users.prototype.id,
  UsersRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(Users, dataSource);
  }
}
