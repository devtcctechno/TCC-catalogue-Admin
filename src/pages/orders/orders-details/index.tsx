import { Icon } from "@iconify/react"
import { Avatar, Button, Card, CardContent, CardHeader, Divider, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { Box } from "@mui/system"
import moment from "moment"
import Router, { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import CustomChip from 'src/@core/components/mui/chip'
import { CURRENCY_VALUE, DATEPICKER_DATE_FORMAT } from "src/AppConfig"
import { appErrors, PAYMENT_STATUS } from "src/AppConstants"
import TccDataTable from "src/customComponents/data-table/table"
import TccSelect from "src/customComponents/Form-Elements/select"
import { DELIVERY_STATUS, ORDER_STATUS_UPDATE, ORDERS_DETAIL } from "src/services/AdminServices"
import { firstLetterUpperCaseText } from "src/utils/sharedFunction"


const OrderStatus = [
    { title: 'Pending', id: 1 },
    { title: "Confirmed", id: 2 },
    { title: 'Processing', id: 3 },
    { title: 'OutOfDelivery', id: 4 },
    { title: 'Delivered', id: 5 },
    { title: 'Returned', id: 6 },
    { title: 'Failed', id: 7 },
    { title: 'Canceled', id: 8 },
]

const DeliverStatus = [
    { title: 'Pending', id: 1 },
    { title: 'Deliver', id: 2 },
]

const paymentMethod = [
    { title: 'CashOnDelivery', id: 1 },
    { title: 'Paypal', id: 2 },
    { title: 'Affirm', id: 3 },
    { title: 'YOCO', id: 4 },
    { title: 'Card', id: 5 }
]

const shippingMethod = [
    { title: 'Pick up at showroom ', id: 1 },
    { title: 'Ship to my address', id: 2 },
]
type OrderData = {
    id: number
    order_number: string
    order_status: any
    order_date: string
    email: string
    user_name: string
    user_email: string
    user_phone_number: string
    shipping_add_country: string
    shipping_add_state: string
    shipping_add_city: string
    billing_add_country: string
    billing_add_state: string
    billing_add_city: string
    sub_total: any
    total_tax: number
    shipping_cost: any
    payment_method: any
    discount: any
    order_shipping_address: any
    order_billing_address: any
    payment_status: any
    order_total: any
    payment_transaction_id: any
    shipping_method: any
}

type ShippingData = {
    house_builing: string
    area_name: string
    pincode: number
    city_id: number
    state_id: number
    country_id: number
    phone_number: number
}

type BillingData = {
    house_builing: string
    area_name: string
    pincode: number
    city_id: number
    state_id: number
    country_id: number
    phone_number: number
}

const OrderDetails = () => {

    const [pageSize, setPageSize] = useState(10)
    const [orderDetailData, setOrderDetailData] = useState<{
        id: number, quantity: number, sub_total: number, product_tax: any, product_name: string, product_sku: string, metal: string, diamond_rate: any, Karat: number, Metal_tone: string, product_size: number, product_length: number, product_image: any[],
        engraving: any[], product_type: any, gemstone: any[], product_price: any, delivery_status: any, discount: any, sort_description: any
    }[]>([])
    const [orderData, setOrderData] = useState<Partial<OrderData>>({})
    const [shippingData, setShippingData] = useState<Partial<ShippingData>>({})
    const [billingData, setBillingData] = useState<Partial<BillingData>>({})
    const [orderStatusUpdate, setOrderStatusUpdate] = useState('')
    const [deliveryStatus, setDeliveryStatus] = useState('')
    const [orderNumberData, setOrderNumber] = useState('')
    const [orderTaxData, setOrderTaxData] = useState([])
    const router = useRouter();
    const { orderNumber } = router.query;
    const karatData = process?.env?.NEXT_PUBLIC_KARAT_VALUE
    const invoiceOnClick = () => {
        Router.push({ pathname: "/orders/invoice/invoice-list", query: { id: orderData.id } })
    }

    const invoicePrintOnClick = () => {
        Router.push({ pathname: "/orders/invoice/invoice-layout", query: { id: orderData.id } })
    }

    const orderStatus: any = {
        1: { title: 'Pending', color: 'primary' },
        2: { title: 'Confirmed', color: 'success' },
        3: { title: 'Processing', color: 'warning' },
        4: { title: 'OutOfDelivery', color: 'info' },
        5: { title: 'Delivered', color: 'success' },
        6: { title: 'Returned', color: 'warning' },
        7: { title: "Failed", color: "error" },
        8: { title: "Canceled", color: "error" }
    }

    const deliveryStatusList: any = {
        1: { title: 'Pending', color: 'primary' },
        2: { title: 'Deliver', color: 'success' },
    }

    const paymentStatusList: any = {
        0: { title: 'Pending', color: 'error' },
        1: { title: 'Paid', color: 'success' },
        2: { title: 'Failed', color: 'error' }
    }

    /////////////////////// ORDER-DETAILS //////////////////////////

    const ordersDetailsData = async (orderNumber: any) => {
        const payload = {
            "order_number": orderNumber,
        };
        try {
            const data = await ORDERS_DETAIL(payload);
            if (data && data.code === 200 || data.code === "200") {
                setOrderData(data.data)
                setOrderTaxData(JSON.parse(data.data.order_taxs))
                setOrderStatusUpdate(data.data.order_status)
                const orderTableData = [];
                for (const item of data.data.order) {
                    orderTableData.push({
                        id: item?.product_id, quantity: item.quantity,
                        sub_total: item?.sub_total?.toFixed(2),
                        product_tax: item.product_tax == null ? <Typography>00.00</Typography> : <Typography>{item.product_tax}</Typography>,
                        product_name: item.product_name.replace("ct", `${karatData}`), product_sku: item.product_sku, metal: item.metal,
                        diamond_rate: item.diamond_rate, Karat: item.Karat,
                        Metal_tone: item.Metal_tone, product_size: item.product_size, product_length: item.product_length,
                        product_image: item.product_image,
                        product_price: item.product_price?.toFixed(2),
                        delivery_status: item.delivery_status, discount: item.discount == null ?
                            <Typography>00.00</Typography> : <Typography>{item.discount}</Typography>,
                        gemstone: item.order_details_json.gemstone,
                        engraving: item.order_details_json.engraving,
                        product_type: item.order_details_json.product_type,
                        sort_description: item?.product ? item?.product?.sort_description : item?.sort_description
                    });
                }
                setOrderDetailData(orderTableData);
                setShippingData(data.data.order_shipping_address)
                setBillingData(data.data.order_billing_address)

            } else {
                return toast.error(data.message);
            }
        } catch (e: any) {
            toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN);
        }

        return false;
    }
    useEffect(() => {
        const orderNumberValue: string = orderNumber as string
        if (orderNumberValue != undefined) {
            setOrderNumber(orderNumberValue)
            ordersDetailsData(orderNumber)
        }
    }, [router.isReady])

    //////////////////// ORDER STATUS API ///////////////////////

    const orderStatusApi = async (order: number) => {
        const payload = {
            "id": orderData.id,
            "order_status": order,
        };
        try {
            const data = await ORDER_STATUS_UPDATE(payload);
            if (data.code === 200 || data.code === "200") {
                ordersDetailsData(orderNumber)

                toast.success(data.message);
            } else {
                return toast.error(data.message);
            }
        } catch (e: any) {
            toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN);
        }

        return false;
    }

    const handleChangeOrderStatus = (e: any) => {
        orderStatusApi(e.target.value)
        setOrderStatusUpdate(e.target.value);
    }

    const handleChangeDeliveryStatus = (event: any) => {
        deliveryStatusApi(event.target.value)
        setDeliveryStatus(event.target.value)
    }

    //////////////////// DELIVERY STATUS API ///////////////////////

    const deliveryStatusApi = async (delivery: number) => {
        const payload = {
            "order_id": orderData.id,
            "delivery_status": delivery,
        };
        try {
            const data = await DELIVERY_STATUS(payload);
            if (data.code === 200 || data.code === "200") {
                ordersDetailsData(orderNumber)
                setDeliveryStatus(data.data)
                toast.success(data.message);
                ordersDetailsData
            } else {
                return toast.error(data?.message);
            }
        } catch (e: any) {
            toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN);
        }

        return false;
    }
    return (
        <>
            <Button variant='contained' sx={{ mr: 3, mb: 4, '& svg': { mr: 2 } }} onClick={() => Router.back()}>
                <Icon icon='material-symbols:arrow-back-rounded' />
                Back
            </Button>
            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="h6" sx={{ mr: 4 }}>{orderData?.order_number}</Typography>
                            <CustomChip
                                rounded
                                skin='light'
                                size='small'
                                label={orderStatus[orderData?.order_status]?.title}
                                color={orderStatus[orderData?.order_status]?.color}
                                sx={{ textTransform: 'capitalize', mr: 4 }}
                            />
                            <Icon icon='material-symbols:calendar-month' style={{ fontSize: '20px' }} />
                            <Typography sx={{ ml: 2, fontSize: "13px" }}>{moment(orderData?.order_date).format(DATEPICKER_DATE_FORMAT)}</Typography>
                        </CardContent>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', ml: 5 }}>
                            <Box>
                                <Button
                                    sx={{ mb: 2, fontSize: '12px' }}
                                    color='primary'
                                    disabled={orderData?.payment_status === PAYMENT_STATUS.paid ? false : true}
                                    onClick={invoicePrintOnClick}>
                                    <Icon icon='tabler:printer' style={{ fontSize: '20px', marginRight: 8 }} />
                                    print Invoice
                                </Button>
                                <Button sx={{ mb: 2, fontSize: '12px' }}
                                    color='primary'
                                    disabled={orderData?.payment_status === PAYMENT_STATUS.paid ? false : true}
                                    onClick={invoiceOnClick}>
                                    <Icon icon='tabler:eye' style={{ fontSize: '20px', marginRight: 8 }} />
                                    View Invoice</Button>
                            </Box>
                            <Box>
                                <TccSelect
                                    disabled={orderData?.payment_status === PAYMENT_STATUS.paid ? false : true}
                                    inputLabel="Order Status"
                                    label='Order Status'
                                    Options={OrderStatus}
                                    value={orderStatusUpdate}
                                    title='title'
                                    isNoneValue='0'
                                    onChange={handleChangeOrderStatus}
                                    sx={{ width: '200px' }}
                                />
                            </Box>
                        </CardContent>
                        <Divider />
                    </Card>
                </Grid>
                <Grid item xs={12} md={8} lg={8}>
                    <Grid item xs={12}>
                        <Card sx={{ mb: 6 }}>
                            <CardHeader title='Order Details' />
                            <Divider />
                            <CardContent sx={{ display: 'grid', justifyContent: 'end' }}>
                                <Typography sx={{ fontSize: "13px" }}>Payment Method: {paymentMethod.find((t: any) => t.id === orderData?.payment_method)?.title}</Typography>
                                {orderData.payment_transaction_id &&
                                    <Typography sx={{ fontSize: "13px" }}>Payment Method Reference : {orderData.payment_transaction_id}</Typography>
                                }
                            </CardContent>
                            <Divider />

                            <Grid item xs={12} sm={12} sx={{ mt: "30px" }}>
                                <TableContainer component={Paper} sx={{
                                    "&::-webkit-scrollbar": {
                                        width: 4,
                                        height: 4
                                    },
                                    "&::-webkit-scrollbar-track": {
                                        backgroundColor: "white"
                                    },
                                    "&::-webkit-scrollbar-thumb": {
                                        backgroundColor: "#dcdcdc",
                                        borderRadius: 2
                                    },
                                    maxHeight: 350
                                }} >
                                    <Table stickyHeader aria-label='sticky table'>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align='center' sx={{ minWidth: 80 }}>Image</TableCell>
                                                <TableCell align='center' sx={{ minWidth: 280 }}>Name</TableCell>
                                                <TableCell align='center' sx={{ minWidth: 280 }}>SKU</TableCell>
                                                <TableCell align='center' sx={{ minWidth: 100 }}>Price</TableCell>
                                                <TableCell align='center' sx={{ minWidth: 100 }}>Quantity</TableCell>
                                                <TableCell align='center' sx={{ minWidth: 100 }}>Tax</TableCell>
                                                <TableCell align='center' sx={{ minWidth: 100 }}>Discount</TableCell>
                                                <TableCell align='center' sx={{ minWidth: 100 }}>Subtotal</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {orderDetailData.map((value: any) => {
                                                return (
                                                    <TableRow>
                                                        <TableCell align='center' sx={{ minWidth: 80 }}>
                                                            <Avatar src={value?.product_image}></Avatar>
                                                        </TableCell>
                                                        <TableCell align='center' sx={{ minWidth: 280 }}>
                                                            <Typography>{value?.product_name}</Typography>
                                                        </TableCell>
                                                        <TableCell align='center' sx={{ minWidth: 280 }}>
                                                            <Typography>{value?.product_sku}</Typography>
                                                        </TableCell>
                                                        <TableCell align='center' sx={{ minWidth: 100 }}>
                                                            <Typography>{value?.product_price}</Typography>
                                                        </TableCell>
                                                        <TableCell align='center' sx={{ minWidth: 100 }}>
                                                            <Typography>{value?.quantity}</Typography>
                                                        </TableCell>
                                                        <TableCell align='center' sx={{ minWidth: 100 }}>
                                                            <Typography>{value?.product_tax}</Typography>
                                                        </TableCell>
                                                        <TableCell align='center' sx={{ minWidth: 100 }}>
                                                            <Typography>{value?.discount}</Typography>
                                                        </TableCell>
                                                        <TableCell align='center' sx={{ minWidth: 100 }}>
                                                            <Typography>{value?.sub_total}</Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                            <Divider />
                            <CardContent sx={{ display: 'flex', justifyContent: 'end' }}>
                                <Grid xs={12} md={6} lg={6}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography sx={{ fontSize: "13px" }}><b>Sub Total:</b></Typography>
                                        {orderData?.sub_total === null ? <Typography sx={{ fontSize: "13px" }}>{`${CURRENCY_VALUE}`} 00.00</Typography> : <Typography sx={{ fontSize: "13px" }}>{`${CURRENCY_VALUE}${orderData?.sub_total}`}</Typography>}
                                    </Box>
                                    <Divider sx={{ mb: 2, mt: 1 }} />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography sx={{ fontSize: "13px" }}><b>Shipping:</b></Typography>
                                        {orderData?.shipping_cost === null ? <Typography sx={{ fontSize: "13px" }}>{`${CURRENCY_VALUE}`} 00.00</Typography> : <Typography sx={{ fontSize: "13px" }}>{`${CURRENCY_VALUE}${orderData?.shipping_cost}`}</Typography>}
                                    </Box>
                                    <Divider sx={{ mb: 2, mt: 1 }} />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography sx={{ fontSize: "13px" }}><b>Discount : </b></Typography>
                                        <Typography sx={{ fontSize: "13px" }}>{orderData?.discount == null ? <Typography>{`${CURRENCY_VALUE}`}00.00</Typography> : <Typography sx={{ fontSize: "13px" }}>{`${CURRENCY_VALUE}${orderData?.discount}`}</Typography>}</Typography>
                                    </Box>
                                    <Divider sx={{ mb: 2, mt: 1 }} />
                                    {orderTaxData && orderTaxData.map((t: any) => (
                                        <>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography sx={{ fontSize: "13px" }}><b>{t.name}</b> ({t.rate}%)</Typography>
                                                <Typography sx={{ fontSize: "13px" }}>{`${CURRENCY_VALUE}`}{t.tax_amount}</Typography>
                                            </Box>
                                            <Divider sx={{ mb: 2, mt: 1 }} />
                                        </>
                                    ))}

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography sx={{ fontSize: "13px" }}><b>Total :</b></Typography>
                                        <Typography sx={{ fontSize: "13px" }}>{`${CURRENCY_VALUE}`}{orderData?.order_total?.toFixed(2)}</Typography>
                                    </Box>
                                </Grid>
                            </CardContent>
                        </Card>
                        <Grid container spacing={6}>
                            {orderDetailData.map((details, k) => (
                                <Grid item lg={6} md={6} xs={12} key={details.id}>
                                    <Grid item xs={12}>
                                        <Card>
                                            <CardContent>
                                                <Typography sx={{ fontSize: "13px" }}><b>{details.product_name && firstLetterUpperCaseText(details.product_name)}</b></Typography>
                                                <Typography sx={{ fontSize: "10px", mt: '5px' }}>{details.product_sku}</Typography>
                                            </CardContent>
                                            <Divider />
                                            <CardContent>
                                                {details.Karat && <Typography sx={{ fontSize: "13px" }}><b>Gold KT: </b>{details.Karat}</Typography>}
                                                {details.metal && <Typography sx={{ fontSize: "13px" }}><b> Metal: </b>{details.metal}</Typography>}
                                                {details.Metal_tone && <Typography sx={{ fontSize: "13px" }}><b>Metal Tone: </b>{details.Metal_tone}</Typography>}
                                                {details.product_size && <Typography sx={{ fontSize: "13px" }}><b>Size: </b>{details.product_size}</Typography>}
                                                {details.product_length && <Typography sx={{ fontSize: "13px" }}><b>Length: </b>{details.product_length}</Typography>}
                                                {details?.product_type === 1 &&
                                                    <>
                                                        {details?.sort_description && <Typography sx={{ fontSize: "13px" }}><b>Sort Description: </b>{details?.sort_description}</Typography>}
                                                    </>
                                                }
                                                {details.gemstone && details.gemstone.map((value: any, index: any) => (
                                                    <>
                                                        <Typography sx={{ fontSize: "13px" }}><b>Stone{" "}{index + 1}: </b>
                                                            {value.stone}
                                                        </Typography>
                                                        <Typography sx={{ fontSize: "13px" }}><b>Cut{" "}: </b>
                                                            {value.cut}
                                                        </Typography>
                                                        <Typography sx={{ fontSize: "13px" }}><b>MM Size{" "}: </b>
                                                            {value.mm_size}
                                                        </Typography>
                                                    </>
                                                ))}
                                                {details?.product_type === 4 &&
                                                    <>
                                                        {details?.engraving &&
                                                            <Typography sx={{ fontSize: "13px" }}><b>Engraving: </b>
                                                                {details?.engraving.map((item: any) => (
                                                                    `${item.value}`
                                                                ))}
                                                            </Typography>
                                                        }
                                                    </>
                                                }
                                                {details?.product_type === 3 &&
                                                    <>
                                                        {details?.engraving &&
                                                            <Typography sx={{ fontSize: "13px" }}><b>Engraving: </b>
                                                                {details?.engraving}
                                                            </Typography>
                                                        }
                                                    </>
                                                }
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                </Grid>
                            ))}

                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                    <Grid item xs={12}>
                        <Card>
                            <CardHeader title='Shipping info' />
                            <Divider />
                            <CardContent>
                                <Typography sx={{ mb: 4, fontSize: "13px" }}><b>Payment Status:</b>

                                    <CustomChip
                                        rounded
                                        size='small'
                                        skin='light'
                                        label={paymentStatusList[orderData?.payment_status]?.title}
                                        color={paymentStatusList[orderData?.payment_status]?.color}
                                        sx={{ textTransform: 'capitalize', ml: 3 }}
                                    />

                                </Typography>
                                <Typography sx={{ mb: 6, fontSize: "13px" }}><b>Shipping Method:</b>{" "}{shippingMethod.find((t: any) => t.id === orderData?.shipping_method)?.title} </Typography>

                                <Typography sx={{ mb: 4, fontSize: "13px" }}><b>Delivery Status:</b>

                                    <CustomChip
                                        rounded
                                        size='small'
                                        label={orderDetailData.map((t: any) => (deliveryStatusList[t.delivery_status]?.title))[0]}
                                        color="default"
                                        sx={{ textTransform: 'capitalize', ml: 3 }}
                                    />

                                </Typography>
                                <TccSelect
                                    disabled={orderData?.payment_status === PAYMENT_STATUS.paid ? false : true}
                                    inputLabel="Delivery Status"
                                    defaultValue=""
                                    label='Delivery Status'
                                    title='title'
                                    isNoneValue='0'
                                    value={orderData?.payment_status === PAYMENT_STATUS.paid ? orderDetailData[0]?.delivery_status : ''}
                                    Options={DeliverStatus}
                                    onChange={handleChangeDeliveryStatus}
                                    fullWidth
                                />
                            </CardContent>
                        </Card>
                        <Card sx={{ mt: 6 }} >
                            <CardHeader sx={{ fontSize: "13px" }} title='Customer' />
                            <Divider />
                            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar src="http://cdn.onlinewebfonts.com/svg/img_24787.png" sx={{ mr: 8 }} />
                                <Typography sx={{ fontSize: "13px" }}>{orderData?.user_name ? orderData?.user_name : orderData?.order_shipping_address?.full_name}</Typography>
                            </CardContent>

                            <Divider />

                            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                                <Icon icon='tabler:garden-cart' style={{ fontSize: '30px' }} />
                                <Typography sx={{ ml: 8, fontSize: "13px" }}>{orderDetailData.length} Orders</Typography>
                            </CardContent>
                            <Divider />
                            <CardContent>
                                <Typography sx={{ fontSize: "13px" }} variant='body1'><b>Contact Info</b></Typography>
                                <Typography sx={{ display: 'flex', alignItems: 'center', mt: 4, fontSize: "13px" }}>
                                    <Icon icon='mdi-light:email' style={{ fontSize: '25px', marginRight: 20 }} />
                                    {orderData?.user_email ? orderData?.user_email : orderData?.email}
                                </Typography>
                                <Typography sx={{ display: 'flex', alignItems: 'center', mt: 4, fontSize: "13px" }}>
                                    <Icon icon='clarity:mobile-phone-line' style={{ fontSize: '25px', marginRight: 20 }} />
                                    {orderData?.user_phone_number ? orderData?.user_phone_number : shippingData.phone_number}
                                </Typography>
                            </CardContent>
                            <Divider />

                            <CardContent>
                                <Typography sx={{ fontSize: "13px" }} variant='body1'><b>Shipping address</b></Typography>
                                <Typography sx={{ mt: 4, fontSize: "13px" }}><b>Name:</b> {orderData?.order_shipping_address?.full_name}</Typography>
                                <Typography sx={{ fontSize: "13px" }}><b>Phone: </b>{shippingData.phone_number}</Typography>
                                <Typography sx={{ fontSize: "13px" }}><b>Address : </b>{shippingData.house_builing} </Typography>
                                <Typography sx={{ fontSize: "13px" }}><b>Area Name : </b>{shippingData.area_name} </Typography>
                                <Typography sx={{ fontSize: "13px" }}><b>City:</b> {orderData?.shipping_add_city}</Typography>
                                <Typography sx={{ fontSize: "13px" }}><b>State:</b> {orderData?.shipping_add_state}</Typography>
                                <Typography sx={{ fontSize: "13px" }}><b>Zip code: </b> {shippingData.pincode}</Typography>
                                <Typography sx={{ fontSize: "13px" }}><b>Country:</b> {orderData?.shipping_add_country}</Typography>
                            </CardContent>

                            <Divider />

                            <CardContent>
                                <Typography sx={{ fontSize: "13px" }} variant='body1'><b>Billing address</b></Typography>
                                <Typography sx={{ mt: 4, fontSize: "13px" }}><b>Name:</b> {orderData?.order_billing_address?.full_name}</Typography>
                                <Typography sx={{ fontSize: "13px" }}><b>Phone: </b> {billingData.phone_number}</Typography>
                                <Typography sx={{ fontSize: "13px" }}><b>Address : </b> {billingData.house_builing}</Typography>
                                <Typography sx={{ fontSize: "13px" }}><b>Area Name : </b> {billingData.area_name}</Typography>
                                <Typography sx={{ fontSize: "13px" }}><b>City:</b> {orderData?.billing_add_city}</Typography>
                                <Typography sx={{ fontSize: "13px" }}><b>State:</b> {orderData?.billing_add_state}</Typography>
                                <Typography sx={{ fontSize: "13px" }}><b>Zip code: </b> {billingData.pincode}</Typography>
                                <Typography sx={{ fontSize: "13px" }}><b>Country:</b> {orderData?.billing_add_country}</Typography>
                            </CardContent>
                        </Card>

                    </Grid>
                </Grid>
            </Grid >
        </>
    )
}
export default OrderDetails