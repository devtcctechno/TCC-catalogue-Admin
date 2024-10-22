import { Box, Card, CardHeader, Divider, Drawer, Grid, Table, TableBody, TableCell, TableContainer, TableRow, Typography, Paper, TableHead } from '@mui/material'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { appErrors, configProductPath, DEFAULT_STATUS_CODE_SUCCESS, looseDiamondSampleFile } from 'src/AppConstants'
import TCCTableHeader from 'src/customComponents/data-table/header'
import TccDataTable from 'src/customComponents/data-table/table'
import { ICommonPagination } from 'src/data/interface'
import { LOOSE_DIAMOND_BULK, LOOSE_DIAMOND_DELETE, LOOSE_DIAMOND_DETAIL, LOOSE_DIAMOND_LIST } from 'src/services/AdminServices'
import { createPagination } from 'src/utils/sharedFunction'
import looseDiamondField from 'public/json/loose-diamonds-field.json'
import Image from 'next/image'

const LooseDiamond = () => {

    // constant
    const URL = `${looseDiamondSampleFile}`

    // state
    const [pagination, setPagination] = useState({ ...createPagination(), search_text: "" })
    const [result, setResult] = useState<any[]>([])
    const [drawerAction, setDrawerAction] = useState(false)
    const [looseDiamondDetail, setLooseDiamondDetail] = useState<any>()
    const [searchFilter, setSearchFilter] = useState()
    const [file, setFile] = useState<File>()
    const [loading, setLoading] = useState<boolean>()
    const [bulkErrorMessage, setBulkErrorMessage] = useState([])

    // use effect
    useEffect(() => {
        fetchLooseDiamondList(pagination);
    }, []);

    // function
    const fetchLooseDiamondBulk = async () => {
        const formData: any = new FormData()
        formData.append("diamond_csv", file)

        if (!file) {
            return toast.error("Please select file")
        }
        try {
            setLoading(true)
            const data = await LOOSE_DIAMOND_BULK(formData);
            if (data.code === 200 || data.code === "200") {
                if (data.data.code === 422) {
                    setBulkErrorMessage(data.data.data)
                } else {
                    toast.success(data.message);
                    fetchLooseDiamondList(pagination)
                    setFile(undefined)
                }
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
    }

    const fetchLooseDiamondList = async (mbPagination: ICommonPagination) => {
        try {
            const data = await LOOSE_DIAMOND_LIST(mbPagination);
            if (data.code === DEFAULT_STATUS_CODE_SUCCESS) {
                setPagination(data.data.pagination)
                setResult(data.data.result)
            } else {
                toast.error(data?.message)
            }
        } catch (e: any) {
            toast.error(e?.data?.message)
        }
    }

    const fetchLooseDiamondDetail = async (product_id: string) => {
        try {
            const data = await LOOSE_DIAMOND_DETAIL(product_id)
            if (data.code === DEFAULT_STATUS_CODE_SUCCESS) {
                setLooseDiamondDetail(data?.data)
            } else {
                toast.error(data?.message)
            }
        } catch (e: any) {
            toast.error(e?.data?.message)
        }
    }

    const deleteLooseDiamond = async (product_id: string) => {
        try {
            const data = await LOOSE_DIAMOND_DELETE(product_id)
            if (data.code === DEFAULT_STATUS_CODE_SUCCESS) {
                toast.success(data?.message)
                fetchLooseDiamondList(pagination)
            }
        } catch (error) {
            throw error
        }
    }

    const viewOnClickHandler = (data: any) => {
        fetchLooseDiamondDetail(data.id)
        setDrawerAction(true)
    }

    const handleChangeSortBy = (orderSort: any) => {
        fetchLooseDiamondList({
            ...pagination,
            sort_by: orderSort == undefined ? 'id' : orderSort.map((t: any) => t.field),
            order_by: orderSort == undefined ? 'ASC' : orderSort.map((t: any) => t.sort)
        })
    }

    const handleChangePerPageRows = (perPageRows: any) => {
        fetchLooseDiamondList({ ...pagination, per_page_rows: perPageRows.pageSize, current_page: perPageRows.page + 1 })
    }

    const toggleWishlistDrawer = () => {
        setDrawerAction(!drawerAction)
    }

    const deletedOnClickHandler = (row: any) => {
        deleteLooseDiamond(row.id)
    }

    /* demo file download */
    const onButtonClick = () => {
        fetch(URL).then(response => {
            response.blob().then(blob => {
                const fileURL = window.URL.createObjectURL(blob);
                let alink = document.createElement('a');
                alink.href = fileURL;
                alink.download = 'LOOSE_DIAMOND_BULK_UPLOAD.xlsx';
                alink.click();
            })
        })
    }

    // Table column //
    const column = [
        {
            flex: 1,
            value: 'certificate',
            headerName: 'Certificate',
            field: 'certificate',
            text: 'text'
        },
        {
            flex: 1,
            value: 'stone_type',
            headerName: 'Stone Type',
            field: 'stone_type',
            text: 'text'
        },
        {
            flex: 1,
            value: 'shape',
            headerName: 'Stone shape',
            field: 'shape',
            text: 'text'
        },

        {
            flex: 1,
            value: 'weight',
            headerName: 'Stone weight',
            field: 'weight',
            text: 'text'
        },

        {
            flex: 1,
            value: 'clarity',
            headerName: 'Clarity',
            field: 'clarity',
            text: 'text'
        },

        {
            flex: 1,
            value: 'color',
            headerName: 'Color',
            field: 'color',
            text: 'text'
        },
        {
            flex: 1,
            value: 'cut_grade',
            headerName: 'Cut',
            field: 'cut_grade',
            text: 'text'
        },
        {
            flex: 1,
            value: 'action',
            headerName: 'action',
            field: 'action',
            view: 'view',
            deleted: 'deleted',
            sortable: false,
            viewOnClick: viewOnClickHandler,
            deletedOnClick: deletedOnClickHandler
        }
    ]

    return (
        <Box>
            <Grid sx={{ mb: 10 }}>
                <Card>
                    {bulkErrorMessage.length > 0 && <Grid item xs={12} sm={12}>
                        <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
                            <Table stickyHeader aria-label='sticky table'>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align='left'>Column</TableCell>
                                        <TableCell align='right'>Error</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {bulkErrorMessage.map((t: any, index: any) => (
                                        <TableRow key={'ERR_' + index}>
                                            <TableCell align='left'>{t.row_id} :-</TableCell>
                                            <TableCell align='right'>{t.error_message}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>}
                </Card>
            </Grid>
            <Grid>
                <Card>
                    <CardHeader title='Loose Diamond'></CardHeader>
                    <Divider />
                    <Box>
                        <TCCTableHeader configButton value={searchFilter}
                            fileDownload={onButtonClick}
                            uploadFileName={file?.name}
                            onChange={(e: any) => setSearchFilter(e.target.value)}
                            onChangeUpload={(event: any) => setFile(event.target.files[0])}
                            uploadOnClick={fetchLooseDiamondBulk}
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
                            iconTitle='Loose Diamond'
                        />
                    </Box>
                </Card>
                <Drawer
                    open={drawerAction}
                    anchor='right'
                    variant='temporary'
                    onClose={toggleWishlistDrawer}
                    ModalProps={{ keepMounted: true }}
                    sx={{ '& .MuiDrawer-paper': { width: { xs: 600, sm: 500 } } }}
                >
                    <Box sx={{ padding: 2 }}>
                        <Typography
                            variant='h5'
                            sx={{ mb: 2, cursor: 'pointer', marginLeft: 5, marginTop: 5, marginBottom: 5 }}
                            onClick={toggleWishlistDrawer}
                        >
                            Loose Diamond Detail
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        <Image
                            src={looseDiamondDetail?.image_path ?? "/images/looseDiamondImage.gif"}
                            alt='Loose Diamond Image'
                            width={400}
                            height={400}
                            style={{ marginLeft: "auto", marginRight: "auto", display: "block" }}
                        />

                        <Table>
                            <TableBody>
                                {looseDiamondDetail &&
                                    looseDiamondField?.data.map(t => {
                                        return (
                                            <TableRow key={t.title}>
                                                <TableCell
                                                    sx={{
                                                        fontWeight: 'bold',
                                                        textTransform: 'capitalize',
                                                        fontSize: 17
                                                    }}
                                                >
                                                    {t.title}
                                                </TableCell>
                                                <TableCell
                                                    sx={{
                                                        fontSize: 17
                                                    }}
                                                >
                                                    {looseDiamondDetail[t.filed] === null ? '-' : looseDiamondDetail[t.filed]}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                            </TableBody>
                        </Table>
                    </Box>
                </Drawer>
            </Grid>
        </Box>
    )
}

export default LooseDiamond