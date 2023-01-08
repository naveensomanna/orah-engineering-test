import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { Spacing } from "shared/styles/styles"
import { Accordion, AccordionSummary, AccordionDetails } from "@material-ui/core"
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

import { useApi } from "shared/hooks/use-api"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import styles from "./activity.module.scss"
import { Person, PersonHelper } from "shared/models/person"

export const ActivityPage: React.FC = () => {
  const [getStudentsRollData, data, loadState] = useApi({ url: "get-activities" })
  const [getStudentdsData, result, ] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })

  const [rollsData, setRollsData] = useState([])
  useEffect(() => {
    getStudentsRollData();
    getStudentdsData();
  }, [getStudentsRollData,getStudentdsData])

  useEffect(() => {
    setRollsData(data?.activity)
  }, [data])

  const getName=(id:number)=>{
   const studentData= result?.students.find((item)=>item.id===id)
   return PersonHelper.getFullName(studentData);
  }

  return (
    <S.Container>
      <h1>Activity</h1>
      {loadState === "loading" && (
        <CenteredContainer>
          <FontAwesomeIcon icon="spinner" size="2x" spin />
        </CenteredContainer>
      )}
      {loadState === "loaded" && rollsData?.length>0 && rollsData.map((item) => (
        <Accordion key={item.id}>
          <AccordionSummary
            expandIcon={<FontAwesomeIcon icon={faChevronDown} />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <div className={styles.header}>
            <h2>{item?.entity?.name}</h2>
            <span>{new Date(item?.date).toLocaleString()}</span>
            </div>
          </AccordionSummary>
          <AccordionDetails className={styles.accordianDetails}>
           {item?.entity?.student_roll_states.map((roll)=>(
           <div key={roll.student_id}  className={styles.roll}>
            <h2>{getName(+roll.student_id)}</h2>
            <span className={`${styles[roll.roll_state]} ${styles.status}`}>{roll.roll_state}</span>
            </div>
            ))}
          </AccordionDetails>
        </Accordion>
        ))}
    </S.Container>
  )
}

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 0;
  `,
}
