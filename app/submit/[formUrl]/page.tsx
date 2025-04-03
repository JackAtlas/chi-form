import { GetFormContentByUrl } from '@/actions/form'
import { FormElementInstance } from '@/components/FormElements'
import FormSubmitComponent from '@/components/FormSubmitComponent'
import React from 'react'

async function SubmitPage({
  params
}: {
  params: { formUrl: string }
}) {
  const { formUrl } = await params
  const form = await GetFormContentByUrl(formUrl)

  if (!form) {
    throw new Error('找不到表单')
  }

  const formContent = JSON.parse(
    form.content
  ) as FormElementInstance[]

  return (
    <FormSubmitComponent formUrl={formUrl} content={formContent} />
  )
}

export default SubmitPage
