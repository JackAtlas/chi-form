'use client'

import {
  ElementsType,
  FormElement,
  FormElementInstance,
  SubmitFunction
} from '../FormElements'
import { TextQuoteIcon } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import useDesigner from '../hooks/useDesigner'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel
} from '../ui/form'
import { Switch } from '../ui/switch'
import { cn } from '@/lib/utils'
import { Textarea } from '../ui/textarea'
import { Slider } from '../ui/slider'

const type: ElementsType = 'TextAreaField'

const extraAttributes = {
  label: '多行文本框',
  helperText: '说明语句',
  required: false,
  placeholder: '占位符',
  rows: 3 // field-sizing: content 会导致 rows 失效
}

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
  placeholder: z.string().max(50),
  rows: z.number().min(1).max(10)
})

export const TextAreaFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes
  }),
  designerBtnElement: {
    icon: TextQuoteIcon,
    label: '多行文本框'
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,

  validate: (
    formElement: FormElementInstance,
    currentValue: string
  ): boolean => {
    const element = formElement as CustomInstance
    if (element.extraAttributes.required) {
      return currentValue.length > 0
    }

    return true
  }
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
  const { label, required, placeholder, helperText } =
    element.extraAttributes
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>
        {label}
        {required && '*'}
      </Label>
      <Input readOnly disabled placeholder={placeholder} />
      {helperText && (
        <p className="text-muted-foreground text-[0.8rem]">
          {helperText}
        </p>
      )}
    </div>
  )
}

function FormComponent({
  elementInstance,
  submitValue,
  isInvalid,
  defaultValue
}: {
  elementInstance: FormElementInstance
  submitValue?: SubmitFunction
  isInvalid?: boolean
  defaultValue?: string
}) {
  const element = elementInstance as CustomInstance

  const [value, setValue] = useState(defaultValue || '')
  const [error, setError] = useState(false)

  useEffect(() => {
    setError(isInvalid ? true : false)
  }, [isInvalid])

  const { label, required, placeholder, helperText, rows } =
    element.extraAttributes
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className={cn(error && 'text-red-500')}>
        {label}
        {required && '*'}
      </Label>
      <Textarea
        className={cn(error && 'text-red-500')}
        rows={rows}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        onBlur={(e) => {
          if (!submitValue) return
          const valid = TextAreaFieldFormElement.validate(
            element,
            e.target.value
          )
          setError(!valid)
          if (!valid) return
          submitValue(element.id, e.target.value)
        }}
        value={value}
      />
      {helperText && (
        <p
          className={cn(
            'text-muted-foreground text-[0.8rem]',
            error && 'text-red-500'
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  )
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>

function PropertiesComponent({
  elementInstance
}: {
  elementInstance: FormElementInstance
}) {
  const element = elementInstance as CustomInstance
  const { updateElement } = useDesigner()
  const { label, required, placeholder, helperText, rows } =
    element.extraAttributes
  const form = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: 'onBlur',
    defaultValues: {
      label,
      helperText,
      required,
      placeholder,
      rows
    }
  })

  useEffect(() => {
    form.reset(element.extraAttributes)
  }, [element, form])

  function applyChanges(values: propertiesFormSchemaType) {
    const { label, helperText, required, placeholder, rows } = values
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        label,
        helperText,
        required,
        placeholder,
        rows
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
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>标签</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') e.currentTarget.blur()
                  }}
                />
              </FormControl>
              <FormDescription>
                字段的标签，显示在字段的上方。
              </FormDescription>
            </FormItem>
          )}
        ></FormField>
        <FormField
          control={form.control}
          name="placeholder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>占位符</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') e.currentTarget.blur()
                  }}
                />
              </FormControl>
              <FormDescription>字段的占位符</FormDescription>
            </FormItem>
          )}
        ></FormField>
        <FormField
          control={form.control}
          name="helperText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>说明语句</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') e.currentTarget.blur()
                  }}
                />
              </FormControl>
              <FormDescription>
                字段的说明语句，显示在字段的下方
              </FormDescription>
            </FormItem>
          )}
        ></FormField>
        <FormField
          control={form.control}
          name="rows"
          render={({ field }) => (
            <FormItem>
              <FormLabel>行数 {form.watch('rows')}</FormLabel>
              <FormControl>
                <Slider
                  defaultValue={[field.value]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={(value) => {
                    field.onChange(value[0])
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        ></FormField>
        <FormField
          control={form.control}
          name="required"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>必填</FormLabel>
                <FormDescription></FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        ></FormField>
      </form>
    </Form>
  )
}
