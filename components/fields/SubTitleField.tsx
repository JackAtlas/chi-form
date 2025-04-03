'use client'

import {
  ElementsType,
  FormElement,
  FormElementInstance
} from '../FormElements'
import { Heading2Icon } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
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

const type: ElementsType = 'SubTitleField'

const extraAttributes = {
  title: '副标题'
}

const propertiesSchema = z.object({
  title: z.string().min(2).max(50)
})

export const SubTitleFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes
  }),
  designerBtnElement: {
    icon: Heading2Icon,
    label: '副标题'
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
  const { title } = element.extraAttributes
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-muted-foreground">副标题字段</Label>
      <p className="text-lg">{title}</p>
    </div>
  )
}

function FormComponent({
  elementInstance
}: {
  elementInstance: FormElementInstance
}) {
  const element = elementInstance as CustomInstance

  const { title } = element.extraAttributes
  return <p className="text-lg">{title}</p>
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
      title: element.extraAttributes.title
    }
  })

  useEffect(() => {
    form.reset(element.extraAttributes)
  }, [element, form])

  function applyChanges(values: propertiesFormSchemaType) {
    const { title } = values
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        title
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>副标题字段</FormLabel>
              <FormControl>
                <Input
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
