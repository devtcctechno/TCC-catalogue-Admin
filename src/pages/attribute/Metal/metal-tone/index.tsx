// ** MUI Imports
import { calculateSize, Icon } from '@iconify/react'
import { CardContent, Divider, CardHeader, Grid, Card, Drawer, Typography, IconButton, Button, FormControl, TextField, FormHelperText, SelectChangeEvent, FormControlLabel, Switch } from '@mui/material'
import { useEffect, useState } from 'react'
import TCCTableHeader from 'src/customComponents/data-table/header'
import TccDataTable from 'src/customComponents/data-table/table'
import Box from '@mui/material/Box'
import TccSingleFileUpload from 'src/customComponents/Form-Elements/file-upload/singleFile-upload'
import TccEditor from 'src/customComponents/Form-Elements/editor'
import DrawerHeader from 'src/customComponents/components/drawer-header'
import { METAL_TONE_ADD, METAL_TONE_DELETE, METAL_TONE_EDIT, METAL_TONE_GET_ALL, METAL_TONE_MASTER, METAL_TONE_STATUS } from 'src/services/AdminServices'
import { toast } from 'react-hot-toast'
import { appErrors, SEARCH_DELAY_TIME, FIELD_REQUIRED, IMAGE_FIELD_REQUIRED, DEFAULT_STATUS_CODE_SUCCESS } from 'src/AppConstants'
import DeleteDataModel from 'src/customComponents/delete-model'
import { createPagination } from 'src/utils/sharedFunction'
import { ICommonPagination } from 'src/data/interface'
import { Controller, useForm } from 'react-hook-form'
import TccSelect from 'src/customComponents/Form-Elements/select'
import InfoSection from 'src/@core/components/common/info-drawer/info-drawer'
import { Info_Key } from 'src/data/enum'

