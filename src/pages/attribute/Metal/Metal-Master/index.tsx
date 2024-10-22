// ** MUI Imports
import { Divider, CardHeader, Grid, Card, Drawer, Button, FormControl, TextField, FormHelperText, Switch, FormControlLabel } from '@mui/material'
import { useEffect, useState } from 'react'
import TCCTableHeader from 'src/customComponents/data-table/header'
import TccDataTable from 'src/customComponents/data-table/table'
import Box from '@mui/material/Box'
import DrawerHeader from 'src/customComponents/components/drawer-header'
import { Controller, useForm } from 'react-hook-form'
import { appErrors, FIELD_REQUIRED, SEARCH_DELAY_TIME } from 'src/AppConstants'
import { METAL_MASTER_ADD, METAL_MASTER_DELETE, METAL_MASTER_EDIT, METAL_MASTER_GET_ALL, METAL_MASTER_STATUS } from 'src/services/AdminServices'
import { toast } from 'react-hot-toast'
import { ICommonPagination } from 'src/data/interface'
import { createPagination } from 'src/utils/sharedFunction'
import DeleteDataModel from 'src/customComponents/delete-model'

const Metalmaster = () => {

    // ---- State ----
    let timer: any;
    const [searchFilter, setSearchFilter] = useState()
    const [drawerAction, setDrawerAction] = useState(false)
    const [metalMasterName, setMetalMasterName] = useState('')
    const [dialogTitle, setDialogTitle] = useState<'Add' | 'Edit'>('Add')
    const [pagination, setPagination] = useState({ ...createPagination(), search_text: "" })
    const [result, setResult] = useState([])
    const [metalMasterId, setMetalMasterId] = useState();
    const [showModel, setShowModel] = useState(false);

    const toggleAddMetalMasterDrawer = () => setDrawerAction(!drawerAction)

    const defaultValues = {
        metalMasterName: metalMasterName,
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
        setValue("metalMasterName", data.name)
        setDialogTitle('Edit');
        toggleAddMetalMasterDrawer();
        setMetalMasterId(data.id);
    }

    const clearFormDataHandler = () => {
        reset()
    }

    /////////////////////// ADD API ///////////////////////

    const addApi = async (data: any) => {

        const payload = {
            "name": data.metalMasterName,
        };
        try {
            const data = await METAL_MASTER_ADD(payload);
            if (data.code === 200 || data.code === "200") {
                toggleAddMetalMasterDrawer();
                toast.success(data.message);
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

    /////////////////////// GET API ///////////////////////

    const getAllApi = async (mbPagination: ICommonPagination) => {
        try {
            const data = await METAL_MASTER_GET_ALL(mbPagination);
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
        getAllApi({ ...pagination, per_page_rows: perPageRows.pageSize, current_page: perPageRows.page + 1, })
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
            "name": data.metalMasterName,
        };
        try {
            const data = await METAL_MASTER_EDIT(metalMasterId, payload);
            if (data.code === 200 || data.code === "200") {
                toast.success(data.message);
                toggleAddMetalMasterDrawer();
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
            const data = await METAL_MASTER_DELETE(metalMasterId);
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
            const data = await METAL_MASTER_STATUS(row.id);
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
            width: 200,
            value: 'name',
            headerName: 'Metal Name',
            field: 'name',
            text: 'text'
        },
        {
            width: 200,
            value: 'slug',
            headerName: 'Slug',
            field: 'slug',
            text: 'text'
        },
        {
            width: 150,
            headerName: 'status',
            field: 'is_active',
            switch: 'switch',
            SwitchonChange: statusApi,
            value: 'is_active'

        },
    ]

    const onsubmit = (data: any) => {
        if (dialogTitle === "Add") {
            addApi(data)
        } else {
            editApi(data)
        }
    }

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='Metal Master'></CardHeader>
                    <Divider />
                    <Box>
                        <TCCTableHeader value={searchFilter}
                            onChange={(e: any) => setSearchFilter(e.target.value)}
                        />

                    </Box>
                    <Box sx={{ width: '100%' }}>
                        <TccDataTable
                            column={column}
                            rows={result}
                            handleSortChanges={handleChangeSortBy}
                            pageSize={parseInt(pagination.per_page_rows.toString())}
                            rowCount={pagination.total_items}
                            page={pagination.current_page - 1}
                            onPageChange={handleChangePerPageRows}
                            iconTitle='Metal Master'
                        />
                    </Box>
                </Card>
            </Grid>
            <Drawer
                open={drawerAction}
                anchor='right'
                variant='temporary'
                onClose={toggleAddMetalMasterDrawer}
                ModalProps={{ keepMounted: true }}
                sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
            >
                <DrawerHeader
                    title={`${dialogTitle} Metal Master`}
                    onClick={() => {
                        clearFormDataHandler();
                        toggleAddMetalMasterDrawer();
                    }}
                    tabBar
                />

                <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
                    <form onSubmit={handleSubmit(onsubmit)}>
                        <FormControl fullWidth sx={{ mb: 4 }}>
                            <Controller
                                name='metalMasterName'
                                control={control}
                                rules={{ required: true }}
                                render={({ field }: any) => (
                                    <TextField
                                        autoFocus
                                        size='small'
                                        disabled={dialogTitle === 'Edit' ? true : false}
                                        value={metalMasterName}
                                        label='Metal Name'
                                        onChange={(e) => setMetalMasterName(e.target.value)}
                                        error={Boolean(errors.metalMasterName)}
                                        {...field}
                                    />
                                )}
                            />
                            {errors.metalMasterName && <FormHelperText sx={{ color: 'error.main' }}>{FIELD_REQUIRED}</FormHelperText>}
                        </FormControl>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
                            <Button variant='contained' sx={{ mr: 3 }} type="submit">
                                {dialogTitle === 'Add' ? "SUBMIT" : "EDIT"}
                            </Button>
                            <Button variant='outlined' color='secondary' onClick={toggleAddMetalMasterDrawer}>
                                Cancel
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Drawer>
            <DeleteDataModel showModel={showModel} toggle={toggleModel} onClick={deleteApi} />

        </Grid>
    )
}

export default Metalmaster
