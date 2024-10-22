import { Icon } from "@iconify/react"
import { Button, Card, CardContent, Grid, Typography } from "@mui/material"
import { Box } from "@mui/system"
import Router, { useRouter } from "next/router"
import { Fragment, useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { IMAGE_FIELD_REQUIRED, appErrors } from "src/AppConstants"
import GlbFileUpload from "src/customComponents/Form-Elements/file-upload/glbFile-upload"
import TccMultipleImageUpload from "src/customComponents/Form-Elements/file-upload/image-upload"
import TccSingleFileUpload from "src/customComponents/Form-Elements/file-upload/singleFile-upload"
import TccMultipleVideoUpload from "src/customComponents/Form-Elements/file-upload/videoFile-upload"
import TccSelect from "src/customComponents/Form-Elements/select"
import { IMAGE_UPLOAD_TYPE } from "src/data/enum"
import { ADD_PRODUCT_IMAGES, ADD_PRODUCT_VIDEO, GET_BY_ID_PRODUCTS, METAL_TONE_DROPDOWN_LIST } from "src/services/AdminServices"


const ProductImageUpload = (data: any) => {
    const [metalToneList, setMetalToneList] = useState<any[]>([])
    const [metalToneData, setMetalToneData] = useState<any>([])
    const [metalToneValue, setMetalToneValue] = useState('')
    const [productId, setProductId] = useState(0)
    const [featureRemoveImage, setFeatureRemoveImage] = useState("0")
    const [otherRemoveImage, setOtherRemoveImage] = useState("0")
    const [videoRemoveImage, setVideoRemoveImage] = useState("0")
    const [imageFile, setImageFile] = useState<string>()
    const [imageShow, setImageShow] = useState("")
    const [removeimage, setRemoveImage] = useState("0")
    const [imageValue, setImageValue] = useState('')
    const router = useRouter()
    const { id } = router.query

    const getByIdProductData = async (id: number) => {
        const data = await GET_BY_ID_PRODUCTS(id);
        if (data.code === 200 || data.code === "200") {
            setMetalToneData(data?.data?.metal_tone)
            const metalTone: any[] = []
            if (data.data.metal_tone.length === 0) {
                metalTone.push({
                    metalToneValue: '',
                    rotedImage: [],
                    imageData: [],
                    productVideo: [],
                    featuredImage: [],
                })
            } else {
                data.data.metal_tone.map((t: any) => {
                    metalTone.push({
                        ...t,
                        metalToneValue: t.id,
                        rotedImage: [],
                        imageData: [],
                        productVideo: [],
                        featuredImage: [],
                    })
                })
            }
            setMetalToneList(metalTone)
        }
    }

    const getMetalToneList = async (id: number) => {

        const payload = {
            product_id: id
        }
        try {
            const data = await METAL_TONE_DROPDOWN_LIST(payload);
            if (data.code === 200 || data.code === "200") {
                if (data.data && data.data.length > 0) {
                    const metalTone: any[] = []
                    data.data.map((t: any) => {
                        metalTone.push({
                            ...t,
                            metalToneValue: "",
                            rotedImage: [],
                            imageData: [],
                            productVideo: [],
                            featuredImage: [],
                            is_deleted: "0"
                        })
                    })
                    setMetalToneList(metalTone)
                }

            } else {
                return toast.error(data.message);
            }
        } catch (e: any) {
            toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN)
        }
    }

    useEffect(() => {
        let productDetailId: string = router.asPath.split("/?id=")[1]
        if (productDetailId != undefined) {
            setProductId(parseInt(productDetailId))
            getByIdProductData(parseInt(productDetailId))
            getMetalToneList(parseInt(productDetailId))

        }
    }, [router.isReady])

    const productImagesAdd = async (index: number) => {

        const objAtIndex = metalToneList[index];
        if (objAtIndex?.imageData?.length > 0) {
            const formData = new FormData()
            formData.append("id_product", productId.toString())
            formData.append("id_metal_tone", objAtIndex.metalToneValue)
            formData.append("image_type", "2")

            objAtIndex.imageData.map((t: any) => {
                formData.append("images", t)
            })
            try {
                const data = await ADD_PRODUCT_IMAGES(formData);
                if (data.code === 200 || data.code === "200") {
                    setOtherRemoveImage("1")
                    setMetalToneValue('')
                    const metalData = metalToneList;
                    metalData[index].imageData = data
                    setMetalToneList([...metalData])
                    return (toast.success(data.message))
                }
                else {
                    toast.error(data.message);
                }
            } catch (e: any) {
                toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN);
            }
            return false;
        }
    }

    const productFeaturedImages = async (index: number) => {
        const objAtIndex = metalToneList[index];
        if (objAtIndex.featuredImage?.length === 0) {
            toast.error(`${IMAGE_FIELD_REQUIRED}`, {
                position: "top-right"
            });

        }
        else {
            const formData = new FormData()
            formData.append("id_product", productId.toString())
            formData.append("id_metal_tone", objAtIndex.metalToneValue)
            formData.append("image_type", "1")
            objAtIndex.featuredImage?.map((t: any) => {
                formData.append("images", t)
            })

            try {
                const data = await ADD_PRODUCT_IMAGES(formData);
                if (data.code === 200 || data.code === "200") {
                    setMetalToneValue('')
                    setFeatureRemoveImage("1")
                    const metalData = metalToneList;
                    metalData[index].featuredImage = data
                    setMetalToneList([...metalData])
                    return (toast.success(data.message))
                }
                else {
                    toast.error(data.message);
                }
            } catch (e: any) {
                toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN);
            }
        }

    }

    const product360Images = async (index: number) => {
        const objAtIndex = metalToneList[index];
        if (objAtIndex.rotedImage.length !== 0) {
            const formData = new FormData()
            formData.append("id_product", productId.toString())
            formData.append("id_metal_tone", objAtIndex.metalToneValue)
            formData.append("image_type", "3")

            objAtIndex.rotedImage.map((t: any) => {
                formData.append("images", t)
            })

            try {
                const data = await ADD_PRODUCT_IMAGES(formData);
                if (data.code === 200 || data.code === "200") {
                    setMetalToneValue('')
                    const metalData = metalToneList;
                    metalData[index].rotedImage = data
                    setMetalToneList([...metalData])
                    return (toast.success(data.message))
                }
                else {
                    toast.error(data.message);
                }
            } catch (e: any) {
                toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN);
            }

            return false;
        }
    }

    const productVideoUpload = async (index: number) => {
        const objAtIndex = metalToneList[index];
        if (objAtIndex.productVideo.length !== 0) {
            const formData = new FormData()
            formData.append("id_product", productId.toString())
            formData.append("id_metal_tone", objAtIndex.metalToneValue)
            formData.append("image_type", "4")
            formData.append("images", objAtIndex?.productVideo)
            try {
                const data = await ADD_PRODUCT_IMAGES(formData);
                if (data.code === 200 || data.code === "200") {
                    setMetalToneValue('')
                    setVideoRemoveImage("1")
                    const metalData = metalToneList;
                    metalData[index].productVideo = data
                    setMetalToneList([...metalData])
                    return (toast.success(data.message))
                }
                else {
                    toast.error(data.message);
                }
            } catch (e: any) {
                toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN);
            }
        }
    }

    // ** GLB UPLOAD
    const productGlbUpload = async () => {
        if (imageFile) {
            const formData = new FormData()
            formData.append("id_product", productId.toString())
            formData.append("id_metal_tone", '')
            formData.append("image_type", IMAGE_UPLOAD_TYPE.Glb_upload)
            formData.append("images", imageFile || "")
            try {
                const data = await ADD_PRODUCT_IMAGES(formData);
                if (data.code === 200 || data.code === "200") {
                    setMetalToneValue('')
                    setRemoveImage("1")
                    return (toast.success(data.message))
                }
                else {
                    toast.error(data.message);
                }
            } catch (e: any) {
                toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN);
            }
        }
    }
    return (
        <Fragment>
            <Button variant='contained' sx={{ ml: 5, mb: 4, '& svg': { mr: 2 } }} onClick={() => Router.back()}>
                <Icon icon='material-symbols:arrow-back-rounded' />
                Back
            </Button>
            <Box sx={{ display: "flex", justifyContent: "end" }}>
                <Button variant='contained' sx={{ mt: -13, mb: 4, '& svg': { mr: 2 } }} onClick={(data: any) => Router.push({ pathname: "/product/show-image-upload", query: { id: id } })}>
                    View / Delete
                </Button>
            </Box>
            <Grid container spacing={6}>
                <>
                    <Grid item xs={12} md={12} lg={12} sx={{ ml: 5 }}>
                        <Card >
                            <CardContent>
                                <Box>
                                    <Grid container spacing={6}>
                                        <Grid item xs={12} md={12} lg={12}>
                                            <Typography variant="body2" sx={{ mb: 2, mt: 4 }}>GLB Upload</Typography>
                                            <GlbFileUpload
                                                onDrop={setImageFile}
                                                onClick={removeimage}
                                                imageFile={imageShow}
                                                imageValue={setImageValue}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                                <Box sx={{ display: "flex", justifyContent: "end" }}>
                                    <Button variant='contained' sx={{ mt: 8 }} onClick={() => {
                                        productGlbUpload()
                                    }}>
                                        SAVE
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    {metalToneList && metalToneList.map((value, i) => {
                        return (
                            <Grid item xs={12} md={12} lg={12} sx={{ ml: 5 }}>
                                <Card key={i}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex' }}>
                                            <Grid xs={6} md={12} lg={6} sx={{ mr: 4 }}>
                                                <Typography variant="body2" sx={{ mb: 2 }}>Tone</Typography>
                                                <TccSelect
                                                    fullWidth
                                                    size='small'
                                                    inputLabel="Selete product Tone"
                                                    label='Selete product Tone'
                                                    id='controlled-select'
                                                    value={value.metalToneValue}
                                                    title='name'
                                                    onChange={(e: any) => {
                                                        const metalData = metalToneList;
                                                        metalData[i].metalToneValue = e.target.value
                                                        setMetalToneList([...metalData])
                                                    }}
                                                    Options={metalToneList}
                                                />
                                            </Grid>
                                            <Grid xs={6} md={12} lg={6}>
                                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                                    <Typography variant="body2" sx={{ mb: 2 }}>video Upload</Typography>
                                                </Box>
                                                <TccMultipleVideoUpload onDrop={(data: any) => {
                                                    const metalData = metalToneList;
                                                    metalData[i].productVideo = data
                                                    setMetalToneList([...metalData])
                                                }} onClick={videoRemoveImage} onRemoveData={setVideoRemoveImage} />
                                            </Grid>
                                        </Box>
                                        <Box>
                                            <Grid container spacing={6}>
                                                <Grid item xs={12} md={4} lg={4}>
                                                    <Typography variant="body2" sx={{ mb: 2, mt: 4 }}>Image Upload</Typography>
                                                    <TccMultipleImageUpload onDrop={(data: any) => {
                                                        const metalData = metalToneList;
                                                        metalData[i].imageData = data
                                                        setMetalToneList([...metalData])
                                                    }} onClick={otherRemoveImage} onRemoveData={setOtherRemoveImage} />
                                                </Grid>
                                                <Grid item xs={12} md={4} lg={4}>
                                                    <Typography variant="body2" sx={{ mb: 2, mt: 4 }}>Featured Image Upload</Typography>
                                                    <TccMultipleImageUpload onDrop={(data: any) => {
                                                        const metalData = metalToneList;
                                                        metalData[i].featuredImage = data
                                                        setMetalToneList([...metalData])
                                                    }} onClick={featureRemoveImage} onRemoveData={setFeatureRemoveImage} />
                                                </Grid>
                                                <Grid item xs={12} md={4} lg={4}>
                                                    <Typography variant="body2" sx={{ mb: 2, mt: 4 }}>360 Image Upload</Typography>
                                                    <TccMultipleImageUpload onDrop={(data: any) => {
                                                        const metalData = metalToneList;
                                                        metalData[i].rotedImage = data
                                                        setMetalToneList([...metalData])
                                                    }} />
                                                </Grid>
                                            </Grid>
                                        </Box>
                                        <Box sx={{ display: "flex", justifyContent: "end" }}>
                                            <Button variant='contained' sx={{ mt: 8 }} onClick={() => {
                                                productImagesAdd(i)
                                                const objAtIndex = metalToneList[i]
                                                if (metalToneData.length !== 0) {
                                                    if (objAtIndex.metalToneValue == '') {
                                                        toast.error("Metal Tone is required", {
                                                            position: "top-right"
                                                        });
                                                    } else {
                                                        productFeaturedImages(i)
                                                        productVideoUpload(i)
                                                    }
                                                }
                                                if (metalToneData.length === 0) {
                                                    productFeaturedImages(i)
                                                    productVideoUpload(i)
                                                }
                                                product360Images(i)
                                            }}>
                                                SAVE
                                            </Button>
                                        </Box>

                                    </CardContent>
                                </Card>
                            </Grid>
                        )
                    })}
                </>
            </Grid>
        </Fragment >
    )
}

export default ProductImageUpload
