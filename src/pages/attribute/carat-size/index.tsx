
// ** MUI Imports
import { Divider, CardHeader, Grid, Card, Drawer, Button, FormControl, TextField, FormHelperText } from '@mui/material'
import React, { useEffect, useState } from 'react'
import TCCTableHeader from 'src/customComponents/data-table/header'
import TccDataTable from 'src/customComponents/data-table/table'
import Box from '@mui/material/Box'
import DrawerHeader from 'src/customComponents/components/drawer-header'
import { CARAT_SIZE_ADD, CARAT_SIZE_DELETE, CARAT_SIZE_EDIT, CARAT_SIZE_GET_ALL, CARAT_SIZE_STATUS, CONFIG_MASTER_DROPDOWN } from 'src/services/AdminServices'
import { appErrors, FIELD_REQUIRED, SEARCH_DELAY_TIME, SIZE_POSITIVE_REQUIRED, SLUG_POSITIVE_REQUIRED } from 'src/AppConstants'
import { toast } from 'react-hot-toast'
import DeleteDataModel from 'src/customComponents/delete-model'
import { createPagination } from 'src/utils/sharedFunction'
import { ICommonPagination } from 'src/data/interface'
import { Controller, useForm } from 'react-hook-form'
import TccSelect from 'src/customComponents/Form-Elements/select'
import TccSingleFileUpload from 'src/customComponents/Form-Elements/file-upload/singleFile-upload'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Info_Key } from 'src/data/enum'
import InfoSection from 'src/@core/components/common/info-drawer/info-drawer'

const schema = yup.object().shape({
  caratSize: yup.string()
    .matches(/^\d+(\.\d{1,10})?$/, 'The size must be a positive number')
    .required('This field is required'),
})

