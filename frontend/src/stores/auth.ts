import { apolloClient } from "@/lib/apollo"
import { REGISTER } from "@/lib/grapqhl/queries/Register"
import { RegisterInput, User } from "@/types/auth"
import { create } from "zustand"
import { persist } from "zustand/middleware"

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
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      signup: async (registerData: RegisterInput): Promise<boolean> => {
        try {
          const { name, email, password } = registerData

          const { data } = await apolloClient.mutate<RegisterMutationData>({
            mutation: REGISTER,
            variables: {
              name,
              email,
              password,
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
          throw new Error("Error authenticating user", error instanceof Error ? error : undefined)
        }
      },
    }),
    { name: "auth-storage" }
  )
)
