// ** MUI Imports
// ** MUI Imports
import { Divider, CardHeader, Grid, Card, Drawer, Button, FormControl, TextField, FormHelperText, Autocomplete, FormControlLabel, Switch } from '@mui/material'
import { useEffect, useState } from 'react'
import TCCTableHeader from 'src/customComponents/data-table/header'
import TccDataTable from 'src/customComponents/data-table/table'
import Box from '@mui/material/Box'
import TccSingleFileUpload from 'src/customComponents/Form-Elements/file-upload/singleFile-upload'
import DrawerHeader from 'src/customComponents/components/drawer-header'
import { SHANKS_ADD, SHANKS_DELETE, SHANKS_EDIT, SHANKS_GET_ALL, SHANKS_STATUS, } from 'src/services/AdminServices'
import { toast } from 'react-hot-toast'
import { appErrors, DEFAULT_STATUS_CODE_SUCCESS, FIELD_REQUIRED, IMAGE_FIELD_REQUIRED, SEARCH_DELAY_TIME } from 'src/AppConstants'
import DeleteDataModel from 'src/customComponents/delete-model'
import { createPagination } from 'src/utils/sharedFunction'
import { ICommonPagination } from 'src/data/interface'
import { Controller, useForm } from 'react-hook-form'
import { Info_Key } from 'src/data/enum'
import InfoSection from 'src/@core/components/common/info-drawer/info-drawer'

