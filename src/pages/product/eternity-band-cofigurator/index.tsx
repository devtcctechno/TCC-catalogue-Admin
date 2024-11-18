// ** MUI Imports
import { Divider, CardHeader, Grid, Card, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material'
import { useEffect, useState } from 'react'
import TCCTableHeader from 'src/customComponents/data-table/header'
import TccDataTable from 'src/customComponents/data-table/table'
import Box from '@mui/material/Box'
import { appErrors, configProductPath, SEARCH_DELAY_TIME } from 'src/AppConstants'
import { createPagination } from 'src/utils/sharedFunction'
import { toast } from 'react-hot-toast'
import { ICommonPagination } from 'src/data/interface'
import DeleteDataModel from 'src/customComponents/delete-model'
import { CONFIG_PRODUCT, CONFIG_PRODUCT_DELETE, ETERNITY_CONFIG_PRODUCT, GET_ALL_ETERNITY_BAND_PRODUCT, GET_ALL_THREESTONECONFIGPRODUCT } from 'src/services/AdminServices'
import Router from 'next/router'



const EternityBandConfigurator = () => {

    let timer: any;
    const [searchFilter, setSearchFilter] = useState()
    const [drawerAction, setDrawerAction] = useState(false)
    const [id, setId] = useState('')
    const [file, setFile] = useState<File>()
    const [pagination, setPagination] = useState({ ...createPagination(), search_text: "" })
    const [result, setResult] = useState([])
    const [dialogTitle, setDialogTitle] = useState<'Add' | 'Edit'>('Add')
    const [showModel, setShowModel] = useState(false);
    const [bulkErrorMessage, setBulkErrorMessage] = useState([])
    const [loading, setLoading] = useState<boolean>()
    const karatData = process?.env?.NEXT_PUBLIC_KARAT_VALUE
    const toggleAddConfigutorDrawer = () => setDrawerAction(!drawerAction)

    const viewOnClickHandler = (data: any) => {
        Router.push({ pathname: "/product/eternity-band-config-detail", query: { id: data?.id } })
    }

    /* demo file download */

    const URL = `${configProductPath}`

    const onButtonClick = () => {
        fetch(URL).then(response => {
            response.blob().then(blob => {
                const fileURL = window.URL.createObjectURL(blob);
                let alink = document.createElement('a');
                alink.href = fileURL;
                alink.download = 'CONFIG_PRODUCT_BULK_UPLOAD.xlsx';
                alink.click();
            })
        })
    }

    const deleteOnClickHandler = async (data: any) => {
        setId(data.id)
        setShowModel(!showModel)
    }

    ///////////////////// GET API ///////////////////////

    const getAllApi = async (mbPagination: ICommonPagination) => {
        try {
            const data = await GET_ALL_ETERNITY_BAND_PRODUCT(mbPagination);
            if (data.code === 200 || data.code === "200") {
                setPagination(data.data.pagination)
                const productData: any = [];
                for (const item of data.data.productList) {
                    productData.push({
                        id: item.id, product_title: item.product_title.replace("ct", `${karatData}`), sku: item.sku,
                        center_Diamond_shape: item.diamond_shape_name, center_diamond_carat: item.diamond_carat_size,
                        center_diamond_clarity: item.diamond_clarity_value, center_diamond_color: item.diamond_color_name,
                        center_diamond_cut: item.diamond_cut_value
                    });
                }
                setResult(productData)
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
    }, [searchFilter]);

    /////////////////////// BULK UPLOAD API ///////////////////////

    const bulkUploadApi = async () => {
        const formData: any = new FormData()
        formData.append("config_csv", file || "")

        try {
            setLoading(true)
            const data = await ETERNITY_CONFIG_PRODUCT(formData);
            if (data.code === 200 || data.code === "200") {
                toast.success(data.message);
                getAllApi(pagination)
                setFile(undefined)
            } else {
                toast.error(data.message);
                return toast.error(data.data.map((t: any) => t.error_message));
            }
        } catch (e: any) {
            setLoading(false)
            toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN);
            setBulkErrorMessage(e.data.data)
        }
        setLoading(false)
        return false;
    }

    /////////////////////// DELETE API ///////////////////////

    const toggleModel = (showdata: any) => {
        setShowModel(showdata)
    }

    const deleteApi = async () => {
        const payload = {
            "id_product": parseInt(id),
        };

        try {
            const data = await CONFIG_PRODUCT_DELETE(payload);
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

    const column = [
        {
            width: 400,
            value: 'product_title',
            headerName: 'Product Name',
            field: 'product_title',
            text: 'text'
        },
        {
            width: 400,
            value: 'sku',
            headerName: 'Product SKU',
            field: 'sku',
            text: 'text'
        },
        {
            width: 150,
            value: 'center_Diamond_shape',
            headerName: 'Diamond Shape',
            field: 'center_Diamond_shape',
            text: 'text'
        },
        {
            width: 150,
            value: 'center_diamond_carat',
            headerName: 'Diamond Carat',
            field: 'center_diamond_carat',
            text: 'text'
        },
        {
            width: 150,
            value: 'center_diamond_color',
            headerName: 'Diamond Color',
            field: 'center_diamond_color',
            text: 'text'
        },
        {
            width: 150,
            value: 'center_diamond_clarity',
            headerName: 'Diamond Clarity',
            field: 'center_diamond_clarity',
            text: 'text'
        },
        {
            width: 150,
            value: 'center_diamond_cut',
            headerName: 'Diamond Cut',
            field: 'center_diamond_cut',
            text: 'text'

        },
        {
            width: 100,
            headerName: 'Action',
            field: 'action',
            view: 'view',
            viewOnClick: viewOnClickHandler,
            deleted: 'deleted',
            deletedOnClick: deleteOnClickHandler,
        },


    ]
    return (
        <Grid container spacing={6}>
            {bulkErrorMessage != null && bulkErrorMessage.length > 0 ?
                <Grid item xs={12} sm={12}>
                    <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
                        <Table stickyHeader aria-label='sticky table'>
                            <TableHead>
                                <TableRow>
                                    <TableCell align='center'>Row Id / Product Style No.</TableCell>
                                    <TableCell align='center'>Error Message</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {bulkErrorMessage && bulkErrorMessage.map((t: any, index: any) =>
                                    <TableRow key={"ERR_" + index}>
                                        <TableCell align='center' >
                                            {t?.row_id && `Row Id :  ${t?.row_id}`}
                                            {t?.head_no && `Head No :  ${t?.head_no}`}
                                            {t?.shank_no && `Shank No :  ${t?.shank_no}`}
                                            {t?.band_no && `Band No:  ${t?.band_no}`}
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
                    <CardHeader title='Eternity Band Configurator Product'></CardHeader>
                    <Divider />
                    <Box>
                        <TCCTableHeader configButton value={searchFilter}
                            fileDownload={onButtonClick}
                            uploadFileName={file?.name}
                            onChange={(e: any) => setSearchFilter(e.target.value)}
                            onChangeUpload={(event: any) => setFile(event.target.files[0])}
                            uploadOnClick={bulkUploadApi}
                            loading={loading}
                        />
                    </Box>
                    <Box sx={{ width: '100%' }}>
                        <TccDataTable
                            column={column}
                            rows={result}
                            handleSortChanges={handleChangeSortBy}
                            pageSize={parseInt(pagination.per_page_rows.toString())}
                            rowCount={pagination.total_items}
                            page={pagination.current_page - 1}
                            onPageChange={handleChangePerPageRows}
                            iconTitle='Configutor'
                        />
                    </Box>
                </Card>
            </Grid>
            <DeleteDataModel showModel={showModel} toggle={toggleModel} onClick={deleteApi} />
        </Grid>
    )
}

export default EternityBandConfigurator;