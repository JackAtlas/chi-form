'use client'

import React from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './ui/dialog'
import { Button } from './ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from './ui/form'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { FilePlusIcon, Loader2Icon } from 'lucide-react'
import { toast } from 'sonner'
import { formSchema, formSchemaType } from '@/schemas/form'
import { CreateForm } from '@/actions/form'
import { useRouter } from 'next/navigation'

function CreateFormBtn() {
  const router = useRouter()
  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: ''
    }
  })

  async function onSubmit(values: formSchemaType) {
    try {
      const formId = await CreateForm(values)
      toast.success('表单创建成功')
      router.push(`/builder/${formId}`)
    } catch (error) {
      console.error(error)
      toast.error('表单创建失败，请稍后再试')
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="group border border-primary/20 h-[200px] items-center justify-center flex flex-col hover:border-primary hover:cursor-pointer border-dashed gap-4"
        >
          <FilePlusIcon className="size-8 text-muted-foreground group-hover:text-primary" />
          <p className="font-bold text-xl text-muted-foreground group-hover:text-primary">
            创建新表单
          </p>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>创建表单</DialogTitle>
          <DialogDescription>创建表单开始收集反馈</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>名称</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>描述</FormLabel>
                  <FormControl>
                    <Textarea rows={5} {...field} />
                  </FormControl>
                </FormItem>
              )}
            ></FormField>
          </form>
        </Form>
        <DialogFooter>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={form.formState.isSubmitting}
            className="w-full mt-4"
          >
            {!form.formState.isSubmitting ? (
              '保存'
            ) : (
              <Loader2Icon className="animate-spin" />
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateFormBtn
