import { Divider, CardHeader, Grid, Card, Drawer, Button, FormControl, TextField, FormHelperText, SelectChangeEvent, FormControlLabel, Switch } from '@mui/material'
import { useEffect, useState } from 'react'
import TCCTableHeader from 'src/customComponents/data-table/header'
import TccDataTable from 'src/customComponents/data-table/table'
import Box from '@mui/material/Box'
import TccSingleFileUpload from 'src/customComponents/Form-Elements/file-upload/singleFile-upload'
import DrawerHeader from 'src/customComponents/components/drawer-header'
import { GOLD_KT_ADD, GOLD_KT_DELETE, GOLD_KT_EDIT, GOLD_KT_GET_ALL, GOLD_KT_MASTER, GOLD_KT_STATUS } from 'src/services/AdminServices'
import { toast } from 'react-hot-toast'
import { appErrors, DEFAULT_STATUS_CODE_SUCCESS, FIELD_REQUIRED, IMAGE_FIELD_REQUIRED, KARAT_POSITIVE_REQUIRED, ONLY_POSITIVE_NUMBER_REGEX, SEARCH_DELAY_TIME } from 'src/AppConstants'
import DeleteDataModel from 'src/customComponents/delete-model'
import { createPagination } from 'src/utils/sharedFunction'
import { ICommonPagination } from 'src/data/interface'
import { Controller, useForm } from 'react-hook-form'
import TccSelect from 'src/customComponents/Form-Elements/select'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import InfoSection from 'src/@core/components/common/info-drawer/info-drawer'
import { Info_Key } from 'src/data/enum'

const schema = yup.object().shape({
  goldKTName: yup.string()
    .matches(ONLY_POSITIVE_NUMBER_REGEX, 'The Metal karat must be a positive number')
    .required(`${FIELD_REQUIRED}`),
})

