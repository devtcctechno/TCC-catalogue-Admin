// ** MUI Imports
import { Divider, CardHeader, Grid, Card, Drawer, Button, FormControl, TextField, FormHelperText } from '@mui/material'
import { useEffect, useState } from 'react'
import TCCTableHeader from 'src/customComponents/data-table/header'
import TccDataTable from 'src/customComponents/data-table/table'
import Box from '@mui/material/Box'
import DrawerHeader from 'src/customComponents/components/drawer-header'
import { toast } from 'react-hot-toast'
import { appErrors, SEARCH_DELAY_TIME, FIELD_REQUIRED } from 'src/AppConstants'
import { createPagination } from 'src/utils/sharedFunction'
import { ICommonPagination } from 'src/data/interface'
import { ADD_PAGE_SETTINGS, DELETE_PAGE_SETTINGS, EDIT_PAGE_SETTINGS, GET_ALL_PAGE_SETTINGS, RESTRICT_STATUS, STATUS_PAGE_SETTINGS } from 'src/services/AdminServices'
import DeleteDataModel from 'src/customComponents/delete-model'
import { Controller, useForm } from 'react-hook-form'
import Editor from 'src/@core/components/custom-ckeditor'
const PageSetting = () => {

    let timer: any;
    const [searchFilter, setSearchFilter] = useState('')
    const [showModel, setShowModel] = useState(false)
    const [drawerAction, setDrawerAction] = useState(false);
    const [editorDrawerAction, setEditorDrawerAction] = useState(false);
    const [pageName, setpageName] = useState("");
    const [urlValue, setUrlValue] = useState("");
    const [id, setId] = useState("")
    const [dialogTitle, setDialogTitle] = useState<'Add' | 'Edit'>('Add')
    const [allData, setAllData] = useState([]);
    const [pagination, setPagination] = useState({ ...createPagination(), search_text: "" });
    const [editorData, setEditorData] = useState('')
    const [errorData, setErrorData] = useState(false)
    const toggleAddDrawer = () => setDrawerAction(!drawerAction);
    const toggleEditorDrawer = () => setEditorDrawerAction(!editorDrawerAction)
    const [formErrorData, setFormErrorData] = useState(false);

    const defaultValues = {
        pageName: pageName,
        urlValue: urlValue,
        edit: editorData
    }
    const {
        control,
        setValue,
        reset,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues
    })

    // **  Get API 

    const getAllDataApi = async (mbPagination: ICommonPagination) => {
        try {
            const data = await GET_ALL_PAGE_SETTINGS(mbPagination);
            if (data.code === 200 || data.code === "200") {
                setAllData(data.data.result);
                setPagination(data.data.pagination)
            } else {
                return toast.error(data.message);
            }
        } catch (e: any) {
            toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN)
        }
    }

    useEffect(() => {
        getAllDataApi(pagination);
    }, []);

    const handleChangePerPageRows = (perPageRows: any) => {
        getAllDataApi({ ...pagination, per_page_rows: perPageRows.pageSize, current_page: perPageRows.page + 1 })
    }

    const handleChangeSortBy = (orderSort: any) => {
        getAllDataApi({ ...pagination, sort_by: orderSort == undefined ? "id" : orderSort.map((t: any) => t.field), order_by: orderSort == undefined ? "DESC" : orderSort.map((t: any) => t.sort) })
    }
    const searchBusinessUser = async () => {
        if (timer) {
            clearTimeout(timer);
        }

        timer = setTimeout(() => {
            getAllDataApi({ ...pagination, current_page: 1, search_text: searchFilter });
        }, SEARCH_DELAY_TIME);
    }

    useEffect(() => {
        searchBusinessUser();
    }, [searchFilter]);

    // **  Add API 

    const addDataApi = async (data: any) => {
        const payload = {
            "name": data.pageName,
            "description": data.edit,
            "url": data.urlValue,
        }
        try {
            const data = await ADD_PAGE_SETTINGS(payload)
            if (data.code === 200 || data.code === "200") {
                toggleAddDrawer();
                clearFormData();
                toast.success(data.message)
                getAllDataApi(pagination)

            } else {
                return toast.error(data.message)
            }
        } catch (e: any) {
            toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN, {
                position: "top-center"
            })
        }

        return false
    }

    // **  Edit API 

    const editDataApi = async (data: any) => {

        const payload = {
            "name": data.pageName,
            "description": data.edit,
            "url": data.urlValue,
        }
        try {
            const data = await EDIT_PAGE_SETTINGS(id, payload)
            if (data.code === 200 || data.code === "200") {
                toggleAddDrawer();
                clearFormData();
                toast.success(data.message)
                getAllDataApi(pagination)
            } else {
                return toast.error(data.message)
            }
        } catch (e: any) {
            toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN, {
                position: "top-center"
            })
        }
        return false
    }

    // ** Delete API 

    const deleteBrandDataApi = async () => {

        try {
            const data = await DELETE_PAGE_SETTINGS(id);
            if (data.code === 200 || data.code === "200") {
                toast.success(data.message);
                setShowModel(!showModel)
                getAllDataApi(pagination)
            } else {
                return toast.error(data.message)
            }
        } catch (error) {

        }
    }

    // ** Active Status API 

    const activeStatusDataApi = async (checked: boolean, row: any) => {
        try {
            const datas = await STATUS_PAGE_SETTINGS(row.id)

            if (datas.code === 200 || datas.code === "200") {

                toast.success("Successfully updated")
                getAllDataApi(pagination)
                return true
            } else {
                return toast.error(datas.message)
            }
        } catch (error) {

            return toast.error(appErrors.UNKNOWN_ERROR_TRY_AGAIN)
        }
    }

    // ** Restrict Status API

    const restrictStatusDataApi = async (checked: boolean, row: any) => {
        try {
            const datas = await RESTRICT_STATUS(row.id)
            if (datas.code === 200 || datas.code === "200") {
                toast.success("Successfully updated")
                getAllDataApi(pagination)
                return true
            } else {
                return toast.error(datas.message)
            }
        } catch (error) {
            return toast.error(appErrors.UNKNOWN_ERROR_TRY_AGAIN)
        }
    }

    // ** Edit & Delete handler

    const editOnClickHandler = (data: any) => {
        setEditorData(data.description)
        setValue("pageName", data.name)
        setValue("urlValue", data.url)
        setId(data.id)
        setDialogTitle('Edit')
        toggleAddDrawer()
    }

    const deleteOnclickHandler = (data: any) => {
        setId(data.id)
        setShowModel(!showModel)
    }

    // ** Table Column Data
    const column = [
        {
            width: 350,
            value: 'name',
            headerName: 'name',
            field: 'name',
            text: 'text'
        },
        {
            width: 350,
            value: 'url',
            headerName: 'URL',
            field: 'url',
            text: 'text'
        },
        {
            width: 100,
            headerName: 'status',
            field: 'is_active',
            switch: 'switch',
            value: 'is_active',
            SwitchonChange: activeStatusDataApi
        },
        {
            width: 100,
            headerName: 'Restrict status',
            field: 'is_restrict',
            switch: 'switch',
            value: 'is_restrict',
            SwitchonChange: restrictStatusDataApi

        },
        {
            width: 100,
            headerName: 'Action',
            field: 'action',
            edit: "edit",
            deleted: 'deleted',
            editOnClick: editOnClickHandler,
            deletedOnClick: deleteOnclickHandler
        },
    ]

    // ** Handle Function

    const clearFormData = () => {
        setFormErrorData(false)
        reset()
        setEditorData("")
    }

    const onsubmit = (data: any) => {
        if (dialogTitle === 'Add') {
            addDataApi(data)
        } else {
            if (data.edit === "<p></p>\n") {
                setFormErrorData(true)
            } else {
                setFormErrorData(false)
            }
            if (data.urlValue && data.pageName && data.edit !== "<p></p>\n") {
                editDataApi(data)
            }
        }
    }

    const handleEditorChange = (editor: any) => {
        const data = editor
        setEditorData(data)
    }

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='Page Settings'></CardHeader>
                    <Divider />
                    <Box>
                        <TCCTableHeader isButton value={searchFilter}
                            onChange={(e: any) => setSearchFilter(e.target.value)}
                            toggle={() => {
                                setDialogTitle('Add')
                                toggleAddDrawer()
                                clearFormData()
                            }}
                            ButtonName='Add Page Setting'
                        />

                    </Box>
                    <Box sx={{ width: "100%" }}>
                        <TccDataTable
                            column={column}
                            rows={allData}
                            handleSortChanges={handleChangeSortBy}
                            pageSize={parseInt(pagination.per_page_rows.toString())}
                            rowCount={pagination.total_items}
                            page={pagination.current_page - 1}
                            onPageChange={handleChangePerPageRows}
                            iconTitle='Page Setting'
                        />
                    </Box>
                </Card>
            </Grid>
            <Drawer
                open={drawerAction}
                anchor='right'
                variant='temporary'
                onClose={toggleAddDrawer}
                ModalProps={{ keepMounted: true }}
                sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
            >

                <DrawerHeader
                    title={`${dialogTitle} Page Setting`}
                    onClick={() => {
                        toggleAddDrawer()
                        clearFormData()
                    }}
                    tabBar
                />
                <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
                    <form
                        onSubmit={handleSubmit(onsubmit)}
                    >
                        <FormControl fullWidth sx={{ mb: 4 }}>
                            <Controller
                                name='pageName'
                                control={control}
                                rules={{ required: true }}
                                render={({ field }: any) => (
                                    <TextField
                                        autoFocus
                                        size='small'
                                        value={pageName}
                                        label='Name'
                                        onChange={(e) => setpageName(e.target.value)}
                                        error={Boolean(errors.pageName)}
                                        {...field}
                                    />
                                )}
                            />
                            {errors.pageName && <FormHelperText sx={{ color: 'error.main' }}>{FIELD_REQUIRED}</FormHelperText>}
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 4 }}>
                            <Controller
                                name='urlValue'
                                control={control}
                                rules={{ required: true }}
                                render={({ field }: any) => (
                                    <TextField
                                        autoFocus
                                        size='small'
                                        value={urlValue}
                                        label='URL'
                                        onChange={(e) => setUrlValue(e.target.value)}
                                        error={Boolean(errors.urlValue)}
                                        {...field}
                                    />
                                )}
                            />
                            {errors.urlValue && <FormHelperText sx={{ color: 'error.main' }}>{FIELD_REQUIRED}</FormHelperText>}
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 4 }}>
                            <Controller
                                name='edit'
                                control={control}
                                rules={{ required: true }}
                                render={({ field }: any) => (
                                    <Editor
                                        onChange={(value: any) => {
                                            handleEditorChange(value)
                                            field.onChange(value)
                                        }}
                                        value={editorData}
                                        error={Boolean(errors.edit)}
                                    />
                                )}
                            />
                            {errors.edit && (
                                <FormHelperText sx={{ color: 'error.main' }}>{FIELD_REQUIRED}</FormHelperText>
                            )}
                        </FormControl>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
                            <Button variant='contained' sx={{ mr: 3 }} type="submit">
                                {dialogTitle === 'Add' ? "SUBMIT" : "EDIT"}
                            </Button>
                            <Button variant='outlined' color='secondary' onClick={() => {
                                toggleAddDrawer()
                                clearFormData()
                            }}>
                                Cancel
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Drawer>
            <DeleteDataModel showModel={showModel} toggle={(show: any) => setShowModel(show)}
                onClick={deleteBrandDataApi}
            />

        </Grid>
    )
}


export default PageSetting