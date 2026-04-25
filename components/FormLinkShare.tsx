'use client'

import { Button } from './ui/button'
import { Input } from './ui/input'
import { Share2Icon } from 'lucide-react'
import { toast } from 'sonner'

function FormLinkShare({ shareURL }: { shareURL: string }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const shareLink = `${baseUrl}/submit/${shareURL}`
  return (
    <div className="flex grow gap-4 items-center">
      <Input value={shareLink} readOnly />
      <Button
        className="max-w-62.5"
        onClick={() => {
          navigator.clipboard.writeText(shareLink)
          toast.info('链接已复制到剪贴板')
        }}
      >
        <Share2Icon className="mr-2 size-4" />
        分享链接
      </Button>
    </div>
  )
}

export default FormLinkShare
