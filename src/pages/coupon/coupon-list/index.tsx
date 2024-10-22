// ** MUI Imports
import { Divider, CardHeader, Grid, Card } from '@mui/material'
import { useEffect, useState } from 'react'
import TCCTableHeader from 'src/customComponents/data-table/header'
import TccDataTable from 'src/customComponents/data-table/table'
import Box from '@mui/material/Box'
import { appErrors, SEARCH_DELAY_TIME } from 'src/AppConstants'
import { createPagination } from 'src/utils/sharedFunction'
import { DELETE_COUPON, GET_ALL_COUPON, STATUS_COUPON } from 'src/services/AdminServices'
import { toast } from 'react-hot-toast'
import { ICommonPagination } from 'src/data/interface'
import DeleteDataModel from 'src/customComponents/delete-model'
import Router from 'next/router'

const CouponList = () => {

    let timer: any;
    const [searchFilter, setSearchFilter] = useState()
    const [id, setId] = useState('');
    const [pagination, setPagination] = useState({ ...createPagination(), search_text: "" })
    const [result, setResult] = useState([])
    const [showModel, setShowModel] = useState(false);

    // ** EDIT ONCLICK HANDLER
    const editOnClickHandler = async (data: any) => {
        Router.push({ pathname: "/coupon/coupon-detail/", query: { id: data.id } })

    }

    // ** DELETE ONCLICK HANDLER
    const deleteOnClickHandler = async (data: any) => {
        setId(data.id)
        setShowModel(!showModel)
    }

    // **  GET API CALL
    const getAllApi = async (mbPagination: ICommonPagination) => {
        try {
            const data = await GET_ALL_COUPON(mbPagination);
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
    }, [searchFilter]);

    // **  STATUS API 
    const statusApi = async (checked: boolean, row: any) => {
        try {
            const datas = await STATUS_COUPON(row.id)
            if (datas.code === 200 || datas.code === "200") {
                toast.success("Successfully updated")
                getAllApi(pagination)
                return true
            } else {
                return toast.error(datas.message)
            }
        } catch (error) {
            return toast.error(appErrors.UNKNOWN_ERROR_TRY_AGAIN)
        }
    }

    // ** DELETE API CALL
    const toggleModel = (showdata: any) => {
        setShowModel(showdata)
    }

    const deleteApi = async () => {
        try {
            const data = await DELETE_COUPON(id);
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

    // ** TABLE DATA 
    const column = [
        {
            width: 400,
            value: 'name',
            headerName: 'Name',
            field: 'name',
            text: 'text'
        },
        {
            width: 300,
            value: 'coupon_code',
            headerName: 'Coupon Code',
            field: 'coupon_code',
            text: 'text'
        },
        {
            width: 300,
            value: 'discount_amount',
            headerName: 'Discount Amount',
            field: 'discount_amount',
            text: 'text'
        },
        {
            width: 400,
            value: 'discount_type',
            headerName: 'Discount Type',
            field: 'discount_type',
            text: 'text'
        },
        {
            width: 100,
            value: 'is_active',
            headerName: 'Status',
            field: 'is_active',
            switch: 'switch',
            SwitchonChange: statusApi
        },
        {
            width: 150,
            headerName: 'Action',
            field: 'action',
            edit: "edit",
            editOnClick: editOnClickHandler,
            deleted: 'deleted',
            deletedOnClick: deleteOnClickHandler,
        },
    ]

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='Coupon'></CardHeader>
                    <Divider />
                    <Box>
                        <TCCTableHeader isButton value={searchFilter}
                            onChange={(e: any) => setSearchFilter(e.target.value)}
                            toggle={() => {
                                Router.push("/coupon/coupon-detail")
                            }}
                            ButtonName='Add Coupon'
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
                            iconTitle='Coupon'
                        />
                    </Box>
                </Card>
            </Grid>

            <DeleteDataModel showModel={showModel} toggle={toggleModel} onClick={deleteApi} />
        </Grid>
    )
}

export default CouponList