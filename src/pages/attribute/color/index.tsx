// ** MUI Imports
import { Divider, CardHeader, Grid, Card, Drawer, Button, FormControl, TextField, FormHelperText } from '@mui/material'
import { useEffect, useState } from 'react'
import TCCTableHeader from 'src/customComponents/data-table/header'
import TccDataTable from 'src/customComponents/data-table/table'
import Box from '@mui/material/Box'
import DrawerHeader from 'src/customComponents/components/drawer-header'
import { toast } from 'react-hot-toast'
import { appErrors, SEARCH_DELAY_TIME, FIELD_REQUIRED, DEFAULT_STATUS_CODE_SUCCESS } from 'src/AppConstants'
import { createPagination } from 'src/utils/sharedFunction'
import { ICommonPagination } from 'src/data/interface'
import { ADD_COLOR, ADD_INFO, DELETE_COLOR, EDIT_COLOR, GET_ALL_COLOR, GET_INFO, STATUS_UPDATE_COLOR } from 'src/services/AdminServices'
import DeleteDataModel from 'src/customComponents/delete-model'
import { Controller, useForm } from 'react-hook-form'
import InfoSection from 'src/@core/components/common/info-drawer/info-drawer'
import { Info_Key } from 'src/data/enum'

const Color = () => {

  let timer: any;
  const [searchFilter, setSearchFilter] = useState('')
  const [showModel, setShowModel] = useState(false)
  const [drawerAction, setDrawerAction] = useState(false);
  const [editorDrawerAction, setEditorDrawerAction] = useState(false);
  const [colorName, setColorName] = useState("");
  const [colorId, setColorId] = useState("")
  const [dialogTitle, setDialogTitle] = useState<'Add' | 'Edit'>('Add')
  const [colorData, setColorData] = useState([]);
  const [pagination, setPagination] = useState({ ...createPagination(), search_text: "" });
  const toggleAddColorDrawer = () => setDrawerAction(!drawerAction);

  const toggleEditorDrawer = () => setEditorDrawerAction(!editorDrawerAction)

  const defaultValues = {
    colorName: colorName,
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
    getAllColorDataApi(pagination);
  }, []);

  const clearFormData = () => {
    reset()
  }

  const editOnClickHandler = (data: any) => {
    setValue("colorName", data.name)
    setColorId(data.id)
    setDialogTitle('Edit')
    toggleAddColorDrawer()
  }
  const deleteOnclickHandler = (data: any) => {
    setColorId(data.id)
    setShowModel(!showModel)
  }

  /////////////////// GET API ///////////////////
  const getAllColorDataApi = async (mbPagination: ICommonPagination) => {
    try {
      const data = await GET_ALL_COLOR(mbPagination);
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

  const handleChangePerPageRows = (perPageRows: any) => {
    getAllColorDataApi({ ...pagination, per_page_rows: perPageRows.pageSize, current_page: perPageRows.page + 1 })
  }

  const handleOnPageChange = (page: number) => {
    getAllColorDataApi({ ...pagination, current_page: page + 1 })
  }

  const handleChangeSortBy = (orderSort: any) => {
    getAllColorDataApi({ ...pagination, sort_by: orderSort == undefined ? "id" : orderSort.map((t: any) => t.field), order_by: orderSort == undefined ? "DESC" : orderSort.map((t: any) => t.sort) })
  }
  const searchBusinessUser = async () => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      getAllColorDataApi({ ...pagination, current_page: 1, search_text: searchFilter });
    }, SEARCH_DELAY_TIME);
  }

  /////////////////// ADD API ///////////////////

  const addColorApi = async (data: any) => {
    const payload = {
      "name": data.colorName,
    }
    try {
      const data = await ADD_COLOR(payload)
      if (data.code === 200 || data.code === "200") {

        toggleAddColorDrawer();
        clearFormData();
        toast.success(data.message)
        getAllColorDataApi(pagination)

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
  const editColorDataApi = async (data: any) => {
    const payload = {
      "name": data.colorName,
    }
    try {
      const data = await EDIT_COLOR(colorId, payload)
      if (data.code === 200 || data.code === "200") {

        toggleAddColorDrawer();
        clearFormData();
        toast.success(data.message)
        getAllColorDataApi(pagination)
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

  const deleteColorDataApi = async () => {
    try {
      const data = await DELETE_COLOR(colorId);
      if (data.code === 200 || data.code === "200") {
        toast.success(data.message);
        setShowModel(!showModel)
        getAllColorDataApi(pagination)
      } else {
        return toast.error(data.message)
      }
    } catch (error) {

    }
  }

  /////////////////// STATUS API /////////////////// 

  const activeStatusDataApi = async (checked: boolean, row: any) => {
    try {
      const datas = await STATUS_UPDATE_COLOR(row.id)

      if (datas.code === 200 || datas.code === "200") {
        toast.success("Successfully updated")
        getAllColorDataApi(pagination)

        return true
      } else {
        return toast.error(datas.message)
      }
    } catch (error) {

      return toast.error(appErrors.UNKNOWN_ERROR_TRY_AGAIN)
    }
  }

  const onsubmit = (data: any) => {
    if (dialogTitle === 'Add') {
      addColorApi(data)
    } else {
      editColorDataApi(data)
    }
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
      headerName: 'slug',
      field: 'slug',
      text: 'text'
    },
    {
      flex: 1,
      headerName: 'status',
      field: 'is_active',
      switch: 'switch',
      value: 'is_active',
      SwitchonChange: activeStatusDataApi
    },
    {
      flex: 1,
      headerName: 'Action',
      field: 'action',
      edit: "edit",
      deleted: 'deleted',
      editOnClick: editOnClickHandler,
      deletedOnClick: deleteOnclickHandler
    },
  ]
  const onInfoSubmit = (data: any) => {
    toggleEditorDrawer()
  }
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Color'></CardHeader>
          <Divider />
          <Box>
            <TCCTableHeader isButton value={searchFilter}
              onChange={(e: any) => setSearchFilter(e.target.value)}
              toggle={() => {
                setDialogTitle('Add')
                toggleAddColorDrawer()
                clearFormData()
              }}
              ButtonName='Add Color'
              infoButton
              infotoggle={() => {
                toggleEditorDrawer()
              }}
            />

          </Box>
          <TccDataTable
            column={column}
            rows={colorData}
            handleSortChanges={handleChangeSortBy}
            pageSize={parseInt(pagination.per_page_rows.toString())}
            onChangepage={handleOnPageChange}
            rowCount={pagination.total_items}
            page={pagination.current_page - 1}
            onPageChange={handleChangePerPageRows}
            iconTitle='Color'
          />
        </Card>
      </Grid>
      <Drawer
        open={drawerAction}
        anchor='right'
        variant='temporary'
        onClose={toggleAddColorDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
      >

        <DrawerHeader
          title={`${dialogTitle} Color`}
          onClick={() => {
            toggleAddColorDrawer()
            clearFormData()
          }}
          tabBar
        />
        <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
          <form onSubmit={handleSubmit(onsubmit)}>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='colorName'
                control={control}
                rules={{ required: true }}
                render={({ field }: any) => (
                  <TextField
                    autoFocus
                    size='small'
                    value={colorName}
                    label='Color Name'
                    onChange={(e) => setColorName(e.target.value)}
                    error={Boolean(errors.colorName)}
                    {...field}
                  />
                )}
              />
              {errors.colorName && <FormHelperText sx={{ color: 'error.main' }}>{FIELD_REQUIRED}</FormHelperText>}
            </FormControl>

            <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
              <Button variant='contained' sx={{ mr: 3 }} type="submit">
                {dialogTitle === 'Add' ? "SUBMIT" : "EDIT"}
              </Button>
              <Button variant='outlined' color='secondary' onClick={() => {
                toggleAddColorDrawer()
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
        info_key={Info_Key.Color}
        drawerTitle="Color Info"
        drawerToggle={() => toggleEditorDrawer()}
        drawerACtion={editorDrawerAction} />
      <DeleteDataModel showModel={showModel} toggle={(show: any) => setShowModel(show)} onClick={deleteColorDataApi} />

    </Grid>
  )
}


export default Color