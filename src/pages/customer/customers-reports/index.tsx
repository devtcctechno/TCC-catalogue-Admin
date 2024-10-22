// ** MUI Imports
import { Divider, CardHeader, Grid, Card, SelectChangeEvent, Box, TextField, Button, } from '@mui/material'
import { subMonths } from 'date-fns'
import { forwardRef, useEffect, useState } from 'react'
import TccSelect from 'src/customComponents/Form-Elements/select'
import format from 'date-fns/format'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import XLSX from 'sheetjs-style'
import toast from 'react-hot-toast'
import { appErrors } from 'src/AppConstants'
import { ICommonReportPagination } from 'src/data/interface'
import { GET_ALL_CARTLIST_PRODUCT, GET_ALL_CUSTOMER_REPORT, GET_ALL_CUSTOMER_SUBSCRIBER, GET_ALL_TOP_SELLING_PRODUCT, GET_ALL_WISHLIST, GET_ALL_WISHLIST_PRODUCT } from 'src/services/AdminServices'

interface PickerProps {
    label?: string
    end: Date | number
    start: Date | number
}

type DateType = Date | undefined

const customerReportArray = [
    {
        id: 1,
        name: "Customers"
    },
    {
        id: 2,
        name: "Customers Subscribers"
    },
    {
        id: 3,
        name: "Customers Wishlist"
    },
    {
        id: 4,
        name: "Customers Cart"
    },
    {
        id: 5,
        name: "Top Selling Products "
    },
    // {
    //     id: 6,
    //     name: "Product Enquiries"
    // },
    // {
    //     id: 7,
    //     name: "Orders"
    // },
]