const MetalTone = () => {

  let timer: any;
  const [searchFilter, setSearchFilter] = useState('')
  const [drawerAction, setDrawerAction] = useState(false)
  const [editorDrawerAction, setEditorDrawerAction] = useState(false)
  const [metalToneName, setMetalToneName] = useState('')
  const [metalToneId, setMetalToneId] = useState('');
  const [pagination, sePagination] = useState({ ...createPagination(), search_text: "" })
  const [result, setResult] = useState([])
  const [categoryvalue, setCategoryValue] = useState<string>('')
  const [options, setOptions] = useState([])
  const [dialogTitle, setDialogTitle] = useState<'Add' | 'Edit'>('Add')
  const [showModel, setShowModel] = useState(false);
  const [imageFile, setImageFile] = useState<string>()
  const [imageShow, setImageShow] = useState("")
  const [removeimage, setRemoveImage] = useState("0")
  const [sortCode, setSortCode] = useState('')
  const [categoryValueError, setCategoryValueError] = useState("")
  const [imageValue, setImageValue] = useState('')
  const defaultValues =
  {
    metalToneName: metalToneName,
    sortCode: sortCode,
  }

  const {
    control,
    setValue,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: defaultValues
  })
  const handleChange = (event: SelectChangeEvent) => {
    setCategoryValue(event.target.value as string)
    if (event.target.value === '') {
      setCategoryValueError(`${FIELD_REQUIRED}`)
    } else {
      setCategoryValueError("")
    }
  }

  const toggleAddMetalToneDrawer = () => {
    if (drawerAction == false) {
      setRemoveImage("1")
    } else {
      setRemoveImage("0")
    }
    setDrawerAction(!drawerAction)
  }

  const toggleEditorDrawer = () => setEditorDrawerAction(!editorDrawerAction)

  const editOnClickHandler = async (data: any) => {
    setValue("metalToneName", data.name);
    setValue("sortCode", data.sort_code);
    setImageShow(data.image_path);
    setCategoryValue(data.id_metal);
    setDialogTitle('Edit');
    toggleAddMetalToneDrawer();
    setMetalToneId(data.id);
  }

  const deleteOnClickHandler = async (data: any) => {

    setMetalToneId(data.id)
    setShowModel(!showModel)
  }
  const clearFormDataHandler = () => {
    reset()
    setCategoryValue('')
    setImageShow("")
    setCategoryValueError("")
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
      formData.append("name", data.metalToneName)
      formData.append("sort_code", data.sortCode)
      formData.append("metal_master_id", categoryvalue)
      try {
        const data = await METAL_TONE_ADD(formData);
        if (data.code === 200 || data.code === "200") {
          toggleAddMetalToneDrawer();
          getAllApi(pagination)
          toast.success(data.message);
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
      const data = await METAL_TONE_GET_ALL(mbPagination);

      if (data.code === 200 || data.code === "200") {
        sePagination(data.data.pagination)
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


  ////////////////////////// EDIT API ///////////////////////

  const editApi = async (data: any) => {
    // if (imageValue === '1') {
    //   toast.error(`${IMAGE_FIELD_REQUIRED}`, {
    //     position: "top-center"
    //   });
    // } else {
    const formData = new FormData()
    formData.append("image", imageFile || "")
    formData.append("name", data.metalToneName)
    formData.append("sort_code", data.sortCode)
    formData.append("metal_master_id", categoryvalue)
    try {
      const data = await METAL_TONE_EDIT(metalToneId, formData);
      if (data.code === 200 || data.code === "200") {
        toast.success(data.message);
        toggleAddMetalToneDrawer();
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

  ///////////////////// DELETE API ///////////////////////

  const toggleModel = (showdata: any) => {
    setShowModel(showdata)
  }

  const deleteApi = async () => {
    try {
      const data = await METAL_TONE_DELETE(metalToneId);
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
      const data = await METAL_TONE_STATUS(row.id);
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

  //////////////////// DROPDOWN API /////////////////////// 

  const metalToneMasterApi = async () => {
    try {
      const data = await METAL_TONE_MASTER();
      setOptions(data.data)

      if (data.code === 200 || data.code === "200") {
        clearFormDataHandler();
      } else {
        return toast.error(data.message);
      }
    } catch (e: any) {
      toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN);
    }

    return false;
  }
  useEffect(() => {
    metalToneMasterApi()
  }, []);
  const column = [
    {
      headerName: 'image',
      field: 'image_path',
      avatars: 'avatars',
      value: 'image_path',
      width: 80
    },
    {
      width: 200,
      value: 'name',
      headerName: 'Metal tone',
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
      width: 100,
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
      deletedOnClick: deleteOnClickHandler,
    },

  ]

  const onsubmit = (data: any) => {
    if (dialogTitle === "Add") {
      if (categoryvalue !== "") {
        addApi(data)
      }
    } else {
      editApi(data)
    }
  }

  const onInfoSubmit = (data: any) => {
    toggleEditorDrawer()
  }

  const handleOnclickSubmit = () => {
    if (categoryvalue === "") {
      setCategoryValueError(`${FIELD_REQUIRED}`)
    } else {
      setCategoryValueError('')
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Metal Tone'></CardHeader>
          <Divider />
          <Box>
            <TCCTableHeader isButton value={searchFilter}
              onChange={(e: any) => setSearchFilter(e.target.value)}
              toggle={() => {
                setDialogTitle('Add')
                clearFormDataHandler()
                toggleAddMetalToneDrawer()
              }}
              ButtonName='Add Metal Tone'
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
            onPageChange={handleChangePerPageRows}
            rowCount={pagination.total_items}
            page={pagination.current_page - 1}
            iconTitle='Metal Tone'
          />
        </Card>
      </Grid>
      <Drawer
        open={drawerAction}
        anchor='right'
        variant='temporary'
        onClose={toggleAddMetalToneDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
      >
        <DrawerHeader
          title={`${dialogTitle} Metal Tone`}
          onClick={() => {
            clearFormDataHandler()
            toggleAddMetalToneDrawer()
          }}
          tabBar
        />

        <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>

          <form onSubmit={handleSubmit(onsubmit)}>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='metalToneName'
                control={control}
                rules={{ required: true }}
                render={({ field }: any) => (
                  <TextField
                    autoFocus
                    size='small'
                    value={metalToneName}
                    label='Metal Tone Name'
                    onChange={(e) => setMetalToneName(e.target.value)}
                    error={Boolean(errors.metalToneName)}
                    {...field}
                  />
                )}
              />
              {errors.metalToneName && <FormHelperText sx={{ color: 'error.main' }}>{FIELD_REQUIRED}</FormHelperText>}
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
            <TccSelect
              sx={{ mb: 4 }}
              fullWidth
              inputLabel="Select Metal"
              label='Select Metal'
              value={categoryvalue}
              id='controlled-select'
              onChange={handleChange}
              title='name'
              Options={options}
            />
            {categoryValueError && <FormHelperText sx={{ color: 'error.main', mt: "-15px", mb: "5px", ml: "15px" }}>{categoryValueError}</FormHelperText>}
            <TccSingleFileUpload imageValue={setImageValue} onDrop={setImageFile} onClick={removeimage} imageFile={imageShow} />
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
              <Button variant='contained' sx={{ mr: 3 }} type="submit" onClick={() => handleOnclickSubmit()}>
                {dialogTitle === "Add" ? "SUBMIT" : "EDIT"}
              </Button>
              <Button variant='outlined' color='secondary' onClick={() => {
                toggleAddMetalToneDrawer()
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
        info_key={Info_Key.Metal_tone}
        drawerTitle="Metal Tone Info"
        drawerToggle={() => toggleEditorDrawer()}
        drawerACtion={editorDrawerAction} />
      <DeleteDataModel showModel={showModel} toggle={toggleModel} onClick={deleteApi} />
    </Grid>
  )
}

export default MetalTone