export module Account {
  export type LoginInput = {
    userId: string
    password: string
  }
  export type LoginOutput = APIToken & {
    status: number
  }
  export type APIToken = {
    apiToken: string
  }

  export type UserIdInLocalStorage = {
    userId: string
    isEnabled: boolean
  }

  export type SessionAPIToken = {
    account: {
      apiToken: string
    }
  }
  export type UserInformation = {
    firstname: string
    lastname: string
    email: string
  }
  export type HotelManagerInfo = UserInformation & {
    username: string
    hotelManagerId: number
    propertyId: number
    wholesalerId: number
  }
  export type ChangePassword = {
    userId: string
    oldPassword: string
    newPassword: string
  }
}
