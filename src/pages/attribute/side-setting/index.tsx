
// ** MUI Imports
import { Divider, CardHeader, Grid, Card, Drawer, Button, FormControl, TextField, FormHelperText, Autocomplete, FormControlLabel, Switch } from '@mui/material'
import { useEffect, useState } from 'react'
import TCCTableHeader from 'src/customComponents/data-table/header'
import TccDataTable from 'src/customComponents/data-table/table'
import Box from '@mui/material/Box'
import TccSingleFileUpload from 'src/customComponents/Form-Elements/file-upload/singleFile-upload'
import DrawerHeader from 'src/customComponents/components/drawer-header'
import { toast } from 'react-hot-toast'
import { ADD_INFO, CONFIG_MASTER_DROPDOWN, SIDE_SETTING_STYLE_ADD, SIDE_SETTING_STYLE_DELETE, SIDE_SETTING_STYLE_EDIT, SIDE_SETTING_STYLE_GET_ALL, SIDE_SETTING_STYLE_STATUS } from 'src/services/AdminServices'
import { appErrors, DEFAULT_STATUS_CODE_SUCCESS, FIELD_REQUIRED, IMAGE_FIELD_REQUIRED, SEARCH_DELAY_TIME } from 'src/AppConstants'
import DeleteDataModel from 'src/customComponents/delete-model'
import { createPagination } from 'src/utils/sharedFunction'
import { ICommonPagination } from 'src/data/interface'
import { Controller, useForm } from 'react-hook-form'
import InfoSection from 'src/@core/components/common/info-drawer/info-drawer'
import { Info_Key } from 'src/data/enum'

