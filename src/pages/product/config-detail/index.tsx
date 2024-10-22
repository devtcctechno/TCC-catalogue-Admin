// ** MUI Imports
import { Icon } from '@iconify/react'
import { CardContent, CardHeader, Grid, Card, Drawer, Typography, IconButton, Button, FormControl, TextField, FormHelperText, Box, Divider } from '@mui/material'
import dynamic from 'next/dynamic';
import Router, { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
// import CanvasRenderComponent from 'src/@core/components/common/canvas-render';
import { appErrors } from 'src/AppConstants';
import { GET_CONFIGURATOR_DETAIL } from 'src/services/AdminServices';
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
    const { id } = router.query;
    const [detailData, setDetailData] = useState<any>()
    const [sideDiamondPrice, setSideDiamondPrice] = useState<number>()
    const [metalPrice, setMetalPrice] = useState<number>()
    const [withoutBandMetalPrice, setWithoutBandMetalPrice] = useState<number>()
    const [detailId, setDetailId] = useState(0)

    // ---- Three Stone Detail Api ----

    const getAllApi = async (productId: number) => {
        try {
            const data = await GET_CONFIGURATOR_DETAIL(productId);
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
        const productId: string = id as string
        if (productId !== undefined) {
            getAllApi(parseInt(productId))
            setDetailId(parseInt(productId))
        }
    }, [router.isReady])

    useEffect(() => {
        if (detailData) {
            // ** Side Diamond Price Calculate 
            let sideDiamondPrice = [];
            let metalPrice = [];
            let withoutBandPrice = [];
            for (const priceData of detailData.CPDO) {
                const productPDOPrice: any = priceData?.price;
                if (productPDOPrice) {
                    sideDiamondPrice.push(parseFloat(productPDOPrice.toFixed(2)));
                }
            }
            const sideDiamondTotal = sideDiamondPrice.reduce((accumulator, currentValue) => {
                return accumulator + currentValue;
            }, 0);

            setSideDiamondPrice(sideDiamondTotal)

            // ** Metal Price Calculate **

            for (const priceData of detailData.CPMO) {
                const productMetalPrice: any = priceData?.price;
                metalPrice.push(parseFloat(productMetalPrice.toFixed(2)));
            }
            const metalTotal = metalPrice.reduce((accumulator, currentValue) => {
                return accumulator + currentValue;
            }, 0);
            setMetalPrice(parseFloat(metalTotal.toFixed(2)))

            // ** Without Band Price Calculate **

            const bandData = detailData.CPMO.filter((value: any) => value.product_type !== "BAND")
            for (const priceData of bandData) {
                const productMetalPrice: any = priceData?.price;
                withoutBandPrice.push(parseFloat(productMetalPrice.toFixed(2)));
            }
            const withotBandTotal = withoutBandPrice.reduce((accumulator, currentValue) => {
                return accumulator + currentValue;
            }, 0);
            setWithoutBandMetalPrice(parseFloat(withotBandTotal.toFixed(2)))

        }

    }, [detailData])

    return (
        <>
            <Button variant='contained' sx={{ ml: 1, mb: 4, mt: -2, '& svg': { mr: 2 } }} onClick={() => Router.back()}>
                <Icon icon='material-symbols:arrow-back-rounded' />
                Back
            </Button>

            <Card>
                <CardContent>
                    <CardHeader sx={{ mt: -5, ml: -5 }} title={detailData?.product_type === "Ring" ? "Ring Configurator Product" : detailData?.product_type === "three stone" ? "Threestone Configurator Product" : ""}></CardHeader>
                    <Grid container spacing={2}>
                        <Grid item xs={4} sm={4} md={4}>
                            {detailId !== 0 ?
                                <>
                                    {detailData && detailData?.product_type === "Ring" ? (
                                        <ClientSideCanvasRenderComponent
                                            detailData={detailData && detailData}
                                            jsonFile="/assets/config_tcc_variation.json"
                                            bandKey="d\{H9KprfAxqh"
                                            glbKey="ObECsgKY3qJ\$"
                                            showBand={true}
                                            centerDiamond={detailData?.center_stone_sort_code}
                                            uv_glb="UV_TCC.glb"
                                        />
                                    ) : (
                                        <ClientSideCanvasRenderComponent
                                            detailData={detailData}
                                            jsonFile="/assets/config_tcc_ts_variation.json"
                                            bandKey="d\{H9KprfAxqh"
                                            glbKey="bHWO9zkVDqTkNQG"
                                            showBand={false}
                                            centerDiamond={detailData?.center_stone_sort_code}
                                            sideDiamond={detailData?.CPDO[0].stone_sort_code}
                                            uv_glb="UV_TCC.glb"
                                        />
                                    )}

                                </>
                                :
                                <>
                                    {detailData && detailData?.product_type === "Ring" ? (
                                        <ServerSideCanvasRenderComponent
                                            detailData={detailData && detailData}
                                            jsonFile="/assets/config_tcc_variation.json"
                                            bandKey="d\{H9KprfAxqh"
                                            glbKey="ObECsgKY3qJ\$"
                                            showBand={true}
                                            centerDiamond={detailData?.center_stone_sort_code}
                                            uv_glb="UV_TCC.glb"
                                        />
                                    ) : (
                                        <ServerSideCanvasRenderComponent
                                            detailData={detailData}
                                            jsonFile="/assets/config_tcc_ts_variation.json"
                                            bandKey="d\{H9KprfAxqh"
                                            glbKey="bHWO9zkVDqTkNQG"
                                            showBand={false}
                                            centerDiamond={detailData?.center_stone_sort_code}
                                            sideDiamond={detailData?.CPDO[0].stone_sort_code}
                                            uv_glb="UV_TCC.glb"
                                        />
                                    )}
                                </>}
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
                                <Typography sx={{ mr: "10px", fontWeight: 500 }}>Center stone: </Typography>
                                <Typography sx={{ color: 'text.secondary' }}>{detailData?.center_stone}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', margin: '25px' }}>
                                <Typography sx={{ mr: "10px", fontWeight: 500 }}>Center Diamond shape: </Typography>
                                <Typography sx={{ color: 'text.secondary' }}>{detailData?.center_Diamond_shape}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', margin: '25px' }}>
                                <Typography sx={{ mr: "10px", fontWeight: 500 }}>Head name: </Typography>
                                <Typography sx={{ color: 'text.secondary' }}>{detailData?.head_name}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', margin: '25px' }}>
                                <Typography sx={{ mr: "10px", fontWeight: 500 }}>Shank name: </Typography>
                                <Typography sx={{ color: 'text.secondary' }}>{detailData?.shank_name}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', margin: '25px' }}>
                                <Typography sx={{ mr: "10px", fontWeight: 500 }}>Side setting name: </Typography>
                                <Typography sx={{ color: 'text.secondary' }}>{detailData?.side_setting_name}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={3} sx={{ mt: '10px' }}>
                            <Typography sx={{ margin: "10px", fontWeight: 500 }}>Center Diamond Detail </Typography>
                            <Box sx={{ display: 'flex', margin: '10px' }}>
                                <Typography sx={{ mr: "10px", fontWeight: 500 }}>Stone: </Typography>
                                <Typography sx={{ color: 'text.secondary' }}>{detailData?.center_stone}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', margin: '10px' }}>
                                <Typography sx={{ mr: "10px", fontWeight: 500 }}>Shape: </Typography>
                                <Typography sx={{ color: 'text.secondary' }}>{detailData?.center_Diamond_shape}</Typography>
                            </Box>
                            {detailData?.center_diamond_color &&
                                <Box sx={{ display: 'flex', margin: '10px' }}>
                                    <Typography sx={{ mr: "10px", fontWeight: 500 }}>Color: </Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>{detailData?.center_diamond_color}</Typography>
                                </Box>
                            }
                            {detailData?.center_diamond_cut &&
                                <Box sx={{ display: 'flex', margin: '10px' }}>
                                    <Typography sx={{ mr: "10px", fontWeight: 500 }}>Cut: </Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>{detailData?.center_diamond_cut}</Typography>
                                </Box>
                            }
                            {detailData?.center_diamond_clarity &&
                                <Box sx={{ display: 'flex', margin: '10px' }}>
                                    <Typography sx={{ mr: "10px", fontWeight: 500 }}>Clarity: </Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>{detailData?.center_diamond_clarity}</Typography>
                                </Box>
                            }
                            <Box sx={{ display: 'flex', margin: '10px' }}>
                                <Typography sx={{ mr: "10px", fontWeight: 500 }}>Diamond carat: </Typography>
                                <Typography sx={{ color: 'text.secondary' }}>{detailData?.center_diamond_carat}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={3} sx={{ mt: '10px' }}>
                            <Typography sx={{ margin: "10px", fontWeight: 500 }}>Side Diamond Detail </Typography>
                            {detailData?.CPDO.map((value: any) => (
                                <>
                                    <Box sx={{ display: 'flex', margin: '10px' }}>
                                        <Typography sx={{ mr: "10px", fontWeight: 500 }}>Product type: </Typography>
                                        <Typography sx={{ color: 'text.secondary' }}>{value?.product_type}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', margin: '10px' }}>
                                        <Typography sx={{ mr: "10px", fontWeight: 500 }}>Stone: </Typography>
                                        <Typography sx={{ color: 'text.secondary' }}>{value?.stone}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', margin: '10px' }}>
                                        <Typography sx={{ mr: "10px", fontWeight: 500 }}>Shape: </Typography>
                                        <Typography sx={{ color: 'text.secondary' }}>{value?.Diamond_shape}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', margin: '10px' }}>
                                        <Typography sx={{ mr: "10px", fontWeight: 500 }}>Diamond count: </Typography>
                                        <Typography sx={{ color: 'text.secondary' }}>{value?.dia_count}</Typography>
                                    </Box>
                                    {value?.diamond_color && <Box sx={{ display: 'flex', margin: '10px' }}>
                                        <Typography sx={{ mr: "10px", fontWeight: 500 }}>Color: </Typography>
                                        <Typography sx={{ color: 'text.secondary' }}>{value?.diamond_color}</Typography>
                                    </Box>}
                                    {value?.diamond_clarity && <Box sx={{ display: 'flex', margin: '10px' }}>
                                        <Typography sx={{ mr: "10px", fontWeight: 500 }}>Clarity: </Typography>
                                        <Typography sx={{ color: 'text.secondary' }}>{value?.diamond_clarity}</Typography>
                                    </Box>}
                                    {value?.diamond_cut && <Box sx={{ display: 'flex', margin: '10px' }}>
                                        <Typography sx={{ mr: "10px", fontWeight: 500 }}>Cut: </Typography>
                                        <Typography sx={{ color: 'text.secondary' }}>{value?.diamond_cut}</Typography>
                                    </Box>}
                                    <Box sx={{ display: 'flex', margin: '10px' }}>
                                        <Typography sx={{ mr: "10px", fontWeight: 500 }}>MM size: </Typography>
                                        <Typography sx={{ color: 'text.secondary' }}>{value?.diamond_mm_size}</Typography>
                                    </Box>
                                </>
                            ))}
                        </Grid>
                        <Grid item xs={3} sx={{ mt: '10px' }}>
                            <Typography sx={{ margin: "10px", fontWeight: 500 }}>Metal Detail</Typography>
                            {detailData?.CPMO.map((value: any) => (
                                <>
                                    <Box sx={{ display: 'flex', margin: '10px' }}>
                                        <Typography sx={{ mr: "10px", fontWeight: 500 }}>Product type: </Typography>
                                        <Typography sx={{ color: 'text.secondary' }}>{value?.product_type}</Typography>
                                    </Box>
                                    {value?.karat_name && <Box sx={{ display: 'flex', margin: '10px' }}>
                                        <Typography sx={{ mr: "10px", fontWeight: 500 }}>Karat: </Typography>
                                        <Typography sx={{ color: 'text.secondary' }}>{value?.karat_name}</Typography>
                                    </Box>}
                                    <Box sx={{ display: 'flex', margin: '10px' }}>
                                        <Typography sx={{ mr: "10px", fontWeight: 500 }}>Metal: </Typography>
                                        <Typography sx={{ color: 'text.secondary' }}>{value?.metal_name}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', margin: '10px' }}>
                                        <Typography sx={{ mr: "10px", fontWeight: 500 }}>Metal weight: </Typography>
                                        <Typography sx={{ color: 'text.secondary' }}>{value?.metal_wt}</Typography>
                                    </Box>
                                </>
                            ))}
                        </Grid>
                        <Grid item xs={3} sx={{ mt: '10px' }}>
                            {detailData?.product_type === "Ring" &&
                                <>
                                    <Typography sx={{ margin: "10px", fontWeight: 500 }}>Without Band Price Detail</Typography>
                                    <Box sx={{ display: 'flex', margin: '10px' }}>
                                        <Typography sx={{ mr: "10px", fontWeight: 500 }}>Center Diamond Price: </Typography>
                                        <Typography sx={{ color: 'text.secondary' }}>{detailData?.center_dia_price}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', margin: '10px' }}>
                                        <Typography sx={{ mr: "10px", fontWeight: 500 }}>Side Diamond Price: </Typography>
                                        <Typography sx={{ color: 'text.secondary' }}>{sideDiamondPrice}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', margin: '10px' }}>
                                        <Typography sx={{ mr: "10px", fontWeight: 500 }}>Metal Price: </Typography>
                                        <Typography sx={{ color: 'text.secondary' }}>{withoutBandMetalPrice}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', margin: '10px' }}>
                                        <Typography sx={{ mr: "10px", fontWeight: 500 }}>Total Price: </Typography>
                                        <Typography sx={{ color: 'text.secondary' }}>{(detailData?.center_dia_price + sideDiamondPrice + withoutBandMetalPrice).toFixed(2)}</Typography>
                                    </Box>
                                    <Divider style={{ borderBottomWidth: 'medium' }} />
                                </>
                            }
                            <Typography sx={{ margin: "10px", fontWeight: 500 }}>Price Detail</Typography>
                            <Box sx={{ display: 'flex', margin: '10px' }}>
                                <Typography sx={{ mr: "10px", fontWeight: 500 }}>Center Diamond Price: </Typography>
                                <Typography sx={{ color: 'text.secondary' }}>{detailData?.center_dia_price}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', margin: '10px' }}>
                                <Typography sx={{ mr: "10px", fontWeight: 500 }}>Side Diamond Price: </Typography>
                                <Typography sx={{ color: 'text.secondary' }}>{sideDiamondPrice}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', margin: '10px' }}>
                                <Typography sx={{ mr: "10px", fontWeight: 500 }}>Metal Price: </Typography>
                                <Typography sx={{ color: 'text.secondary' }}>{metalPrice}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', margin: '10px' }}>
                                <Typography sx={{ mr: "10px", fontWeight: 500 }}>Total Price: </Typography>
                                <Typography sx={{ color: 'text.secondary' }}>{(detailData?.center_dia_price + sideDiamondPrice + metalPrice).toFixed(2)}</Typography>
                            </Box>
                        </Grid>

                    </Grid>
                </CardContent>
            </Card >
        </>
    )
}
export default DetailsData