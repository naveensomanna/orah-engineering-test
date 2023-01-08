import React, { useEffect } from "react"
import styled from "styled-components"
import { Spacing } from "shared/styles/styles"
import { useApi } from "shared/hooks/use-api"

export const ActivityPage: React.FC = () => {
  const [getStudents, data, loadState] = useApi({ url: "get-activities" })
  useEffect(() => {
    getStudents();
  }, [getStudents])
  console.log(data,"in activity")
  return <S.Container>Activity Page</S.Container>
}

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 0;
  `,
}
