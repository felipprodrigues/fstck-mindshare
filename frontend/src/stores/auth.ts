import { apolloClient } from "@/lib/apollo"
import { LOGIN } from "@/lib/grapqhl/mutations/Login"
import { REGISTER } from "@/lib/grapqhl/mutations/Register"
import { LoginInput, RegisterInput, User } from "@/types/auth"
import { create } from "zustand"
import { persist } from "zustand/middleware"

type LoginMutationData = {
  login: {
    token: string
    refreshToken: string
    user: User
  }
}

type RegisterMutationData = {
  register: {
    token: string
    refreshToken: string
    user: User
  }
}

interface AuthState {
  token: string | null
  isAuthenticated: boolean
  user: User | null
  signup: (data: RegisterInput) => Promise<boolean>
  login: (data: LoginInput) => Promise<boolean>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (loginData: LoginInput): Promise<boolean> => {
        try {
          const { email, password } = loginData

          const { data } = await apolloClient.mutate<LoginMutationData, { data: LoginInput }>({
            mutation: LOGIN,
            variables: {
              data: {
                email,
                password,
              },
            },
          })

          if (data && data.login) {
            const { token, user } = data.login

            set({
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                role: user.role,
              },
              token,
              isAuthenticated: true,
            })
            return true
          }
          return false
        } catch (error) {
          console.log("Error logging in user")
          throw error
        }
      },

      signup: async (registerData: RegisterInput): Promise<boolean> => {
        try {
          const { name, email, password } = registerData

          const { data } = await apolloClient.mutate<RegisterMutationData>({
            mutation: REGISTER,
            variables: {
              data: {
                name,
                email,
                password,
              },
            },
          })

          if (data && data.register) {
            const { token, user } = data.register

            set({
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                role: user.role,
              },
              token,
              isAuthenticated: true,
            })

            return true
          }
          return false
        } catch (error) {
          console.log("Error authenticating user")
          throw error
        }
      },
    }),
    { name: "auth-storage" }
  )
)
