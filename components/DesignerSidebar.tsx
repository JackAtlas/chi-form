import React from 'react'
import useDesigner from './hooks/useDesigner'
import FormElementSidebar from './FormElementSidebar'
import ProportiesFormSidebar from './ProportiesFormSidebar'

function DesignerSidebar() {
  const { selectedElement } = useDesigner()
  return (
    <aside className="w-100 max-w-100 flex flex-col grow gap-2 border-l-2 border-muted p-4 bg-background overflow-y-auto h-full">
      {selectedElement ? (
        <ProportiesFormSidebar />
      ) : (
        <FormElementSidebar />
      )}
    </aside>
  )
}

export default DesignerSidebar
