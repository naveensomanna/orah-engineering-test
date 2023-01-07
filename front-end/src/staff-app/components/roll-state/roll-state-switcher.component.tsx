import React, { useState } from "react"
import { Person } from "shared/models/person"
import { RolllStateType } from "shared/models/roll"
import { RollStateIcon } from "staff-app/components/roll-state/roll-state-icon.component"

interface Props {
  initialState?: RolllStateType
  size?: number
  onStateChange?: (newState: RolllStateType, id:number) => void
  student: Person
}
export const RollStateSwitcher: React.FC<Props> = ({ initialState = "unmark", size = 40, onStateChange,student }) => {
  const [rollState, setRollState] = useState(initialState)
  const nextState = () => {
    const states: RolllStateType[] = ["present", "late", "absent"]
    if (rollState === "unmark" || rollState === "absent") return states[0]
    const matchingIndex = states.findIndex((s) => s === rollState)
    return matchingIndex > -1 ? states[matchingIndex + 1] : states[0]
  }

  const onClick = (id:number) => {
    const next = nextState()
    setRollState(next)
    if (onStateChange) {
      onStateChange(next,id)
    }
  }

  return <RollStateIcon type={rollState} size={size} onClick={onClick} student={student}/>
}
