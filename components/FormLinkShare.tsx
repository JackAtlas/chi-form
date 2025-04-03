'use client'

import React from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Share2Icon } from 'lucide-react'
import { toast } from 'sonner'

function FormLinkShare({ shareURL }: { shareURL: string }) {
  const shareLink = `${window.location.origin}/submit/${shareURL}`
  return (
    <div className="flex flex-grow gap-4 items-center">
      <Input value={shareLink} readOnly />
      <Button
        className="max-w-[250px]"
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
