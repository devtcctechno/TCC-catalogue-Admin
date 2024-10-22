// ** MUI Imports
import { CardContent, Divider, CardHeader, Grid, Card, Drawer, Typography, IconButton, Button, FormControl, TextField, FormHelperText } from '@mui/material'
import { useEffect, useState } from 'react'
import TCCTableHeader from 'src/customComponents/data-table/header'
import TccDataTable from 'src/customComponents/data-table/table'
import Box, { BoxProps } from '@mui/material/Box'
import TccEditor from 'src/customComponents/Form-Elements/editor'
import DrawerHeader from 'src/customComponents/components/drawer-header'
import { toast } from 'react-hot-toast'
import { appErrors, SEARCH_DELAY_TIME, FIELD_REQUIRED } from 'src/AppConstants'
import { createPagination } from 'src/utils/sharedFunction'
import { ICommonPagination } from 'src/data/interface'
import { ADD_COLLECTION, DELETE_COLLECTION, EDIT_COLLECTION, GET_ALL_COLLECTION, STATUS_UPDATE_COLLECTION } from 'src/services/AdminServices'
import DeleteDataModel from 'src/customComponents/delete-model'
import { Controller, useForm } from 'react-hook-form'
import InfoSection from 'src/@core/components/common/info-drawer/info-drawer'
import { Info_Key } from 'src/data/enum'

