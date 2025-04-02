import { Loader2Icon } from 'lucide-react'
import React from 'react'

function Loading() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <Loader2Icon className="size-12 animate-spin text-primary" />
    </div>
  )
}

export default Loading