const Shank = () => {

  let timer: any;
  const [searchFilter, setSearchFilter] = useState()
  const [drawerAction, setDrawerAction] = useState(false)
  const [editorDrawerAction, setEditorDrawerAction] = useState(false)
  const [name, setName] = useState('')
  const [sortCode, setSortCode] = useState('')
  const [imageFile, setImageFile] = useState<string>()
  const [removeimage, setRemoveImage] = useState("0")
  const [imageShow, setImageShow] = useState("")
  const [id, setId] = useState('')
  const [pagination, setPagination] = useState({ ...createPagination(), search_text: "" })
  const [result, setResult] = useState([])
  const [dialogTitle, setDialogTitle] = useState<'Add' | 'Edit'>('Add')
  const [showModel, setShowModel] = useState(false);
  const [imageValue, setImageValue] = useState('')

  const defaultValues = {
    name: name,
    sortCode: sortCode,
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

  const toggleAddShankDrawer = () => {
    if (drawerAction == false) {
      setRemoveImage("1")
    } else {
      setRemoveImage("0")
    }
    setDrawerAction(!drawerAction)
  }


  const toggleEditorDrawer = () => setEditorDrawerAction(!editorDrawerAction)

  const editOnClickHandler = async (data: any) => {

    setDialogTitle('Edit');
    toggleAddShankDrawer();
    setId(data.id);
    setImageShow(data.image_path);
    setValue("name", data.name)
    setValue("sortCode", data.sort_code);
  }
  const deleteOnClickHandler = async (data: any) => {

    setId(data.id)
    setShowModel(!showModel)
  }
  const clearFormDataHandler = () => {
    reset()
    setImageShow("")
  }

  /////////////////// ADD API //////////////////////

  const addApi = async (data: any) => {
    if (!imageFile) {
      toast.error(`${IMAGE_FIELD_REQUIRED}`, {
        position: "top-center"
      });
    } else {
      const formData = new FormData()
      formData.append("image", imageFile || "")
      formData.append("name", data.name)
      formData.append("sort_code", data.sortCode)
      try {
        const data = await SHANKS_ADD(formData);
        if (data.code === 200 || data.code === "200") {
          toggleAddShankDrawer();
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
    }
    return false;
  }

  //////////////////////// GET API ////////////////////////

  const getAllApi = async (mbPagination: ICommonPagination) => {
    try {
      const data = await SHANKS_GET_ALL(mbPagination);

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
  }, [searchFilter])

  ////////////////////////// EDIT API ////////////////////////////

  const editApi = async (data: any) => {
    const formData = new FormData()
    formData.append("image", imageFile || "")
    formData.append("name", data.name)
    formData.append("sort_code", data.sortCode)
    try {
      const data = await SHANKS_EDIT(id, formData);

      if (data.code === 200 || data.code === "200") {
        toast.success(data.message);
        toggleAddShankDrawer();
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
    // }
    return false;
  }

  ///////////////////// DELETE API //////////////////

  const toggleModel = (showdata: any) => {
    setShowModel(showdata)
  }

  const deleteApi = async () => {
    try {
      const data = await SHANKS_DELETE(id);

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

  //////////////////// STATUS API //////////////////

  const statusApi = async (checked: boolean, row: any) => {
    try {
      const data = await SHANKS_STATUS(row.id);

      if (data.code === 200 || data.code === "200") {
        toast.success(data.message);
        getAllApi(pagination)

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
      width: 80,
      headerName: 'image',
      field: 'image_path',
      avatars: 'avatars',
      value: 'image_path'
    },
    {
      width: 200,
      value: 'name',
      headerName: 'Shank value',
      field: 'name',
      text: 'text'
    },
    {
      width: 200,
      value: 'slug',
      headerName: 'slug',
      field: 'slug',
      text: 'text'
    },
    {
      width: 150,
      value: 'sort_code',
      headerName: 'sort code',
      field: 'sort_code',
      text: 'text'
    },
    {
      width: 100,
      headerName: 'status',
      field: 'is_active',
      switch: 'switch',
      value: 'is_active',
      SwitchonChange: statusApi

    },
    {
      width: 100,
      headerName: 'Action',
      field: 'action',
      edit: "edit",
      editOnClick: editOnClickHandler,
      deleted: 'deleted',
      deletedOnClick: deleteOnClickHandler
    },

  ]

  const onsubmit = (data: any) => {
    if (dialogTitle === "Add") {
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
          <CardHeader title='Shank'></CardHeader>
          <Divider />
          <Box>
            <TCCTableHeader isButton value={searchFilter}
              onChange={(e: any) => setSearchFilter(e.target.value)}
              toggle={() => {
                setDialogTitle('Add')
                toggleAddShankDrawer()
                clearFormDataHandler()
              }}
              ButtonName='Add Shank'
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
            iconTitle='Shank'
          />
        </Card>
      </Grid>
      <Drawer
        open={drawerAction}
        anchor='right'
        variant='temporary'
        onClose={toggleAddShankDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
      >
        <DrawerHeader
          title={`${dialogTitle} Shank`}
          onClick={() => {
            clearFormDataHandler()
            toggleAddShankDrawer()
          }}
          tabBar
        />

        <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
          <form onSubmit={handleSubmit(onsubmit)}>
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
                    label='Shank Name'
                    onChange={(e) => setName(e.target.value)}
                    error={Boolean(errors.name)}
                    {...field}
                  />
                )}
              />
              {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{FIELD_REQUIRED}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='sortCode'
                control={control}
                rules={{ required: true }}
                render={({ field }: any) => (
                  <TextField
                    autoFocus
                    size='small'
                    label='Sort Code'
                    value={sortCode}
                    onChange={(e) => setSortCode(e.target.value)}
                    error={Boolean(errors.sortCode)}
                    {...field}
                  />
                )}
              />
              {errors.sortCode && <FormHelperText sx={{ color: 'error.main' }}>{FIELD_REQUIRED}</FormHelperText>}
            </FormControl>
            <TccSingleFileUpload imageValue={setImageValue} onDrop={setImageFile} onClick={removeimage} imageFile={imageShow} />
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
              <Button variant='contained' sx={{ mr: 3 }} type="submit">
                {dialogTitle === 'Add' ? "SUBMIT" : "EDIT"}
              </Button>
              <Button variant='outlined' color='secondary' onClick={toggleAddShankDrawer}>
                Cancel
              </Button>
            </Box>
          </form>
        </Box>
      </Drawer>
      <InfoSection
        onsubmit={onInfoSubmit}
        info_key={Info_Key.Shank}
        drawerTitle="Shank Info"
        drawerToggle={() => toggleEditorDrawer()}
        drawerACtion={editorDrawerAction} />
      <DeleteDataModel showModel={showModel} toggle={toggleModel} onClick={deleteApi} />

    </Grid>
  )
}



export default Shank