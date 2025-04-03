'use client'

import {
  ElementsType,
  FormElement,
  FormElementInstance,
  SubmitFunction
} from '../FormElements'
import { CalendarClockIcon, CalendarIcon } from 'lucide-react'
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
import { Button } from '../ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '../ui/popover'
import { format } from 'date-fns'
import { Calendar } from '../ui/calendar'

const type: ElementsType = 'DateField'

const extraAttributes = {
  label: '时间选择器',
  helperText: '选择一个时间',
  required: false
}

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false)
})

export const DateFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes
  }),
  designerBtnElement: {
    icon: CalendarClockIcon,
    label: '时间选择器'
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
      <Button
        variant="outline"
        className="w-full justify-start text-left font-normal"
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        <span>选择一个时间</span>
      </Button>
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

  const [date, setDate] = useState<Date | undefined>(
    defaultValue ? new Date(defaultValue) : undefined
  )
  const [error, setError] = useState(false)

  useEffect(() => {
    setError(isInvalid ? true : false)
  }, [isInvalid])

  const { label, required, placeholder, helperText } =
    element.extraAttributes
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className={cn(error && 'text-red-500')}>
        {label}
        {required && '*'}
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal',
              !date && 'text-muted-foreground',
              error && 'border-red-500'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'PPP') : <span>选择一个时间</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => {
              setDate(date)
              if (!submitValue) return
              const value = date?.toUTCString() || ''
              const valid = DateFieldFormElement.validate(
                element,
                value
              )
              setError(!valid)
              submitValue(element.id, value)
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
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
  const { label, required, helperText } = element.extraAttributes
  const form = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: 'onBlur',
    defaultValues: {
      label,
      helperText,
      required
    }
  })

  useEffect(() => {
    form.reset(element.extraAttributes)
  }, [element, form])

  function applyChanges(values: propertiesFormSchemaType) {
    const { label, helperText, required } = values
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        label,
        helperText,
        required
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
