import React from 'react'
import { Button } from './ui/button'
import { SaveIcon } from 'lucide-react'

function SaveFormBtn() {
  return (
    <Button variant="outline" className="gap-2">
      <SaveIcon size={6} />
      保存
    </Button>
  )
}

export default SaveFormBtn
