import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DELETE_USER } from "@/lib/grapqhl/mutations/Members"
import { LIST_MEMBERS } from "@/lib/grapqhl/queries/Members"
import { User } from "@/types"
import { useMutation } from "@apollo/client/react"

interface DeleteMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  member: User | null
}

export function DeleteMemberDialog({ open, onOpenChange, member }: DeleteMemberDialogProps) {
  const [deleteUserMutation, { loading }] = useMutation(DELETE_USER, {
    onCompleted: () => {
      onOpenChange(false)
    },
    refetchQueries: [LIST_MEMBERS],
  })

  const handleDeleteUser = async () => {
    if (!member) return
    await deleteUserMutation({
      variables: {
        id: member.id,
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove User</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Are you sure you want to remove
          <span className="font-medium"> {member?.name}</span>? This action cannot be undone.
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDeleteUser} disabled={loading}>
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
