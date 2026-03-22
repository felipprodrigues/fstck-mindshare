import logoIcon from "@/assets/logo-icon.svg"
import { useAuthStore } from "@/stores/auth"
import { Lightbulb, LogOut, Users } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "./ui/button"
import { AvatarComponent } from "@/shared/Avatar"

export function Header() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const location = useLocation()
  const isIdeaPage = location.pathname === "/"
  const isMembersPage = location.pathname === "/members"

  return (
    <div className="w-full px-16 pt-6">
      {isAuthenticated && (
        <div className="flex justify-between w-full">
          <div className="min-w-48">
            <img src={logoIcon} />
          </div>
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button size="sm" className="gap-2" variant={isIdeaPage ? "default" : "ghost"}>
                <Lightbulb className="h-4 w-4" />
                Ideas
              </Button>
            </Link>
            <Link to="/members">
              <Button size="sm" className="gap-2" variant={isMembersPage ? "default" : "ghost"}>
                <Users className="h-4 w-4" />
                Members
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <AvatarComponent userName={user?.name || ""} />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user?.name}</span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
