import { Entity, model, property } from '@loopback/repository'

@model({
  settings: { idInjection: false, mysql: { schema: 'dialer', table: 'user' } },
})
export class User extends Entity {
  @property({
    type: 'number',
    generated: true,
    precision: 10,
    scale: 0,
    id: 1,
    mysql: {
      columnName: 'id',
      dataType: 'int',
      dataLength: null,
      dataPrecision: 10,
      dataScale: 0,
      nullable: 'N',
    },
  })
  id: number
  @property({
    type: 'string',
    length: 512,
    mysql: {
      columnName: 'email',
      dataType: 'varchar',
      dataLength: 512,
      dataPrecision: null,
      dataScale: null,
      nullable: 'Y',
    },
  })
  email?: string

  @property({
    type: 'string',
    length: 512,
    mysql: {
      columnName: 'name',
      dataType: 'varchar',
      dataLength: 512,
      dataPrecision: null,
      dataScale: null,
      nullable: 'Y',
    },
  })
  name?: string

  @property({
    type: 'string',
    required: true,
    length: 512,
    mysql: {
      columnName: 'password',
      dataType: 'varchar',
      dataLength: 512,
      dataPrecision: null,
      dataScale: null,
      nullable: 'N',
    },
  })
  password: string

  @property({
    type: 'string',
    length: 5,
    mysql: {
      columnName: 'role',
      dataType: 'enum',
      dataLength: 5,
      dataPrecision: null,
      dataScale: null,
      nullable: 'Y',
    },
  })
  role?: string

  @property({
    type: 'string',
    required: true,
    length: 512,
    mysql: {
      columnName: 'username',
      dataType: 'varchar',
      dataLength: 512,
      dataPrecision: null,
      dataScale: null,
      nullable: 'N',
    },
  })
  username: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any

  constructor(data?: Partial<User>) {
    super(data)
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations
