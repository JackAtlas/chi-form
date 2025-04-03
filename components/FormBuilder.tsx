'use client'

import { Form } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import PreviewDialogBtn from './PreviewDialogBtn'
import SaveFormBtn from './SaveFormBtn'
import PublishFormBtn from './PublishFormBtn'
import Designer from './Designer'
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import DragOverlayWrapper from './DragOverlayWrapper'
import useDesigner from './hooks/useDesigner'
import { Loader2Icon } from 'lucide-react'

function FormBuilder({ form }: { form: Form }) {
  const { setElements } = useDesigner()
  const [isReady, setIsReady] = useState(false)

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10
    }
  })
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 300,
      tolerance: 5
    }
  })
  const sensors = useSensors(mouseSensor, touchSensor)

  useEffect(() => {
    if (isReady) return
    const elements = JSON.parse(form.content)
    setElements(elements)
    const readyTimeout = setTimeout(() => setIsReady(true), 500)
    return () => clearTimeout(readyTimeout)
  }, [form, setElements])

  if (!isReady) {
    return (
      <div className="flex flex-col justify-center items-center w-full h-full">
        <Loader2Icon
          size={60}
          className="animate-spin text-primary"
        />
      </div>
    )
  }
  return (
    <DndContext sensors={sensors}>
      <main className="flex flex-col w-full">
        <nav className="flex justify-between border-b-2 p-4 gap-3 items-center">
          <h2>
            <span className="text-muted-foreground mr-2">表单:</span>
            {form.name}
          </h2>
          <div className="flex items-center gap-2">
            <PreviewDialogBtn />
            {!form.published && (
              <>
                <SaveFormBtn id={form.id} />
                <PublishFormBtn />
              </>
            )}
          </div>
        </nav>
        <div className="flex w-full flex-grow items-center justify-center relative overflow-y-auto h-[200px] bg-accent bg-[url(/paper.svg)] dark:bg-[url(/paper-dark.svg)]">
          <Designer />
        </div>
      </main>
      <DragOverlayWrapper />
    </DndContext>
  )
}

export default FormBuilder
