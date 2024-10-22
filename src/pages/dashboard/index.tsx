import { Icon } from "@iconify/react"
import { Avatar, Badge, Box, Card, CardContent, CardHeader, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import classnames from 'classnames'
import { useKeenSlider } from 'keen-slider/react'
import Router from "next/router"
import { MouseEvent, useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import CustomAvatar from 'src/@core/components/mui/avatar'
import { IMG_ENDPOINT, LIVE_URL } from "src/AppConfig"
import { appErrors } from "src/AppConstants"
import TCCTableHeader from "src/customComponents/data-table/header"
import TccDataTable from "src/customComponents/data-table/table"
import { GET_ALL_DASHBOARD } from "src/services/AdminServices"

type OrderStatisticsData = {
  new_order: number
  Confirm_order: number
  In_process_order: number
  out_of_delivery_order: number
  delivery_order: number
  cancel_order: number
  return_order: number
  failed_order: number
  total_order: number
  total_revenue: any
}

type TotalRevenue = {
  total: number
}

type TotalItem = {
  item: any
}
const Home = () => {
  const [pageSize, setPageSize] = useState(10)
  const [active, setActive] = useState<string | null>('daily')
  const [result, setResult] = useState<Partial<OrderStatisticsData>>({})
  const [totalRevenue, setTotalRevenue] = useState<Partial<TotalRevenue>>({})
  const [totalItem, setTotalItem] = useState<Partial<TotalItem>>({})
  const [topSellingProduct, setTopSellingProduct] = useState<{ id: number, name: any, sku: any, slug: any, order_count: number, image_path: any }[]>([])

  /////////////////////// GET API ///////////////////////

  const getAllApi = async () => {
    try {
      const data = await GET_ALL_DASHBOARD();
      if (data.code === 200 || data.code === "200") {
        setResult(data.data)
        setTotalRevenue(data.data.total_revenue)
        setTotalItem(data.data.total_items)

        const topSellingTableData = [];
        for (const item of data.data.top_selling_product) {
          topSellingTableData.push({ id: item.product_id, name: item.name, sku: item.sku, slug: item.slug, order_count: item.order_count, image_path: item.image_path });
        }
        setTopSellingProduct(topSellingTableData)
      } else {
        return toast.error(data.message);
      }
    } catch (e: any) {
      toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN);
    }

    return false;
  }
  useEffect(() => {
    getAllApi();
  }, []);

  return (
    <>
      <h2 style={{ margin: 0, marginBottom: 8 }}>Dashboard</h2>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={<Box sx={{ display: 'flex' }}><Icon icon='material-symbols:bar-chart' fontSize='23px' /><Typography><b>Order Statistics</b></Typography></Box>}
              sx={{
                flexDirection: ['column', 'row'],
                alignItems: ['flex-start', 'center'],
                '& .MuiCardHeader-action': { mb: 0 },
                '& .MuiCardHeader-content': { mb: [2, 0] }
              }}
            />
            <CardContent>
              <Grid container spacing={6}>
                <Grid item xs={12} md={3} lg={3}>
                  <Card>
                    <CardContent sx={{ gap: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography variant='h6'>{result.new_order}</Typography>
                        <Typography variant='body2'>New Order</Typography>
                      </Box>
                      <CustomAvatar skin='light' color='primary'>
                        <Icon icon='material-symbols:garden-cart' fontSize='20px' />
                      </CustomAvatar>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                  <Card>
                    <CardContent sx={{ gap: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography variant='h6'>{result.Confirm_order}</Typography>
                        <Typography variant='body2'>Confirmed</Typography>
                      </Box>
                      <CustomAvatar skin='light' color='success'>
                        <Icon icon='material-symbols:check-circle' fontSize='20px' />
                      </CustomAvatar>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                  <Card>
                    <CardContent sx={{ gap: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography variant='h6'>{result.In_process_order}</Typography>
                        <Typography variant='body2'>In Process</Typography>
                      </Box>
                      <CustomAvatar skin='light' color='warning'>
                        <Icon icon='ic:baseline-watch-later' fontSize='20px' />
                      </CustomAvatar>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                  <Card>
                    <CardContent sx={{ gap: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography variant='h6'>{result.out_of_delivery_order}</Typography>
                        <Typography variant='body2'>Out for Delivery</Typography>
                      </Box>
                      <CustomAvatar skin='light' color='info'>
                        <Icon icon='material-symbols:pedal-bike-sharp' fontSize='20px' />
                      </CustomAvatar>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
            <CardContent>
              <Grid container spacing={6}>
                <Grid item xs={12} md={3} lg={3}>
                  <Card>

                    <CardContent sx={{ gap: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography variant='h6'>{result.delivery_order}</Typography>
                        <Typography variant='body2'>Delivered</Typography>
                      </Box>
                      <CustomAvatar skin='light' color='success'>
                        <Icon icon='mdi:package-variant-closed-delivered' fontSize='20px' />
                      </CustomAvatar>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                  <Card>
                    <CardContent sx={{ gap: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography variant='h6'>{result.cancel_order}</Typography>
                        <Typography variant='body2'>Cancelled</Typography>
                      </Box>
                      <CustomAvatar skin='light' color='error'>
                        <Icon icon='material-symbols:delete-forever-rounded' fontSize='20px' />
                      </CustomAvatar>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                  <Card>
                    <CardContent sx={{ gap: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography variant='h6'>{result.return_order}</Typography>
                        <Typography variant='body2'>Return</Typography>
                      </Box>
                      <CustomAvatar skin='light' color='warning'>
                        <Icon icon='material-symbols:assignment-returned' fontSize='20px' />
                      </CustomAvatar>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                  <Card>
                    <CardContent sx={{ gap: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography variant='h6'>{result.failed_order}</Typography>
                        <Typography variant='body2'> Failed</Typography>
                      </Box>
                      <CustomAvatar skin='light' color='error'>
                        <Icon icon='material-symbols:sms-failed-rounded' fontSize='20px' />
                      </CustomAvatar>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card sx={{ mt: 6 }}>
            <CardHeader
              title={<Box sx={{ display: 'flex' }}><Icon icon='gg:dollar' fontSize='23px' /><Typography><b>Revenue Statistics</b></Typography></Box>}
              sx={{
                flexDirection: ['column', 'row'],
                alignItems: ['flex-start', 'center'],
                '& .MuiCardHeader-action': { mb: 0 },
                '& .MuiCardHeader-content': { mb: [2, 0] }
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <CardContent sx={{ pt: theme => `${theme.spacing(0.5)} !important` }}>
                <Grid container spacing={6}>
                  <Grid item xs={6} md={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CustomAvatar skin='light' color='success' sx={{ mr: 4, width: 42, height: 42 }}>
                        <Icon icon='fluent-mdl2:product-variant' />
                      </CustomAvatar>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant='h6'>{result.total_order}</Typography>
                        <Typography variant='body2' sx={{ whiteSpace: 'nowrap' }}>Total Orders</Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
              <CardContent sx={{ pt: theme => `${theme.spacing(0.5)} !important` }}>
                <Grid container spacing={6}>
                  <Grid item xs={6} md={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CustomAvatar skin='light' color='warning' sx={{ mr: 4, width: 42, height: 42 }}>
                        <Icon icon='ph:currency-circle-dollar-fill' />
                      </CustomAvatar>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant='h6'>{totalRevenue.total?.toFixed(2)}</Typography>
                        <Typography variant='body2' sx={{ whiteSpace: 'nowrap' }}>Total Revenue</Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
              <CardContent sx={{ pt: theme => `${theme.spacing(0.5)} !important` }}>
                <Grid container spacing={6}>
                  <Grid item xs={6} md={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CustomAvatar skin='light' color='info' sx={{ mr: 4, width: 42, height: 42 }}>
                        <Icon icon='mdi:assignment-return' />
                      </CustomAvatar>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant='h6'>{totalItem.item}</Typography>
                        <Typography variant='body2' sx={{ whiteSpace: 'nowrap' }}>Total Item </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Box>

          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card sx={{ mt: 6 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Icon icon='icon-park:ad-product' fontSize='23px' />
              <Typography sx={{ ml: 2 }}><b>Top Selling Products</b></Typography>
            </CardContent>
            <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
              <Table stickyHeader aria-label='sticky table'>
                <TableHead>
                  <TableRow>
                    <TableCell align='center'>Image</TableCell>
                    <TableCell align='center'>Product Name</TableCell>
                    <TableCell align='center' sx={{ minWidth: 200 }}>Product SKU</TableCell>
                    <TableCell align='center'>Order Count</TableCell>
                    <TableCell align='center'>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topSellingProduct.map((value: any) => {
                    return (
                      <TableRow>
                        <TableCell align='center'>
                          <Avatar src={`${IMG_ENDPOINT}/${value?.image_path}`}></Avatar>
                        </TableCell>
                        <TableCell align='center'>
                          <Typography>{value?.name}</Typography>
                        </TableCell>
                        <TableCell align='center' sx={{ minWidth: 200 }}>
                          <Typography>{value?.sku}</Typography>
                        </TableCell>
                        <TableCell align='center'>
                          <Typography>{value?.order_count}</Typography>
                        </TableCell>
                        <TableCell align='center'>
                          <IconButton
                            size='small'
                            sx={{ color: 'text.secondary' }}
                            onClick={() =>
                              Router.push({ pathname: `/product/add-product-variant/`, query: { id: value.id, action: "view" } })
                            }
                          >
                            <Icon icon='tabler:eye' />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
    </>

  )
}

export default Home