const SideSettingStyle = () => {

  let timer: any;
  const [searchFilter, setSearchFilter] = useState()
  const [drawerAction, setDrawerAction] = useState(false)
  const [editorDrawerAction, setEditorDrawerAction] = useState(false)
  const [settingStyle, setSettingStyle] = useState('')
  const [imageFile, setImageFile] = useState<string>()
  const [removeimage, setRemoveImage] = useState("0")
  const [settingStylePagination, setSettingStylePagination] = useState({ ...createPagination(), search_text: "" })
  const [settingStyleResult, setSettingStyleResult] = useState([])
  const [settingStyleId, setSettingStyleId] = useState('');
  const [imageShow, setImageShow] = useState("")
  const [dialogTitle, setDialogTitle] = useState<'Add' | 'Edit'>('Add')
  const [showModel, setShowModel] = useState(false);
  const [sortCode, setSortCode] = useState('')
  const [shankList, setShanklist] = useState([])
  const [shankData, setShankData] = useState<{ id: null, name: "" }[]>([])
  const [imageValue, setImageValue] = useState('')
  const [checkValueData, setCheckValueData] = useState({
    ringCheckValue: false, bandCheckValue: false,
    threeStoneCheckValue: false, braceleteCheckValue: false,
    pendantCheckValue: false, earringCheckValue: false
  })
  const defaultValues = {
    settingStyle: settingStyle,
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
  const toggleAddSettingStyleDrawer = () => {
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
    setValue("settingStyle", data.name);
    setValue("sortCode", data.sort_code);
    setCheckValueData((prevState) => ({
      ...prevState,
      ringCheckValue: data.is_config === '1' ? true : false,
      bandCheckValue: data.is_band === '1' ? true : false,
      braceleteCheckValue: data.is_bracelet === '1' ? true : false,
      pendantCheckValue: data.is_pendant === '1' ? true : false,
      threeStoneCheckValue: data.is_three_stone === '1' ? true : false,
      earringCheckValue: data.is_earring === '1' ? true : false,
    }))
    const diamondShapeData: any = []
    let list: any
    for (list of shankList) {
      const data = { id: list.id, name: list.name }

      diamondShapeData.push(data)
    }

    const diamondFinal = diamondShapeData?.filter((t: any) => {
      if (data.id_shank.indexOf(parseInt(t.id)) >= 0) return t;
    })
    setShankData(diamondFinal)

    setImageShow(data.image_path);
    toggleAddSettingStyleDrawer();
    setSettingStyleId(data.id);
  }

  const deleteOnClickHandler = async (data: any) => {

    setSettingStyleId(data.id)
    setShowModel(!showModel)
  }
  const clearFormDataHandler = () => {
    reset()
    setImageShow("")
    setShankData([])
    setCheckValueData((prevState) => ({
      ...prevState,
      ringCheckValue: false,
      bandCheckValue: false,
      braceleteCheckValue: false,
      pendantCheckValue: false,
      threeStoneCheckValue: false,
      earringCheckValue: false,
    }))
  }

  /////////////////// ADD API ///////////////////////
  const sideSettingStyleAddApi = async (data: any) => {
    if (!imageFile) {
      toast.error(`${IMAGE_FIELD_REQUIRED}`, {
        position: "top-center"
      });
    } else {
      const formData = new FormData()
      formData.append("image", imageFile || "")
      formData.append("name", data.settingStyle)
      formData.append("sort_code", data.sortCode)
      shankData.map((value: any, index) => formData.append(`id_shank[${index}]`, value.id))
      formData.append("is_config", checkValueData.ringCheckValue ? "1" : "0")
      formData.append("is_band", checkValueData.bandCheckValue ? "1" : "0")
      formData.append("is_three_stone", checkValueData.threeStoneCheckValue ? "1" : "0")
      formData.append("is_bracelet", checkValueData.braceleteCheckValue ? "1" : "0")
      formData.append("is_pendant", checkValueData.pendantCheckValue ? "1" : "0")
      formData.append("is_earring", checkValueData.earringCheckValue ? "1" : "0")
      try {
        const data = await SIDE_SETTING_STYLE_ADD(formData);

        if (data.code === 200 || data.code === "200") {
          toggleAddSettingStyleDrawer();
          toast.success(data.message);
          sideSettingStyleGetAllApi(settingStylePagination);
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

  const sideSettingStyleGetAllApi = async (mbPagination: ICommonPagination) => {
    try {
      const data = await SIDE_SETTING_STYLE_GET_ALL(mbPagination);
      if (data.code === 200 || data.code === "200") {
        setSettingStylePagination(data.data.pagination)
        setSettingStyleResult(data.data.result)
      } else {
        return toast.error(data.message);
      }
    } catch (e: any) {
      toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN);
    }

    return false;
  }
  useEffect(() => {
    sideSettingStyleGetAllApi(settingStylePagination);
  }, []);

  const handleChangePerPageRows = (perPageRows: any) => {
    sideSettingStyleGetAllApi({ ...settingStylePagination, per_page_rows: perPageRows.pageSize, current_page: perPageRows.page + 1 })
  }

  const handleOnPageChange = (page: number) => {
    sideSettingStyleGetAllApi({ ...settingStylePagination, current_page: page + 1 })
  }

  const handleChangeSortBy = (orderSort: any) => {
    sideSettingStyleGetAllApi({ ...settingStylePagination, sort_by: orderSort == undefined ? "id" : orderSort.map((t: any) => t.field), order_by: orderSort == undefined ? "DESC" : orderSort.map((t: any) => t.sort) })
  }
  const searchBusinessUser = async () => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      sideSettingStyleGetAllApi({ ...settingStylePagination, current_page: 1, search_text: searchFilter });
    }, SEARCH_DELAY_TIME);
  }

  useEffect(() => {
    searchBusinessUser();
  }, [searchFilter])

  const dropDownDatApi = async () => {

    try {
      const data = await CONFIG_MASTER_DROPDOWN();
      if (data.code === 200 || data.code === "200") {
        setShanklist(data.data.shankList)
      } else {
        return toast.error(data.message);
      }
    } catch (e: any) {
      toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN);
    }

    return false;
  }

  useEffect(() => {
    dropDownDatApi()
  }, [])

  ////////////////////////// EDIT API //////////////////////////

  const sideSettingStyleEditApi = async (data: any) => {
    // if (imageValue === '1') {
    //     toast.error(`${IMAGE_FIELD_REQUIRED}`, {
    //         position: "top-center"
    //     });
    // } else {
    const formData = new FormData()
    formData.append("id", settingStyleId)
    formData.append("image", imageFile || "")
    formData.append("name", data.settingStyle)
    formData.append("sort_code", data.sortCode)
    shankData.map((value: any, index) => formData.append(`id_shank[${index}]`, value.id))
    formData.append("is_config", checkValueData.ringCheckValue ? "1" : "0")
    formData.append("is_band", checkValueData.bandCheckValue ? "1" : "0")
    formData.append("is_three_stone", checkValueData.threeStoneCheckValue ? "1" : "0")
    formData.append("is_bracelet", checkValueData.braceleteCheckValue ? "1" : "0")
    formData.append("is_pendant", checkValueData.pendantCheckValue ? "1" : "0")
    formData.append("is_earring", checkValueData.earringCheckValue ? "1" : "0")

    try {
      const data = await SIDE_SETTING_STYLE_EDIT(settingStyleId, formData);
      if (data.code === 200 || data.code === "200") {
        toast.success(data.message);
        toggleAddSettingStyleDrawer();
        clearFormDataHandler();
        sideSettingStyleGetAllApi(settingStylePagination);
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

  const sideSettingStyleDeleteApi = async () => {

    try {
      const data = await SIDE_SETTING_STYLE_DELETE(settingStyleId)
      if (data.code === 200 || data.code === "200") {
        toast.success(data.message);
        setShowModel(!showModel);
        sideSettingStyleGetAllApi(settingStylePagination);
      } else {
        return toast.error(data.message);
      }
    } catch (e: any) {
      toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN);
    }

    return false;
  }

  //////////////////// STATUS API ///////////////////////

  const sideSettingStyleStatusApi = async (checked: boolean, row: any) => {

    try {
      const data = await SIDE_SETTING_STYLE_STATUS(row.id);

      if (data.code === 200 || data.code === "200") {
        toast.success(data.message);
        sideSettingStyleGetAllApi(settingStylePagination)

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
      headerName: 'value',
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
      SwitchonChange: sideSettingStyleStatusApi

    },
    {
      width: 300,
      headerName: 'config',
      field: 'is_pendant',
      config_chips: 'config_chips',
      is_band: 'is_band',
      is_config: 'is_config',
      is_bracelet: 'is_bracelet',
      is_earring: 'is_earring',
      is_pendant: 'is_pendant',
      is_three_stone: 'is_three_stone'
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

  const onSubmit = (data: any) => {
    if (dialogTitle === 'Add') {
      sideSettingStyleAddApi(data)
    } else {
      sideSettingStyleEditApi(data)
    }
  }
  const handleSwitchChange = (name: any) => {
    setCheckValueData((prevState: any) => ({
      ...prevState,
      [name]: !prevState[name]
    }));
  };


  const onInfoSubmit = (data: any) => {
    toggleEditorDrawer()
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Side Setting Style'></CardHeader>
          <Divider />
          <Box>
            <TCCTableHeader isButton value={searchFilter}
              onChange={(e: any) => setSearchFilter(e.target.value)}
              toggle={() => {
                setDialogTitle('Add')
                toggleAddSettingStyleDrawer()
                clearFormDataHandler()
              }}
              ButtonName='Add Side Setting Style'
              infoButton
              infotoggle={() => {
                toggleEditorDrawer()
              }}
            />

          </Box>
          <TccDataTable
            column={column}
            rows={settingStyleResult}
            handleSortChanges={handleChangeSortBy}
            pageSize={parseInt(settingStylePagination.per_page_rows.toString())}
            rowCount={settingStylePagination.total_items}
            page={settingStylePagination.current_page - 1}
            onPageChange={handleChangePerPageRows}
            iconTitle='Side Setting Style'
          />
        </Card>
      </Grid>
      <Drawer
        open={drawerAction}
        anchor='right'
        variant='temporary'
        onClose={toggleAddSettingStyleDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
      >
        <DrawerHeader
          title={`${dialogTitle} Side Setting Style`}
          onClick={() => {
            clearFormDataHandler()
            toggleAddSettingStyleDrawer()
          }}
          tabBar
        />

        <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='settingStyle'
                control={control}
                rules={{ required: true }}
                render={({ field }: any) => (
                  <TextField
                    autoFocus
                    size='small'
                    value={settingStyle}
                    label='Side Setting Style Name'
                    onChange={(e) => setSettingStyle(e.target.value)}
                    error={Boolean(errors.settingStyle)}
                    {...field}
                  />
                )}
              />
              {errors.settingStyle && <FormHelperText sx={{ color: 'error.main' }}>{FIELD_REQUIRED}</FormHelperText>}
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
                {dialogTitle === "Add" ? "SUBMIT" : "EDIT"}
              </Button>
              <Button variant='outlined' color='secondary' onClick={toggleAddSettingStyleDrawer}>
                Cancel
              </Button>
            </Box>
          </form>
        </Box>
      </Drawer>
      <InfoSection
        onsubmit={onInfoSubmit}
        info_key={Info_Key.Side_setting}
        drawerTitle="Side Setting Info"
        drawerToggle={() => toggleEditorDrawer()}
        drawerACtion={editorDrawerAction} />
      <DeleteDataModel showModel={showModel} toggle={toggleModel} onClick={sideSettingStyleDeleteApi} />
    </Grid>
  )
}


export default SideSettingStyle
