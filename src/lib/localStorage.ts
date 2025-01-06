import { IUser } from "./types"


export const getCurrentUserId = (): string => {
  const user = JSON.parse(localStorage.getItem('user')!)
  if (!user) {
    throw new Error('User Not Logged In')
  }

  return user._id
}

export const getCurrentUsername = () => {
  const user = JSON.parse(localStorage.getItem('user')!)

  if (!user) {
    throw new Error('User Not Logged In')
  }

  return user.username
}

export const getCurrentName = () => {
  const user = JSON.parse(localStorage.getItem('user')!)

  if (!user) {
    throw new Error('User Not Logged In')
  }

  return user.name
}

export const getCurrentUser = (): IUser | undefined => {
  const user = JSON.parse(localStorage.getItem('user')!)
  if (!user) {
    // throw new Error("User Not Logged In");
    return
  }

  return user
}

export const getCurrentUserAndAccessToken = () => {
  const user = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user')!)
    : null
  const accessToken = localStorage.getItem('accessToken')
    ? localStorage.getItem('accessToken')
    : null

  return { user, accessToken }
}

export const saveUserAndTokenLocalstorage = (
  user: any,
  accessToken: string,
  refressToken: string
) => {
  localStorage.setItem('user', JSON.stringify(user))
  localStorage.setItem('accessToken', accessToken)
  localStorage.setItem('refressToken', refressToken)
}

export const saveUserToLocalstorage = (user: any) => {
  localStorage.setItem('user', JSON.stringify(user))
}

export const isCurrentUser = (userId: string) => {
  return userId === getCurrentUserId()
}

export const updateDataInLocalStorage = (data: any) => {
  const user = getCurrentUser()
  saveUserToLocalstorage({ ...user, ...data })
}
