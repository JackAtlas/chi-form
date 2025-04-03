import React, { use, useTransition } from 'react'
import { Button } from './ui/button'
import { ArrowUpToLineIcon, Loader2Icon } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from './ui/alert-dialog'
import { toast } from 'sonner'
import { PublishForm } from '@/actions/form'
import { useRouter } from 'next/navigation'

function PublishFormBtn({ id }: { id: number }) {
  const [loading, startTransition] = useTransition()
  const router = useRouter()

  async function publishForm() {
    try {
      await PublishForm(id)
      toast.success('表单发布成功,现已对外公开')
      router.refresh()
    } catch (error) {
      toast.error('表单发布失败，请稍后刷新再试')
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="gap-2 text-white bg-gradient-to-r from-violet-400 to-fuchsia-400">
          <ArrowUpToLineIcon size={6} />
          发布
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>您确定吗？</AlertDialogTitle>
          <AlertDialogDescription>
            此操作不可逆。表单发布后不可修改。
            <br />
            <span className="font-medium">
              表单发布后将对外公开，您可以从中收集信息。
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={(e) => {
              e.preventDefault()
              startTransition(publishForm)
            }}
          >
            继续 {loading && <Loader2Icon className="animate-spin" />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default PublishFormBtn
