import { ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import {RolllStateType} from "./roll"


export interface Person {
  id: number
  first_name: string
  last_name: string
  photo_url?: string
}

export const PersonHelper = {
  getFullName: (p: Person) => `${p.first_name} ${p.last_name}`,
}

export interface RollsType {
  type: string
  count: number | undefined
}

export interface IdRoleType {
  [key: string]: RolllStateType
}

export interface ContextData {
  searchText: string
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void
  anchorEl: any
  handleClickMenu: (key: string) => void
  handleClick: (event: any) => void
  sortBy: string
  isRollMode: boolean
  onStateChange: (val: string, id: number) => void
  roleStateList: RollsType[]
  onActiveRollAction: (action: ActiveRollAction) => void
  onItemClick: (type: string) => void
  handleClose:()=>void
}