const CaratSize = () => {

  let timer: any;
  const [searchFilter, setSearchFilter] = useState()
  const [drawerAction, setDrawerAction] = useState(false)
  const [editorDrawerAction, setEditorDrawerAction] = useState(false)
  const [caratSize, setCaratSize] = useState("")
  const [caratId, setCaratid] = useState('');
  const [pagination, setPagination] = useState({ ...createPagination(), search_text: "" })
  const [result, setResult] = useState([])
  const [dialogTitle, setDialogTitle] = useState<'Add' | 'Edit'>('Add')
  const [showModel, setShowModel] = useState(false);
  const [sortCode, setSortCode] = useState('')
  const [imageFile, setImageFile] = useState<string>()
  const [imageShow, setImageShow] = useState("")
  const [removeimage, setRemoveImage] = useState("0")

  const defaultValues = {
    caratSize: caratSize,
    sortCode: sortCode,
  }
  const {
    control,
    setValue,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  })

  const toggleAddCaratSizeDrawer = () => {
    if (drawerAction == false) {
      setRemoveImage("1")
    } else {
      setRemoveImage("0")
    }
    setDrawerAction(!drawerAction)
  }

  const toggleEditorDrawer = () => setEditorDrawerAction(!editorDrawerAction)

  const editOnClickHandler = async (data: any) => {
    setValue("caratSize", data.value)
    setValue("sortCode", data.sort_code);
    setDialogTitle('Edit');
    setImageShow(data.image_path);
    toggleAddCaratSizeDrawer();
    setCaratid(data.id);
  }

  const deleteOnClickHandler = async (data: any) => {
    setCaratid(data.id)
    setShowModel(!showModel)
  }

  const clearFormDataHandler = () => {
    reset()
    setImageShow("")
  }

  /////////////////////// ADD API ///////////////////////

  const caratsizeAddApi = async (data: any) => {

    const formData = new FormData()
    formData.append("image", imageFile || "")
    formData.append("value", data.caratSize)

    try {
      const data = await CARAT_SIZE_ADD(formData);
      if (data.code === 200 || data.code === "200") {
        toggleAddCaratSizeDrawer();
        toast.success(data.message);
        clearFormDataHandler();
        caratgetallApi(pagination);
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
  const caratgetallApi = async (mbPagination: ICommonPagination) => {
    try {
      const data = await CARAT_SIZE_GET_ALL(mbPagination);
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
    caratgetallApi(pagination);
  }, []);

  const handleChangePerPageRows = (perPageRows: any) => {
    caratgetallApi({ ...pagination, per_page_rows: perPageRows.pageSize, current_page: perPageRows.page + 1 })
  }

  const handleChangeSortBy = (orderSort: any) => {
    caratgetallApi({ ...pagination, sort_by: orderSort == undefined ? "id" : orderSort.map((t: any) => t.field), order_by: orderSort == undefined ? "DESC" : orderSort.map((t: any) => t.sort) })
  }

  const searchBusinessUser = async () => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      caratgetallApi({ ...pagination, current_page: 1, search_text: searchFilter });
    }, SEARCH_DELAY_TIME);
  }

  useEffect(() => {
    searchBusinessUser();
  }, [searchFilter]);

  /////////////////////// EDIT API ///////////////////////

  const caratSizeEditApi = async (data: any) => {

    const formData = new FormData()
    formData.append("image", imageFile || "")
    formData.append("value", data.caratSize)

    try {
      const data = await CARAT_SIZE_EDIT(caratId, formData);
      if (data.code === 200 || data.code === "200") {
        toast.success(data.message);
        toggleAddCaratSizeDrawer();
        caratgetallApi(pagination);
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

  /////////////////////// DELETE  API ///////////////////////

  const toggleModel = (showdata: any) => {
    setShowModel(showdata)
  }

  const caratSizeDeleteApi = async () => {
    try {
      const data = await CARAT_SIZE_DELETE(caratId);
      if (data.code === 200 || data.code === "200") {
        toast.success(data.message);
        setShowModel(!showModel);
        caratgetallApi(pagination);
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
      const data = await CARAT_SIZE_STATUS(row.id);
      if (data.code === 200 || data.code === "200") {
        toast.success(data.message);
        caratgetallApi(pagination)

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
      flex: 1,
      value: 'value',
      headerName: 'Value',
      field: 'value',
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
      value: 'sort_code',
      headerName: 'sort code',
      field: 'sort_code',
      text: 'text'
    },
    {
      flex: 1,
      headerName: 'status',
      field: 'is_active',
      switch: 'switch',
      value: 'is_active',
      SwitchonChange: statusApi
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
      caratsizeAddApi(data)
    } else {
      caratSizeEditApi(data)
    }
  }

  const onInfoSubmit = (data: any) => {
    toggleEditorDrawer()
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Carat Size'></CardHeader>
          <Divider />
          <Box>
            <TCCTableHeader isButton value={searchFilter}
              onChange={(e: any) => setSearchFilter(e.target.value)}
              toggle={() => {
                setDialogTitle('Add')
                toggleAddCaratSizeDrawer()
                clearFormDataHandler()
              }}
              ButtonName='Add Carat Size'
              infoButton
              infotoggle={() => {
                toggleEditorDrawer()
              }}
            />

          </Box>
          <Box sx={{ width: "100%" }}>
            <TccDataTable
              column={column}
              sortingMode="server"
              rows={result}
              pageSize={parseInt(pagination.per_page_rows.toString())}
              rowCount={pagination.total_items}
              handleSortChanges={handleChangeSortBy}
              page={pagination.current_page - 1}
              onPageChange={handleChangePerPageRows}
              iconTitle='Carat Size'
            />
          </Box>
        </Card>
      </Grid>
      <Drawer
        open={drawerAction}
        anchor='right'
        variant='temporary'
        onClose={toggleAddCaratSizeDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
      >

        <DrawerHeader
          title={`${dialogTitle} Carat Size`}
          onClick={() => {
            clearFormDataHandler()
            toggleAddCaratSizeDrawer()
          }}
          tabBar
        />

        <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='caratSize'
                control={control}
                rules={{ required: true }}
                render={({ field }: any) => (
                  <TextField
                    type="text"
                    autoFocus
                    size='small'
                    value={caratSize}
                    label='Value'
                    onChange={(e) => setCaratSize(e.target.value)}
                    error={Boolean(errors.caratSize)}
                    {...field}
                  />
                )}
              />
              {errors.caratSize && <FormHelperText sx={{ color: 'error.main' }}>{errors.caratSize.message ? errors.caratSize.message : FIELD_REQUIRED}</FormHelperText>}
            </FormControl>
            {dialogTitle === 'Edit' ? <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='sortCode'
                control={control}
                rules={{ required: true }}
                render={({ field }: any) => (
                  <TextField
                    disabled
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
            </FormControl> : ""}
            <TccSingleFileUpload onDrop={setImageFile} onClick={removeimage} imageFile={imageShow} />

            <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
              <Button variant='contained' sx={{ mr: 3 }} type='submit'>
                {dialogTitle === "Add" ? "SUBMIT" : "EDIT"}
              </Button>
              <Button variant='outlined' color='secondary' onClick={() => {
                toggleAddCaratSizeDrawer()
                clearFormDataHandler()
              }}>
                Cancel
              </Button>
            </Box>
          </form>
        </Box>
      </Drawer>
      <InfoSection
        onsubmit={onInfoSubmit}
        info_key={Info_Key.Carat}
        drawerTitle="Carat Size Info"
        drawerToggle={() => toggleEditorDrawer()}
        drawerACtion={editorDrawerAction} />
      <DeleteDataModel showModel={showModel} toggle={toggleModel} onClick={caratSizeDeleteApi} />
    </Grid>
  )
}

export default CaratSize