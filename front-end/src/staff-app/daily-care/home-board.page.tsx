import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person, PersonHelper } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import { Search } from "./Search"
import style from "./dailyCare.module.scss"

const initialStateRoll = [
  { type: "all", count: 0 },
  { type: "present", count: 0 },
  { type: "late", count: 0 },
  { type: "absent", count: 0 },
]

export const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false)
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [searchText, setSearchText] = useState('');
  const [studentsData, setStudents] = useState<any>([])
  const [roleStateList, setRoleStateList] = useState(initialStateRoll)
  const [studentsRollData, setStudentsRollData] = useState({})


  useEffect(() => {
    void getStudents()
  }, [getStudents])

  useEffect(() => {
    setStudents(data?.students)
  }, [data])

  const onToolbarAction = (action: ToolbarAction) => {
    if (action === "roll") {
      setIsRollMode(true)
    }
  }

  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      setIsRollMode(false)
      setStudentsRollData({});
      setRoleStateList(initialStateRoll)
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

  const handleSearch = (e: any) => {
    const { value } = e.target;
    setSearchText(value)
    filterStudentsData(value)
  }

  const onStateChange = (val: string, id: number) => {
    const idRoll: any = { ...studentsRollData, [id]: val }
    setStudentsRollData(idRoll)
    const updated = roleStateList.map((item) => {
      let count = Object.values(idRoll).reduce((acc, cur) => {
        if (item.type === cur) {
          acc += 1;
        }
        return acc;
      }, 0)
      return { ...item, count }

    })
    setRoleStateList(updated);
  }
  return (
    <>
      <S.PageContainer>
        <Toolbar onItemClick={onToolbarAction} searchText={searchText} handleSearch={handleSearch} />

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && (
          studentsData?.length > 0 ? (
            <>
              {studentsData.map((s: any) => (
                <StudentListTile key={s.id} isRollMode={isRollMode} student={s} onStateChange={onStateChange} roleState={studentsRollData[s.id]}/>
              ))}
            </>
          ) : (<p className={style.notFoonItemClickund}>Results not found</p>)
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay isActive={isRollMode} onItemClick={onActiveRollAction} stateList={roleStateList} />
    </>
  )
}

type ToolbarAction = "roll" | "sort"
interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void
  searchText: string
  handleSearch: (val: any) => void
}
const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick, searchText, handleSearch } = props
  return (
    <S.ToolbarContainer>
      <div onClick={() => onItemClick("sort")}>First Name</div>
      {/* <div>Search</div> */}
      <Search value={searchText} onSearch={handleSearch} />
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
