import React from 'react'
import { Button } from './ui/button'
import { ScanEyeIcon } from 'lucide-react'
import useDesigner from './hooks/useDesigner'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from './ui/dialog'
import { FormElements } from './FormElements'

function PreviewDialogBtn() {
  const { elements } = useDesigner()
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <ScanEyeIcon size={6} />
          预览
        </Button>
      </DialogTrigger>
      <DialogContent className="w-screen h-screen max-h-screen max-w-screen sm:max-w-screen flex flex-col flex-grow p-0 gap-0">
        <div className="px-4 py-2 border-b">
          <DialogTitle className="text-lg font-bold text-muted-foreground">
            表单预览
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            您的用户将看到这样的表单
          </p>
        </div>
        <div className="bg-accent flex flex-col flex-grow items-center justify-center p-4 bg-[url(/paper.svg)] dark:bg-[url(/paper-dark.svg)] overflow-y-auto">
          <div className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background h-full w-full rounded-2xl p-8 overflow-y-auto">
            {elements.map((element) => {
              const FormComponent =
                FormElements[element.type].formComponent
              return (
                <FormComponent
                  key={element.id}
                  elementInstance={element}
                />
              )
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PreviewDialogBtn