const CollectionComponent = () => {

    let timer: any;
    const [searchFilter, setSearchFilter] = useState('')
    const [showModel, setShowModel] = useState(false)
    const [drawerAction, setDrawerAction] = useState(false);
    const [editorDrawerAction, setEditorDrawerAction] = useState(false);
    const [name, setName] = useState("");
    const [collectionId, setCollectionId] = useState("")
    const [dialogTitle, setDialogTitle] = useState<'Add' | 'Edit'>('Add')
    const [colorData, setColorData] = useState([]);
    const [pagination, setPagination] = useState({ ...createPagination(), search_text: "" });
    const [editerData, setEditerData] = useState("")
    const [edit, setEdit] = useState<String>('<p></p>')
    const [called, setCalled] = useState(true)
    const toggleAddDrawer = () => setDrawerAction(!drawerAction);

    const toggleEditorDrawer = () => setEditorDrawerAction(!editorDrawerAction)

    const defaultValues = {
        name: name,
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

    const clearFormData = () => {
        reset()
    }

    const editOnClickHandler = (data: any) => {
        setValue("name", data.name)
        setCollectionId(data.id)
        setDialogTitle('Edit')
        toggleAddDrawer()
    }
    const deleteOnclickHandler = (data: any) => {
        setCollectionId(data.id)
        setShowModel(!showModel)
    }

    /////////////////// GET API ///////////////////

    const getAllCollectionDataApi = async (mbPagination: ICommonPagination) => {
        try {
            const data = await GET_ALL_COLLECTION(mbPagination);
            if (data.code === 200 || data.code === "200") {

                setColorData(data.data.result);
                setPagination(data.data.pagination)

            } else {
                return toast.error(data.message);
            }
        } catch (e: any) {
            toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN)
        }
    }

    useEffect(() => {
        getAllCollectionDataApi(pagination);
    }, []);

    const handleChangePerPageRows = (perPageRows: any) => {
        getAllCollectionDataApi({ ...pagination, per_page_rows: perPageRows.pageSize, current_page: perPageRows.page + 1 })
    }

    const handleChangeSortBy = (orderSort: any) => {
        getAllCollectionDataApi({ ...pagination, sort_by: orderSort == undefined ? "id" : orderSort.map((t: any) => t.field), order_by: orderSort == undefined ? "DESC" : orderSort.map((t: any) => t.sort) })
    }
    const searchBusinessUser = async () => {
        if (timer) {
            clearTimeout(timer);
        }

        timer = setTimeout(() => {
            getAllCollectionDataApi({ ...pagination, current_page: 1, search_text: searchFilter });
        }, SEARCH_DELAY_TIME);
    }

    useEffect(() => {
        searchBusinessUser();
    }, [searchFilter]);

    /////////////////// ADD API ///////////////////

    const addCollectionApi = async (data: any) => {
        const payload = {
            "name": data.name,
        }
        try {
            const data = await ADD_COLLECTION(payload)
            if (data.code === 200 || data.code === "200") {

                toggleAddDrawer();
                clearFormData();
                toast.success(data.message)
                getAllCollectionDataApi(pagination)

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

    /////////////////// EDIT API /////////////////// 

    const editCollectionDataApi = async (data: any) => {

        const payload = {
            "name": data.name,
        }
        try {
            const data = await EDIT_COLLECTION(collectionId, payload)
            if (data.code === 200 || data.code === "200") {

                toggleAddDrawer();
                clearFormData();
                toast.success(data.message)
                getAllCollectionDataApi(pagination)
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

    /////////////////// DELETE API /////////////////// 

    const deleteCollectionDataApi = async () => {

        try {
            const data = await DELETE_COLLECTION(collectionId);
            if (data.code === 200 || data.code === "200") {
                toast.success(data.message);
                setShowModel(!showModel)
                getAllCollectionDataApi(pagination)
            } else {
                return toast.error(data.message)
            }
        } catch (error) {

        }
    }

    /////////////////// STATUS API /////////////////// 

    const activeStatusDataApi = async (checked: boolean, row: any) => {
        try {
            const datas = await STATUS_UPDATE_COLLECTION(row.id)

            if (datas.code === 200 || datas.code === "200") {
                toast.success("Successfully updated")
                getAllCollectionDataApi(pagination)

                return true
            } else {
                return toast.error(datas.message)
            }
        } catch (error) {

            return toast.error(appErrors.UNKNOWN_ERROR_TRY_AGAIN)
        }
    }

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
            value: 'slug',
            headerName: 'slug',
            field: 'slug',
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

    const onsubmit = (data: any) => {
        if (dialogTitle === 'Add') {
            addCollectionApi(data)
        } else {
            editCollectionDataApi(data)
        }
    }

    const onInfoSubmit = (data: any) => {
        toggleEditorDrawer()
    }

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='Collection'></CardHeader>
                    <Divider />
                    <Box>
                        <TCCTableHeader isButton value={searchFilter}
                            onChange={(e: any) => setSearchFilter(e.target.value)}
                            toggle={() => {
                                setDialogTitle('Add')
                                toggleAddDrawer()
                                clearFormData()
                            }}
                            ButtonName='Add Collection'
                            infoButton
                            infotoggle={toggleEditorDrawer}
                        />

                    </Box>
                    <Box sx={{ width: "100%" }}>
                        <TccDataTable
                            column={column}
                            rows={colorData}
                            handleSortChanges={handleChangeSortBy}
                            pageSize={parseInt(pagination.per_page_rows.toString())}
                            rowCount={pagination.total_items}
                            page={pagination.current_page - 1}
                            onPageChange={handleChangePerPageRows}
                            iconTitle='Collection'
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
                    title={`${dialogTitle} Collection`}
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
                                name='name'
                                control={control}
                                rules={{ required: true }}
                                render={({ field }: any) => (
                                    <TextField
                                        autoFocus
                                        size='small'
                                        value={name}
                                        label='Name'
                                        onChange={(e) => setName(e.target.value)}
                                        error={Boolean(errors.name)}
                                        {...field}
                                    />
                                )}
                            />
                            {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{FIELD_REQUIRED}</FormHelperText>}
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

            <InfoSection
                onsubmit={onInfoSubmit}
                info_key={Info_Key.Collection}
                drawerTitle="Collection Info"
                drawerToggle={() => toggleEditorDrawer()}
                drawerACtion={editorDrawerAction} />
            <DeleteDataModel showModel={showModel} toggle={(show: any) => setShowModel(show)}
                onClick={deleteCollectionDataApi}
            />

        </Grid>
    )
}


export default CollectionComponent