const CustomerReports = () => {

    const [reports, setReportsName] = useState<any>()
    const [startDate, setStartDate] = useState<DateType>(subMonths(new Date(), 8))
    const [endDate, setEndDate] = useState<DateType>(new Date())
    const [customerListData, setCustomerListData] = useState([])
    const [customerSubscriberData, setCustomerSubscriberData] = useState([])
    const [wishListData, setWishListData] = useState([])
    const [cartListData, setCartListData] = useState([])
    const [topSellingProductData, seTtopSellingProductData] = useState([])

    // *** CUSTOMER_API

    const getCustomerListApi = async (mbPagination: ICommonReportPagination) => {
        try {
            const data = await GET_ALL_CUSTOMER_REPORT(mbPagination);
            if (data.code === 200 || data.code === "200") {
                setCustomerListData(data?.data)
                if (data?.data.length <= 0) {
                    toast.error("Data Not Found")
                }
            } else {
                return toast.error(data.message);
            }
        } catch (e: any) {
            toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN);
        }
        return false;
    }

    // ***** CUSTOMER_SUBSCRIBER

    const getCustomerSubscriberListApi = async (mbPagination: ICommonReportPagination) => {
        try {
            const data = await GET_ALL_CUSTOMER_SUBSCRIBER(mbPagination);

            if (data.code === 200 || data.code === "200") {
                setCustomerSubscriberData(data?.data)
                if (data?.data.length <= 0) {
                    toast.error("Data Not Found")
                }
            } else {
                return toast.error(data.message);
            }
        } catch (e: any) {
            toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN);
        }
        return false;
    }

    // ***** WISHLIST_PRODUCT 

    const getWishListApi = async (mbPagination: ICommonReportPagination) => {
        try {
            const data = await GET_ALL_WISHLIST_PRODUCT(mbPagination);
            if (data.code === 200 || data.code === "200") {
                setWishListData(data?.data)
                if (data?.data.length <= 0) {
                    toast.error("Data Not Found")
                }
            } else {
                return toast.error(data.message);
            }
        } catch (e: any) {
            toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN);
        }
        return false;
    }

    // ***** CARTLIST_PRODUCT 

    const getCartListApi = async (mbPagination: ICommonReportPagination) => {
        try {
            const data = await GET_ALL_CARTLIST_PRODUCT(mbPagination);
            if (data.code === 200 || data.code === "200") {
                setCartListData(data?.data)
                if (data?.data.length <= 0) {
                    toast.error("Data Not Found")
                }
            } else {
                return toast.error("Data Not Found");
            }
        } catch (e: any) {
            toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN);
        }
        return false;
    }

    // ***** TOP_SELLING_PRODUCT_LIST 

    const getTopSellingProductListApi = async (mbPagination: ICommonReportPagination) => {
        try {
            const data = await GET_ALL_TOP_SELLING_PRODUCT(mbPagination);
            if (data.code === 200 || data.code === "200") {
                seTtopSellingProductData(data?.data)
                if (data?.data.length <= 0) {
                    toast.error("Data Not Found")
                }
            } else {
                return toast.error(data.message);
            }
        } catch (e: any) {
            toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN);
        }

        return false;
    }

    const handleChange = (event: SelectChangeEvent) => {
        setReportsName(event.target.value as string)
        if (startDate && endDate) {
            if (event.target.value == '1') {
                getCustomerListApi({ start_date: startDate, end_date: endDate });
            } else if (event.target.value == '2') {
                getCustomerSubscriberListApi({ start_date: startDate, end_date: endDate });
            } else if (event.target.value == '3') {
                getWishListApi({ start_date: startDate, end_date: endDate });
            } else if (event.target.value == '4') {
                getCartListApi({ start_date: startDate, end_date: endDate });
            } else if (event.target.value == '5') {
                getTopSellingProductListApi({ start_date: startDate, end_date: endDate });
            }
        }
    }

    const handleOnChange = (dates: any) => {
        const [start, end] = dates
        setStartDate(start)
        setEndDate(end)
        if (start && end) {
            if (reports == '1') {
                getCustomerListApi({ start_date: start, end_date: end });
            } else if (reports == '2') {
                getCustomerSubscriberListApi({ start_date: start, end_date: end });
            } else if (reports == '3') {
                getWishListApi({ start_date: start, end_date: end });
            } else if (reports == '4') {
                getCartListApi({ start_date: start, end_date: end });
            } else if (reports == '5') {
                getTopSellingProductListApi({ start_date: start, end_date: end });
            }
        }
    }

    const exportToExcel = () => {
        if (reports === undefined || reports === "") {
            toast.error("Please select customer reports name")
        } else {
            const worksheet = XLSX.utils.json_to_sheet(
                reports == '1' ? customerListData
                    : reports == '2' ? customerSubscriberData
                        : reports == '3' ? wishListData
                            : reports == '4' ? cartListData
                                : reports == '5' ? topSellingProductData
                                    : []);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            XLSX.writeFile(workbook,
                `${reports == '1' ? "CustomerListDataSheet.xlsx"
                    : reports == '2' ? "CustomerSubscriberDataSheet.xlsx"
                        : reports == '3' ? "WishListDataSheet.xlsx"
                            : reports == '4' ? "CartListDataSheet.xlsx"
                                : reports == '5' ? "TopSellingProductDataSheet.xlsx"
                                    : ''}`
            );
        }
    };

    const CustomInput = forwardRef((props: PickerProps, ref) => {
        const startDate = props.start !== null ? format(props.start, 'MM/dd/yyyy') : ""
        const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : ""

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
                    <CardHeader title='Reports'></CardHeader>
                    <Divider />
                    <Box style={{ display: 'flex', marginTop: '50px', justifyContent: 'space-between' }}>
                        <Grid item xs={12} sm={6} marginLeft={12} marginRight={5}>
                            <TccSelect
                                sx={{ mb: 4 }}
                                fullWidth
                                inputLabel="Customer Reports"
                                label='Customer Reports'
                                value={reports}
                                id='controlled-select'
                                onChange={handleChange}
                                title='name'
                                Options={customerReportArray}

                            />
                        </Grid>
                        <Grid item xs={12} sm={6} marginRight={12}>
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
                        </Grid>
                    </Box>

                    <Box style={{ marginBottom: '50px', marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                        <Button onClick={exportToExcel} variant='contained'>
                            Download Excel
                        </Button>
                    </Box>
                </Card>
            </Grid>

        </Grid >
    )
}

export default CustomerReports
