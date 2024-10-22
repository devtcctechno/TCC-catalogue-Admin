import { Avatar, Box, BoxProps, Card, CardContent, Divider, Grid, Paper, Table, TableBody, TableCell, TableCellBaseProps, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { styled, useTheme } from '@mui/material/styles'
import { useEffect, useState } from "react"
import moment from "moment"
import { INVOICE_DETAIL } from "src/services/AdminServices"
import { CURRENCY_VALUE, DATEPICKER_DATE_FORMAT } from "src/AppConfig"
import Cookies from "js-cookie"

const MUITableCell = styled(TableCell)<TableCellBaseProps>(({ theme }) => ({
    borderBottom: 0,
    paddingLeft: '0 !important',
    paddingRight: '0 !important',
    paddingTop: `${theme.spacing(1)} !important`,
    paddingBottom: `${theme.spacing(1)} !important`
}))

const CalcWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '&:not(:last-of-type)': {
        marginBottom: theme.spacing(2)
    }
}))


type InvoiceData = {
    invoice_number: any
    invoice_date: any
    invoice_amount: number
    shipping_country: string
    shipping_state: string
    shipping_city: string
    billing_country: string
    billing_state: string
    billing_city: string
}

type ShippingAdressData = {
    full_name: string
    house_builing: string
    area_name: string
    pincode: number
    city_id: number
    state_id: number
    country_id: number
    phone_number: number
}

type InvoicePrice = {
    order_total: any
    sub_total: any
    total_tax: any
}

type BillingAdressData = {
    house_builing: string
    area_name: string
    pincode: number
    city_id: number
    state_id: number
    country_id: number
    phone_number: number
}

