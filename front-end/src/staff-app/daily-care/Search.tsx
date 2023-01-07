import React from "react";
import { TextField } from '@material-ui/core';
import style from "./dailyCare.module.scss";

interface Search {
    value: string;
    onSearch: (e:any) => void;
}

export const Search: React.FC<Search> = ({ value, onSearch }) => {
    return (
        <TextField id="outlined-basic" variant="outlined" placeholder="Search by name" className={style.search} value={value} onChange={onSearch} />
    )
} 