const GoldKT = () => {

  let timer: any;
  const [searchFilter, setSearchFilter] = useState()
  const [drawerAction, setDrawerAction] = useState(false)
  const [editorDrawerAction, setEditorDrawerAction] = useState(false)
  const [goldKTName, setGoldKTName] = useState('')
  const [categoryvalue, setCategoryValue] = useState<string>('')
  const [options, setOptions] = useState([])
  const [imageFile, setImageFile] = useState<string>()
  const [imageShow, setImageShow] = useState("")
  const [removeimage, setRemoveImage] = useState("0")
  const [goldKTpagination, setGoldKTPagination] = useState({ ...createPagination(), search_text: "" })
  const [goldKTresult, setGoldKTResult] = useState([])
  const [goldKTId, setGoldKTId] = useState('');
  const [dialogTitle, setDialogTitle] = useState<'Add' | 'Edit'>('Add')
  const [showModel, setShowModel] = useState(false);
  const [categoryValueError, setCategoryValueError] = useState("")
  const [imageValue, setImageValue] = useState('')
  const defaultValues = {
    goldKTName: goldKTName,
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

  const handleChange = (event: SelectChangeEvent) => {
    setCategoryValue(event.target.value as string)
    if (event.target.value === '') {
      setCategoryValueError(`${FIELD_REQUIRED}`)
    } else {
      setCategoryValueError("")
    }
  }
  const toggleAddGoldKTDrawer = () => {
    if (drawerAction == false) {
      setRemoveImage("1")
    } else {
      setRemoveImage("0")
    }
    setDrawerAction(!drawerAction)
  }

  const toggleEditorDrawer = () => setEditorDrawerAction(!editorDrawerAction)

  const editOnClickHandler = async (data: any) => {
    setValue("goldKTName", data.name);
    setDialogTitle('Edit');
    setImageShow(data.image_path);
    setCategoryValue(data.id_metal);
    toggleAddGoldKTDrawer();
    setGoldKTId(data.id);
  }

  const deleteOnClickHandler = async (data: any) => {
    setGoldKTId(data.id)
    setShowModel(!showModel)
  }

  const clearFormDataHandler = () => {
    reset()
    setCategoryValue('')
    setImageShow("")
    setCategoryValueError("")
  }


  /////////////////// ADD API ///////////////////////

  const addApi = async (data: any) => {
    if (!imageFile) {
      toast.error(`${IMAGE_FIELD_REQUIRED}`, {
        position: "top-center"
      });
    } else {
      const formData = new FormData()
      formData.append("name", data.goldKTName)
      formData.append("image", imageFile || "")
      formData.append("metal_master_id", categoryvalue)
      try {
        const data = await GOLD_KT_ADD(formData);

        if (data.code === 200 || data.code === "200") {
          toggleAddGoldKTDrawer();
          toast.success(data.message);
          getAllApi(goldKTpagination);
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

  //////////////////////// GET API ///////////////////////

  const getAllApi = async (mbPagination: ICommonPagination) => {
    try {
      const data = await GOLD_KT_GET_ALL(mbPagination);

      if (data.code === 200 || data.code === "200") {
        setGoldKTPagination(data.data.pagination)
        setGoldKTResult(data.data.result)
      } else {
        return toast.error(data.message);
      }

    } catch (e: any) {
      toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN);
    }

    return false;
  }
  useEffect(() => {
    getAllApi(goldKTpagination);
  }, []);

  const handleChangePerPageRows = (perPageRows: any) => {
    getAllApi({ ...goldKTpagination, per_page_rows: perPageRows.pageSize, current_page: perPageRows.page + 1 })
  }

  const handleChangeSortBy = (orderSort: any) => {
    getAllApi({ ...goldKTpagination, sort_by: orderSort == undefined ? "id" : orderSort.map((t: any) => t.field), order_by: orderSort == undefined ? "DESC" : orderSort.map((t: any) => t.sort) })
  }

  const handleOnPageChange = (page: number) => {
    getAllApi({ ...goldKTpagination, current_page: page + 1 })
  }
  const searchBusinessUser = async () => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      getAllApi({ ...goldKTpagination, current_page: 1, search_text: searchFilter });
    }, SEARCH_DELAY_TIME);
  }

  useEffect(() => {
    searchBusinessUser();
  }, [searchFilter])

  /////////////////////// EDIT API ///////////////////////

  const editApi = async (data: any) => {
    const formData = new FormData()
    formData.append("image", imageFile || "")
    formData.append("name", data.goldKTName)
    formData.append("metal_master_id", categoryvalue)
    try {
      const data = await GOLD_KT_EDIT(goldKTId, formData);

      if (data.code === 200 || data.code === "200") {
        toast.success(data.message);
        toggleAddGoldKTDrawer();
        clearFormDataHandler();
        getAllApi(goldKTpagination);
      } else {
        return toast.error(data.message);
      }
    } catch (e: any) {
      toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN, {
        position: "top-center"
      });
      // }
    }
    return false;
  }

  ///////////////////// DELETE API ///////////////////////

  const toggleModel = (showdata: any) => {
    setShowModel(showdata)
  }

  const deleteApi = async () => {
    try {
      const data = await GOLD_KT_DELETE(goldKTId);

      if (data.code === 200 || data.code === "200") {
        toast.success(data.message);
        setShowModel(!showModel);
        getAllApi(goldKTpagination);
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
      const data = await GOLD_KT_STATUS(row.id);

      if (data.code === 200 || data.code === "200") {
        toast.success(data.message);
        getAllApi(goldKTpagination)

      } else {
        return toast.error(data.message);
      }
    } catch (e: any) {
      toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN);
    }

    return false;
  }

  //////////////////// MASTER API /////////////////////// 

  const masterApi = async () => {
    try {
      const data = await GOLD_KT_MASTER();
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
    masterApi()
  }, []);

  const column = [

    {
      width: 80,
      headerName: 'image',
      field: 'image_path',
      avatars: 'avatars',
      value: 'image_path'
    },
    {
      width: 150,
      value: 'name',
      headerName: 'Carat',
      field: 'name',
      text: 'text'
    },

    {
      width: 150,
      value: 'slug',
      headerName: 'slug',
      field: 'slug',
      text: 'text'
    },
    {
      width: 150,
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
    if (dialogTitle === 'Add') {
      addApi(data)
    } else {
      editApi(data)
    }
  }

  const handleOnclickSubmit = () => {
    if (categoryvalue === "") {
      setCategoryValueError(`${FIELD_REQUIRED}`)
    } else {
      setCategoryValueError('')
    }
  }

  const onInfoSubmit = (data: any) => {
    toggleEditorDrawer();
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Karat Master'></CardHeader>
          <Divider />
          <Box>
            <TCCTableHeader isButton value={searchFilter}
              onChange={(e: any) => setSearchFilter(e.target.value)}
              toggle={() => {
                setDialogTitle('Add')
                toggleAddGoldKTDrawer()
                clearFormDataHandler()
              }}
              ButtonName='Add Karat'
              infoButton
              infotoggle={() => {
                toggleEditorDrawer()
              }}
            />

          </Box>
          <TccDataTable
            column={column}
            rows={goldKTresult}
            handleSortChanges={handleChangeSortBy}
            pageSize={parseInt(goldKTpagination.per_page_rows.toString())}
            rowCount={goldKTpagination.total_items}
            page={goldKTpagination.current_page - 1}
            onPageChange={handleChangePerPageRows}
            iconTitle='Karat'
          />
        </Card>
      </Grid>
      <Drawer
        open={drawerAction}
        anchor='right'
        variant='temporary'
        onClose={toggleAddGoldKTDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
      >
        <DrawerHeader
          title={`${dialogTitle} Karat`}
          onClick={() => {
            clearFormDataHandler()
            toggleAddGoldKTDrawer()
          }}
          tabBar
        />

        <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
          <form onSubmit={handleSubmit(onsubmit)}>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='goldKTName'
                control={control}
                rules={{ required: true }}
                render={({ field }: any) => (
                  <TextField
                    autoFocus
                    size='small'
                    type='text'
                    value={goldKTName}
                    label='Karat'
                    onChange={(e) => setGoldKTName(e.target.value)}
                    error={Boolean(errors.goldKTName)}
                    {...field}
                  />
                )}
              />
              {errors.goldKTName && <FormHelperText sx={{ color: 'error.main' }}>{errors.goldKTName.message ? errors.goldKTName.message : FIELD_REQUIRED}</FormHelperText>}
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
              <Button variant='outlined' color='secondary' onClick={toggleAddGoldKTDrawer}>
                Cancel
              </Button>
            </Box>
          </form>
        </Box>
      </Drawer>
      <InfoSection
        onsubmit={onInfoSubmit}
        info_key={Info_Key.Metal_karat}
        drawerTitle="Metal Karat Info"
        drawerToggle={() => toggleEditorDrawer()}
        drawerACtion={editorDrawerAction} />
      <DeleteDataModel showModel={showModel} toggle={toggleModel} onClick={deleteApi} />
    </Grid>
  )
}


export default GoldKT