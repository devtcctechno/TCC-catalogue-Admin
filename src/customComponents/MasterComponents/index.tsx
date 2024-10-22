/* eslint-disable lines-around-comment */
// ** MUI Imports
import {
    Divider,
    CardHeader,
    Grid,
    Card,
    Drawer,
    Typography,
    Button,
    FormControl,
    TextField,
    FormHelperText,
    SelectChangeEvent
} from '@mui/material'
import { useEffect, useState } from 'react'
import TableHeader from 'src/customComponents/data-table/header'
import DataTable from 'src/customComponents/data-table/table'
import Box from '@mui/material/Box'
import Editor from 'src/customComponents/Form-Elements/editor'
import DrawerHeader from 'src/customComponents/components/drawer-header'
import { toast } from 'react-hot-toast'
import { appErrors, SEARCH_DELAY_TIME, FIELD_REQUIRED } from 'src/AppConstants'
import { createPagination } from 'src/utils/sharedFunction'
import { ICommonPagination } from 'src/data/interface'
import DeleteDataModel from 'src/customComponents/delete-model'
import { Controller, useForm } from 'react-hook-form'
import {
    ADD_MASTER,
    DELETE_MASTER,
    EDIT_MASTER,
    GET_ALL_MASTER,
    STATUS_UPDATE_MASTER
} from 'src/services/AdminServices'
import SingleFileUpload from 'src/customComponents/Form-Elements/file-upload/singleFile-upload'
import SelectDropDown from 'src/customComponents/Form-Elements/select'

interface MasterComponent {
    Title: string
    EditorField?: boolean
    MasterType: string
    ColumnData: any
    AddImage?: boolean
    SortCodeField?: boolean
    DropDown?: boolean
    DropDownLabelName?: string
    link?: boolean
    id_parent?: boolean
    order?: boolean
    taxValue?: boolean
    showInfo?: boolean
}

const FormType = {
    add: "Add",
    edit: "Edit",
}

