import { GetForms, GetFormStats } from '@/actions/form'
import CreateFormBtn from '@/components/CreateFormBtn'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Form } from '@prisma/client'
import {
  ArrowRightIcon,
  FilePenIcon,
  FileSpreadsheetIcon,
  GhostIcon,
  MousePointerClickIcon,
  ViewIcon
} from 'lucide-react'
import { ReactNode, Suspense } from 'react'
import { formatDistance } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="container pt-4">
      <Suspense fallback={<StatsCards loading={true} />}>
        <CardStatsWrapper />
      </Suspense>
      <Separator className="my-6" />
      <h2 className="text-4xl font-bold col-span-2">您的表单</h2>
      <Separator className="my-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CreateFormBtn />
        <Suspense
          fallback={[1, 2, 3, 4].map((el) => (
            <FormCardSkeleton key={el} />
          ))}
        >
          <FormCards></FormCards>
        </Suspense>
      </div>
    </div>
  )
}

async function CardStatsWrapper() {
  const stats = await GetFormStats()

  return <StatsCards loading={false} data={stats} />
}

interface StatsCardProps {
  data?: Awaited<ReturnType<typeof GetFormStats>>
  loading: boolean
}

function StatsCards(props: StatsCardProps) {
  const { data, loading } = props

  return (
    <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="总访问量"
        icon={<ViewIcon className="text-blue-600" />}
        helperText="所有表单的总访问量"
        value={data?.visits.toLocaleString() || ''}
        loading={loading}
        className="shadow-md shadow-blue-600"
      />
      <StatsCard
        title="总提交量"
        icon={<FileSpreadsheetIcon className="text-yellow-600" />}
        helperText="所有表单的总提交量"
        value={data?.submissions.toLocaleString() || ''}
        loading={loading}
        className="shadow-md shadow-yellow-600"
      />
      <StatsCard
        title="转化率"
        icon={<MousePointerClickIcon className="text-green-600" />}
        helperText="总访问量转化成提交的比率"
        value={data?.submissionRate.toLocaleString() + '%' || ''}
        loading={loading}
        className="shadow-md shadow-green-600"
      />
      <StatsCard
        title="放弃率"
        icon={<GhostIcon className="text-red-600" />}
        helperText="总访问量中未转化成提交的比率"
        value={data?.bounceRate.toLocaleString() + '%' || ''}
        loading={loading}
        className="shadow-md shadow-red-600"
      />
    </div>
  )
}

function StatsCard({
  title,
  value,
  icon,
  helperText,
  loading,
  className
}: {
  title: string
  value: string
  helperText: string
  className: string
  loading: boolean
  icon: ReactNode
}) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading && (
            <Skeleton>
              <span className="opacity-0">0</span>
            </Skeleton>
          )}
          {!loading && value}
          <p className="text-xs text-muted-foreground pt-1">
            {helperText}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function FormCardSkeleton() {
  return (
    <Skeleton className="border-2 border-primary/20 h-[200px] w-full" />
  )
}

async function FormCards() {
  const forms = await GetForms()
  return (
    <>
      {forms.map((form) => (
        <FormCard key={form.id} form={form} />
      ))}
    </>
  )
}

function FormCard({ form }: { form: Form }) {
  return (
    <Card className="h-[200px] gap-0 justify-between">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between overflow-x-hidden">
          <span className="truncate font-bold">{form.name}</span>
          {form.published && <Badge>已发布</Badge>}
          {!form.published && (
            <Badge variant="destructive">未发布</Badge>
          )}
        </CardTitle>
        <CardDescription className="flex items-center justify-between text-muted-foreground text-sm">
          {formatDistance(form.createdAt, new Date(), {
            addSuffix: true,
            locale: zhCN
          })}
          {form.published && (
            <div className="flex items-center gap-2">
              <ViewIcon size={16} className="text-muted-foreground" />
              <span>{form.visits.toLocaleString()}</span>
              <FileSpreadsheetIcon
                size={16}
                className="text-muted-foreground"
              />
              <span>{form.submissions.toLocaleString()}</span>
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[20px] truncate text-sm text-muted-foreground">
        {form.description || '暂无描述'}
      </CardContent>
      <CardFooter>
        {form.published && (
          <Button asChild className="w-full mt-2 text-md gap-4">
            <Link href={`/forms/${form.id}`}>
              查看提交 <ArrowRightIcon />
            </Link>
          </Button>
        )}
        {!form.published && (
          <Button asChild className="w-full mt-2 text-md gap-4">
            <Link href={`/builder/${form.id}`}>
              编辑表单 <FilePenIcon />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
