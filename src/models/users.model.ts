import { Entity, model, property } from '@loopback/repository'

@model({
  settings: {
    idInjection: false,
    mysql: { schema: 'dashboard', table: 'users' },
  },
})
export class Users extends Entity {
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
    required: true,
    length: 45,
    mysql: {
      columnName: 'email',
      dataType: 'varchar',
      dataLength: 45,
      dataPrecision: null,
      dataScale: null,
      nullable: 'N',
    },
  })
  email: string

  @property({
    type: 'string',
    required: true,
    length: 60,
    mysql: {
      columnName: 'password',
      dataType: 'varchar',
      dataLength: 60,
      dataPrecision: null,
      dataScale: null,
      nullable: 'N',
    },
  })
  password: string

  @property({
    type: 'string',
    length: 45,
    mysql: {
      columnName: 'name',
      dataType: 'varchar',
      dataLength: 45,
      dataPrecision: null,
      dataScale: null,
      nullable: 'Y',
    },
  })
  name?: string

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
  role?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any

  constructor(data?: Partial<Users>) {
    super(data)
  }
}

export interface UsersRelations {
  // describe navigational properties here
}

export type UsersWithRelations = Users & UsersRelations
