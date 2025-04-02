import { Active, DragOverlay, useDndMonitor } from '@dnd-kit/core'
import React, { useState } from 'react'
import { SidebarBtnElementDragOverlay } from './SidebarBtnElement'
import { ElementsType, FormElements } from './FormElements'

function DragOverlayWrapper() {
  const [draggedItem, setDraggedItem] = useState<Active | null>(null)
  useDndMonitor({
    onDragStart(event) {
      setDraggedItem(event.active)
    },
    onDragMove() {},
    onDragOver() {},
    onDragEnd() {
      setDraggedItem(null)
    },
    onDragCancel() {
      setDraggedItem(null)
    }
  })

  if (!draggedItem) return null

  let node = <div>没有可接收区域</div>
  const isSidebarBtnElement =
    draggedItem.data?.current?.isDesignerBtnElement

  if (isSidebarBtnElement) {
    const type = draggedItem.data?.current?.type as ElementsType
    node = (
      <SidebarBtnElementDragOverlay
        formElement={FormElements[type]}
      />
    )
  }

  return <DragOverlay>{node}</DragOverlay>
}

export default DragOverlayWrapper
