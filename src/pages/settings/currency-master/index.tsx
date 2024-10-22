// ** MUI Imports
import { Icon } from "@iconify/react";
import { CardContent, Divider, CardHeader, Grid, Card, Drawer, Typography, IconButton, Button, FormControl, TextField, FormHelperText } from '@mui/material'
import { useEffect, useState } from 'react'
import TCCTableHeader from 'src/customComponents/data-table/header'
import TccDataTable from 'src/customComponents/data-table/table'
import Box, { BoxProps } from '@mui/material/Box'
import DrawerHeader from 'src/customComponents/components/drawer-header'
import { toast } from 'react-hot-toast'
import { FIELD_REQUIRED, SEARCH_DELAY_TIME, appErrors } from 'src/AppConstants'
import { CURRENCY_ADD, CURRENCY_DELETE, CURRENCY_EDIT, CURRENCY_GET_ALL, CURRENCY_STATUS, DEFAULT_CURRENCY_STATUS } from 'src/services/AdminServices'
import { ICommonPagination } from "src/data/interface";
import { createPagination } from "src/utils/sharedFunction";
import { Controller, useForm } from "react-hook-form";
import DeleteDataModel from "src/customComponents/delete-model";

const CurrencyMaster = () => {

  let timer: any;
  const [searchFilter, setSearchFilter] = useState()
  const [drawerAction, setDrawerAction] = useState(false)
  const [editorDrawerAction, setEditorDrawerAction] = useState(false)
  const [currencyName, setCurrencyName] = useState("")
  const [rate, setRate] = useState("")
  const [id, setId] = useState('')
  const [pagination, setPagination] = useState({ ...createPagination(), search_text: "" })
  const [result, setResult] = useState([])
  const [showModel, setShowModel] = useState(false);
  const [dialogTitle, setDialogTitle] = useState<'Add' | 'Edit'>('Add')

  const toggleAddUserDrawer = () => setDrawerAction(!drawerAction)
  const toggleEditorDrawer = () => setEditorDrawerAction(!editorDrawerAction)

  const defaultValues = {
    currencyName: currencyName,
    rate: rate,
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
    setValue("currencyName", data.currency)
    setValue("rate", data.rate)
    setDialogTitle('Edit');
    toggleAddUserDrawer();
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
      name: data.currencyName,
      rate: data.rate,
    };
    try {
      const data = await CURRENCY_ADD(payload);
      if (data.code === 200 || data.code === "200") {
        toggleAddUserDrawer()
        clearFormDataHandler()
        getAllApi(pagination)
        return toast.success(data.message)

      } else {
        return toast.error(data.message);
      }
    } catch (e: any) {
      toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN);
    }

    return false;

  }

  /////////////////////// GET API ///////////////////////

  const getAllApi = async (mbPagination: ICommonPagination) => {
    try {
      const data = await CURRENCY_GET_ALL(mbPagination);
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

  const handleChangePerPageRows = (perPageRows: number) => {
    getAllApi({ ...pagination, per_page_rows: perPageRows })
  }

  const handleOnPageChange = (page: number) => {
    getAllApi({ ...pagination, current_page: page + 1 })
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
      "name": data.currencyName,
      "rate": data.rate,
    };
    try {
      const data = await CURRENCY_EDIT(id, payload);
      if (data.code === 200 || data.code === "200") {
        toggleAddUserDrawer();
        clearFormDataHandler()
        getAllApi(pagination);
        return toast.success(data.message);
      } else {
        return toast.error(data.message);
      }
    } catch (e: any) {
      toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN);
    }

    return false;
  }

  /////////////////////// DELETE  API ///////////////////////

  const toggleModel = (showdata: any) => {
    setShowModel(showdata)
  }

  const deleteApi = async () => {

    try {
      const data = await CURRENCY_DELETE(id);
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
      const data = await CURRENCY_STATUS(row.id);
      if (data.code === 200 || data.code === "200") {
        getAllApi(pagination);
        return toast.success(data.message);
      } else {
        return toast.error(data.message);
      }
    } catch (e: any) {
      toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN);
    }

    return false;
  }
  //////////////////// DEFAULT STATUS API ///////////////////////

  const defaultCurrencyApi = async (checked: boolean, row: any) => {
    try {
      const data = await DEFAULT_CURRENCY_STATUS(row.id);
      if (data.code === 200 || data.code === "200") {
        getAllApi(pagination)
        return toast.success(data.message);
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
      value: 'currency',
      headerName: 'Currency name',
      field: 'currency',
      text: 'text1'
    },
    {
      flex: 1,
      value: 'rate',
      headerName: 'Rate',
      field: 'rate',
      text: 'text1'
    },
    {
      flex: 1,
      value: 'is_active',
      headerName: 'status',
      field: 'is_active',
      switch: 'switch',
      SwitchonChange: statusApi
    },
    {
      flex: 1,
      value: 'is_default',
      headerName: 'Default currency',
      field: 'is_default',
      switch: 'switch',
      SwitchonChange: defaultCurrencyApi
    },
    {
      flex: 1,
      headerName: 'Action',
      field: 'action',
      edit: "edit",
      deleted: 'deleted',
      editOnClick: editOnClickHandler,
      deletedOnClick: deleteOnClickHandler
    },
  ]

  const onSubmit = (data: any) => {
    if (dialogTitle === 'Add') {
      addApi(data)
    } else {
      editApi(data)
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Currency Master'></CardHeader>
          <Divider />
          <TCCTableHeader isButton value={searchFilter}
            onChange={(e: any) => setSearchFilter(e.target.value)}
            toggle={() => {
              setDialogTitle('Add')
              toggleAddUserDrawer()
              clearFormDataHandler()
            }}
            ButtonName='Add New Currency'
          />
          <TccDataTable
            column={column}
            rows={result}
            handleSortChanges={handleChangeSortBy}
            pageSize={parseInt(pagination.per_page_rows.toString())}
            onChangepage={handleChangePerPageRows}
            rowCount={pagination.total_items}
            page={pagination.current_page - 1}
            onPageChange={handleOnPageChange}
            iconTitle='Currency'
          />
        </Card>
      </Grid>
      <Drawer
        open={drawerAction}
        anchor='right'
        variant='temporary'
        onClose={toggleAddUserDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
      >
        <DrawerHeader
          title={`${dialogTitle} Currency`}
          onClick={() => {
            clearFormDataHandler()
            toggleAddUserDrawer()
          }}
          tabBar
        />

        <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='currencyName'
                control={control}
                rules={{ required: true }}
                render={({ field }: any) => (
                  <TextField
                    autoFocus
                    size='small'
                    value={currencyName}
                    label='Currency Name'
                    onChange={(e: any) => setCurrencyName(e.target.value)}
                    error={Boolean(errors.currencyName)}
                    {...field}
                  />
                )}
              />
              {errors.currencyName && <FormHelperText sx={{ color: 'error.main' }}>{FIELD_REQUIRED}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='rate'
                control={control}
                rules={{ required: true }}
                render={({ field }: any) => (
                  <TextField
                    autoFocus
                    size='small'
                    value={rate}
                    label='Rate'
                    onChange={(e: any) => setRate(e.target.value)}
                    error={Boolean(errors.rate)}
                    {...field}
                  />
                )}
              />
              {errors.rate && <FormHelperText sx={{ color: 'error.main' }}>{FIELD_REQUIRED}</FormHelperText>}
            </FormControl>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
              <Button variant='contained' sx={{ mr: 3 }} type="submit">
                {dialogTitle === 'Add' ? "SUBMIT" : "EDIT"}
              </Button>
              <Button variant='outlined' color='secondary' onClick={toggleAddUserDrawer}>
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

export default CurrencyMaster