import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AvatarComponent } from "@/shared/Avatar"
import type { User } from "@/types"
import { Crown, Edit, Trash2, User as UserIcon } from "lucide-react"

interface MemberCardProps {
  member: User
  isCurrentUser: boolean
  onEdit: () => void
  onDelete: () => void
}

export function MemberCard({ member, isCurrentUser, onEdit, onDelete }: MemberCardProps) {
  const isAdmin = member.role === "admin" || member.role === "owner"

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <AvatarComponent userName={member.name} />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-base truncate">{member.name}</p>
                <p className="text-sm text-muted-foreground truncate">{member.email}</p>
                {member.role && (
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {isAdmin ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                        <Crown className="h-3 w-3" />
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                        <UserIcon className="h-3 w-3" />
                        Member
                      </span>
                    )}
                    {isCurrentUser && (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                        You
                      </span>
                    )}
                  </div>
                )}
                {isCurrentUser && !member.role && (
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                      You
                    </span>
                  </div>
                )}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={onEdit}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={onDelete}
                  disabled={isCurrentUser}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
