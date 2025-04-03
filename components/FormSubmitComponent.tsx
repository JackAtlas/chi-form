'use client'

import React, {
  useCallback,
  useRef,
  useState,
  useTransition
} from 'react'
import { FormElementInstance, FormElements } from './FormElements'
import { Button } from './ui/button'
import { Loader2Icon, MousePointerClickIcon } from 'lucide-react'
import { toast } from 'sonner'
import { SubmitForm } from '@/actions/form'

function FormSubmitComponent({
  formUrl,
  content
}: {
  formUrl: string
  content: FormElementInstance[]
}) {
  const formValues = useRef<{ [key: string]: string }>({})
  const formErrors = useRef<{ [key: string]: boolean }>({})
  const [renderKey, setRenderKey] = useState(new Date().getTime())

  const [submitted, setSubmitted] = useState(false)

  const [pending, startTransition] = useTransition()

  const validateForm: () => boolean = useCallback(() => {
    for (const field of content) {
      const actualValue = formValues.current[field.id] || ''
      const valid = FormElements[field.type].validate(
        field,
        actualValue
      )
      if (!valid) {
        formErrors.current[field.id] = true
      }
    }

    if (Object.keys(formErrors.current).length > 0) {
      return false
    }
    return true
  }, [content])

  const submitValue = (key: string, value: string) => {
    formValues.current[key] = value
  }

  const submitForm = async () => {
    formErrors.current = {}
    const validForm = validateForm()
    if (!validForm) {
      setRenderKey(new Date().getTime())
      toast.error('表单有错误，请检查')
      return
    }

    try {
      const JsonContent = JSON.stringify(formValues.current)
      await SubmitForm(formUrl, JsonContent)
      setSubmitted(true)
    } catch (error) {
      toast.error('出错了')
    }
  }

  if (submitted) {
    return (
      <div className="flex justify-center w-full h-full items-center p-8">
        <div className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background w-full p-8 overflow-y-auto border shadow-xl shadow-violet-700 rounded">
          <h1 className="text-2xl font-bold">表单已提交</h1>
          <p className="text-muted-foreground">感谢您的参与！</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center w-full h-full items-center p-8">
      <div
        key={renderKey}
        className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background w-full p-8 overflow-y-auto border shadow-xl shadow-violet-700 rounded"
      >
        {content.map((element) => {
          const FormElement = FormElements[element.type].formComponent
          return (
            <FormElement
              key={element.id}
              elementInstance={element}
              submitValue={submitValue}
              isInvalid={formErrors.current[element.id]}
              defaultValue={formValues.current[element.id]}
            />
          )
        })}
        <Button
          className="mt-8"
          onClick={() => {
            startTransition(submitForm)
          }}
          disabled={pending}
        >
          {!pending && (
            <>
              <MousePointerClickIcon />
              提交
            </>
          )}
          {pending && <Loader2Icon className="animate-spin" />}
        </Button>
      </div>
    </div>
  )
}

export default FormSubmitComponent
