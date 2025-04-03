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
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Loader2Icon
} from 'lucide-react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { toast } from 'sonner'
import Link from 'next/link'
import Confetti from 'react-confetti'

function FormBuilder({ form }: { form: Form }) {
  const { setElements, setSelectedElement } = useDesigner()
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
    setSelectedElement(null)
    const readyTimeout = setTimeout(() => setIsReady(true), 500)
    return () => clearTimeout(readyTimeout)
  }, [form, setElements, isReady, setSelectedElement])

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

  if (form.published) {
    const shareURL = `${window.location.origin}/submit/${form.shareURL}`
    return (
      <>
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
        />
        <div className="flex flex-col items-center justify-center h-full w-full">
          <div className="max-w-md">
            <h1 className="text-center text-4xl font-bold text-primary border-b pb-2 mb-10">
              表单已发布
            </h1>
            <h2 className="text-2xl">分享此表单</h2>
            <h3 className="text-xl text-muted-foreground border-b pb-10">
              访问此链接的任何人都能提交这个表单
            </h3>
            <div className="my-4 flex flex-col gap-2 items-center w-full border-b pb-4">
              <Input className="w-full" readOnly value={shareURL} />
              <Button
                className="mt-2 w-full"
                onClick={() => {
                  navigator.clipboard.writeText(shareURL)
                  toast.info('链接已复制到剪贴板')
                }}
              >
                复制链接地址
              </Button>
            </div>
            <div className="flex justify-between">
              <Button variant="link" asChild>
                <Link href="/" className="gap-2">
                  <ArrowLeftIcon size={16} />
                  返回首页
                </Link>
              </Button>
              <Button variant="link" asChild>
                <Link href={`/forms/${form.id}`} className="gap-2">
                  表单详情
                  <ArrowRightIcon size={16} />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </>
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
                <PublishFormBtn id={form.id} />
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
