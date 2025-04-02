import React from 'react'
import { Button } from './ui/button'
import { ScanEyeIcon } from 'lucide-react'

function PreviewDialogBtn() {
  return (
    <Button variant="outline" className="gap-2">
      <ScanEyeIcon size={6} />
      预览
    </Button>
  )
}

export default PreviewDialogBtn
