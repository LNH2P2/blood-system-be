import { UserRole } from '../../users/user-type/enum/user.enum'

export interface CurrentUser {
  _id: string
  email: string
  role: UserRole
  username?: string
  fullName?: string
}
