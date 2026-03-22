// import { useLazyQuery, useMutation } from "@apollo/client/react"
import { Drawer, DrawerContent } from "@/components/ui/drawer"
import { GET_IDEA } from "@/lib/grapqhl/queries/Idea"
import { Idea } from "@/types"
import { useLazyQuery } from "@apollo/client/react"
import { X } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "../../../components/ui/button"
import { CommentArea } from "./CommentArea"
import { CommentsList } from "./CommentsList"

interface IdeaDetailDrawerProps {
  ideaId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function IdeaDetailDrawer({ open, onOpenChange, ideaId }: IdeaDetailDrawerProps) {
  const [commentContent, setCommentContent] = useState("")

  const [getIdeaQuery, { data, loading }] = useLazyQuery<{ getIdea: Idea }>(GET_IDEA)

  console.log(ideaId)

  useEffect(() => {
    if (ideaId) {
      getIdeaQuery({ variables: { ideaId } })
    }
  }, [ideaId])

  const { getIdea: idea } = data || {}

  const handleAddComment = () => {}

  const handleToggleVote = () => {}

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="flex flex-col rounded-l-2xl">
        <div className="flex-shrink-0 p-6 bg-slate-100 rounded-l-2xl">
          <div className="flex items-start justify-between">
            <h2 className="text-2xl font-bold pr-4 flex-1">{idea?.title || "Loading..."}</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="flex-shrink-0"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          {idea && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {idea?.description || ""}
            </p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <CommentsList comments={idea?.comments || []} loading={loading} />
        </div>
        <CommentArea
          commentContent={commentContent || ""}
          setCommentContent={setCommentContent}
          handleAddComment={handleAddComment}
          handleVote={handleToggleVote}
          idea={idea}
        />
      </DrawerContent>
    </Drawer>
  )
}
