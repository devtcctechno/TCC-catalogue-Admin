// ** MUI Imports
import { Divider, CardHeader, Grid, Card, Drawer, Button, FormControl, TextField, FormHelperText } from '@mui/material'
import React, { useEffect, useState } from 'react'
import TCCTableHeader from 'src/customComponents/data-table/header'
import TccDataTable from 'src/customComponents/data-table/table'
import Box from '@mui/material/Box'
import DrawerHeader from 'src/customComponents/components/drawer-header'
import { CLARITY_ADD, CLARITY_DELETE, CLARITY_EDIT, CLARITY_GET_ALL, CLARITY_STATUS } from 'src/services/AdminServices'
import { toast } from 'react-hot-toast'
import { appErrors, SEARCH_DELAY_TIME, FIELD_REQUIRED } from 'src/AppConstants'
import DeleteDataModel from 'src/customComponents/delete-model'
import { createPagination } from 'src/utils/sharedFunction'
import { ICommonPagination } from 'src/data/interface'
import { Controller, useForm } from 'react-hook-form'
import InfoSection from 'src/@core/components/common/info-drawer/info-drawer'
import { Info_Key } from 'src/data/enum'

const Clarity = () => {

  let timer: any;
  const [searchFilter, setSearchFilter] = useState('')
  const [drawerAction, setDrawerAction] = useState(false)
  const [editorDrawerAction, setEditorDrawerAction] = useState(false)
  const [clarityName, setClarityName] = useState('')
  const [clarityId, setClarityId] = useState('')
  const [pagination, setPagination] = useState({ ...createPagination(), search_text: "" })
  const [result, setResult] = useState([])
  const [dialogTitle, setDialogTitle] = useState<'Add' | 'Edit'>('Add')
  const [showModel, setShowModel] = useState(false);
  const toggleAddClarityDrawer = () => setDrawerAction(!drawerAction)
  const [queryOptions, setQueryOptions] = React.useState({});
  const defaultValues = {
    clarityName: clarityName,
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


  useEffect(() => {
    searchBusinessUser();
  }, [searchFilter]);

  useEffect(() => {
    clarityGetAllApi(pagination);
  }, []);

  const toggleEditorDrawer = () => setEditorDrawerAction(!editorDrawerAction)

  const editOnClickHandler = async (data: any) => {
    setValue("clarityName", data.name)
    setDialogTitle('Edit');
    toggleAddClarityDrawer();
    setClarityId(data.id);
  }

  const deleteOnClickHandler = async (data: any) => {
    setClarityId(data.id)
    setShowModel(!showModel)
  }
  const clearFormDataHandler = () => {
    reset()
  }

  /////////////////////// ADD API ///////////////////////

  const clarityAddApi = async (data: any) => {

    const payload = {
      "name": data.clarityName,
    };
    try {
      const data = await CLARITY_ADD(payload);
      if (data.code === 200 || data.code === "200") {
        toggleAddClarityDrawer();
        toast.success(data.message);
        clearFormDataHandler();
        clarityGetAllApi(pagination);
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

  const clarityGetAllApi = async (mbPagination: ICommonPagination) => {
    try {
      const data = await CLARITY_GET_ALL(mbPagination);
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

  const handleChangePerPageRows = (perPageRows: any) => {
    clarityGetAllApi({ ...pagination, per_page_rows: perPageRows.pageSize, current_page: perPageRows.page + 1 })
  }

  const handleChangeSortBy = (orderSort: any) => {
    clarityGetAllApi({ ...pagination, sort_by: orderSort == undefined ? "id" : orderSort.map((t: any) => t.field), order_by: orderSort == undefined ? "DESC" : orderSort.map((t: any) => t.sort) })
  }

  const searchBusinessUser = async () => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      clarityGetAllApi({ ...pagination, current_page: 1, search_text: searchFilter });
    }, SEARCH_DELAY_TIME);
  }

  /////////////////////// EDIT API ///////////////////////

  const clarityEditApi = async (data: any) => {
    const payload = {
      "name": data.clarityName,
    };
    try {
      const data = await CLARITY_EDIT(clarityId, payload);
      if (data.code === 200 || data.code === "200") {
        toast.success(data.message);
        toggleAddClarityDrawer();
        clearFormDataHandler();
        clarityGetAllApi(pagination);
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

  /////////////////////// DELETE API ///////////////////////

  const toggleModel = (showdata: any) => {
    setShowModel(showdata)
  }

  const ClarityDeleteApi = async () => {
    try {
      const data = await CLARITY_DELETE(clarityId);
      if (data.code === 200 || data.code === "200") {
        toast.success(data.message);
        setShowModel(!showModel);
        clarityGetAllApi(pagination);
      } else {
        return toast.error(data.message);
      }
    } catch (e: any) {
      toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN);
    }

    return false;
  }

  //////////////////// STATUS API ///////////////////////

  const claritySatusApi = async (checked: boolean, row: any) => {
    try {
      const data = await CLARITY_STATUS(row.id);
      if (data.code === 200 || data.code === "200") {
        toast.success(data.message);
        clarityGetAllApi(pagination)

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
      value: 'name',
      headerName: 'name',
      field: 'name',
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
      value: 'is_active',
      SwitchonChange: claritySatusApi
    },
    {
      flex: 1,
      headerName: 'Action',
      field: 'action',
      edit: "edit",
      editOnClick: editOnClickHandler,
      deleted: 'deleted',
      deletedOnClick: deleteOnClickHandler,

    },
  ]

  const onsubmit = (data: any) => {
    if (dialogTitle === 'Add') {
      clarityAddApi(data)
    } else {
      clarityEditApi(data)
    }
  }

  const onInfoSubmit = (data: any) => {
    toggleEditorDrawer()
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Clarity'></CardHeader>
          <Divider />
          <Box>
            <TCCTableHeader isButton value={searchFilter}
              onChange={(e: any) => setSearchFilter(e.target.value)}
              toggle={() => {
                setDialogTitle('Add')
                toggleAddClarityDrawer()
                clearFormDataHandler()
              }}
              ButtonName='Add Clarity'
              infoButton
              infotoggle={() => {
                toggleEditorDrawer()
              }}
            />

          </Box>
          <Box sx={{ width: '100%' }}>
            <TccDataTable
              column={column}
              rows={result}
              sortingMode="server"
              handleSortChanges={handleChangeSortBy}
              pageSize={parseInt(pagination.per_page_rows.toString())}
              rowCount={pagination.total_items}
              page={pagination.current_page - 1}
              onPageChange={handleChangePerPageRows}
              iconTitle='Clarity'
            />
          </Box>

        </Card>
      </Grid>
      <Drawer
        open={drawerAction}
        anchor='right'
        variant='temporary'
        onClose={toggleAddClarityDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
      >
        <DrawerHeader
          title={`${dialogTitle} Clarity`}
          onClick={() => {
            clearFormDataHandler()
            toggleAddClarityDrawer()
          }}
          tabBar
        />

        <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
          <form onSubmit={handleSubmit(onsubmit)}>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='clarityName'
                control={control}
                rules={{ required: true }}
                render={({ field }: any) => (
                  <TextField
                    autoFocus
                    size='small'
                    value={clarityName}
                    label='Clarity Name'
                    onChange={(e) => setClarityName(e.target.value)}
                    error={Boolean(errors.clarityName)}
                    {...field}
                  />
                )}
              />
              {errors.clarityName && <FormHelperText sx={{ color: 'error.main' }}>{FIELD_REQUIRED}</FormHelperText>}
            </FormControl>

            <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
              <Button variant='contained' sx={{ mr: 3 }} type='submit' >
                {dialogTitle === 'Add' ? "SUBMIT" : "EDIT"}
              </Button>
              <Button variant='outlined' color='secondary' onClick={toggleAddClarityDrawer}>
                Cancel
              </Button>
            </Box>
          </form>
        </Box>
      </Drawer>
      <InfoSection
        onsubmit={onInfoSubmit}
        info_key={Info_Key.Clarity}
        drawerTitle="Clarity Info"
        drawerToggle={() => toggleEditorDrawer()}
        drawerACtion={editorDrawerAction} />
      <DeleteDataModel showModel={showModel} toggle={toggleModel} onClick={ClarityDeleteApi} />

    </Grid>
  )
}

export default Clarity