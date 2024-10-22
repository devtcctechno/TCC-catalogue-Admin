// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardHeader from '@mui/material/CardHeader'
import { Badge, Button, Divider, TextField } from '@mui/material'
import { forwardRef, useEffect, useState } from 'react'
import TccDataTable from 'src/customComponents/data-table/table'
import { Box } from '@mui/system'
import Router from 'next/router'
import CustomChip from 'src/@core/components/mui/chip'
import { ICommonOrderPagination } from 'src/data/interface'
import { GET_ALL_ORDERS } from 'src/services/AdminServices'
import { toast } from 'react-hot-toast'
import { SEARCH_DELAY_TIME, appErrors } from 'src/AppConstants'
import { createOrderPagination } from 'src/utils/sharedFunction'
import { OrderStatus } from 'src/data/type'
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

type DateType = Date | undefined

type statusCount = {
    all_order: number
    total_pendding_order: number
    total_confirm_order: number
    total_in_process_order: number
    total_out_of_delivery_order: number
    total_delivery_order: number
    total_returned_order: number
    total_cancel_order: number
    total_fail_order: number
}
const OrdersList = () => {

    let timer: any;

    const [searchFilter, setSearchFilter] = useState()
    const [startDate, setStartDate] = useState<any>(subMonths(new Date(), 3))
    const [endDate, setEndDate] = useState<any>(new Date())
    const [pagination, setPagination] = useState({ ...createOrderPagination(), order_status: 0 })
    const [result, setResult] = useState([])
    const [count, setCount] = useState<Partial<statusCount>>({})
    const [orderDate, setOrderDate] = useState({})
    const [pageSize, setPageSize] = useState(10)
    const [orderNumber, setOrderNumber] = useState('')
    const [orderStatus, setOrderStatus] = useState<number>()
    const viewOnClickHandler = (data: any) => {
        Router.push({ pathname: "/orders/orders-details", query: { orderNumber: data.order_number } })
    }

    /////////////////////// GET API ///////////////////////

    const getAllApi = async (mbPagination: ICommonOrderPagination) => {
        try {
            const data = await GET_ALL_ORDERS(mbPagination);

            if (data.code === 200 || data.code === "200") {
                setPagination(data.data.pagination)
                setResult(data.data.result)
                setCount(data.data.count || {})
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
            getAllApi({ ...pagination, per_page_rows: perPageRows.pageSize, current_page: perPageRows.page + 1, order_status: orderStatus, start_date: (moment(startDate).format('ddd MMM DD YYYY')), end_date: (moment(endDate).format('ddd MMM DD YYYY')) })
        } else {
            getAllApi({ ...pagination, per_page_rows: perPageRows.pageSize, current_page: perPageRows.page + 1, order_status: orderStatus })
        }
    }

    const handleOnPageChange = (page: number) => {
        getAllApi({ ...pagination, current_page: page + 1, order_status: orderStatus, start_date: (moment(startDate).format('ddd MMM DD YYYY')), end_date: (moment(endDate).format('ddd MMM DD YYYY')) })
    }

    const handleChangeSortBy = (orderSort: any) => {
        getAllApi({ ...pagination, sort_by: orderSort == undefined ? "id" : orderSort.map((t: any) => t.field), order_by: orderSort == undefined ? "DESC" : orderSort.map((t: any) => t.sort) })
    }

    const searchBusinessUser = async () => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            if ((orderStatus || orderStatus === 0) && (startDate && endDate)) {
                getAllApi({ ...pagination, current_page: 1, order_status: orderStatus, start_date: (moment(startDate).format('ddd MMM DD YYYY')), end_date: (moment(endDate).format('ddd MMM DD YYYY')), sort_by: "id", order_by: "asc" });
            } else {
                if ((orderStatus || orderStatus === 0) && (startDate === null && endDate === null)) {
                    getAllApi({ ...pagination, current_page: 1, order_status: orderStatus, sort_by: "id", order_by: "asc" })
                }
            }
        }, SEARCH_DELAY_TIME);
    }
    useEffect(() => {
        searchBusinessUser();
    }, [startDate, endDate, orderStatus]);

    const column = [
        {
            value: 'order_number',
            headerName: 'Order Number',
            field: 'order_number',
            text: 'text',
            width: 200
        },
        {
            value: 'order_date',
            headerName: 'date',
            field: 'order_date',
            date: 'date',
            width: 150
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
            width: 150,
            value: 'order_total',
            headerName: 'Total',
            field: 'order_total',
            price: 'price'
        },
        {
            headerName: 'order_status',
            field: 'order_status',
            value: 'order_status',
            order_status_chip: "order_status_chip",
            width: 140,
        },
        {
            width: 120,
            headerName: 'payment_status',
            field: 'payment_status',
            value: 'payment_status',
            payment_status_chip: "payment_status_chip"
        },
        {
            flex: 1,
            headerName: 'Action',
            view: 'view',
            viewOnClick: viewOnClickHandler

        },
    ]
    const handleOnChange = (dates: any) => {
        const [start, end] = dates
        if (start !== null && end !== null) {
            getAllApi({ ...pagination, current_page: 1, order_status: orderStatus, start_date: (moment(start).format('ddd MMM DD YYYY')), end_date: (moment(end).format('ddd MMM DD YYYY')), sort_by: "id", order_by: "asc" })
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 6, ml: 5, mr: 5, fontSize: 'medium' }}>
                        <Badge badgeContent={count.all_order == 0 ? "0" : count.all_order} max={count.all_order} color='primary' sx={{ mt: 5 }}>
                            <CustomChip rounded label='All' skin='light' sx={{ fontSize: 'medium' }}
                                onClick={() => setOrderStatus(OrderStatus.All)}
                            />
                        </Badge>

                        <Badge badgeContent={count.total_pendding_order == 0 ? "0" : count.total_pendding_order} max={count.total_pendding_order} color='primary' sx={{ mt: 5 }}>
                            <CustomChip rounded label='Pending' skin='light' sx={{ ml: 5, fontSize: 'medium' }}
                                onClick={() => setOrderStatus(OrderStatus.Pending)}
                            />
                        </Badge>

                        <Badge badgeContent={count.total_confirm_order == 0 ? "0" : count.total_confirm_order} max={count.total_confirm_order} color='primary' sx={{ mt: 5 }}>
                            <CustomChip rounded label='Confirmed' skin='light' sx={{ ml: 5, fontSize: 'medium' }}
                                onClick={() => setOrderStatus(OrderStatus.Confirmed)}
                            />
                        </Badge>

                        <Badge badgeContent={count.total_in_process_order == 0 ? "0" : count.total_in_process_order} max={count.total_in_process_order} color='primary' sx={{ mt: 5 }}>
                            <CustomChip rounded label='Processing' skin='light' sx={{ ml: 5, fontSize: 'medium' }}
                                onClick={() => setOrderStatus(OrderStatus.Processing)}
                            />

                        </Badge>

                        <Badge badgeContent={count.total_out_of_delivery_order == 0 ? "0" : count.total_out_of_delivery_order} max={count.total_out_of_delivery_order} color='primary' sx={{ mt: 5 }}>
                            <CustomChip rounded label='Out for Delivery' skin='light' sx={{ ml: 5, fontSize: 'medium' }}
                                onClick={() => setOrderStatus(OrderStatus.OutOfDelivery)}
                            />
                        </Badge>

                        <Badge badgeContent={count.total_delivery_order == 0 ? "0" : count.total_delivery_order} max={count.total_delivery_order} color='primary' sx={{ mt: 5 }}>
                            <CustomChip rounded label='Delivered' skin='light' sx={{ ml: 5, fontSize: 'medium' }}
                                onClick={() => setOrderStatus(OrderStatus.Delivered)}
                            />

                        </Badge>

                        <Badge badgeContent={count.total_returned_order == 0 ? "0" : count.total_returned_order} max={count.total_returned_order} color='primary' sx={{ mt: 5 }}>
                            <CustomChip rounded label='Returned' skin='light' sx={{ ml: 5, fontSize: 'medium' }}
                                onClick={() => setOrderStatus(OrderStatus.Returned)}
                            />

                        </Badge>

                        <Badge badgeContent={count.total_fail_order == 0 ? "0" : count.total_fail_order} max={count.total_fail_order} color='primary' sx={{ mt: 5 }}>
                            <CustomChip rounded label='Failed' skin='light' sx={{ ml: 5, fontSize: 'medium' }}
                                onClick={() => setOrderStatus(OrderStatus.Failed)}
                            />
                        </Badge>

                        <Badge badgeContent={count.total_cancel_order == 0 ? "0" : count.total_cancel_order} max={count.total_cancel_order} color='primary' sx={{ mt: 5 }}>
                            <CustomChip rounded label='Canceled' skin='light' sx={{ ml: 5, fontSize: 'medium' }}
                                onClick={() => setOrderStatus(OrderStatus.Canceled)}
                            />

                        </Badge>
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