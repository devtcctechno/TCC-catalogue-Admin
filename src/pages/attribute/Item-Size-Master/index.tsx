// ** MUI Imports
import { Divider, CardHeader, Grid, Card, Drawer, Button, FormControl, TextField, FormHelperText } from '@mui/material'
import { useEffect, useState } from 'react'
import TCCTableHeader from 'src/customComponents/data-table/header'
import TccDataTable from 'src/customComponents/data-table/table'
import Box from '@mui/material/Box'
import DrawerHeader from 'src/customComponents/components/drawer-header'
import { ITEM_SIZE_ADD, ITEM_SIZE_DELETE, ITEM_SIZE_EDIT, ITEM_SIZE_GET_ALL, ITEM_SIZE_STATUS } from 'src/services/AdminServices'
import { toast } from 'react-hot-toast'
import { appErrors, FIELD_REQUIRED, SEARCH_DELAY_TIME } from 'src/AppConstants'
import { ICommonPagination } from 'src/data/interface'
import { createPagination } from 'src/utils/sharedFunction'
import { Controller, useForm } from 'react-hook-form'
import DeleteDataModel from 'src/customComponents/delete-model'
import InfoSection from 'src/@core/components/common/info-drawer/info-drawer'
import { Info_Key } from 'src/data/enum'

