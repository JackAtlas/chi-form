'use client'

import {
  ElementsType,
  FormElement,
  FormElementInstance
} from '../FormElements'
import { LetterTextIcon } from 'lucide-react'
import { Label } from '../ui/label'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import useDesigner from '../hooks/useDesigner'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '../ui/form'
import { Textarea } from '../ui/textarea'

const type: ElementsType = 'ParagraphField'

const extraAttributes = {
  text: '段落'
}

const propertiesSchema = z.object({
  text: z.string().min(2).max(50)
})

export const ParagraphFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes
  }),
  designerBtnElement: {
    icon: LetterTextIcon,
    label: '段落'
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,

  validate: () => true
}

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes
}

function DesignerComponent({
  elementInstance
}: {
  elementInstance: FormElementInstance
}) {
  const element = elementInstance as CustomInstance
  const { text } = element.extraAttributes
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-muted-foreground">段落字段</Label>
      <p>{text}</p>
    </div>
  )
}

function FormComponent({
  elementInstance
}: {
  elementInstance: FormElementInstance
}) {
  const element = elementInstance as CustomInstance

  const { text } = element.extraAttributes
  return <p>{text}</p>
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>

function PropertiesComponent({
  elementInstance
}: {
  elementInstance: FormElementInstance
}) {
  const element = elementInstance as CustomInstance
  const { updateElement } = useDesigner()
  const form = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: 'onBlur',
    defaultValues: {
      text: element.extraAttributes.text
    }
  })

  useEffect(() => {
    form.reset(element.extraAttributes)
  }, [element, form])

  function applyChanges(values: propertiesFormSchemaType) {
    const { text } = values
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        text
      }
    })
  }

  return (
    <Form {...form}>
      <form
        onBlur={form.handleSubmit(applyChanges)}
        onSubmit={(e) => {
          e.preventDefault()
        }}
        className="space-y-3"
      >
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>段落字段</FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') e.currentTarget.blur()
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        ></FormField>
      </form>
    </Form>
  )
}
