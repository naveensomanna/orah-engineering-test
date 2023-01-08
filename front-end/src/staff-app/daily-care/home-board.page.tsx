import React, { useState, useEffect, createContext, useContext } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { ContextData, IdRoleType, Person, PersonHelper, RollsType } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import { Search } from "./Search"
import style from "./dailyCare.module.scss"
import { faSort } from "@fortawesome/free-solid-svg-icons"
import { Menu, MenuItem, Snackbar } from "@material-ui/core"

const initialStateRoll: RollsType[] = [
  { type: "all", count: 0 },
  { type: "present", count: 0 },
  { type: "late", count: 0 },
  { type: "absent", count: 0 },
]

export const StudentsRollsData = createContext({} as ContextData)

export const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false)
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [updateStudents, data1, loadState1] = useApi({ url: "save-roll" })
  const [searchText, setSearchText] = useState("")
  const [studentsData, setStudents] = useState<any>([])
  const [roleStateList, setRoleStateList] = useState<RollsType[]>(initialStateRoll)
  const [studentsRollData, setStudentsRollData] = useState<IdRoleType>({})
  const [anchorEl, setAnchorEl] = useState(null)
  const [sortBy, setSortBy] = useState<string>("asc")
  const [snackbarVisible, setSnackBarVisible] = useState(false)



  useEffect(() => {
    void getStudents()
  }, [getStudents])

  const ascendingOrder = () => {
    return data?.students.sort((a: Person, b: Person) => PersonHelper.getFullName(a) > PersonHelper.getFullName(b))
  }

  const firstNameOrder = () => {
    return data?.students.sort((a: Person, b: Person) => a.first_name > b.first_name)
  }

  const lastNameOrder = () => {
    return data?.students.sort((a: Person, b: Person) => a.last_name > b.last_name)
  }

  useEffect(() => {
    const sorted = ascendingOrder()
    setStudents(sorted)
  }, [data])

  const descendingOrder = () => {
    return data?.students.sort((a, b) => PersonHelper.getFullName(a) > PersonHelper.getFullName(b)).reverse()
  }

  const handleClick = (event: { currentTarget: React.SetStateAction<null> }) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  // sort dropdown
  const handleClickMenu = (key: string) => {
    setSortBy(key)
    const orderWise: { [key: string]: () => any } = {
      asc: ascendingOrder,
      desc: descendingOrder,
      firstName: firstNameOrder,
      lastName: lastNameOrder,
    }
    const sortedData = orderWise[key]
    setStudents(sortedData)
    handleClose()
  }

  const onToolbarAction = (action: ToolbarAction) => {
    if (action === "roll") {
      setIsRollMode(true)
      const updatedAllCount: RollsType[] = roleStateList.map((item: RollsType) => {
        if (item.type === "all") {
          return { ...item, count: data?.students.length }
        }
        return item
      })
      setRoleStateList(updatedAllCount)
    }
  }

  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      setIsRollMode(false)
      setStudentsRollData({})
      setRoleStateList(initialStateRoll)
      setStudents(data?.students)
    } else if (Object.keys(studentsRollData)?.length > 0) {
      let data = []
      for (let i in studentsRollData) {
        data.push({
          student_id: i,
          roll_state: studentsRollData[i],
        })
      }
      const pojo = { student_roll_states: data }
      updateStudents(pojo)
      setIsRollMode(false)
      setStudentsRollData({})
      setSnackBarVisible(true)
    }
  }

  const filterStudentsData = (value: string) => {
    if (value.trim()) {
      const filterData = data?.students.filter((student: any) => PersonHelper.getFullName(student)?.toLowerCase().includes(value.toLowerCase()))
      setStudents(filterData)
    } else {
      setStudents(data?.students)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setSearchText(value)
    filterStudentsData(value)
  }

  const onStateChange = (val: string, id: number) => {
    const idRoll: IdRoleType = { ...studentsRollData, [id]: val }
    setStudentsRollData(idRoll)
    const updated: RollsType[] = roleStateList.map((item) => {
      let count = Object.values(idRoll).reduce((acc: number, cur) => {
        if (item.type === cur) {
          acc += 1
        }
        return acc
      }, 0)
      return { ...item, count: item.type === "all" ? item.count : count }
    })

    setRoleStateList(updated)
  }

  // filter roll wise

  const onItemClick = (type: string) => {
    let filterIds: number[] = []
    for (let i in studentsRollData) {
      if (studentsRollData[i] === type) {
        filterIds.push(+i)
      }
    }
    const filterRolls = data?.students.filter((item: Person) => filterIds.includes(item.id))
    setStudents(filterRolls)
  }
  const contextProps={
    searchText,
    handleSearch,
    anchorEl,
    handleClickMenu,
    handleClick,
    sortBy,
    isRollMode,
    onStateChange,
    roleStateList,
    onActiveRollAction,
    onItemClick,
    handleClose,
  }
  return (
    <StudentsRollsData.Provider
    value={{...contextProps}}
    >
      <S.PageContainer>
        <Toolbar onItemClick={onToolbarAction} />

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" &&
          (studentsData?.length > 0 ? (
            <>
              {studentsData.map((s: any) => (
                <StudentListTile key={s.id} student={s} roleState={studentsRollData[s.id]} />
              ))}
            </>
          ) : (
            <p className={style.notFound}>Results not found</p>
          ))}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
       <ActiveRollOverlay />

      <Snackbar
        open={snackbarVisible}
        autoHideDuration={2000}
        onClose={() => {
          setSnackBarVisible(false)
        }}
        message="Successfully completed"
      />
    </StudentsRollsData.Provider>
  )
}

type ToolbarAction = "roll" | "sort"
interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void
}

const options = [
  { key: "asc", label: "Asc order" },
  { key: "desc", label: "Desc order" },
  { key: "firstName", label: "Sort by FirstName" },
  { key: "lastName", label: "Sort by LastName" },
]

const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick } = props
  const { handleClick, anchorEl, handleClose, sortBy, handleClickMenu } = useContext(StudentsRollsData)

  return (
    <S.ToolbarContainer>
      <div onClick={handleClick} aria-controls="simple-menu">
        <FontAwesomeIcon icon={faSort} />
      </div>
      <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        {options.map((option) => (
          <MenuItem key={option.key} selected={sortBy === option.key} value={option.key} onClick={() => handleClickMenu(option.key)}>
            {option.label}
          </MenuItem>
        ))}
      </Menu>
      <Search />
      <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
    </S.ToolbarContainer>
  )
}

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
  ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
}