const Item_Size_Master = () => {

    let timer: any;
    const [searchFilter, setSearchFilter] = useState()
    const [drawerAction, setDrawerAction] = useState(false)
    const [itemSizeValue, setItemSizeValue] = useState('')
    const [id, setId] = useState();
    const [pagination, setPagination] = useState({ ...createPagination(), search_text: "" })
    const [result, setResult] = useState([])
    const [dialogTitle, setDialogTitle] = useState<'Add' | 'Edit'>('Add')
    const [showModel, setShowModel] = useState(false);
    const [editorDrawerAction, setEditorDrawerAction] = useState(false)
    const toggleAddItemSizeDrawer = () => setDrawerAction(!drawerAction)
    const toggleEditorDrawer = () => setEditorDrawerAction(!editorDrawerAction)
    const defaultValues = {
        itemSizeValue: itemSizeValue,
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


    const editOnClickHandler = async (data: any) => {
        setValue("itemSizeValue", data.size)
        setDialogTitle('Edit');
        toggleAddItemSizeDrawer();
        setId(data.id);
    }

    const deleteOnClickHandler = async (data: any) => {
        setId(data.id)
        setShowModel(!showModel)
    }

    const clearFormDataHandler = () => {
        reset()
    }

    /////////////////////// ADD API ///////////////////////

    const addApi = async (data: any) => {
        const payload = {
            "value": data.itemSizeValue,
        };
        try {
            const data = await ITEM_SIZE_ADD(payload);
            if (data.code === 200 || data.code === "200") {
                toggleAddItemSizeDrawer();
                toast.success(data.message);
                getAllApi(pagination);
                clearFormDataHandler();

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

    /////////////////////// GET API ///////////////////////
    const getAllApi = async (mbPagination: ICommonPagination) => {
        try {
            const data = await ITEM_SIZE_GET_ALL(mbPagination);
            if (data.code === 200 || data.code === "200") {
                setPagination(data.data.pagination)
                setResult(data.data.result)
            } else {
                return toast.error(data.message);
            }
        } catch (e: any) {
            toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN);
        }

        return false;
    }
    useEffect(() => {
        getAllApi(pagination);
    }, []);

    const handleChangePerPageRows = (perPageRows: any) => {
        getAllApi({ ...pagination, per_page_rows: perPageRows.pageSize, current_page: perPageRows.page + 1 })
    }

    const handleChangeSortBy = (orderSort: any) => {
        getAllApi({ ...pagination, sort_by: orderSort == undefined ? "id" : orderSort.map((t: any) => t.field), order_by: orderSort == undefined ? "DESC" : orderSort.map((t: any) => t.sort) })
    }

    const searchBusinessUser = async () => {
        if (timer) {
            clearTimeout(timer);
        }

        timer = setTimeout(() => {
            getAllApi({ ...pagination, current_page: 1, search_text: searchFilter });
        }, SEARCH_DELAY_TIME);
    }

    useEffect(() => {
        searchBusinessUser();
    }, [searchFilter]);


    /////////////////////// EDIT API ///////////////////////

    const editApi = async (data: any) => {
        const payload = {
            "value": data.itemSizeValue,
        };
        try {
            const data = await ITEM_SIZE_EDIT(id, payload);
            if (data.code === 200 || data.code === "200") {
                toast.success(data.message);
                toggleAddItemSizeDrawer();
                clearFormDataHandler();
                getAllApi(pagination);
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

    /////////////////////// DELETE  API ///////////////////////

    const toggleModel = (showdata: any) => {
        setShowModel(showdata)
    }

    const deleteApi = async () => {
        try {
            const data = await ITEM_SIZE_DELETE(id);
            if (data.code === 200 || data.code === "200") {
                toast.success(data.message);
                setShowModel(!showModel);
                getAllApi(pagination);

            } else {
                return toast.error(data.message);
            }
        } catch (e: any) {
            toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN);
        }

        return false;
    }

    //////////////////// STATUS API ///////////////////////

    const statusApi = async (checked: boolean, row: any) => {
        try {
            const data = await ITEM_SIZE_STATUS(row.id);
            if (data.code === 200 || data.code === "200") {
                toast.success(data.message);
                getAllApi(pagination);
            } else {
                return toast.error(data.message);
            }
        } catch (e: any) {
            toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN);
        }

        return false;
    }


    const column = [
        {
            flex: 1,
            value: 'size',
            headerName: 'Item Value',
            field: 'size',
            text: 'text'
        },
        {
            flex: 1,
            value: 'slug',
            headerName: 'Slug',
            field: 'slug',
            text: 'text'
        },
        {
            flex: 1,
            headerName: 'status',
            field: 'is_active',
            switch: 'switch',
            SwitchonChange: statusApi,
            value: 'is_active'

        },
        {
            flex: 1,
            headerName: 'Action',
            field: 'action',
            edit: "edit",
            editOnClick: editOnClickHandler,
            deletedOnClick: deleteOnClickHandler,
            deleted: 'deleted',
        },
    ]

    const onSubmit = (data: any) => {
        if (dialogTitle === 'Add') {
            addApi(data)
        } else {
            editApi(data)
        }
    }

    const onInfoSubmit = (data: any) => {
        toggleEditorDrawer()
    }

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='Item Size'></CardHeader>
                    <Divider />
                    <Box>
                        <TCCTableHeader isButton value={searchFilter}
                            onChange={(e: any) => setSearchFilter(e.target.value)}
                            toggle={() => {
                                setDialogTitle('Add')
                                toggleAddItemSizeDrawer()
                                clearFormDataHandler()
                            }}
                            ButtonName='Add Item Size'
                            infoButton
                            infotoggle={() => {
                                toggleEditorDrawer()
                            }}
                        />

                    </Box>
                    <TccDataTable
                        column={column}
                        rows={result}
                        handleSortChanges={handleChangeSortBy}
                        pageSize={parseInt(pagination.per_page_rows.toString())}
                        rowCount={pagination.total_items}
                        page={pagination.current_page - 1}
                        onPageChange={handleChangePerPageRows}
                        iconTitle='Item Size'
                    />
                </Card>
            </Grid>
            <Drawer
                open={drawerAction}
                anchor='right'
                variant='temporary'
                onClose={toggleAddItemSizeDrawer}
                ModalProps={{ keepMounted: true }}
                sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
            >
                <DrawerHeader
                    title={`${dialogTitle} Item Size`}
                    onClick={() => {
                        clearFormDataHandler()
                        toggleAddItemSizeDrawer()
                    }}
                    tabBar
                />

                <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FormControl fullWidth sx={{ mb: 4 }}>
                            <Controller
                                name='itemSizeValue'
                                control={control}
                                rules={{ required: true }}
                                render={({ field }: any) => (
                                    <TextField
                                        autoFocus
                                        size='small'
                                        value={itemSizeValue}
                                        label='Item Value'
                                        onChange={(e) => setItemSizeValue(e.target.value)}
                                        error={Boolean(errors.itemSizeValue)}
                                        {...field}
                                    />
                                )}
                            />
                            {errors.itemSizeValue && <FormHelperText sx={{ color: 'error.main' }}>{FIELD_REQUIRED}</FormHelperText>}
                        </FormControl>

                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
                            <Button variant='contained' sx={{ mr: 3 }} type="submit">
                                {dialogTitle === 'Add' ? "SUBMIT" : "EDIT"}
                            </Button>
                            <Button variant='outlined' color='secondary' onClick={toggleAddItemSizeDrawer}>
                                Cancel
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Drawer>
            <InfoSection
                onsubmit={onInfoSubmit}
                info_key={Info_Key.Item_Size}
                drawerTitle="Item Size Info"
                drawerToggle={() => toggleEditorDrawer()}
                drawerACtion={editorDrawerAction} />
            <DeleteDataModel showModel={showModel} toggle={toggleModel} onClick={deleteApi} />

        </Grid>
    )
}

export default Item_Size_Master