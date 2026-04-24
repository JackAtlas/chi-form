'use client'

import { Button } from './ui/button'

function VisitBtn({ shareURL }: { shareURL: string }) {
  return (
    <Button
      className="w-50"
      onClick={() => {
        window.open(`/submit/${shareURL}`, '_blank')
      }}
    >
      查看
    </Button>
  )
}

export default VisitBtn
