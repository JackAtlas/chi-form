import React, { useTransition } from 'react'
import { Button } from './ui/button'
import { Loader2Icon, SaveIcon } from 'lucide-react'
import useDesigner from './hooks/useDesigner'
import { UpdateFormContent } from '@/actions/form'
import { toast } from 'sonner'

function SaveFormBtn({ id }: { id: number }) {
  const { elements } = useDesigner()
  const [loading, startTransition] = useTransition()

  const updateFormContent = async () => {
    try {
      const jsonElements = JSON.stringify(elements)
      await UpdateFormContent(id, jsonElements)
      toast.success('表单已保存')
    } catch (error) {
      toast.error('保存失败，请稍后刷新重试')
      console.log(error)
    }
  }
  return (
    <Button
      variant="outline"
      className="gap-2"
      disabled={loading}
      onClick={() => {
        startTransition(updateFormContent)
      }}
    >
      <SaveIcon size={6} />
      保存
      {loading && <Loader2Icon className="animate-spin" />}
    </Button>
  )
}

export default SaveFormBtn
