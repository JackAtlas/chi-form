import { TextFieldFormElement } from './fields/TextField'
import { LucideIcon } from 'lucide-react'

export type ElementsType = 'TextField'

export type FormElement = {
  type: ElementsType

  construct: (id: string) => FormElementInstance

  designerBtnElement: {
    icon: LucideIcon
    label: string
  }

  designerComponent: React.FC<{
    elementInstance: FormElementInstance
  }>
  formComponent: React.FC<{ elementInstance: FormElementInstance }>
  propertiesComponent: React.FC<{
    elementInstance: FormElementInstance
  }>
}

export type FormElementInstance = {
  id: string
  type: ElementsType
  extraAttributes?: Record<string, any>
}

type FormElementsType = {
  [key in ElementsType]: FormElement
}
export const FormElements: FormElementsType = {
  TextField: TextFieldFormElement
}
