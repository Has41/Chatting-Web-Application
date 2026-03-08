import { SetMetadata } from '@nestjs/common'

export const Users = (...args: string[]) => SetMetadata('users', args)
