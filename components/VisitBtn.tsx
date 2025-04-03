'use client'

import React from 'react'
import { Button } from './ui/button'

function VisitBtn({ shareURL }: { shareURL: string }) {
  const shareLink = `${window.location.origin}/submit/${shareURL}`
  return (
    <Button
      className="w-[200px]"
      onClick={() => {
        window.open(shareLink, '_blank')
      }}
    >
      查看
    </Button>
  )
}

export default VisitBtn