const MasterComponent = ({
    Title,
    EditorField,
    MasterType,
    ColumnData,
    AddImage,
    SortCodeField,
    DropDown,
    DropDownLabelName,
    link,
    id_parent,
    order,
    taxValue,
    showInfo = false,
}: MasterComponent) => {
    let timer: any

    // ----- State ----- //
    const [searchFilter, setSearchFilter] = useState('')
    const [showModel, setShowModel] = useState(false)
    const [drawerAction, setDrawerAction] = useState(false)
    const [editorDrawerAction, setEditorDrawerAction] = useState(false)
    const [dataValue, setDataValue] = useState('')
    const [dataName, setDataName] = useState('')
    const [dataId, setDataId] = useState('')
    const [dialogTitle, setDialogTitle] = useState<string>(FormType.add)
    const [getData, setGetData] = useState([])
    const [pagination, setPagination] = useState({ ...createPagination(), search_text: '' })
    const [editerData, setEditerData] = useState('')
    const [imageFile, setImageFile] = useState<any>('')
    const [removeimage, setRemoveImage] = useState('0')
    const [imageShow, setImageShow] = useState(undefined)
    const [categoryvalue, setCategoryValue] = useState<string>('')
    const [idParent, setIdParent] = useState<any>(null)
    const [options, setOptions] = useState([])
    const [datalink, setDataLink] = useState('')
    const [dataOrder, setDataOrder] = useState('')
    const [dataTaxValue, setDataTaxValue] = useState<any>('')
    const [parent, setParent] = useState([])
    const [apiErrorMessage, setApiErrorMessage] = useState<any>('')

    // ----- Hook ----- //
    const defaultValues = {
        dataValue: dataValue,
        dataName: dataName,
        datalink: datalink,
        dataOrder: dataOrder,
        dataTaxValue: dataTaxValue,
        imageFile: imageFile
    }
    const {
        control,
        setValue,
        reset,
        handleSubmit,
        clearErrors,
        formState: { errors }
    } = useForm({
        defaultValues
    })

    // ----- useEffect ----- //
    useEffect(() => {
        if (pagination) {
            getAllMasterDataApi(pagination)
        }
    }, [])

    useEffect(() => {
        searchBusinessUser()
    }, [searchFilter])

    useEffect(() => {
        if (dialogTitle === 'Add') {
            setImageShow(undefined)
        }
    }, [dialogTitle])

    useEffect(() => {
        clearErrors(['dataName', 'dataValue', 'dataOrder', 'dataTaxValue', 'datalink', 'imageFile'])
        if (!drawerAction) {
            setImageFile([])
        }
    }, [drawerAction])

    // ----- Master GET API ----- //
    const getAllMasterDataApi = async (mbPagination: ICommonPagination) => {
        try {
            const data = await GET_ALL_MASTER(mbPagination, MasterType)

            if (data.code === 200 || data.code === '200') {
                setGetData(data.data.result)
                setParent(data.data.result.filter((t: any) => t.id_parent === null))
                setPagination(data.data.pagination)
                setImageShow(data.image_path)
            } else {
                return toast.error(data.message)
            }
        } catch (e: any) {
            toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN)
        }
    }

    // ----- Master ADD API ----- //
    const addMasterApi = async (data: any) => {
        const formdata: any = new FormData()
        formdata.append('name', data?.dataName)
        formdata.append('master_type', MasterType)
        {
            SortCodeField === true && formdata.append('sort_code', data?.dataValue)
        }
        {
            order === true && formdata.append('order', data?.dataOrder)
        }
        {
            taxValue === true && formdata.append('value', data?.dataTaxValue)
        }
        {
            if (imageFile) {
                AddImage === true && formdata.append('image', imageFile || '')
            }
        }
        {
            DropDown == true && formdata.append('metal_master_id', categoryvalue)
        }
        {
            link == true && formdata.append('link', data?.datalink)
        }
        {
            id_parent == true && idParent !== null && formdata.append('id_parent', idParent)
        }

        try {
            const data = await ADD_MASTER(formdata)
            if (data.code === 200 || data.code === '200') {
                toggleAddDrawer()
                clearFormData()
                toast.success(data.message)
                getAllMasterDataApi(pagination)
            } else {
                return toast.error(data.message)
            }
        } catch (e: any) {
            setApiErrorMessage(e?.data?.message)
        }
        return false
    }

    // ----- Master EDIT API ----- //
    const editMasterDataApi = async (data: any) => {
        const formdata: any = new FormData()
        formdata.append('name', data?.dataName)
        formdata.append('master_type', MasterType)
        {
            SortCodeField === true && formdata.append('sort_code', data?.dataValue)
        }
        {
            order === true && formdata.append('order', data?.dataOrder)
        }
        {
            taxValue === true && formdata.append('value', data?.dataTaxValue)
        }
        {
            if (imageFile) {
                AddImage === true && formdata.append('image', imageFile || '')
            }
        }
        {
            DropDown == true && formdata.append('metal_master_id', categoryvalue)
        }
        {
            link == true && formdata.append('link', data?.datalink)
        }
        {
            id_parent == true && idParent !== null && formdata.append('id_parent', idParent)
        }

        try {
            const data = await EDIT_MASTER(formdata, dataId)
            if (data.code === 200 || data.code === '200') {
                toggleAddDrawer()
                clearFormData()
                toast.success(data.message)
                getAllMasterDataApi(pagination)
            } else {
                return toast.error(data.message)
            }
        } catch (e: any) {
            setApiErrorMessage(e?.data?.message)
        }

        return false
    }

    // ----- Master DELETE API ----- //
    const deleteMasterDataApi = async () => {
        try {
            const data = await DELETE_MASTER(dataId, MasterType)
            if (data.code === 200 || data.code === '200') {
                toast.success(data.message)
                setShowModel(!showModel)
                getAllMasterDataApi(pagination)
            } else {
                return toast.error(data.message)
            }
        } catch (error) { }
    }

    // ----- Master STATUS API ----- //
    const activeStatusDataApi = async (row: any) => {
        try {
            const data = await STATUS_UPDATE_MASTER(row.id, MasterType)
            if (data.code === 200 || data.code === '200') {
                toast.success('Successfully updated')
                getAllMasterDataApi(pagination)

                return true
            } else {
                return toast.error(data.message)
            }
        } catch (error) {
            return toast.error(appErrors.UNKNOWN_ERROR_TRY_AGAIN)
        }
    }

    // ----- Function ----- //
    const toggleAddDrawer = () => {
        setDrawerAction(!drawerAction)
    }

    const toggleEditorDrawer = () => setEditorDrawerAction(!editorDrawerAction)

    const handleChangePerPageRows = (perPageRows: any) => {
        getAllMasterDataApi({ ...pagination, per_page_rows: perPageRows.pageSize, current_page: perPageRows.page + 1 })
    }

    const handleChangeSortBy = (orderSort: any) => {
        getAllMasterDataApi({
            ...pagination,
            sort_by: orderSort == undefined ? 'id' : orderSort.map((t: any) => t.field),
            order_by: orderSort == undefined ? 'ASC' : orderSort.map((t: any) => t.sort)
        })
    }

    const searchBusinessUser = async () => {
        if (timer) {
            clearTimeout(timer)
        }

        timer = setTimeout(() => {
            getAllMasterDataApi({ ...pagination, current_page: 1, search_text: searchFilter })
        }, SEARCH_DELAY_TIME)
    }

    const handleChange = (event: SelectChangeEvent) => {
        setCategoryValue(event.target.value as string)
    }

    const handleIdParentChange = (event: SelectChangeEvent) => {
        setIdParent(event.target.value ? event.target.value : null)
    }

    const clearFormData = () => {
        reset()
        setImageShow(undefined)
        setCategoryValue('')
        setIdParent(null)
        setApiErrorMessage('')
    }

    const editOnClickHandler = (data: any) => {
        setValue('dataValue', data.sort_code)
        setValue('dataName', data.name)
        setValue('datalink', data.link)
        setValue('dataTaxValue', data.value)
        setDataId(data.id)
        setDataTaxValue(data.value)
        setDialogTitle(FormType.edit)
        setImageShow(data.image_path)
        setCategoryValue(data.id_metal)
        setIdParent(data.id_parent)
        setDataOrder(data?.order_by)
        setValue('dataOrder', data?.order_by === null ? '' : data?.order_by)
        toggleAddDrawer()
        setApiErrorMessage('')
    }

    const deleteOnclickHandler = (data: any) => {
        setDataId(data.id)
        setShowModel(!showModel)
    }

    const onsubmit = (data: any) => {
        if (dialogTitle === FormType.add) {
            if (AddImage && !imageFile) {
                setApiErrorMessage('Image is required')
                return
            }
            addMasterApi(data)
        } else if (dialogTitle === FormType.edit) {
            if (AddImage && !imageShow) {
                setApiErrorMessage('Image is required')
                return
            }
            editMasterDataApi(data)
        }
    }

    const handleImageURLs = (e: any) => {
        setImageFile(e)
    }

    // ----- column ----- //
    const column = [
        ...ColumnData,

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
            edit: 'edit',
            deleted: 'deleted',
            sortable: false,
            editOnClick: editOnClickHandler,
            deletedOnClick: deleteOnclickHandler
        }
    ]

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title={Title}></CardHeader>
                    <Divider />
                    <Box>
                        <TableHeader
                            isButton
                            value={searchFilter}
                            onChange={(e: any) => setSearchFilter(e.target.value)}
                            toggle={() => {
                                setDialogTitle(FormType.add)
                                toggleAddDrawer()
                                clearFormData()
                            }}
                            ButtonName={`Add ${Title}`}
                            infoButton={showInfo}
                            infotoggle={toggleEditorDrawer}
                        />
                    </Box>
                    <DataTable
                        column={column}
                        rows={getData}
                        handleSortChanges={handleChangeSortBy}
                        pageSize={parseInt(pagination.per_page_rows.toString())}
                        rowCount={pagination.total_items}
                        page={pagination.current_page - 1}
                        onPageChange={handleChangePerPageRows}
                        iconTitle={Title}
                    />
                </Card>
            </Grid>
            <Drawer
                open={drawerAction}
                anchor='right'
                variant='temporary'
                onClose={toggleAddDrawer}
                ModalProps={{ keepMounted: true }}
                sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
            >
                <DrawerHeader
                    title={`${dialogTitle} ${Title}`}
                    onClick={() => {
                        toggleAddDrawer()
                        clearFormData()
                    }}
                    tabBar
                />
                <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
                    <form onSubmit={handleSubmit(onsubmit)}>
                        <FormControl fullWidth sx={{ mb: 4 }}>
                            <Controller
                                name='dataName'
                                control={control}
                                rules={{ required: true }}
                                render={({ field }: any) => (
                                    <TextField
                                        autoFocus
                                        size='small'
                                        value={dataName}
                                        label={`${Title} Name`}
                                        onChange={e => setDataName(e.target.value)}
                                        error={Boolean(errors.dataName)}
                                        {...field}
                                    />
                                )}
                            />
                            {errors.dataName && <FormHelperText sx={{ color: 'error.main' }}>{FIELD_REQUIRED}</FormHelperText>}
                        </FormControl>
                        {SortCodeField === true && (
                            <FormControl fullWidth sx={{ mb: 4 }}>
                                <Controller
                                    name='dataValue'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }: any) => (
                                        <TextField
                                            autoFocus
                                            size='small'
                                            label={`${Title} Code`}
                                            value={dataValue}
                                            onChange={e => setDataValue(e.target.value)}
                                            error={Boolean(errors.dataValue)}
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.dataValue && <FormHelperText sx={{ color: 'error.main' }}>{FIELD_REQUIRED}</FormHelperText>}
                            </FormControl>
                        )}

                        {order === true && (
                            <FormControl fullWidth sx={{ mb: 4 }}>
                                <Controller
                                    name='dataOrder'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }: any) => (
                                        <TextField
                                            autoFocus
                                            size='small'
                                            label={`${Title} Order`}
                                            value={dataOrder}
                                            onChange={e => setDataOrder(e.target.value)}
                                            error={Boolean(errors.dataOrder)}
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.dataOrder && <FormHelperText sx={{ color: 'error.main' }}>{FIELD_REQUIRED}</FormHelperText>}
                            </FormControl>
                        )}

                        {taxValue === true && (
                            <FormControl fullWidth sx={{ mb: 4 }}>
                                <Controller
                                    name='dataTaxValue'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }: any) => (
                                        <TextField
                                            autoFocus
                                            size='small'
                                            label={`Tax Value`}
                                            value={taxValue}
                                            onChange={e => setDataTaxValue(e.target.value)}
                                            error={Boolean(errors.dataTaxValue)}
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.dataTaxValue && <FormHelperText sx={{ color: 'error.main' }}>{FIELD_REQUIRED}</FormHelperText>}
                            </FormControl>
                        )}

                        {link === true && (
                            <FormControl fullWidth sx={{ mb: 4 }}>
                                <Controller
                                    name='datalink'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }: any) => (
                                        <TextField
                                            autoFocus
                                            size='small'
                                            label={`${Title} Link`}
                                            value={datalink}
                                            onChange={e => setDataLink(e.target.value)}
                                            error={Boolean(errors.datalink)}
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.datalink && <FormHelperText sx={{ color: 'error.main' }}>{FIELD_REQUIRED}</FormHelperText>}
                            </FormControl>
                        )}

                        {DropDown === true && (
                            <SelectDropDown
                                sx={{ mb: 4 }}
                                fullWidth
                                inputLabel={DropDownLabelName}
                                label={DropDownLabelName}
                                value={categoryvalue}
                                id='controlled-select'
                                onChange={handleChange}
                                title='name'
                                Options={options}
                            />
                        )}

                        {id_parent === true && (dialogTitle === FormType.add || idParent !== null) && (
                            <SelectDropDown
                                sx={{ mb: 4 }}
                                fullWidth
                                inputLabel={`Select ${Title}`}
                                label={`Select ${Title}`}
                                value={idParent}
                                id='controlled-select'
                                onChange={handleIdParentChange}
                                title='name'
                                Options={parent}
                            />
                        )}

                        {AddImage && (
                            <FormControl fullWidth sx={{ mb: 4 }}>
                                <Controller
                                    name='imageFile'
                                    control={control}
                                    rules={{ required: dialogTitle === FormType.add }}
                                    render={({ field }) => (
                                        <>
                                            <Typography sx={{ mt: 4, mb: 4 }}>Image</Typography>
                                            <SingleFileUpload
                                                onDrop={(file: any) => {
                                                    setImageFile(file)
                                                    setImageShow(file)
                                                    field.onChange(file)
                                                }}
                                                onClick={removeimage}
                                                imageFile={imageShow}
                                                uploadedImage={imageFile}
                                                handleImageURL={handleImageURLs}
                                                error={Boolean(errors.imageFile)}
                                                {...field}
                                            />
                                            {errors.imageFile && (
                                                <FormHelperText sx={{ color: 'error.main' }}>Image is required</FormHelperText>
                                            )}
                                        </>
                                    )}
                                />
                            </FormControl>
                        )}

                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
                            <Button variant='contained' sx={{ mr: 3 }} type='submit'>
                                {dialogTitle === FormType.add ? 'SUBMIT' : 'EDIT'}
                            </Button>
                            <Button
                                variant='outlined'
                                color='secondary'
                                onClick={() => {
                                    toggleAddDrawer()
                                    clearFormData()
                                }}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </form>

                    {apiErrorMessage !== null ? (
                        <FormHelperText sx={{ color: 'error.main', paddingTop: '10px' }}>{apiErrorMessage}</FormHelperText>
                    ) : (
                        ''
                    )}
                </Box>
            </Drawer>

            {EditorField && (
                <Drawer
                    open={editorDrawerAction}
                    anchor='right'
                    variant='temporary'
                    onClose={toggleEditorDrawer}
                    ModalProps={{ keepMounted: true }}
                    sx={{ '& .MuiDrawer-paper': { width: { xs: 800, sm: 800 } } }}
                >
                    <DrawerHeader title={`Add ${Title} Info`} onClick={toggleEditorDrawer} />

                    <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
                        <form>
                            <Editor getHtmlData={setEditerData} data={`<p></p>`} called={true} />

                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
                                <Button variant='contained' sx={{ mr: 3 }}>
                                    Submit
                                </Button>
                                <Button variant='outlined' color='secondary' onClick={toggleEditorDrawer}>
                                    Cancel
                                </Button>
                            </Box>
                        </form>
                    </Box>
                </Drawer>
            )}

            <DeleteDataModel showModel={showModel} toggle={(show: any) => setShowModel(show)} onClick={deleteMasterDataApi} />
        </Grid>
    )
}

export default MasterComponent
