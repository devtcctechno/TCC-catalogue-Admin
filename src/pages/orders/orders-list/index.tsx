// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardHeader from '@mui/material/CardHeader'
import {Divider, TextField } from '@mui/material'
import { forwardRef, useEffect, useState } from 'react'
import TccDataTable from 'src/customComponents/data-table/table'
import { Box } from '@mui/system'
import Router from 'next/router'
import { ICommonOrderPagination } from 'src/data/interface'
import { GET_ALL_ORDERS } from 'src/services/AdminServices'
import { toast } from 'react-hot-toast'
import {appErrors } from 'src/AppConstants'
import { createOrderPagination } from 'src/utils/sharedFunction'
import format from 'date-fns/format'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { subMonths } from 'date-fns'
import moment from 'moment'

interface PickerProps {
    label?: string
    end: Date | number
    start: Date | number
}

const OrdersList = () => {

    // ** Const
    let timer: any;

    // ** State's
    const [startDate, setStartDate] = useState<any>(subMonths(new Date(), 3))
    const [endDate, setEndDate] = useState<any>(new Date())
    const [pagination, setPagination] = useState({ ...createOrderPagination(), order_status: 0 })
    const [result, setResult] = useState([])
    
    const viewOnClickHandler = (data: any) => {
        Router.push({ pathname: "/orders/orders-details", query: { orderNumber: data.order_number } })
    }

    // ** List API 

    const getAllApi = async (mbPagination: ICommonOrderPagination) => {
        try {
            const data = await GET_ALL_ORDERS(mbPagination);
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
        getAllApi({ ...pagination, start_date: (moment(startDate).format('ddd MMM DD YYYY')), end_date: (moment(endDate).format('ddd MMM DD YYYY')) });
    }, []);

    const handleChangePerPageRows = (perPageRows: any) => {
        if (startDate !== null && endDate !== null) {
            getAllApi({ ...pagination, per_page_rows: perPageRows.pageSize, current_page: perPageRows.page + 1, start_date: (moment(startDate).format('ddd MMM DD YYYY')), end_date: (moment(endDate).format('ddd MMM DD YYYY')) })
        } else {
            getAllApi({ ...pagination, per_page_rows: perPageRows.pageSize, current_page: perPageRows.page + 1})
        }
    }

    const handleChangeSortBy = (orderSort: any) => {
        getAllApi({ ...pagination, sort_by: orderSort == undefined ? "id" : orderSort.map((t: any) => t.field), order_by: orderSort == undefined ? "DESC" : orderSort.map((t: any) => t.sort) })
    }

    const searchBusinessUser = async () => {
        if (timer) {
            clearTimeout(timer);
        };
    }

    useEffect(() => {
        searchBusinessUser();
    }, [startDate, endDate]);

    // ** Table Column

    const column = [
        {
            value: 'order_number',
            headerName: 'Order Number',
            field: 'order_number',
            text: 'text',
            width: 300
        },
        {
            value: 'order_date',
            headerName: 'date',
            field: 'order_date',
            date: 'date',
            width: 200
        },
        {
            value: 'user_name',
            headerName: 'Customer Name',
            field: 'customer Name',
            gustName: 'gustName',
            value2: 'full_name',
            width: 250
        },
        {
            width: 200,
            value: 'sub_total',
            headerName: 'Total',
            field: 'sub_total',
            price: 'price'
        },
        {
            width: 100,
            headerName: 'Action',
            view: 'view',
            viewOnClick: viewOnClickHandler

        },
    ]

    const handleOnChange = (dates: any) => {
        const [start, end] = dates
        if (start !== null && end !== null) {
            getAllApi({ ...pagination, current_page: 1, start_date: (moment(start).format('ddd MMM DD YYYY')), end_date: (moment(end).format('ddd MMM DD YYYY')), sort_by: "id", order_by: "asc" })
        }
        setStartDate(start)
        setEndDate(end)
    }

    const CustomInput = forwardRef((props: PickerProps, ref) => {
        const startDate = props.start !== null ? format(props.start, 'MM/dd/yyyy') : ''
        const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : ''
        const value = `${startDate}${endDate !== null ? endDate : ''}`
        return <TextField
            sx={{ mb: 4 }}
            size='small'
            fullWidth
            inputRef={ref}
            label={props.label || ''} {...props}
            value={value}
        />
    })

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='Product Order Transactions' />
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'end', mr: 9, mt: 5 }} >
                        <DatePickerWrapper>
                            <DatePicker
                                selectsRange
                                endDate={endDate}
                                selected={startDate}
                                startDate={startDate}
                                id='date-range-picker'
                                onChange={handleOnChange}
                                shouldCloseOnSelect={true}
                                customInput={
                                    <CustomInput label='Search Dates' start={startDate as Date | number} end={endDate as Date | number} />
                                }
                            />
                        </DatePickerWrapper>
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
                        />
                    </Box>
                </Card>
            </Grid>
        </Grid>
    )
}

export default OrdersList