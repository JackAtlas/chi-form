'use client'

import { ElementsType, FormElement } from '../FormElements'
import { SeparatorHorizontalIcon } from 'lucide-react'
import { Label } from '../ui/label'
import { Separator } from '../ui/separator'

const type: ElementsType = 'SeparatorField'

export const SeparatorFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type
  }),
  designerBtnElement: {
    icon: SeparatorHorizontalIcon,
    label: '分割线'
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,

  validate: () => true
}

function DesignerComponent() {
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-muted-foreground">分割线字段</Label>
      <Separator />
    </div>
  )
}

function FormComponent() {
  return <Separator />
}

function PropertiesComponent() {
  return <p>此组件没有属性</p>
}
