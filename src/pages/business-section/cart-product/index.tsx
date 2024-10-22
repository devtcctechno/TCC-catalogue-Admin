// ** MUI Imports
import { Divider, CardHeader, Grid, Card, Box, Drawer, CardContent, Typography, } from '@mui/material'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { LIVE_URL } from 'src/AppConfig'
import { All_PRODUCT_TYPE, SEARCH_DELAY_TIME, appErrors } from 'src/AppConstants'
import DrawerHeader from 'src/customComponents/components/drawer-header'
import TCCTableHeader from 'src/customComponents/data-table/header'
import TccDataTable from 'src/customComponents/data-table/table'
import { ICommonPagination } from 'src/data/interface'
import { GEMSTONES_DROPDOWN, GET_ALL_CART_PRODUCT } from 'src/services/AdminServices'
import { createCartagination, createPagination } from 'src/utils/sharedFunction'
import CustomAvatar from 'src/@core/components/mui/avatar'

const CartProduct = () => {

    let timer: any;
    const [searchFilter, setSearchFilter] = useState()
    const [pageSize, setPageSize] = useState(10)
    const [drawerAction, setDrawerAction] = useState(false)
    const [viewDrawerAction, setViewDrawerAction] = useState(false)
    const [pagination, setPagination] = useState({ ...createCartagination(), search_text: "" })
    const [result, setResult] = useState<{
        id: any, user_id: any, user_name: string, user_email: string,
        user_phone_numer: string, product_title: string, product_sku: string,
        product_image: string, product_price: string,
        Metal_tone: string, band_metal_tone: string, head_metal_tone: string,
        product_length: string, product_size: string, shank_metal_tone: string,
        is_band: string, product_details: any, product_type: string,
        product_karat: string, product_metal: string
    }[]>([]);
    const [cartData, setCartData] = useState<any>()
    const [gemstoneData, setGemstoneData] = useState([])
    const [finalStoneData, setFinalStoneData] = useState([])
    const karatData = process?.env?.NEXT_PUBLIC_KARAT_VALUE

    const toggleViewDrawer = () => setViewDrawerAction(!viewDrawerAction)

    const viewOnClickHandler = (data: any) => {
        toggleViewDrawer()
        setCartData(data)
    }

    /////////////////////// GET API ///////////////////////

    const getAllApi = async (mbPagination: ICommonPagination) => {
        try {
            const data = await GET_ALL_CART_PRODUCT(mbPagination);
            if (data.code === 200 || data.code === "200") {
                setPagination(data.data.pagination)
                const productcartData = [];
                for (const item of data.data.result) {
                    productcartData.push({
                        id: item.id, user_id: item.user_id, user_name: item.user_name, user_email: item.user_email,
                        user_phone_numer: item?.user_phone_numer, product_title: item.product_title.replace("ct", `${karatData}`), product_sku: item.product_sku,
                        product_image: item?.product_image, product_price: item?.product_price && item?.product_price.toFixed(2),
                        Metal_tone: item?.Metal_tone, band_metal_tone: item?.band_metal_tone, head_metal_tone: item?.head_metal_tone,
                        product_length: item?.product_length, product_size: item?.product_size, shank_metal_tone: item?.shank_metal_tone,
                        is_band: item?.is_band, product_details: item?.product_details, product_type: item?.product_type, product_karat: item?.product_karat,
                        product_metal: item?.product_metal
                    });
                }
                setResult(productcartData);
            } else {
                return toast.error(data.message);
            }
        } catch (e: any) {
            toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN);
        }

        return false;
    }

    const getGemstoneListApi = async () => {
        try {
            const data = await GEMSTONES_DROPDOWN();
            if (data.code === 200 || data.code === "200") {
                setGemstoneData(data?.data)
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
        getGemstoneListApi()
    }, []);

    useEffect(() => {
        const finalData: any = []
        if (cartData?.product_details.gemstone) {
            for (let value of cartData?.product_details?.gemstone) {
                const data = gemstoneData?.find((t: any) => t.id == value?.stone)
                finalData.push(data)
            }
            setFinalStoneData(finalData)
        }
    }, [gemstoneData, cartData])

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

    const column = [
        {
            width: 250,
            value: 'user_name',
            headerName: 'User Name',
            field: 'user_name',
            text: 'text'
        },
        {
            width: 350,
            value: 'product_title',
            headerName: 'Product name',
            field: 'title',
            text: 'text'
        },
        {
            width: 300,
            value: 'product_sku',
            headerName: 'sku',
            field: 'sku',
            text: 'text'
        },
        {
            width: 150,
            value: 'product_price',
            headerName: 'Price',
            field: 'Price',
            text: 'text'
        },
        {
            width: 80,
            value: 'action',
            headerName: 'action',
            field: 'action',
            view: 'view',
            viewOnClick: viewOnClickHandler
        },
    ]

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='Cart Products'></CardHeader>
                    <Divider />

                    <TCCTableHeader value={searchFilter}
                        onChange={(e: any) => setSearchFilter(e.target.value)}

                    />
                    <Box sx={{ width: '100%' }}>
                        <TccDataTable
                            column={column}
                            rows={result}
                            handleSortChanges={handleChangeSortBy}
                            pageSize={parseInt(pagination.per_page_rows.toString())}
                            rowCount={pagination.total_items}
                            page={pagination.current_page - 1}
                            onPageChange={handleChangePerPageRows}
                            iconTitle={'Product'}
                        />
                    </Box>
                </Card>
            </Grid>
            <Drawer
                open={viewDrawerAction}
                anchor='right'
                variant='temporary'
                onClose={toggleViewDrawer}
                ModalProps={{ keepMounted: true }}
                sx={{ '& .MuiDrawer-paper': { width: { xs: 950, sm: 950, md: 950, lg: 950 } } }}
            >
                <DrawerHeader
                    title='View Cart Data'
                    onClick={toggleViewDrawer}
                />

                <Box sx={{ display: 'flex' }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                        <CustomAvatar
                            src={cartData?.product_image && `https://dr2mfr65joexd.cloudfront.net/${cartData.product_image}`}
                            variant='rounded'
                            alt='review image'
                            sx={{ width: 200, height: 300, mb: 4 }}
                        />
                    </CardContent>
                    <CardContent sx={{ pb: 4 }}>
                        <Typography variant='body2' sx={{ color: 'text.disabled', textTransform: 'uppercase' }}>
                            Product Details
                        </Typography>
                        <Box sx={{ pt: 4 }}>
                            {cartData?.product_type === All_PRODUCT_TYPE?.Config_Ring_product ?
                                <Box sx={{ display: 'flex', mb: 3 }}>
                                    <Typography sx={{ mr: 2, fontWeight: 500 }}>Title:</Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>{cartData?.product_title.replace("ct", `${karatData}`)}</Typography>
                                </Box>
                                :
                                <Box sx={{ display: 'flex', mb: 3 }}>
                                    <Typography sx={{ mr: 2, fontWeight: 500 }}>Title:</Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>{cartData?.product_title}</Typography>
                                </Box>
                            }
                            <Box sx={{ display: 'flex', mb: 3 }}>
                                <Typography sx={{ mr: 2, fontWeight: 500 }}>SKU:</Typography>
                                <Typography sx={{ color: 'text.secondary' }}>{cartData?.product_sku}</Typography>
                            </Box>

                            {cartData?.product_size &&
                                <Box sx={{ display: 'flex', mb: 3 }}>
                                    <Typography sx={{ mr: 2, fontWeight: 500 }}>Size:</Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>{cartData?.product_size}</Typography>
                                </Box>
                            }
                            {cartData?.product_karat &&
                                <Box sx={{ display: 'flex', mb: 3 }}>
                                    <Typography sx={{ mr: 2, fontWeight: 500 }}>Karat:</Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>{cartData?.product_karat}</Typography>
                                </Box>
                            }
                            {cartData?.product_metal &&
                                <Box sx={{ display: 'flex', mb: 3 }}>
                                    <Typography sx={{ mr: 2, fontWeight: 500 }}>Metal:</Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>{cartData?.product_metal}</Typography>
                                </Box>
                            }
                            {cartData?.product_length &&
                                <Box sx={{ display: 'flex', mb: 3 }}>
                                    <Typography sx={{ mr: 2, fontWeight: 500 }}>Length:</Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>{cartData?.product_length}</Typography>
                                </Box>
                            }
                            {cartData?.Metal_tone &&
                                <Box sx={{ display: 'flex', mb: 3 }}>
                                    <Typography sx={{ mr: 2, fontWeight: 500 }}>Metal Tone:</Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>{cartData?.Metal_tone}</Typography>
                                </Box>
                            }
                            {cartData?.head_metal_tone &&
                                <Box sx={{ display: 'flex', mb: 3 }}>
                                    <Typography sx={{ mr: 2, fontWeight: 500 }}>Head Tone:</Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>{cartData?.head_metal_tone}</Typography>
                                </Box>
                            }
                            {cartData?.shank_metal_tone &&
                                <Box sx={{ display: 'flex', mb: 3 }}>
                                    <Typography sx={{ mr: 2, fontWeight: 500 }}>Shank Tone:</Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>{cartData?.shank_metal_tone}</Typography>
                                </Box>
                            }
                            {cartData?.band_metal_tone &&
                                <Box sx={{ display: 'flex', mb: 3 }}>
                                    <Typography sx={{ mr: 2, fontWeight: 500 }}>Band Tone:</Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>{cartData?.band_metal_tone}</Typography>
                                </Box>
                            }
                            {cartData?.product_details?.gemstone?.length > 0 &&
                                <Box sx={{ display: 'flex', mb: 3 }}>
                                    <Typography sx={{ mr: 2, fontWeight: 500 }}>Gemstone:</Typography>
                                    <Box>
                                        {finalStoneData.map((value: any, index: any) =>
                                            <Typography sx={{ color: 'text.secondary' }}>
                                                Stone{" "}{index + 1} : {value?.name}
                                            </Typography>
                                        )}
                                    </Box>

                                </Box>
                            }
                            {cartData?.product_type === All_PRODUCT_TYPE?.Config_Ring_product &&
                                <>
                                    {cartData?.product_details?.engraving &&
                                        <Box sx={{ display: 'flex', mb: 3 }}>
                                            <Typography sx={{ mr: 2, fontWeight: 500 }}>Engraving:</Typography>
                                            <Typography sx={{ color: 'text.secondary' }}>{cartData?.product_details?.engraving}</Typography>
                                        </Box>
                                    }
                                </>
                            }

                            {cartData?.product_type === All_PRODUCT_TYPE?.BirthStone_product && <Box sx={{ mb: 3, display: 'flex' }}>
                                <Typography sx={{ mr: 2, fontWeight: 500 }}>Engraving:</Typography>
                                <Box>
                                    {cartData?.product_details?.engraving.map((t: any, index: any) => (
                                        <>
                                            <Typography sx={{ color: 'text.secondary' }}>Text{" "}{index + 1} : {t?.text}</Typography>
                                            <Typography sx={{ color: 'text.secondary' }}>Engraving{" "}{index + 1} : {t?.value}</Typography>
                                        </>
                                    )
                                    )}
                                </Box>
                            </Box>
                            }

                            {cartData?.product_details?.font_style &&
                                <Box sx={{ display: 'flex', mb: 3 }}>
                                    <Typography sx={{ mr: 2, fontWeight: 500 }}>Font Style:</Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>{cartData?.product_details?.font_style}</Typography>
                                </Box>
                            }
                        </Box>
                    </CardContent>
                </Box>
                <Box>
                    <CardContent sx={{ pb: 4 }}>
                        <Typography variant='body2' sx={{ color: 'text.disabled', textTransform: 'uppercase' }}>
                            User Details
                        </Typography>
                        <Box sx={{ pt: 4 }}>
                            <Box sx={{ display: 'flex', mb: 3 }}>
                                <Typography sx={{ mr: 2, fontWeight: 500 }}>User Name:</Typography>
                                <Typography sx={{ color: 'text.secondary' }}>{cartData?.user_name ? cartData?.user_name : '-'}</Typography>
                            </Box>

                            <Box sx={{ display: 'flex', mb: 3 }}>
                                <Typography sx={{ mr: 2, fontWeight: 500 }}>Email:</Typography>
                                <Typography sx={{ color: 'text.secondary' }}>{cartData?.user_email ? cartData?.user_email : '-'}</Typography>
                            </Box>

                            <Box sx={{ display: 'flex', mb: 3 }}>
                                <Typography sx={{ mr: 2, fontWeight: 500 }}>Phone Number:</Typography>
                                <Typography sx={{ color: 'text.secondary' }}>{cartData?.user_phone_numer ? cartData?.user_phone_numer : '-'}</Typography>
                            </Box>

                        </Box>
                    </CardContent>
                </Box>
            </Drawer>

        </Grid >
    )
}

export default CartProduct
