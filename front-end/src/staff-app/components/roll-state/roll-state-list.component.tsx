import React, { useContext } from "react"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { RollStateIcon } from "staff-app/components/roll-state/roll-state-icon.component"
import { Spacing, FontWeight } from "shared/styles/styles"
import { RolllStateType } from "shared/models/roll"
import { StudentsRollsData } from "staff-app/daily-care/home-board.page"

interface Props {
  size?: number
}
export const RollStateList: React.FC<Props> = ({  size = 14, }) => {

  const {roleStateList:stateList,onItemClick}=useContext(StudentsRollsData)

  const onClick = (type: ItemType) => {
    if (onItemClick) {
      onItemClick(type)
    }
  }

  return (
    <S.ListContainer>
      {stateList.map((s, i) => {
        if (s.type === "all") {
          return (
            <S.ListItem key={i}>
              <FontAwesomeIcon icon="users" size="sm" style={{ cursor: "pointer" }} onClick={() => onClick(s.type)} />
              <span>{s.count}</span>
            </S.ListItem>
          )
        }

        return (
          <S.ListItem key={i}>
            <RollStateIcon type={s.type} size={size} onClick={() => onClick(s.type)} />
            <span>{s.count}</span>
          </S.ListItem>
        )
      })}
    </S.ListContainer>
  )
}

const S = {
  ListContainer: styled.div`
    display: flex;
    align-items: center;
  `,
  ListItem: styled.div`
    display: flex;
    align-items: center;
    margin-right: ${Spacing.u2};

    span {
      font-weight: ${FontWeight.strong};
      margin-left: ${Spacing.u2};
    }
  `,
}

interface StateList {
  type: ItemType
  count: number
}

type ItemType = RolllStateType | "all"
