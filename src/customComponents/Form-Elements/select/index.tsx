import { FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import { title } from "process"
import { useState } from "react"


const TccSelect = ({ label, isNoneValue, error, defaultValue, inputLabel, Options, onChange, value, fullWidth, sx, title, disabled, InputProps }: any) => {

    return (
        <>
            <FormControl fullWidth={fullWidth} size='small' sx={sx}>
                <InputLabel id='demo-simple-select-outlined-label'>{inputLabel}</InputLabel>
                <Select
                    fullWidth={fullWidth}
                    label={label}
                    defaultValue={defaultValue}
                    id='demo-simple-select-outlined'
                    labelId='demo-simple-select-outlined-label'
                    value={value}
                    disabled={disabled}
                    onChange={onChange}
                    inputProps={{ readOnly: InputProps }}
                    error={error ? error : false}

                >
                    {isNoneValue && isNoneValue === '0' ?
                        <></> :
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                    }

                    {Options.map((option: any) => (

                        <MenuItem key={option.id} value={option.id}>{option[title]}</MenuItem>

                    ))}
                </Select>
            </FormControl>
        </>
    )
}

export default TccSelect