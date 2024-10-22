import { Box, Button, Drawer, FormControl, FormHelperText, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { appErrors, DEFAULT_STATUS_CODE_SUCCESS, FIELD_REQUIRED, LONG_DESCRIPTION } from "src/AppConstants";
import DrawerHeader from "src/customComponents/components/drawer-header";
import TccEditor from "src/customComponents/Form-Elements/editor";
import { ADD_INFO, GET_INFO } from "src/services/AdminServices";

interface dataType {
    info_key: string
    drawerTitle: string,
    drawerACtion: boolean,
    onsubmit: any,
    drawerToggle: () => void,
}
const InfoSection = (props: dataType) => {
    // state
    const [editorData, setEditorData] = useState("")
    const [edit, setEdit] = useState<any>('<p></p>')
    const [errorData, setErrorData] = useState<any>()
    const [titleError, setTitleError] = useState<any>()
    const [desError, setDesError] = useState<any>()
    const [title, setTitle] = useState<any>()

    // useEffect
    useEffect(() => {
        if (props.drawerACtion) {
            fetchInfo()
        }
    }, [props.drawerACtion])

    // ----- GET_INFO_DATA ----
    const fetchInfo = async () => {
        try {
            const data = await GET_INFO(props.info_key)
            if (data.code === DEFAULT_STATUS_CODE_SUCCESS) {
                setTitle(data?.data.title)
                setEdit(data?.data.description)
            } else {
                toast.error(data?.message)
            }
        } catch (e: any) {
            toast.error(e?.data?.message)
        }
    }
    const clearFormHandler = () => {
        setTitle("")
        setDesError("")
        setEdit("<p></p>")
    }

    const addInfoApi = async () => {
        const payload = {
            "info_key": props.info_key,
            "title": title,
            "description": editorData
        };
        try {
            const data = await ADD_INFO(payload);
            if (data.code === 200 || data.code === "200") {
                toast.success(data.message);
            } else {
                return toast.error(data.message);
            }
        } catch (e: any) {
            toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN, {
                position: "top-center"
            });
        }
        return false;
    }

    const onSubmit = () => {
        if (
            editorData.toString().trim() === `<p></p>` ||
            title === '' || title === undefined) {
            const titleError = title ? "" : `${FIELD_REQUIRED}`
            setTitleError(titleError)
            const longDesError = editorData.toString().trim() !== `<p></p>` ? '' : `${LONG_DESCRIPTION}`;
            setDesError(longDesError)
        } else {
            props.onsubmit()
            addInfoApi()
        }
    }

    return (
        <Drawer
            open={props.drawerACtion}
            anchor='right'
            variant='temporary'
            onClose={() => {
                clearFormHandler()
                props.drawerToggle()
            }}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: { xs: 800, sm: 800 } } }}
        >
            <DrawerHeader
                title={`${props.drawerTitle}`}
                onClick={() => {
                    props.drawerToggle()
                }}
            />
            <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
                <TextField
                    autoFocus
                    fullWidth
                    size='small'
                    label='Title'
                    value={title || ""}
                    sx={{ mb: 2 }}
                    error={Boolean(titleError)}
                    onChange={(event: any) => {
                        if (event.target.value) {
                            setTitleError('')
                        } else {
                            setTitleError(`${FIELD_REQUIRED}`)
                        }
                        setTitle(event.target.value)
                    }}
                />
                {titleError && <FormHelperText sx={{ color: 'error.main' }}>{FIELD_REQUIRED}</FormHelperText>}
                <TccEditor
                    wrapperClassName={desError && errorData === true ? "demo-wrapper" : 'editor-validaton-wrapper'}
                    getHtmlData={setEditorData} data={edit} called={true} errorData={setErrorData}
                />
                {desError && errorData === true && <FormHelperText sx={{ color: 'error.main' }}>{FIELD_REQUIRED}</FormHelperText>}
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
                    <Button variant='contained' sx={{ mr: 3 }} type="submit" onClick={() => onSubmit()}>
                        SUBMIT
                    </Button>
                    <Button variant='outlined' color='secondary' onClick={() => {
                        clearFormHandler()
                        props.drawerToggle()
                    }}>
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Drawer >

    )
}

export default InfoSection; 