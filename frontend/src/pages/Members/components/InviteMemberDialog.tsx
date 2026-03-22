import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CREATE_USER } from "@/lib/grapqhl/mutations/Members"
import { useMutation } from "@apollo/client/react"
import { useState } from "react"
import { Button } from "../../../components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog"

interface InviteMemberProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated?: () => void
}

export function InviteMemberDialog({ open, onOpenChange, onCreated }: InviteMemberProps) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [createUserMutation, { loading }] = useMutation(CREATE_USER, {
    onCompleted: () => {
      onOpenChange(false)
      setName("")
      setEmail("")
      onCreated?.()
    },
  })

  const handleSubmit = async () => {
    await createUserMutation({
      variables: {
        data: {
          name,
          email,
        },
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite User</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invite-name">Name</Label>
            <Input
              id="invite-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="User's name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="invite-email">E-mail</Label>
            <Input
              id="invite-email"
              value={email}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            Invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
