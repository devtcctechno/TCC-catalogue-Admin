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
import { ADD_META_TAG, DELETE_META_TAG, EDIT_META_TAG, GET_ALL_META_TAG, PAGE_LIST_DROPDOWN_LIST, STATUS_META_TAG } from 'src/services/AdminServices'
import DeleteDataModel from 'src/customComponents/delete-model'
import { Controller, useForm } from 'react-hook-form'
import MultiInput from 'src/customComponents/Form-Elements/multi-inputs'
import TccSelect from 'src/customComponents/Form-Elements/select'
import TccInput from 'src/customComponents/Form-Elements/inputField'

const MetaDataSetting = () => {

    let timer: any;
    const [searchFilter, setSearchFilter] = useState('')
    const [showModel, setShowModel] = useState(false)
    const [drawerAction, setDrawerAction] = useState(false);
    const [editorDrawerAction, setEditorDrawerAction] = useState(false);
    const [pageName, setpageName] = useState("");
    const [id, setId] = useState("")
    const [dialogTitle, setDialogTitle] = useState<'Add' | 'Edit'>('Add')
    const [allData, setAllData] = useState([]);
    const [pagination, setPagination] = useState({ ...createPagination(), search_text: "" });
    const [description, setDescription] = useState('')
    const toggleAddDrawer = () => setDrawerAction(!drawerAction);
    const toggleEditorDrawer = () => setEditorDrawerAction(!editorDrawerAction)
    const [keyWordValue, setKeyWordValue] = useState([]);
    const [pageListId, setPageListId] = useState('')
    const [pageListData, setPageListData] = useState([])

    const defaultValues = {
        pageName: pageName,
        pageListId: pageListId,
        keyWordValue: [],
        edit: ''
    }

    const {
        control,
        getValues,
        setValue,
        reset,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues
    })

    const handleKeyWordChange = (event: any, value: any) => {
        setValue("keyWordValue", value);
        setKeyWordValue(value)
    };

    // **  Get API 

    const getAllDataApi = async (mbPagination: ICommonPagination) => {
        try {
            const data = await GET_ALL_META_TAG(mbPagination);
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
            "title": data?.pageName,
            "description": data.edit,
            "key_word": getValues("keyWordValue").join(","),
            "id_page": data?.pageListId,
        }
        try {
            const data = await ADD_META_TAG(payload)
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
            "title": data?.pageName,
            "description": data.edit,
            "key_word": getValues("keyWordValue").join(","),
            "id_page": data?.pageListId,
        }
        try {
            const data = await EDIT_META_TAG(id, payload)
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
            const data = await DELETE_META_TAG(id);
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
            const datas = await STATUS_META_TAG(row.id)

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

    // ** Page List API
    const dropDownDatApi = async () => {
        try {
            const data = await PAGE_LIST_DROPDOWN_LIST();
            if (data.code === 200 || data.code === "200") {
                setPageListData(data.data)
            } else {
                return toast.error(data.message);
            }
        } catch (e: any) {
            toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN);
        }

        return false;
    }

    useEffect(() => {
        dropDownDatApi()
    }, [])

    // ** Edit & Delete handler

    const editOnClickHandler = (data: any) => {
        setValue("edit", data.description);
        setValue("pageName", data.title)
        setValue("pageListId", data.id_page)
        setValue("keyWordValue", data.key_word?.split(','))
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
            width: 250,
            value: 'title',
            headerName: 'name',
            field: 'title',
            text: 'text'
        },
        {
            width: 250,
            value: 'page_name',
            headerName: 'Page Name',
            field: 'page_name',
            text: 'text'
        },
        {
            width: 250,
            value: 'page_url',
            headerName: 'URL',
            field: 'page_url',
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
        reset()
        setKeyWordValue([])
    }

    const onsubmit = (data: any) => {
        if (dialogTitle === 'Add') {
            addDataApi(data)
        } else {
            editDataApi(data)
        }
    }

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='Meta Tag Settings'></CardHeader>
                    <Divider />
                    <Box>
                        <TCCTableHeader isButton value={searchFilter}
                            onChange={(e: any) => setSearchFilter(e.target.value)}
                            toggle={() => {
                                setDialogTitle('Add')
                                toggleAddDrawer()
                                clearFormData()
                            }}
                            ButtonName='Add Meta Tag'
                            infotoggle={toggleEditorDrawer}
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
                            iconTitle='Meta Tag'
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
                    title={`${dialogTitle} Meta Tag`}
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
                                name='keyWordValue'
                                control={control}
                                rules={{ required: true }}
                                render={({ field }: any) => (
                                    <MultiInput
                                        label=''
                                        placeholder='Enter keywords'
                                        value={field.value}
                                        onChange={handleKeyWordChange}
                                        error={field.value?.length === 0 && Boolean(errors.keyWordValue)}
                                    />
                                )}
                            />
                            {keyWordValue.length === 0 && errors.keyWordValue && <FormHelperText sx={{ color: 'error.main' }}>{FIELD_REQUIRED}</FormHelperText>}
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 4 }}>
                            <Controller
                                name='pageListId'
                                control={control}
                                rules={{ required: true }}
                                render={({ field }: any) => (
                                    <TccSelect
                                        fullWidth
                                        inputLabel="Select Page"
                                        label='Select Page'
                                        value={pageListId}
                                        id='controlled-select'
                                        onChange={(event: any) => setPageListId(event.target.value)}
                                        title='name'
                                        Options={pageListData}
                                        error={Boolean(errors.pageListId)}
                                        {...field}
                                    />
                                )}
                            />
                            {errors.pageListId && <FormHelperText sx={{ color: 'error.main' }}>{FIELD_REQUIRED}</FormHelperText>}
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 4 }}>
                            <Controller
                                name='edit'
                                control={control}
                                rules={{ required: true }}
                                render={({ field }: any) => (
                                    <TccInput
                                        fullWidth
                                        value={description}
                                        rows={4}
                                        multiline
                                        label='Description'
                                        onChange={(e: any) => setDescription(e.target.value)}
                                        error={Boolean(errors.edit)}
                                        {...field}
                                    />
                                )}
                            />
                            {errors.edit && <FormHelperText sx={{ color: 'error.main' }}>{FIELD_REQUIRED}</FormHelperText>}
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
            </Drawer >
            <DeleteDataModel showModel={showModel} toggle={(show: any) => setShowModel(show)}
                onClick={deleteBrandDataApi}
            />

        </Grid >
    )
}


export default MetaDataSetting