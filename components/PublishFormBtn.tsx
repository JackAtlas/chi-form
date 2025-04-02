import React from 'react'
import { Button } from './ui/button'
import { ArrowUpToLineIcon } from 'lucide-react'

function PublishFormBtn() {
  return (
    <Button className="gap-2 text-white bg-gradient-to-r from-violet-400 to-fuchsia-400">
      <ArrowUpToLineIcon size={6} />
      发布
    </Button>
  )
}

export default PublishFormBtn
