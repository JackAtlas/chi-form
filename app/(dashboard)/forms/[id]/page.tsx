import { GetFormById, GetFormWithSubmissions } from '@/actions/form'
import FormLinkShare from '@/components/FormLinkShare'
import VisitBtn from '@/components/VisitBtn'
import React, { ReactNode } from 'react'
import { StatsCard } from '../../page'
import {
  FileSpreadsheetIcon,
  GhostIcon,
  MousePointerClickIcon,
  ViewIcon
} from 'lucide-react'
import {
  ElementsType,
  FormElementInstance
} from '@/components/FormElements'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { format, formatDistance } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'

export default async function FormDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const form = await GetFormById(Number(id))
  if (!form) {
    throw new Error('Form not found')
  }

  const { visits, submissions } = form

  let submissionRate = 0
  if (visits > 0) {
    submissionRate = (submissions / visits) * 100
  }

  const bounceRate = 100 - submissionRate

  return (
    <>
      <div className="py-10 border-b border-muted">
        <div className="flex justify-between container">
          <h1 className="text-4xl font-bold truncate">{form.name}</h1>
          <VisitBtn shareURL={form.shareURL} />
        </div>
      </div>
      <div>
        <div className="py-4 border-b border-muted">
          <div className="container flex gap-2 items-center justify-between">
            <FormLinkShare shareURL={form.shareURL} />
          </div>
        </div>
      </div>
      <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 container">
        <StatsCard
          title="总访问量"
          icon={<ViewIcon className="text-blue-600" />}
          helperText="所有表单的总访问量"
          value={visits.toLocaleString() || ''}
          loading={false}
          className="shadow-md shadow-blue-600"
        />
        <StatsCard
          title="总提交量"
          icon={<FileSpreadsheetIcon className="text-yellow-600" />}
          helperText="所有表单的总提交量"
          value={submissions.toLocaleString() || ''}
          loading={false}
          className="shadow-md shadow-yellow-600"
        />
        <StatsCard
          title="转化率"
          icon={<MousePointerClickIcon className="text-green-600" />}
          helperText="总访问量转化成提交的比率"
          value={submissionRate.toLocaleString() + '%' || ''}
          loading={false}
          className="shadow-md shadow-green-600"
        />
        <StatsCard
          title="放弃率"
          icon={<GhostIcon className="text-red-600" />}
          helperText="总访问量中未转化成提交的比率"
          value={bounceRate.toLocaleString() + '%' || ''}
          loading={false}
          className="shadow-md shadow-red-600"
        />
      </div>

      <div className="container pt-10">
        <SubmissionTable id={form.id} />
      </div>
    </>
  )
}

type Row = {
  [key: string]: string
} & {
  submittedAt: Date
}

async function SubmissionTable({ id }: { id: number }) {
  const form = await GetFormWithSubmissions(id)

  if (!form) {
    throw new Error('未找到表单')
  }

  const formElements = JSON.parse(
    form.content
  ) as FormElementInstance[]

  const columns: {
    id: string
    label: string
    required: boolean
    type: ElementsType
  }[] = []

  formElements.forEach((element) => {
    switch (element.type) {
      case 'TextField':
      case 'NumberField':
      case 'TextAreaField':
      case 'DateField':
      case 'SelectField':
      case 'CheckboxField':
        columns.push({
          id: element.id,
          label: element.extraAttributes?.label,
          required: element.extraAttributes?.isRequired,
          type: element.type
        })
        break
      default:
        break
    }
  })

  const rows: Row[] = []
  form.FormSubmissions.forEach((submission) => {
    const content = JSON.parse(submission.content)
    rows.push({
      ...content,
      submittedAt: submission.createdAt
    })
  })

  return (
    <div>
      <h1 className="text-2xl font-bold my-4">提交</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id} className="uppercase">
                  {column.label}
                </TableHead>
              ))}
              <TableHead className="text-muted-foreground text-right uppercase">
                提交时间
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <RowCell
                    key={column.id}
                    type={column.type}
                    value={row[column.id]}
                  ></RowCell>
                ))}
                <TableCell className="text-muted-foreground text-right">
                  {formatDistance(row.submittedAt, new Date(), {
                    addSuffix: true,
                    locale: zhCN
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function RowCell({
  type,
  value
}: {
  type: ElementsType
  value: string
}) {
  let node: ReactNode = value

  switch (type) {
    case 'DateField':
      if (!value) break
      const date = new Date(value)
      node = (
        <Badge variant="outline">{format(date, 'dd/MM/yyyy')}</Badge>
      )
      break
    case 'CheckboxField':
      const checked = value === 'true' ? true : false
      node = <Checkbox checked={checked} disabled />
      break
    case 'TextAreaField':
      node = <p className="whitespace-pre-line">{value}</p>
      break
    default:
      break
  }

  return <TableCell>{node}</TableCell>
}
