
import { TextField } from "@mui/material";
import React, { useState } from "react";

const TccInput = ({ error, value, label, placeholder, type, onChange, fullWidth, rows, multiline, sx, disabled, InputProps }: any) => {
    const validatePositiveNumber = (value: any) => {
        if (type === 'number') {
            if (parseInt(value) >= 0) {
                return value
            } else {
                return ''
            }
        } else {
            return value
        }

    };
    return (
        <div className="form-group">
            <TextField
                InputProps={{ readOnly: InputProps }}
                disabled={disabled}
                label={label}
                value={validatePositiveNumber(value)}
                placeholder={placeholder}
                type={type}
                error={error}
                fullWidth={fullWidth}
                size='small'
                onChange={onChange}
                rows={rows}
                multiline={multiline}
                sx={sx}
            />
        </div>
    );
};

export default TccInput;