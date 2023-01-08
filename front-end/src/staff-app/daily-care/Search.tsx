import React, { useContext } from "react";
import { TextField } from '@material-ui/core';
import style from "./dailyCare.module.scss";
import { StudentsRollsData } from "./home-board.page";

export const Search: React.FC = () => {
    const { searchText: value, handleSearch: onSearch } = useContext(StudentsRollsData)
    return (
        <TextField id="outlined-basic" variant="outlined" placeholder="Search by name" className={style.search} value={value} onChange={onSearch} />
    )
} 