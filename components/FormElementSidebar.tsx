import React from 'react'
import SidebarBtnElement from './SidebarBtnElement'
import { FormElements } from './FormElements'
import { Separator } from './ui/separator'

function FormElementSidebar() {
  return (
    <div>
      <p className="text-sm text-foreground/70">拖放组件</p>
      <Separator className="my-2" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 place-items-center">
        <p className="text-sm text-muted-foreground col-span-1 md:col-span-2 place-self-start">
          布局组件
        </p>
        <SidebarBtnElement formElement={FormElements.TitleField} />
        <SidebarBtnElement formElement={FormElements.SubTitleField} />
        <SidebarBtnElement
          formElement={FormElements.ParagraphField}
        />
        <SidebarBtnElement
          formElement={FormElements.SeparatorField}
        />
        <SidebarBtnElement formElement={FormElements.SpacerField} />
        <p className="text-sm text-muted-foreground col-span-1 md:col-span-2 place-self-start">
          表单组件
        </p>
        <SidebarBtnElement formElement={FormElements.TextField} />
        <SidebarBtnElement formElement={FormElements.NumberField} />
        <SidebarBtnElement formElement={FormElements.TextAreaField} />
        <SidebarBtnElement formElement={FormElements.DateField} />
        <SidebarBtnElement formElement={FormElements.SelectField} />
        <SidebarBtnElement formElement={FormElements.CheckboxField} />
      </div>
    </div>
  )
}

export default FormElementSidebar
