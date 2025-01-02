// ** MUI Imports
import { Icon } from '@iconify/react'
import { Divider, CardHeader, Grid, Card, Drawer, Button, SelectChangeEvent, TextField, FormHelperText, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, FormControlLabel, Switch } from '@mui/material'
import { useEffect, useState } from 'react'
import TCCTableHeader from 'src/customComponents/data-table/header'
import TccDataTable from 'src/customComponents/data-table/table'
import Box from '@mui/material/Box'
import DrawerHeader from 'src/customComponents/components/drawer-header'
import { appErrors, FIELD_REQUIRED, SEARCH_DELAY_TIME } from 'src/AppConstants'
import TccSelect from 'src/customComponents/Form-Elements/select'
import { toast } from 'react-hot-toast'
import { ICommonDiamondGroupPagination } from 'src/data/interface'
import { createDiamondGroupPagination, exportToExcel } from 'src/utils/sharedFunction'
import DeleteDataModel from 'src/customComponents/delete-model'
import { ADD_DIAMOND_GROUP_MASTER, ADD_PRODUCT_DROPDOWN_LIST, ADD_TYPE_DIAMOND_GROUP_MASTER, BULK_UPLOAD_DIAMOND_GROUP_MASTER, DELETE_DIAMOND_GROUP_MASTER, EDIT_DIAMOND_GROUP_MASTER, GET_ALL_DIAMOND_GROUP_MASTER, GET_DIAMOND_GROUP_MASTER, STATUS_UPDATE_DIAMOND_GROUP_MASTER } from 'src/services/AdminServices'

const stone_type_List = [
    {
        id: 0,
        title: "None"
    },
    {
        id: 1,
        title: "Natural"
    },
    {
        id: 2,
        title: "Synthetic"
    },
    {
        id: 3,
        title: "Both"
    }
]

