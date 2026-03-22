import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface AvatarComponentProps {
  userName: string | undefined
  isDrawer?: boolean
}

export const AvatarComponent = ({ userName, isDrawer = false }: AvatarComponentProps) => (
  <Avatar className={isDrawer ? "h-8 w-8 flex-shrink-0" : ""}>
    <AvatarFallback
      className={isDrawer ? "bg-blue-600 text-white" : "bg-zinc-950 text-primary-foreground"}
    >
      {userName ? userName.charAt(0).toUpperCase() : ""}
    </AvatarFallback>
  </Avatar>
)
