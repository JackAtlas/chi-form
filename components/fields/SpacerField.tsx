'use client'

import {
  ElementsType,
  FormElement,
  FormElementInstance
} from '../FormElements'
import { AlignVerticalSpaceAroundIcon } from 'lucide-react'
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
import { Slider } from '../ui/slider'

const type: ElementsType = 'SpacerField'

const extraAttributes = {
  height: 20
}

const propertiesSchema = z.object({
  height: z.number().min(5).max(200)
})

export const SpacerFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes
  }),
  designerBtnElement: {
    icon: AlignVerticalSpaceAroundIcon,
    label: '间距'
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
  const { height } = element.extraAttributes
  return (
    <div className="flex flex-col gap-2 w-full items-center">
      <Label className="text-muted-foreground">
        间距字段：{height}px
      </Label>
      <AlignVerticalSpaceAroundIcon className="size-8" />
    </div>
  )
}

function FormComponent({
  elementInstance
}: {
  elementInstance: FormElementInstance
}) {
  const element = elementInstance as CustomInstance

  const { height } = element.extraAttributes
  return <div style={{ height, width: '100%' }}></div>
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
      height: element.extraAttributes.height
    }
  })

  useEffect(() => {
    form.reset(element.extraAttributes)
  }, [element, form])

  function applyChanges(values: propertiesFormSchemaType) {
    const { height } = values
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        height
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
          name="height"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                间距字段(px)：{form.watch('height')}
              </FormLabel>
              <FormControl className="pt-2">
                <Slider
                  defaultValue={[field.value]}
                  min={5}
                  max={200}
                  step={1}
                  onValueChange={(value) => {
                    field.onChange(value[0])
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