const DiamondgroupMaster = () => {

    let timer: any;
    const [searchFilter, setSearchFilter] = useState()
    const [drawerAction, setDrawerAction] = useState(false)
    const [editorDrawerAction, setEditorDrawerAction] = useState(false)
    const [filterModal, setFilterModal] = useState(false)
    const [diamondMasterId, setDiamondMasterId] = useState()
    const [diamondGroupMasterPagination, setDiamondGroupMasterPagination] = useState<ICommonDiamondGroupPagination>({
        ...createDiamondGroupPagination(), stone: '', shape: '', color: '', clarity: '', max_price: '', min_price: '', carat: ''
    })
    const [diamondGroupMasterResult, setDiamondGroupMasterResult] = useState([])

    const [stoneList, setStoneList] = useState([])
    const [shapeList, setShapeList] = useState([])
    const [mmSizeList, setMmSizeList] = useState([])
    const [colorList, setColorList] = useState([])
    const [clarityList, setClarityList] = useState([])
    const [cutsList, setCutsList] = useState([])
    const [seviveSizeList, setSeviveSizeList] = useState([])
    const [caratSizeList, setCaratSizeList] = useState([])

    const [stoneId, setStoneId] = useState('')
    const [shapeId, setShapeId] = useState('')
    const [mmSizeId, setMmSizeId] = useState('')
    const [colorId, setColorId] = useState('')
    const [clarityId, setClarityId] = useState('')
    const [cutsId, setCutsId] = useState('')
    const [seviveSizeId, setSeviveSizeId] = useState('')
    const [naturalRate, setNaturalRate] = useState('')
    const [caratSizeID, setCaratSizeId] = useState('')
    const [labGrownRate, setLabGrownRate] = useState('')
    const [file, setFile] = useState<File | undefined>(undefined)
    const [bulkErrorMessage, setBulkErrorMessage] = useState([])
    const [dialogTitle, setDialogTitle] = useState<'Add' | 'Edit'>('Add')
    const [showModel, setShowModel] = useState(false);
    const [minCaratRange, setMinCaratRange] = useState('')
    const [maxCaratRange, setMaxCaratRange] = useState('')
    const [stonePriceError, setStonePriceError] = useState('')
    const [stoneError, setStoneError] = useState('')
    const [shapeError, setShapeError] = useState('')

    const handleSelect = (key: any, value: any) => {
        setDiamondGroupMasterPagination((prevOptions: any) => ({
            ...prevOptions,
            [key]: value,
        }));
    };

    const toggleAddDiamondGroupMasterDrawer = () => {
        if (drawerAction === true) {
            setNaturalRate('')
            setLabGrownRate('')
        }
        setDrawerAction(!drawerAction)
        setStonePriceError('')
        setShapeError('')
        setStoneError('')
    }

    const toggleEditorDrawer = () => setEditorDrawerAction(!editorDrawerAction)

    const defaultValues = {
        stoneId: stoneId,
        shapeId: shapeId,
    }

    const toggleFilterModal = () => {
        setFilterModal(!filterModal)
        setDiamondGroupMasterPagination({ ...diamondGroupMasterPagination, stone: '', shape: '', color: '', clarity: '', max_price: '', min_price: '', carat: '' })
    }

    // ***** DIAMOND_TYPE_DROPDOWN 

    const handleDiamondChangeApi = async (event: SelectChangeEvent, row: any) => {
        const payload = {
            "id": row.id,
            "diamond_type": event.target.value,
        };
        try {
            const data = await ADD_TYPE_DIAMOND_GROUP_MASTER(payload);
            if (data.code === 200 || data.code === "200") {
                toast.success(data.message);
                getDiamondGroupMasterAPI(diamondGroupMasterPagination);
            } else {
                return toast.error(data.message);
            }
        } catch (e: any) {
            toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN);
        }
        return false;
    }

    const editOnClickHandler = async (data: any) => {
        setMinCaratRange(data.min_carat_range)
        setMaxCaratRange(data.max_carat_range)
        setDiamondMasterId(data.id);
        setStoneId(data.id_stone)
        setShapeId(data.id_shape)
        setMmSizeId(data.id_mm_size)
        setColorId(data.id_color)
        setClarityId(data.id_clarity)
        setCutsId(data.id_cuts)
        setCaratSizeId(data.id_carat)
        setSeviveSizeId(data.id_seive_size)
        setLabGrownRate(data.synthetic_rate)
        setNaturalRate(data.rate)
        setDialogTitle('Edit');
        toggleAddDiamondGroupMasterDrawer()
    }

    const deleteOnClickHandler = async (data: any) => {
        setDiamondMasterId(data.id)
        setShowModel(!showModel)
    }

    const clearFormDataHandler = () => {
        setStoneId('')
        setShapeId('')
        setMmSizeId('')
        setColorId('')
        setClarityId('')
        setCutsId('')
        setCaratSizeId('')
        setSeviveSizeId('')
        setNaturalRate('')
        setLabGrownRate('')
        setMinCaratRange('')
        setMaxCaratRange('')
        setStoneError('')
        setShapeError('')
        setStonePriceError('')

    }

    //////////////////// DROPDOWN API /////////////////////// 

    const getAllDropDownData = async () => {

        try {
            const data = await ADD_PRODUCT_DROPDOWN_LIST();
            if (data.code === 200 || data.code === "200") {
                setStoneList(data.data.stone)
                setShapeList(data.data.stone_shape)
                setColorList(data.data.stone_color)
                setCutsList(data.data.stone_cut)
                setClarityList(data.data.stone_clarity)
                setMmSizeList(data.data.MM_Size)
                setSeviveSizeList(data.data.stone_seive)
                setCaratSizeList(data.data.carat_size)

            } else {

                return toast.error(data.message);
            }
        } catch (e: any) {
            toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN)
        }
    }

    useEffect(() => {
        getAllDropDownData()
    }, [])

    /////////////////////// ADD API ///////////////////////

    const diamondMasterGroupAddApi = async (data: any) => {
        if (stoneId && shapeId && (naturalRate || labGrownRate)) {
            const payload = {
                "id_stone": stoneId ? stoneId : null,
                "id_shape": shapeId ? shapeId : null,
                "id_mm_size": mmSizeId != "" ? mmSizeId : null,
                "id_color": colorId != "" ? colorId : null,
                "id_clarity": clarityId != "" ? clarityId : null,
                "id_cuts": cutsId != "" ? cutsId : null,
                "id_seive_size": seviveSizeId != "" ? seviveSizeId : null,
                "id_carat": caratSizeID != "" ? caratSizeID : null,
                "rate": naturalRate != "" ? naturalRate : null,
                "synthetic_rate": labGrownRate != "" ? labGrownRate : null,
                "min_carat_range": minCaratRange ? minCaratRange : null,
                "max_carat_range": maxCaratRange ? maxCaratRange : null
            };
            try {
                const data = await ADD_DIAMOND_GROUP_MASTER(payload);
                if (data.code === 200 || data.code === "200") {
                    toggleAddDiamondGroupMasterDrawer();
                    toast.success(data.message);
                    clearFormDataHandler();
                    getDiamondGroupMasterAPI(diamondGroupMasterPagination);
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

    /////////////////////// GET API ///////////////////////

    const getDiamondGroupMasterAPI = async (mbPagination: ICommonDiamondGroupPagination) => {
        try {
            console.log(mbPagination)
            const data = await GET_DIAMOND_GROUP_MASTER(mbPagination);
            if (data.code === 200 || data.code === "200") {
                setDiamondGroupMasterPagination({ ...mbPagination, total_items: data.data.pagination.total_items, total_pages: data.data.pagination.total_pages, current_page: data.data.pagination.current_page })
                setDiamondGroupMasterResult(data.data.result)
            } else {
                return toast.error(data.message);
            }
        } catch (e: any) {
            toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN);
        }

        return false;
    }
    useEffect(() => {
        getDiamondGroupMasterAPI(diamondGroupMasterPagination);
    }, []);

    const handleChangePerPageRows = (perPageRows: any) => {
        setDiamondGroupMasterPagination({ ...diamondGroupMasterPagination, per_page_rows: perPageRows.pageSize, current_page: perPageRows.page + 1 })
        getDiamondGroupMasterAPI({
            ...diamondGroupMasterPagination, per_page_rows: perPageRows.pageSize, current_page: perPageRows.page + 1
        })
    }

    const handleChangeSortBy = (orderSort: any) => {
        setDiamondGroupMasterPagination({ ...diamondGroupMasterPagination, sort_by: orderSort == undefined ? "id" : orderSort.map((t: any) => t.field), order_by: orderSort == undefined ? "DESC" : orderSort.map((t: any) => t.sort) })

        getDiamondGroupMasterAPI({
            ...diamondGroupMasterPagination, sort_by: orderSort == undefined ? "id" : orderSort.map((t: any) => t.field), order_by: orderSort == undefined ? "DESC" : orderSort.map((t: any) => t.sort)
        })
    }

    /////////////////////// EDIT API ///////////////////////

    const diamondGroupMasterEditApi = async (data: any) => {
        const payload = {
            "id_stone": stoneId && stoneId,
            "id_shape": shapeId && shapeId,
            "id_mm_size": mmSizeId != "" ? mmSizeId : null,
            "id_color": colorId != "" ? colorId : null,
            "id_clarity": clarityId != "" ? clarityId : null,
            "id_cuts": cutsId != "" ? cutsId : null,
            "id_seive_size": seviveSizeId != "" ? seviveSizeId : null,
            "id_carat": caratSizeID != "" ? caratSizeID : null,
            "rate": naturalRate != "" ? naturalRate : null,
            "synthetic_rate": labGrownRate != "" ? labGrownRate : null,
            "min_carat_range": minCaratRange ? minCaratRange : null,
            "max_carat_range": maxCaratRange ? maxCaratRange : null
        };
        try {
            const data = await EDIT_DIAMOND_GROUP_MASTER(diamondMasterId, payload);
            if (data.code === 200 || data.code === "200") {
                toast.success(data.message);
                toggleAddDiamondGroupMasterDrawer();
                clearFormDataHandler();
                getDiamondGroupMasterAPI(diamondGroupMasterPagination);
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

    const diamondGroupMasterDeleteApi = async () => {
        try {
            const data = await DELETE_DIAMOND_GROUP_MASTER(diamondMasterId);
            if (data.code === 200 || data.code === "200") {
                toast.success(data.message);
                setShowModel(!showModel);
                getDiamondGroupMasterAPI(diamondGroupMasterPagination);
            } else {
                return toast.error(data.message);
            }
        } catch (e: any) {
            toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN);
        }

        return false;
    }

    //////////////////// STATUS API ///////////////////////

    const diamondGroupMasterStatusApi = async (checked: boolean, row: any) => {
        try {
            const data = await STATUS_UPDATE_DIAMOND_GROUP_MASTER(row.id);
            if (data.code === 200 || data.code === "200") {
                toast.success(data.message);
                getDiamondGroupMasterAPI(diamondGroupMasterPagination);
            } else {
                return toast.error(data.message);
            }
        } catch (e: any) {
            toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN);
        }

        return false;
    }

    /////////////////////// BULK UPLOAD API ///////////////////////

    const bulkUploadApi = async () => {
        const formData: any = new FormData()
        formData.append("diamond_csv", file || "")

        try {
            const data = await BULK_UPLOAD_DIAMOND_GROUP_MASTER(formData);
            if (data.code === 200 || data.code === "200") {
                getDiamondGroupMasterAPI(diamondGroupMasterPagination);
                setFile(undefined)
                toast.success(data.message);
            } else {
                toast.error(data?.message);
                return toast.error(data?.data?.map((t: any) => t?.error_message));
            }
        } catch (e: any) {
            toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN);
            setBulkErrorMessage(e?.data?.data)
        }
        return false;
    }

    const column = [
        {
            width: 150,
            value: 'diamond',
            headerName: 'Stone',
            field: 'diamond',
            text: 'text'
        },
        {
            width: 150,
            value: 'diamond_shape',
            headerName: 'Shape',
            field: 'diamond_shape',
            text: 'text'
        },
        {
            width: 150,
            value: 'diamond_carat',
            headerName: 'Carat Size',
            field: 'diamond_carat',
            text: 'text'
        },
        {
            width: 150,
            value: 'diamond_mm_size',
            headerName: 'MM Size',
            field: 'diamond_mm_size',
            text: 'text'
        },
        {
            width: 100,
            value: 'diamond_color',
            headerName: 'Color',
            field: 'diamond_color',
            text: 'text'
        },
        {
            width: 100,
            value: 'diamond_clarity',
            headerName: 'Clarity',
            field: 'diamond_clarity',
            text: 'text'
        },
        {
            width: 100,
            value: 'diamond_cuts',
            headerName: 'Cut',
            field: 'diamond_cuts',
            text: 'text'
        },
        {
            width: 150,
            value: 'rate',
            headerName: 'Natural Stone Price',
            field: 'rate',
            text: 'text'
        },
        {
            width: 150,
            value: 'synthetic_rate',
            headerName: 'Lab Grown Stone Price',
            field: 'synthetic_rate',
            text: 'text'
        },
        {
            width: 200,
            value: 'is_diamond_type',
            onChange: handleDiamondChangeApi,
            headerName: 'Diamond_type',
            field: 'Diamond_type',
            Options: stone_type_List,
            dropdown: "dropdown",
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
            headerName: 'status',
            field: 'is_active',
            switch: 'switch',
            value: 'is_active',
            SwitchonChange: diamondGroupMasterStatusApi


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
            if (naturalRate === '' && labGrownRate === '' && stoneId === '' && shapeId === '') {
                setStoneError(`${FIELD_REQUIRED}`)
                setShapeError(`${FIELD_REQUIRED}`)
                setStonePriceError("Natural stone price & Lab Grown stone price Please fill at least one field.")
            } else if (naturalRate === '' && labGrownRate === "") {
                setStonePriceError("Natural stone price & Lab Grown stone price Please fill at least one field.")
            } else {
                if ((naturalRate && (labGrownRate === null || labGrownRate === "")) || (labGrownRate && (naturalRate === null || naturalRate === ""))) {
                    diamondMasterGroupAddApi(data)
                }
            }
        } else {
            if (shapeId !== "" && stoneId !== "" && (naturalRate && (labGrownRate === null || labGrownRate === "")) || (labGrownRate && (naturalRate === null || naturalRate === ""))) {
                diamondGroupMasterEditApi(data)
            }
            else {
                if (!stoneId) {
                    setStoneError(`${FIELD_REQUIRED}`)
                } else if (!shapeId) {
                    setShapeError(`${FIELD_REQUIRED}`)
                } else if (!naturalRate && !labGrownRate) {
                    setStonePriceError("Natural stone price & Lab Grown stone price Please fill at least one field.")
                } else {
                    setStoneError("")
                    setShapeError("")
                    setStonePriceError("")
                }
            }
        }
    }
    const URL = 'https://tcctech-staging.s3.ap-south-1.amazonaws.com/samplecsv/Sample_DiamondGroup.xlsx'

    const onButtonClick = () => {
        fetch(URL).then(response => {
            response.blob().then(blob => {
                const fileURL = window.URL.createObjectURL(blob);
                let alink = document.createElement('a');
                alink.href = fileURL;
                alink.download = 'Sample_DiamondGroup.xlsx';
                alink.click();
            })
        })
    }

    const clearFilter = async () => {
        setDiamondGroupMasterPagination({ ...diamondGroupMasterPagination, stone: '', shape: '', color: '', clarity: '', max_price: '', min_price: '', carat: '', current_page: 1 })
        await getDiamondGroupMasterAPI({
            ...diamondGroupMasterPagination, stone: '', shape: '', color: '', clarity: '', max_price: '', min_price: '', carat: '', current_page: 1
        })
    }
    const handleExportClick = async () => {
        try {
            const data = await GET_ALL_DIAMOND_GROUP_MASTER()
            if (data.code === 200 || data.code === "200") {
                const exportData = data.data.map((t: any) => {
                    return {
                        stone: t.diamond ?? '',
                        shape: t.diamond_shape ?? '',
                        seive_size: t.diamond_seive_size ?? '',
                        mm_size: t.diamond_mm_size ?? '',
                        carat: t.diamond_carat ?? '',
                        color: t.diamond_color ?? '',
                        clarity: t.diamond_clarity ?? '',
                        cuts: t.diamond_cuts ?? '',
                        min_carat_range: t.min_carat_range ?? '',
                        max_carat_range: t.max_carat_range ?? '',
                        natural_rate: t.rate ?? '',
                        synthetic_rate: t.synthetic_rate ?? '',
                    }
                })

                exportToExcel(exportData, "Diamond_Group_master")
            }
        } catch (error) {
            toast.error(appErrors.UNKNOWN_ERROR_TRY_AGAIN)
            throw error
        }
    }
    return (
        <Grid container spacing={6}>
            {bulkErrorMessage !== undefined && bulkErrorMessage !== null && bulkErrorMessage.length > 0 ?
                <Grid item xs={12} sm={12}>
                    <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
                        <Table stickyHeader aria-label='sticky table'>
                            <TableHead>
                                <TableRow>
                                    <TableCell align='center'>Row Id</TableCell>
                                    <TableCell align='center'>Error Message</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {bulkErrorMessage && bulkErrorMessage.map((t: any, index: any) =>
                                    <TableRow key={"ERR_" + index}>
                                        <TableCell align='center' >
                                            {t.row_id}
                                        </TableCell>
                                        <TableCell align='center' >
                                            {t.error_message}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                : <></>}
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='Diamond Group Master'></CardHeader>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: "end", mt: 3 }}>
                        <Button variant='contained' sx={{ '& svg': { mr: 2 }, mr: 4 }} onClick={onButtonClick} >
                            <Icon icon='material-symbols:download' fontSize='1.125rem' /> Download
                        </Button>
                    </Box>
                    <Box style={{ display: 'flex', justifyContent: 'end' }}>
                        <TCCTableHeader importButton value={searchFilter}
                            onChange={(e: any) => setSearchFilter(e.target.value)}
                            onChangeUpload={(event: any) => setFile(event.target.files[0])}
                            uploadFileName={file?.name}
                            uploadOnClick={bulkUploadApi}
                            exportButton={true}
                            exportClick={handleExportClick}
                            toggle={() => {
                                setDialogTitle('Add')
                                clearFormDataHandler()
                                toggleAddDiamondGroupMasterDrawer()
                            }}
                            ButtonName='Add Diamond Group Master'
                        />
                    </Box>
                    <Box style={{ marginTop: '-40px', marginLeft: "20px", cursor: "pointer" }}>
                        <Icon icon="material-symbols:filter-alt-outline" fontSize='1.75rem' onClick={() => toggleFilterModal()} />
                    </Box>
                    {filterModal &&
                        <Card style={{ margin: '20px' }}>
                            <Box sx={{ display: "flex", margin: '20px', textAlign: 'center' }}>
                                <TccSelect
                                    sx={{ width: '15%' }}
                                    inputLabel="Stone"
                                    label='Stone'
                                    value={diamondGroupMasterPagination.stone || ''}
                                    id='controlled-select'
                                    onChange={(event: any) => handleSelect('stone', event.target.value)}
                                    title='name'
                                    Options={stoneList}
                                />
                                <TccSelect
                                    sx={{ ml: 2, width: '15%' }}
                                    inputLabel="Shape"
                                    label='Shape'
                                    value={diamondGroupMasterPagination.shape || ''}
                                    id='controlled-select'
                                    onChange={(event: any) => handleSelect('shape', event.target.value)}
                                    title='name'
                                    Options={shapeList}
                                />
                                <TccSelect
                                    sx={{ ml: 2, width: '15%' }}
                                    inputLabel="Carat Size"
                                    label='Carat Size'
                                    value={diamondGroupMasterPagination.carat || ''}
                                    id='controlled-select'
                                    onChange={(event: any) => handleSelect('carat', event.target.value)}
                                    title='name'
                                    Options={caratSizeList}
                                />
                                <TccSelect
                                    sx={{ ml: 2, width: '15%' }}
                                    inputLabel="Color"
                                    label='Color'
                                    value={diamondGroupMasterPagination.color || ''}
                                    id='controlled-select'
                                    onChange={(event: any) => handleSelect('color', event.target.value)}
                                    title='name'
                                    Options={colorList}
                                />
                                <TccSelect
                                    sx={{ ml: 2, width: '15%' }}
                                    inputLabel="Clarity"
                                    label='Clarity'
                                    value={diamondGroupMasterPagination.clarity || ''}
                                    id='controlled-select'
                                    onChange={(event: any) => handleSelect('clarity', event.target.value)}
                                    title='name'
                                    Options={clarityList}
                                />
                                <TextField
                                    sx={{ ml: 2, width: '15%' }}
                                    size='small'
                                    value={diamondGroupMasterPagination.min_price || ""}
                                    label='Min Price'
                                    onChange={(e) => handleSelect('min_price', e.target.value)}
                                />
                                <TextField
                                    sx={{ ml: 2, width: '15%' }}
                                    size='small'
                                    value={diamondGroupMasterPagination.max_price || ""}
                                    label='Max Price'
                                    onChange={(e: any) => handleSelect('max_price', e.target.value)}
                                />
                                <Button variant='contained' onClick={async () => {
                                    setDiamondGroupMasterPagination({ ...diamondGroupMasterPagination, current_page: 1 })
                                    await getDiamondGroupMasterAPI({ ...diamondGroupMasterPagination, current_page: 1 })
                                }} style={{ marginLeft: '10px', width: '15%' }}>Filter</Button>
                                <Button style={{ marginLeft: '10px' }} onClick={clearFilter}>clear</Button>
                            </Box>
                        </Card>
                    }
                    <Box sx={{ width: '100%' }}>
                        <TccDataTable
                            column={column}
                            rows={diamondGroupMasterResult}
                            handleSortChanges={handleChangeSortBy}
                            pageSize={diamondGroupMasterPagination.per_page_rows}
                            rowCount={diamondGroupMasterPagination.total_items}
                            page={(diamondGroupMasterPagination.current_page || 1) - 1}
                            onPageChange={handleChangePerPageRows}
                            iconTitle='Diamond Group Master'
                        />
                    </Box>
                </Card>
            </Grid >
            <Drawer
                open={drawerAction}
                anchor='right'
                variant='temporary'
                onClose={toggleAddDiamondGroupMasterDrawer}
                ModalProps={{ keepMounted: true }}
                sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
            >
                <DrawerHeader
                    title={`${dialogTitle} Diamond Group Master`}
                    onClick={() => {
                        clearFormDataHandler()
                        toggleAddDiamondGroupMasterDrawer()
                    }}
                    tabBar
                />

                <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
                    <TccSelect
                        fullWidth
                        sx={{
                            mb: 4,
                            '& .MuiInputLabel-root': {
                                color: stoneError ? 'error.main' : '#33303c99'
                            }
                        }}
                        isNoneValue='0'
                        inputLabel="Select Stone"
                        label='Select Stone'
                        value={stoneId}
                        id='controlled-select'
                        onChange={(event: any) => {
                            setStoneId(event.target.value)
                            if (event.target.value) {
                                setStoneError('')
                            } else {
                                setStoneError(`${FIELD_REQUIRED}`)
                            }
                        }}
                        title='name'
                        Options={stoneList}
                        error={stoneError ? true : false}
                    />
                    {stoneId === "" && <FormHelperText sx={{ color: 'error.main', mt: '-10px', mb: '10px' }}>{stoneError}</FormHelperText>}
                    <TccSelect
                        fullWidth
                        sx={{
                            mb: 4,
                            '& .MuiInputLabel-root': {
                                color: shapeError ? 'error.main' : '#33303c99'
                            }
                        }}
                        isNoneValue='0'
                        inputLabel="Select Shape"
                        label='Select Shape'
                        value={shapeId}
                        id='controlled-select'
                        onChange={(event: any) => {
                            setShapeId(event.target.value)
                            if (event.target.value) {
                                setShapeError('')
                            } else {
                                setShapeError(`${FIELD_REQUIRED}`)
                            }
                        }}
                        title='name'
                        Options={shapeList}
                        error={shapeError ? true : false}
                    />
                    {shapeId === "" && <FormHelperText sx={{ color: 'error.main', mt: '-10px', mb: '10px' }}>{shapeError}</FormHelperText>}
                    <TccSelect
                        sx={{ mb: 4 }}
                        fullWidth
                        inputLabel="Select carat Size"
                        label='Select carat Size'
                        value={caratSizeID}
                        id='controlled-select'
                        onChange={(event: any) => setCaratSizeId(event.target.value)}
                        title='name'
                        Options={caratSizeList}
                    />
                    <TccSelect
                        sx={{ mb: 4 }}
                        fullWidth
                        inputLabel="Select MM Size"
                        label='Select MM Size'
                        value={mmSizeId}
                        id='controlled-select'
                        onChange={(event: any) => setMmSizeId(event.target.value)}
                        title='value'
                        Options={mmSizeList}
                    />
                    <TccSelect
                        sx={{ mb: 4 }}
                        fullWidth
                        inputLabel="Select Color"
                        label='Select Color'
                        value={colorId}
                        id='controlled-select'
                        onChange={(event: any) => setColorId(event.target.value)}
                        title='name'
                        Options={colorList}
                    />
                    <TccSelect
                        sx={{ mb: 4 }}
                        fullWidth
                        inputLabel="Select Clarity"
                        label='Select Clarity'
                        value={clarityId}
                        id='controlled-select'
                        onChange={(event: any) => setClarityId(event.target.value)}
                        title='name'
                        Options={clarityList}
                    />
                    <TccSelect
                        sx={{ mb: 4 }}
                        fullWidth
                        inputLabel="Select Cuts"
                        label='Select Cuts'
                        value={cutsId}
                        id='controlled-select'
                        onChange={(event: any) => setCutsId(event.target.value)}
                        title='value'
                        Options={cutsList}
                    />
                    <TccSelect
                        sx={{ mb: 4 }}
                        fullWidth
                        inputLabel="Select Sevie Size"
                        label='Select seive Size'
                        value={seviveSizeId}
                        id='controlled-select'
                        onChange={(event: any) => setSeviveSizeId(event.target.value)}
                        title='name'
                        Options={seviveSizeList}
                    />
                    <TextField
                        autoFocus
                        fullWidth
                        size='small'
                        sx={{ mb: 4 }}
                        value={naturalRate}
                        label='Natural stone Price'
                        onChange={(e) => {
                            setNaturalRate(e.target.value)
                            if (labGrownRate && e.target.value) {
                                setStonePriceError("Natural stone price & Lab Grown stone price Please fill at least one field.")
                            } else if (e.target.value && labGrownRate === null) {
                                setStonePriceError("")
                            } else if (labGrownRate && e.target.value === "") {
                                setStonePriceError("")
                            } else {
                                setStonePriceError("")
                            }
                        }}
                        error={stonePriceError ? true : false}
                    />
                    {stonePriceError && <FormHelperText sx={{ color: 'error.main', mt: '-10px', mb: '10px' }}>{stonePriceError}</FormHelperText>}
                    <TextField
                        fullWidth
                        autoFocus
                        size='small'
                        sx={{ mb: 4 }}
                        value={labGrownRate}
                        label='Lab grown stone Price'
                        onChange={(e) => {
                            setLabGrownRate(e.target.value)
                            if (naturalRate && e.target.value) {
                                setStonePriceError("Natural stone price & Lab Grown stone price Please fill at least one field.")
                            } else if (naturalRate && e.target.value === '') {
                                setStonePriceError("")
                            } else {
                                setStonePriceError("")
                            }
                        }}
                        error={stonePriceError ? true : false}
                    />
                    {stonePriceError && <FormHelperText sx={{ color: 'error.main', mt: '-10px', mb: '10px' }}>{stonePriceError}</FormHelperText>}
                    <TextField
                        fullWidth
                        autoFocus
                        sx={{ mb: 4 }}
                        size='small'
                        value={minCaratRange || ""}
                        label='Min Carat range'
                        onChange={(e) => setMinCaratRange(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        autoFocus
                        sx={{ mb: 4 }}
                        size='small'
                        value={maxCaratRange || ""}
                        label='Max Carat Range'
                        onChange={(e: any) => setMaxCaratRange(e.target.value)}
                    />

                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
                        <Button variant='contained' sx={{ mr: 3 }} type="submit" onClick={(data) => onsubmit(data)}>
                            {dialogTitle === 'Add' ? "SUBMIT" : "EDIT"}
                        </Button>
                        <Button variant='outlined' color='secondary' onClick={toggleAddDiamondGroupMasterDrawer}>
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Drawer>
            <DeleteDataModel showModel={showModel} toggle={toggleModel} onClick={diamondGroupMasterDeleteApi} />
        </Grid >
    )
}

export default DiamondgroupMaster