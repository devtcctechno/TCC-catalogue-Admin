// ** MUI Imports
import { Icon } from '@iconify/react'
import { CardContent, CardHeader, Grid, Card, Drawer, Typography, IconButton, Button, FormControl, TextField, FormHelperText, Box, Divider } from '@mui/material'
import dynamic from 'next/dynamic';
import Router, { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { appErrors } from 'src/AppConstants';
import { GET_ETERNITY_BAND_CONFIGURATOR_DETAIL } from 'src/services/AdminServices';
const ServerSideCanvasRenderComponent = dynamic(
    () => import("src/@core/components/common/canvas-render/index"),
    {
        ssr: false,
    }
);
const ClientSideCanvasRenderComponent = dynamic(
    () => import("src/@core/components/common/canvas-render/index"),
    {
        ssr: false,
    }
);
const DetailsData = () => {

    const router = useRouter();
    const [detailData, setDetailData] = useState<any>()
    const [detailId, setDetailId] = useState(0)

    const getAllApi = async (productId: number) => {
        try {
            const data = await GET_ETERNITY_BAND_CONFIGURATOR_DETAIL(productId);
            if (data.code === 200 || data.code === "200") {
                setDetailData(data?.data)
            } else {
                return toast.error(data.message);
            }
        } catch (e: any) {
            toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN);
        }
        return false;
    }

    useEffect(() => {
        const productId = router.asPath.split("/?id=")[1]
        if (productId !== undefined) {
            getAllApi(parseInt(productId))
            setDetailId(parseInt(productId))
        }
    }, [router, router.isReady])

    return (
        <>
            <Button variant='contained' sx={{ ml: 1, mb: 4, mt: -2, '& svg': { mr: 2 } }} onClick={() => Router.back()}>
                <Icon icon='material-symbols:arrow-back-rounded' />
                Back
            </Button>

            <Card>
                <CardContent>
                    <CardHeader sx={{ mt: -5, ml: -5 }} title={detailData?.product_type === "Ring" ? "Ring Configurator Product" : detailData?.product_type === "three stone" ? "Threestone Configurator Product" : ""}></CardHeader>
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        <Grid item xs={4} sm={4} md={4}>
                            {detailId !== 0 ?
                                <ClientSideCanvasRenderComponent
                                    detailData={detailData}
                                    jsonFile="/assets/config_tcc_eb_variation.json"
                                    bandKey="d\{H9KprfAxqh"
                                    glbKey="ObECsgKY3qJ\$"
                                    centerDiamond={detailData?.stone_sort_code}
                                    sideDiamond={detailData?.diamonds?.stone_sort_code}
                                    showBand={false}
                                /> : <ServerSideCanvasRenderComponent
                                    detailData={detailData}
                                    jsonFile="/assets/config_tcc_eb_variation.json"
                                    bandKey="d\{H9KprfAxqh"
                                    glbKey="ObECsgKY3qJ\$"
                                    centerDiamond={detailData?.stone_sort_code}
                                    sideDiamond={detailData?.diamonds?.stone_sort_code}
                                    showBand={false}
                                />}
                        </Grid>
                        <Grid item xs={8} sm={8} md={8}>
                            <Box sx={{ display: 'flex', margin: '25px' }}>
                                <Typography sx={{ marginRight: '10px', fontWeight: 500 }}>Title: </Typography>
                                <Typography sx={{ color: 'text.secondary' }}>{detailData?.product_title}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', margin: '25px' }}>
                                <Typography sx={{ marginRight: '10px', fontWeight: 500 }}>SKU: </Typography>
                                <Typography sx={{ color: 'text.secondary' }}>{detailData?.sku}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', margin: '25px' }}>
                                <Typography sx={{ mr: 2, fontWeight: 500 }}>Sort Description: </Typography>
                                <Typography sx={{ color: 'text.secondary' }}>{detailData?.product_sort_des}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', margin: '25px' }}>
                                <Typography sx={{ mr: "10px", fontWeight: 500 }}>Side setting name: </Typography>
                                <Typography sx={{ color: 'text.secondary' }}>{detailData?.side_setting_name}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={3} sx={{ mt: '30px' }}>
                            <Typography sx={{ margin: "10px", fontWeight: 500 }}>Diamond Details </Typography>
                            <Box sx={{ display: 'flex', margin: '10px' }}>
                                <Typography sx={{ mr: "10px", fontWeight: 500 }}>Stone: </Typography>
                                <Typography sx={{ color: 'text.secondary' }}>{detailData?.stone_name}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', margin: '10px' }}>
                                <Typography sx={{ mr: "10px", fontWeight: 500 }}>Shape: </Typography>
                                <Typography sx={{ color: 'text.secondary' }}>{detailData?.diamond_shape_name}</Typography>
                            </Box>
                            {detailData?.diamond_color_name &&
                                <Box sx={{ display: 'flex', margin: '10px' }}>
                                    <Typography sx={{ mr: "10px", fontWeight: 500 }}>Color: </Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>{detailData?.diamond_color_name}</Typography>
                                </Box>
                            }
                            {detailData?.diamond_clarity_value &&
                                <Box sx={{ display: 'flex', margin: '10px' }}>
                                    <Typography sx={{ mr: "10px", fontWeight: 500 }}>Clarity: </Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>{detailData?.diamond_clarity_value}</Typography>
                                </Box>
                            }
                            {detailData?.diamond_cut_value &&
                                <Box sx={{ display: 'flex', margin: '10px' }}>
                                    <Typography sx={{ mr: "10px", fontWeight: 500 }}>Cut: </Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>{detailData?.diamond_cut_value}</Typography>
                                </Box>
                            }
                            <Box sx={{ display: 'flex', margin: '10px' }}>
                                <Typography sx={{ mr: "10px", fontWeight: 500 }}>Diamond Carat: </Typography>
                                <Typography sx={{ color: 'text.secondary' }}>{detailData?.diamond_carat_size}</Typography>
                            </Box>
                        </Grid>
                        {detailData?.alternate_dia_count !== null &&
                            <Grid item xs={3} sx={{ mt: '30px' }}>
                                <Typography sx={{ margin: "10px", fontWeight: 500 }}>Alternate Diamond Details</Typography>
                                <Box sx={{ display: 'flex', margin: '10px' }}>
                                    <Typography sx={{ mr: "10px", fontWeight: 500 }}>Stone: </Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>{detailData?.diamonds?.stone_name}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', margin: '10px' }}>
                                    <Typography sx={{ mr: "10px", fontWeight: 500 }}>Shape: </Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>{detailData?.diamonds?.diamond_shape_name}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', margin: '10px' }}>
                                    <Typography sx={{ mr: "10px", fontWeight: 500 }}>Diamond count: </Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>{detailData?.diamonds?.dia_count}</Typography>
                                </Box>
                                {detailData?.diamonds?.diamond_color_name && <Box sx={{ display: 'flex', margin: '10px' }}>
                                    <Typography sx={{ mr: "10px", fontWeight: 500 }}>Color: </Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>{detailData?.diamonds?.diamond_color_name}</Typography>
                                </Box>}
                                {detailData?.diamonds?.diamond_clarity_value && <Box sx={{ display: 'flex', margin: '10px' }}>
                                    <Typography sx={{ mr: "10px", fontWeight: 500 }}>Clarity: </Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>{detailData?.diamonds?.diamond_clarity_value}</Typography>
                                </Box>}
                                {detailData?.diamonds?.diamond_cut_value && <Box sx={{ display: 'flex', margin: '10px' }}>
                                    <Typography sx={{ mr: "10px", fontWeight: 500 }}>Cut: </Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>{detailData?.diamonds?.diamond_cut_value}</Typography>
                                </Box>}
                                {detailData?.diamonds?.diamond_carat_size && <Box sx={{ display: 'flex', margin: '10px' }}>
                                    <Typography sx={{ mr: "10px", fontWeight: 500 }}>Carat Size: </Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>{detailData?.diamonds?.diamond_carat_size}</Typography>
                                </Box>}
                            </Grid>}
                        <Grid item xs={3} sx={{ mt: '30px' }}>
                            <Typography sx={{ margin: "10px", fontWeight: 500 }}>Metal Detail</Typography>
                            {detailData?.metal?.karat_name && <Box sx={{ display: 'flex', margin: '10px' }}>
                                <Typography sx={{ mr: "10px", fontWeight: 500 }}>Karat: </Typography>
                                <Typography sx={{ color: 'text.secondary' }}>{detailData?.metal?.karat_name}</Typography>
                            </Box>}
                            <Box sx={{ display: 'flex', margin: '10px' }}>
                                <Typography sx={{ mr: "10px", fontWeight: 500 }}>Metal: </Typography>
                                <Typography sx={{ color: 'text.secondary' }}>{detailData?.metal?.metal_name}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', margin: '10px' }}>
                                <Typography sx={{ mr: "10px", fontWeight: 500 }}>Metal weight: </Typography>
                                <Typography sx={{ color: 'text.secondary' }}>{detailData?.metal?.metal_wt}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={3} sx={{ mt: '30px' }}>
                            <Typography sx={{ margin: "10px", fontWeight: 500 }}>Price Detail</Typography>
                            <Box sx={{ display: 'flex', margin: '10px' }}>
                                <Typography sx={{ mr: "10px", fontWeight: 500 }}>Diamond Price: </Typography>
                                <Typography sx={{ color: 'text.secondary' }}>{detailData?.alternate_dia_count === null ? detailData?.diamond_price * detailData?.prod_dia_total_count : detailData?.diamond_price * detailData?.alternate_dia_count}</Typography>
                            </Box>
                            {detailData?.alternate_dia_count !== null &&
                                <Box sx={{ display: 'flex', margin: '10px' }}>
                                    <Typography sx={{ mr: "10px", fontWeight: 500 }}>Alternate Diamond Price: </Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>{detailData?.diamonds?.diamond_price * detailData?.alternate_dia_count}</Typography>
                                </Box>
                            }
                            <Box sx={{ display: 'flex', margin: '10px' }}>
                                <Typography sx={{ mr: "10px", fontWeight: 500 }}>Metal Price: </Typography>
                                <Typography sx={{ color: 'text.secondary' }}>{detailData?.metal?.metal_price.toFixed(2)}</Typography>
                            </Box>
                            {detailData?.alternate_dia_count === null ?
                                <Box sx={{ display: 'flex', margin: '10px' }}>
                                    <Typography sx={{ mr: "10px", fontWeight: 500 }}>Total Price: </Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>{(detailData?.diamond_price * detailData?.prod_dia_total_count + detailData?.metal?.metal_price + detailData?.labour_charge + detailData?.other_charge).toFixed(2)}</Typography>
                                </Box> : <Box sx={{ display: 'flex', margin: '10px' }}>
                                    <Typography sx={{ mr: "10px", fontWeight: 500 }}>Total Price: </Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>{(detailData?.diamond_price * detailData?.alternate_dia_count + detailData?.diamonds?.diamond_price * detailData?.alternate_dia_count + detailData?.metal?.metal_price + detailData?.labour_charge + detailData?.other_charge).toFixed(2)}</Typography>
                                </Box>}
                        </Grid>

                    </Grid>
                </CardContent>
            </Card >
        </>
    )
}
export default DetailsData