const InvoicePrint = ({ orderId }: any) => {

    const [pageSize, setPageSize] = useState(10)
    const [invoiceData, setInvoiceData] = useState<Partial<InvoiceData>>({})
    const [shippingAdressData, setShippingAdressData] = useState<Partial<ShippingAdressData>>({})
    const [billingAdressData, setBillingAdressData] = useState<Partial<BillingAdressData>>({})
    const [orderInvoiceData, setOrderInvoiceData] = useState<{ id: number, product_name: string, product_price: number, quantity: number, product_tax: any, sub_total: any, product_image: any, discount: any }[]>([])
    const [orderTaxData, setOrderTaxData] = useState([])
    const [orderTotalPrice, setOrderTotalPrice] = useState<Partial<InvoicePrice>>({})
    const karatData = process?.env?.NEXT_PUBLIC_KARAT_VALUE
    const imageData = Cookies.get('Comapany_info')
    const finalKeyData = imageData && JSON.parse(imageData!);
    const theme = useTheme()

    useEffect(() => {
        setTimeout(() => {
            window.print()
        }, 1200)
    }, [])

    /////////////////////// INVOICE-DETAILS //////////////////////////

    const invoiceDetailsData = async () => {
        const payload = {
            "order_id": orderId
        };
        try {
            const data = await INVOICE_DETAIL(payload);
            if (data.code === 200 || data.code === "200") {
                setInvoiceData(data.data)
                setOrderTotalPrice(data.data.order_invoice)
                setShippingAdressData(data.data.shipping_address)
                setBillingAdressData(data.data.billing_address)
                setOrderTaxData(JSON.parse(data.data.order_invoice.order_taxs));
                const invoiceOrderProductList: any = []
                for (let orderProduct of data.data.order_invoice.order) {
                    invoiceOrderProductList.push({ id: orderProduct.product_id, product_name: orderProduct.product_name.replace("ct", `${karatData}`), product_sku: orderProduct.product_sku, product_price: orderProduct.product_price?.toFixed(2), quantity: orderProduct.quantity, product_tax: orderProduct.product_tax !== null && orderProduct.product_tax, sub_total: orderProduct.sub_total?.toFixed(2), product_image: orderProduct.product_image, discount: orderProduct.discount !== null ? "00.00" : orderProduct.discount })
                }
                setOrderInvoiceData(invoiceOrderProductList);
            } else {
            }
        } catch (e: any) {
        }
        return false;
    }
    useEffect(() => {
        invoiceDetailsData();
    }, [orderId])

    return (
        <div className="print-content">
            <Grid container spacing={6}>
                <Grid item xl={12} xs={12}>
                    <Card style={{ fontSize: '0.50rem' }}>
                        <CardContent sx={{ p: [`${theme.spacing(6)} !important`, `${theme.spacing(10)} !important`] }}>
                            <Grid container>
                                <Grid item sm={6} xs={6} sx={{ mb: { sm: 0, xs: 4 } }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <Box sx={{ mb: 6, display: 'flex', alignItems: 'center' }}>
                                            <img height={30} width={60} src={`${process.env.NEXT_PUBLIC_IMG_ENDPOINT}/${finalKeyData?.dark_image_path}`} />
                                        </Box>
                                        <div>
                                            <Typography sx={{ mb: 2, color: 'text.secondary', fontSize: '0.5rem' }}>Plaza West Covina Mall 609 Plaza, </Typography>
                                            <Typography sx={{ mb: 2, color: 'text.secondary', fontSize: '0.5rem' }}> Dr.West Covina, CA 91790</Typography>
                                            <Typography sx={{ color: 'text.secondary', fontSize: '0.5rem' }}>Call Us: + 626-813-3900</Typography>
                                        </div>
                                    </Box>
                                </Grid>
                                <Grid item sm={6} xs={6}>
                                    <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start' } }}>
                                        <Table sx={{ maxWidth: '210px' }}>
                                            <TableBody sx={{ '& .MuiTableCell-root': { py: `${theme.spacing(1.5)} !important` } }}>
                                                <TableRow>
                                                    <MUITableCell>
                                                        <Typography sx={{ fontSize: '0.5rem' }}>Invoice</Typography>
                                                    </MUITableCell>
                                                    <MUITableCell>
                                                        <Typography sx={{ fontSize: '0.5rem' }}>{invoiceData.invoice_number}</Typography>
                                                    </MUITableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <MUITableCell>
                                                        <Typography sx={{ color: 'text.secondary', fontSize: '0.5rem' }}>Date Issued:</Typography>
                                                    </MUITableCell>
                                                    <MUITableCell>
                                                        <Typography sx={{ fontWeight: 500, color: 'text.secondary', fontSize: '0.5rem' }}>
                                                            {moment(invoiceData.invoice_date).format(DATEPICKER_DATE_FORMAT)}
                                                        </Typography>
                                                    </MUITableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>

                        <Divider />

                        <CardContent sx={{ p: [`${theme.spacing(6)} !important`, `${theme.spacing(10)} !important`] }}>
                            <Grid container>
                                <Grid item xs={6} sm={6} sx={{ mb: { lg: 0, xs: 4 } }}>
                                    <Typography sx={{ mb: 6, fontWeight: 500, fontSize: '0.5rem' }}>Shipping To :</Typography>
                                    <Typography sx={{ mb: 1.5, color: 'text.secondary', fontSize: '0.5rem' }}>{shippingAdressData.house_builing}</Typography>
                                    <Typography sx={{ mb: 1.5, color: 'text.secondary', fontSize: '0.5rem' }}>{shippingAdressData.area_name}, {invoiceData.shipping_city}</Typography>
                                    <Typography sx={{ mb: 1.5, color: 'text.secondary', fontSize: '0.5rem' }}>{invoiceData.shipping_state}</Typography>
                                    <Typography sx={{ mb: 1.5, color: 'text.secondary', fontSize: '0.5rem' }}>{invoiceData.shipping_country}</Typography>
                                    <Typography sx={{ mb: 1.5, color: 'text.secondary', fontSize: '0.5rem' }}>{shippingAdressData.pincode}</Typography>
                                    <Typography sx={{ mb: 1.5, color: 'text.secondary', fontSize: '0.5rem' }}>{shippingAdressData.phone_number}</Typography>
                                </Grid>
                                <Grid item xs={6} sm={6} sx={{ display: 'flex', justifyContent: ['flex-start'] }}>
                                    <div>
                                        <Typography sx={{ mb: 6, fontWeight: 500, fontSize: '0.5rem' }}>Bill To :</Typography>
                                        <Typography sx={{ mb: 1.5, color: 'text.secondary', fontSize: '0.5rem' }}>{billingAdressData.house_builing}</Typography>
                                        <Typography sx={{ mb: 1.5, color: 'text.secondary', fontSize: '0.5rem' }}>{billingAdressData.area_name}, {invoiceData.billing_city}</Typography>
                                        <Typography sx={{ mb: 1.5, color: 'text.secondary', fontSize: '0.5rem' }}>{invoiceData.billing_state}</Typography>
                                        <Typography sx={{ mb: 1.5, color: 'text.secondary', fontSize: '0.5rem' }}>{invoiceData.billing_country}</Typography>
                                        <Typography sx={{ mb: 1.5, color: 'text.secondary', fontSize: '0.5rem' }}>{billingAdressData.pincode}</Typography>
                                        <Typography sx={{ mb: 1.5, color: 'text.secondary', fontSize: '0.5rem' }}>{billingAdressData.phone_number}</Typography>
                                    </div>
                                </Grid>
                            </Grid>
                        </CardContent>

                        <Divider />

                        <Grid item xs={12} sm={12} sx={{ mt: "30px" }}>
                            {orderInvoiceData.map((value: any) => {
                                return (
                                    <div style={{ display: 'flex', marginTop: '10px', fontSize: '0.5rem' }}>
                                        <div style={{ display: 'block', width: '80px' }}>
                                            <Typography sx={{ textAlign: 'center', color: 'text.secondary', fontSize: '0.5rem' }}>Image</Typography>
                                            <Avatar sx={{ marginLeft: 'auto', marginRight: 'auto', color: 'text.secondary', fontSize: '0.5rem' }} src={value?.product_image}></Avatar>
                                        </div>
                                        <div style={{ display: 'block', color: 'text.secondary', width: '25%' }}>
                                            <Typography sx={{ textAlign: 'left', color: 'text.secondary', fontSize: '0.5rem' }}>Name</Typography>
                                            <Typography sx={{ textAlign: 'left', color: 'text.secondary', fontSize: '0.5rem' }}>{value?.product_name}</Typography>
                                        </div>
                                        <div style={{ display: 'block', width: '15%', marginLeft: '15px' }}>
                                            <Typography sx={{ textAlign: 'left', color: 'text.secondary', fontSize: '0.5rem' }}>SKU</Typography>
                                            <Typography sx={{ textAlign: 'left', color: 'text.secondary', fontSize: '0.5rem' }}>{value?.product_sku}</Typography>
                                        </div>
                                        <div style={{ display: 'block', width: '10%', marginLeft: '15px' }}>
                                            <Typography sx={{ textAlign: 'left', color: 'text.secondary', fontSize: '0.5rem' }}>Price</Typography>
                                            <Typography sx={{ textAlign: 'left', color: 'text.secondary', fontSize: '0.5rem' }}>{value?.product_price}</Typography>
                                        </div>
                                        <div style={{ display: 'block', width: '10%' }}>
                                            <Typography sx={{ textAlign: 'left', color: 'text.secondary', fontSize: '0.5rem' }}>Quantity</Typography>
                                            <Typography sx={{ textAlign: 'left', color: 'text.secondary', fontSize: '0.5rem' }}>{value?.quantity}</Typography>
                                        </div>
                                        <div style={{ display: 'block', width: '10%' }}>
                                            <Typography sx={{ textAlign: 'left', color: 'text.secondary', fontSize: '0.5rem' }}>Tax</Typography>
                                            <Typography sx={{ textAlign: 'left', color: 'text.secondary', fontSize: '0.5rem' }}>{value?.product_tax}</Typography>
                                        </div>
                                        <div style={{ display: 'block', width: '10%' }}>
                                            <Typography sx={{ textAlign: 'left', color: 'text.secondary', fontSize: '0.5rem' }}>Discount</Typography>
                                            <Typography sx={{ textAlign: 'left', color: 'text.secondary', fontSize: '0.5rem' }}>{value?.discount}</Typography>
                                        </div>
                                        <div style={{ display: 'block', width: '10%' }}>
                                            <Typography sx={{ textAlign: 'left', color: 'text.secondary', fontSize: '0.5rem' }}>Sub Total</Typography>
                                            <Typography sx={{ textAlign: 'left', color: 'text.secondary', fontSize: '0.5rem' }}>{value?.sub_total}</Typography>
                                        </div>
                                    </div>
                                )
                            })}
                        </Grid>
                        <CardContent sx={{ p: [`${theme.spacing(6)} !important`, `${theme.spacing(10)} !important`] }}>
                            <Grid container>
                                <Grid item xs={6} sm={6} sx={{ mb: { lg: 0, xs: 4 } }}>
                                    <Typography sx={{ color: 'text.secondary', fontSize: '0.5rem' }}>Thanks for your business</Typography>
                                </Grid>
                                <Grid item xs={6} sm={6} sx={{ display: 'flex', justifyContent: ['flex-start'], flexDirection: 'column' }} >
                                    <CalcWrapper>
                                        <Typography sx={{ color: 'text.secondary', fontSize: '0.5rem' }}>Subtotal:</Typography>
                                        <Typography sx={{ fontWeight: 500, color: 'text.secondary', fontSize: '0.5rem' }}>{`${CURRENCY_VALUE}`}{orderTotalPrice?.sub_total?.toFixed(2)}</Typography>
                                    </CalcWrapper>
                                    <CalcWrapper>
                                        <Typography sx={{ color: 'text.secondary', fontSize: '0.5rem' }}>Discount:</Typography>
                                        <Typography sx={{ fontWeight: 500, color: 'text.secondary', fontSize: '0.5rem' }}>{`${CURRENCY_VALUE}`}00.00</Typography>
                                    </CalcWrapper>
                                    {orderTaxData && orderTaxData.map((t: any) => (
                                        <CalcWrapper>
                                            <Typography sx={{ color: 'text.secondary', fontSize: '0.5rem' }}>{t.name}({t.rate})%</Typography>
                                            <Typography sx={{ fontWeight: 500, color: 'text.secondary', fontSize: '0.5rem' }}>{`${CURRENCY_VALUE}`}{t.tax_amount}</Typography>
                                        </CalcWrapper>
                                    ))}
                                    <Divider sx={{ my: `${theme.spacing(2)} !important` }} />
                                    <CalcWrapper>
                                        <Typography sx={{ color: 'text.secondary', fontSize: '0.5rem' }}>Total:</Typography>
                                        <Typography sx={{ fontWeight: 500, color: 'text.secondary', fontSize: '0.5rem' }}>{`${CURRENCY_VALUE}`}{orderTotalPrice?.order_total?.toFixed(2)}</Typography>
                                    </CalcWrapper>
                                </Grid>
                            </Grid>
                        </CardContent>

                        <Divider />

                        <CardContent sx={{ px: [6, 10] }}>
                            <Typography sx={{ color: 'text.secondary' }}>
                                <Typography component='span' sx={{ mr: 1.5, fontWeight: 500, color: 'inherit', fontSize: '0.5rem' }}>
                                    Note:
                                </Typography>
                                <Typography sx={{ fontSize: '0.5rem' }}>
                                    We declare to the best of our knowledge and belief that the particulars stated herein are true and correct
                                    This is Computerised generated invoice if any query please contact on info@thecadco.com
                                </Typography>
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid >
            </Grid >
        </div >
    )
}

export default InvoicePrint