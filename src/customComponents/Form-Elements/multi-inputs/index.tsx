// **  Components Imports
import { Chip } from '@mui/material'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import CustomTextField from 'src/@core/components/mui/text-field'

const MultiInput = ({ onChange, value, label, placeholder, sx, error }: any) => {

    return (
        <CustomAutocomplete
            freeSolo
            multiple
            fullWidth
            value={value}
            onChange={onChange}
            sx={sx}
            id='autocomplete-multiple-filled'
            options={[]}
            renderInput={params => (
                <CustomTextField {...params} variant='filled' label={label} placeholder={placeholder} error={error ? error : false} />
            )}
            renderTags={(value: string[], getTagProps) =>
                Array.isArray(value) ? value?.map((option: string, index: number) => (
                    <Chip label={option} {...(getTagProps({ index }) as {})} key={index} />
                )) : <Chip label={value} {...(getTagProps)} />
            }
        />
    )
}

export default MultiInput