import { Icon } from "@iconify/react";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import moment from "moment";
import Router, { useRouter } from "next/router";
import { SyntheticEvent, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { CURRENCY_VALUE, DATEPICKER_DATE_FORMAT } from "src/AppConfig";
import { appErrors } from "src/AppConstants";
import { ORDERS_DETAIL } from "src/services/AdminServices";
import { firstLetterUpperCaseText } from "src/utils/sharedFunction";
import CustomChip from "src/@core/components/mui/chip";
type OrderData = {
  id: number;
  order_number: string;
  order_status: any;
  order_date: string;
  email: string;
  user_name: string;
  user_email: string;
  user_phone_number: string;
  shipping_add_country: string;
  shipping_add_state: string;
  shipping_add_city: string;
  billing_add_country: string;
  billing_add_state: string;
  billing_add_city: string;
  sub_total: any;
  total_tax: number;
  shipping_cost: any;
  payment_method: any;
  discount: any;
  order_shipping_address: any;
  order_billing_address: any;
  payment_status: any;
  order_total: any;
  payment_transaction_id: any;
  shipping_method: any;
};

type ShippingData = {
  house_builing: string;
  area_name: string;
  pincode: number;
  city_id: number;
  state_id: number;
  country_id: number;
  phone_number: number;
};

const OrderDetails = () => {
  // ** State
  const [orderDetailData, setOrderDetailData] = useState<
    {
      id: number;
      quantity: number;
      sub_total: number;
      product_tax: any;
      product_name: string;
      product_sku: string;
      metal: string;
      diamond_rate: any;
      Karat: number;
      Metal_tone: string;
      product_size: number;
      product_length: number;
      product_image: any[];
      engraving: any[];
      product_type: any;
      gemstone: any[];
      product_price: any;
      delivery_status: any;
      discount: any;
      sort_description: any;
    }[]
  >([]);
  const [orderData, setOrderData] = useState<Partial<OrderData>>({});
  const [shippingData, setShippingData] = useState<Partial<ShippingData>>({});
  const [orderNumberData, setOrderNumber] = useState("");
  const [orderTaxData, setOrderTaxData] = useState([]);
  const [tabValue, setTabValue] = useState<string>("1");

  // ** Const
  const router = useRouter();
  const { orderNumber } = router.query;
  const karatData = process?.env?.NEXT_PUBLIC_KARAT_VALUE;

  // ** Details API

  const ordersDetailsData = async (orderNumber: any) => {
    const payload = {
      order_number: orderNumber,
    };
    try {
      const data = await ORDERS_DETAIL(payload);
      if ((data && data.code === 200) || data.code === "200") {
        setOrderData(data.data);
        setOrderTaxData(JSON.parse(data.data.order_taxs));
        const orderTableData = [];
        for (const item of data.data.order) {
          orderTableData.push({
            id: item?.product_id,
            quantity: item.quantity,
            sub_total: item?.sub_total?.toFixed(2),
            product_tax:
              item.product_tax == null ? (
                <Typography>00.00</Typography>
              ) : (
                <Typography>{item.product_tax}</Typography>
              ),
            product_name: item.product_name.replace("ct", `${karatData}`),
            product_sku: item.product_sku,
            metal: item.metal,
            diamond_rate: item.diamond_rate,
            Karat: item.Karat,
            Metal_tone: item.Metal_tone,
            product_size: item.product_size,
            product_length: item.product_length,
            product_image: item.product_image,
            product_price: item.product_price?.toFixed(2),
            delivery_status: item.delivery_status,
            discount:
              item.discount == null ? (
                <Typography>00.00</Typography>
              ) : (
                <Typography>{item.discount}</Typography>
              ),
            gemstone: item.order_details_json.gemstone,
            engraving: item.order_details_json.engraving,
            product_type: item.order_details_json.product_type,
            sort_description: item?.product
              ? item?.product?.sort_description
              : item?.sort_description,
          });
        }
        setOrderDetailData(orderTableData);
        setShippingData(data.data.order_shipping_address);
      } else {
        return toast.error(data.message);
      }
    } catch (e: any) {
      toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN);
    }

    return false;
  };

  // ** UseEffect

  useEffect(() => {
    const orderNumberValue: string = orderNumber as string;
    if (orderNumberValue != undefined) {
      setOrderNumber(orderNumberValue);
      ordersDetailsData(orderNumber);
    }
  }, [router.isReady]);

  // ** Fuctions

  const handleChangeTabValue = (event: SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  return (
    <>
      <Button
        variant="contained"
        sx={{ mr: 8, ml: 8, mb: 6, "& svg": { mr: 2 } }}
        onClick={() => Router.back()}
      >
        <Icon icon="material-symbols:arrow-back-rounded" />
        Back
      </Button>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card sx={{ mr: 8, ml: 8 }}>
            <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ mr: 4 }}>
                {orderData?.order_number}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center"}}>
              <Icon
                icon="material-symbols:calendar-month"
                style={{ fontSize: "18px" }}
              />
              <Typography sx={{ ml: 2, fontSize: "13px" }}>
                {moment(orderData?.order_date).format(DATEPICKER_DATE_FORMAT)}
              </Typography>
              </Box>
            </CardContent>
            <Divider />
          </Card>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <TabContext value={tabValue}>
            <TabList
              sx={{ mr: 8, ml: 8, mb: 4 }}
              onChange={handleChangeTabValue}
              aria-label="full width tabs example"
            >
              <Tab value="1" label="Product Details" />
              <Tab value="2" label="Customer Details" />
            </TabList>
            <TabPanel value="1">
              <Card>
                <Grid item xs={12} sm={12} md={12}>
                  <TableContainer
                    component={Paper}
                    sx={{
                      "&::-webkit-scrollbar": {
                        width: 4,
                        height: 4,
                      },
                      "&::-webkit-scrollbar-track": {
                        backgroundColor: "white",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "#dcdcdc",
                        borderRadius: 2,
                      },
                      maxHeight: 350,
                    }}
                  >
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                        <TableRow>
                          <TableCell align="center" sx={{ minWidth: 80 }}>
                            Image
                          </TableCell>
                          <TableCell align="center" sx={{ minWidth: 280 }}>
                            Name
                          </TableCell>
                          <TableCell align="center" sx={{ minWidth: 280 }}>
                            SKU
                          </TableCell>
                          <TableCell align="center" sx={{ minWidth: 100 }}>
                            Price
                          </TableCell>
                          <TableCell align="center" sx={{ minWidth: 100 }}>
                            Quantity
                          </TableCell>
                          {/* <TableCell align='center' sx={{ minWidth: 100 }}>Tax</TableCell>
                                                <TableCell align='center' sx={{ minWidth: 100 }}>Discount</TableCell>
                                                <TableCell align='center' sx={{ minWidth: 100 }}>Subtotal</TableCell> */}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orderDetailData.map((value: any) => {
                          return (
                            <TableRow>
                              <TableCell align="center" sx={{ minWidth: 80 }}>
                                <Avatar src={value?.product_image}></Avatar>
                              </TableCell>
                              <TableCell align="center" sx={{ minWidth: 280 }}>
                                <Typography>{value?.product_name}</Typography>
                              </TableCell>
                              <TableCell align="center" sx={{ minWidth: 280 }}>
                                <Typography>{value?.product_sku}</Typography>
                              </TableCell>
                              <TableCell align="center" sx={{ minWidth: 100 }}>
                                <Typography>{value?.product_price}</Typography>
                              </TableCell>
                              <TableCell align="center" sx={{ minWidth: 100 }}>
                                <Typography>{value?.quantity}</Typography>
                              </TableCell>
                              {/* <TableCell align='center' sx={{ minWidth: 100 }}>
                                                            <Typography>{value?.product_tax}</Typography>
                                                        </TableCell>
                                                        <TableCell align='center' sx={{ minWidth: 100 }}>
                                                            <Typography>{value?.discount}</Typography>
                                                        </TableCell>
                                                        <TableCell align='center' sx={{ minWidth: 100 }}>
                                                            <Typography>{value?.sub_total}</Typography>
                                                        </TableCell> */}
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Divider />
                <CardContent sx={{ display: "flex", justifyContent: "end" }}>
                  <Grid xs={12} md={4} lg={4}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mr: 8,
                        ml: 8,
                      }}
                    >
                      <Typography sx={{ fontSize: "13px" }}>
                        <b>Total:</b>
                      </Typography>
                      {orderData?.sub_total === null ? (
                        <Typography sx={{ fontSize: "13px" }}>
                          {`${CURRENCY_VALUE}`} 00.00
                        </Typography>
                      ) : (
                        <Typography
                          sx={{ fontSize: "13px" }}
                        >{`${CURRENCY_VALUE}${orderData?.sub_total}`}</Typography>
                      )}
                    </Box>
                    {/* <Divider sx={{ mb: 2, mt: 1 }} />
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
                                    </Box> */}
                  </Grid>
                </CardContent>
              </Card>
              <Grid container spacing={6} sx={{ mt: "10px" }}>
                {orderDetailData.map((details, k) => (
                  <Grid item lg={12} md={12} xs={12} key={details.id}>
                    <Grid item xs={12}>
                      <Card>
                        <CardContent>
                          <Typography sx={{ fontSize: "13px" }}>
                            <b>
                              {details.product_name &&
                                firstLetterUpperCaseText(details.product_name)}
                            </b>
                          </Typography>
                          <Typography sx={{ fontSize: "10px", mt: "5px" }}>
                            {details.product_sku}
                          </Typography>
                        </CardContent>
                        <Divider />
                        <CardContent>
                          {details.Karat && (
                            <Typography sx={{ fontSize: "13px" }}>
                              <b>Gold KT: </b>
                              {details.Karat}
                            </Typography>
                          )}
                          {details.metal && (
                            <Typography sx={{ fontSize: "13px" }}>
                              <b> Metal: </b>
                              {details.metal}
                            </Typography>
                          )}
                          {details.Metal_tone && (
                            <Typography sx={{ fontSize: "13px" }}>
                              <b>Metal Tone: </b>
                              {details.Metal_tone}
                            </Typography>
                          )}
                          {details.product_size && (
                            <Typography sx={{ fontSize: "13px" }}>
                              <b>Size: </b>
                              {details.product_size}
                            </Typography>
                          )}
                          {details.product_length && (
                            <Typography sx={{ fontSize: "13px" }}>
                              <b>Length: </b>
                              {details.product_length}
                            </Typography>
                          )}
                          {details?.product_type === 1 && (
                            <>
                              {details?.sort_description && (
                                <Typography sx={{ fontSize: "13px" }}>
                                  <b>Sort Description: </b>
                                  {details?.sort_description}
                                </Typography>
                              )}
                            </>
                          )}
                          {details.gemstone &&
                            details.gemstone.map((value: any, index: any) => (
                              <>
                                <Typography sx={{ fontSize: "13px" }}>
                                  <b>Stone {index + 1}: </b>
                                  {value.stone}
                                </Typography>
                                <Typography sx={{ fontSize: "13px" }}>
                                  <b>Cut : </b>
                                  {value.cut}
                                </Typography>
                                <Typography sx={{ fontSize: "13px" }}>
                                  <b>MM Size : </b>
                                  {value.mm_size}
                                </Typography>
                              </>
                            ))}
                          {details?.product_type === 4 && (
                            <>
                              {details?.engraving && (
                                <Typography sx={{ fontSize: "13px" }}>
                                  <b>Engraving: </b>
                                  {details?.engraving.map(
                                    (item: any) => `${item.value}`
                                  )}
                                </Typography>
                              )}
                            </>
                          )}
                          {details?.product_type === 3 && (
                            <>
                              {details?.engraving && (
                                <Typography sx={{ fontSize: "13px" }}>
                                  <b>Engraving: </b>
                                  {details?.engraving}
                                </Typography>
                              )}
                            </>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </TabPanel>
            <TabPanel value="2">
              <Grid item xs={12} md={12} lg={12}>
                <Grid item xs={12}>
                  <Card>
                    <CardHeader sx={{ fontSize: "13px" }} title="Customer" />
                    <Divider />
                    <CardContent
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          src="http://cdn.onlinewebfonts.com/svg/img_24787.png"
                          sx={{ mr: 8 }}
                        />
                        <Typography sx={{ fontSize: "15px" }}>
                          {orderData?.user_name
                            ? orderData?.user_name
                            : orderData?.order_shipping_address?.full_name}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <div style={{ display: "flex" }}>
                          <CustomChip
                            rounded
                            skin="light"
                            icon={
                              <Icon
                                icon="tabler:garden-cart"
                                style={{ fontSize: "22px" }}
                              />
                            }
                            label={`${orderDetailData.length} Orders`}
                            color="success"
                            sx={{
                              textTransform: "capitalize",
                              padding: "5px",
                            }}
                          />
                        </div>
                        {/* <Button
                            sx={{ mb: 2, fontSize: "10px" }}
                            variant="contained"
                            color="success"
                          >
                            <Icon
                              icon="tabler:garden-cart"
                              style={{ fontSize: "20px", marginRight: 8 }}
                            />
                            {orderDetailData.length} Orders
                          </Button> */}
                        {/* <Icon
                            icon="tabler:garden-cart"
                            style={{ fontSize: "30px" }}
                          />
                          <Typography sx={{ ml: 8, fontSize: "13px" }}>
                            {orderDetailData.length} Orders
                          </Typography> */}
                      </Box>
                    </CardContent>
                    <Divider />
                    <CardContent
                      sx={{ display: "flex", justifyContent: "space-between", padding: '30px' }}
                    >
                      <Box>
                        <Typography sx={{ fontSize: "13px" }} variant="body1">
                          <b>Address Details</b>
                        </Typography>
                        <Typography sx={{ mt: 4, fontSize: "13px" }}>
                          <b>Name:</b>{" "}
                          {orderData?.order_shipping_address?.full_name}
                        </Typography>
                        <Typography sx={{ fontSize: "13px" }}>
                          <b>Phone: </b>
                          {shippingData.phone_number}
                        </Typography>
                        <Typography sx={{ fontSize: "13px" }}>
                          <b>Address : </b>
                          {shippingData.house_builing}{" "}
                        </Typography>
                        <Typography sx={{ fontSize: "13px" }}>
                          <b>Area Name : </b>
                          {shippingData.area_name}{" "}
                        </Typography>
                        <Typography sx={{ fontSize: "13px" }}>
                          <b>City:</b> {orderData?.shipping_add_city}
                        </Typography>
                        <Typography sx={{ fontSize: "13px" }}>
                          <b>State:</b> {orderData?.shipping_add_state}
                        </Typography>
                        <Typography sx={{ fontSize: "13px" }}>
                          <b>Zip code: </b> {shippingData.pincode}
                        </Typography>
                        <Typography sx={{ fontSize: "13px" }}>
                          <b>Country:</b> {orderData?.shipping_add_country}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: "13px" }} >
                          <b>Contact Info</b>
                        </Typography>
                        <Typography
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mt: 4,
                            fontSize: "13px",
                          }}
                        >
                          <Icon
                            icon="mdi-light:email"
                            style={{ fontSize: "20px", marginRight: 15 }}
                          />
                          {orderData?.user_email
                            ? orderData?.user_email
                            : orderData?.email}
                        </Typography>
                        <Typography
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mt: 4,
                            fontSize: "13px",
                          }}
                        >
                          <Icon
                            icon="clarity:mobile-phone-line"
                            style={{ fontSize: "20px", marginRight: 15 }}
                          />
                          {orderData?.user_phone_number
                            ? orderData?.user_phone_number
                            : shippingData.phone_number}
                        </Typography>
                      </Box>
                    </CardContent>
                    <Divider />
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>
          </TabContext>
        </Grid>
      </Grid>
    </>
  );
};
export default OrderDetails;
