/**
 * 用户类别
 */

export type UserType ={
  id: number;
  userName: string
  userAccount: string
  avatarUrl?: string
  profile?: string
  gender: number
  phone: string
  email: string
  userStatus: number
  userRole: number
  tags?: string[]
  createTime: Date
}
