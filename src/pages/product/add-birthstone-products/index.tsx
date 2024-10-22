// ** React Imports
import { ChangeEvent, Fragment, SyntheticEvent, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Stepper from '@mui/material/Stepper'
import { styled } from '@mui/material/styles'
import StepLabel from '@mui/material/StepLabel'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import MuiStep, { StepProps } from '@mui/material/Step'

// ** Third Party Imports
import toast from 'react-hot-toast'

// ** Icon Imports
import { Icon } from '@iconify/react'

// ** Custom Components Imports
import StepperCustomDot from 'src/customComponents/StepperCustomDot/intex'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

// ** Styled Component
import StepperWrapper from 'src/@core/styles/mui/stepper'
import TccInput from 'src/customComponents/Form-Elements/inputField'
import TccEditor from 'src/customComponents/Form-Elements/editor'
import { Autocomplete, CardHeader, Checkbox, FormControlLabel, FormGroup, FormHelperText, MenuItem, Paper, Radio, RadioGroup, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import TccSelect from 'src/customComponents/Form-Elements/select'
import { ADD_BIRTHSTONE_PRODUCT_DETAILS, ADD_BIRTHSTONE_PRODUCT_IMAGE, ADD_PRODUCT_DROPDOWN_LIST, ADD_PRODUCT_METAL_DIAMOND_DETAILS, ADD_PRODUCT_MRTAL_DATA, EDIT_BIRTHSTONE_PRODUCT_DETAILS, EDIT_PRODUCT_DETAILS, GET_BY_ID_BIRTHSTONE_PRODUCTS, GET_BY_ID_PRODUCTS } from 'src/services/AdminServices'
import { appErrors, BIRTHSTONE_STONE_TYPE } from 'src/AppConstants'
import Router, { useRouter } from 'next/router'

import { MEATL_GOLD_ID, MEATL_PLATINUM_ID, MEATL_SILVER_ID } from 'src/AppConfig'
import TccSingleFileUpload from 'src/customComponents/Form-Elements/file-upload/singleFile-upload'

const steps = [
    {
        icon: 'fluent-mdl2:product-release',
        title: 'Birthstone Product Basic Details',
    },
    {
        icon: 'ion:diamond-outline',
        title: 'Metal & Gemstone Details',
    }

    // {
    //   icon: 'ion:diamond-outline',
    //   title: 'Image Upload',
    // }

]

const stoneCountData: any = [
    {
        id: 1,
        value: "1",
    },
    {
        id: 2,
        value: "2"
    },
    {
        id: 3,
        value: "3"
    }
]

const genderData: any = [
    {
        id: 1,
        name: "Male",
    },
    {
        id: 2,
        name: "Female"
    },
    {
        id: 3,
        name: "Unisex"
    }
]

const Step = styled(MuiStep)<StepProps>(({ theme }) => ({
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    '&:first-of-type': {
        paddingLeft: 0
    },
    '&:last-of-type': {
        paddingRight: 0
    },
    '& .MuiStepLabel-iconContainer': {
        display: 'none'
    },
    '& .step-subtitle': {
        color: `${theme.palette.text.disabled} !important`
    },
    '& + svg': {
        color: theme.palette.text.disabled
    },
    '&.Mui-completed .step-title': {
        color: theme.palette.text.disabled
    },
    '&.Mui-completed + svg': {
        color: theme.palette.primary.main
    }
}))

const ProductAddBirthStone = () => {
    // ** States
    let productSizeLenghtFilter: any;
    const [productId, setProductId] = useState(0)
    const [count, setCount] = useState(1)
    const [radioButtonStripe, setRadioButtonStripe] = useState('')
    const [inputFieldsCategory, setInputFieldsCategory] = useState([{ c_id: 0, category: null, subCategory: null, subSubCategory: null, categoryList: [], subCategoryList: [], subSubCategoryList: [], id: 0, is_deleted: "0" }])
    const [inputFields, setInputFields] = useState([{ id: 0, textEngraving: null, countEngraving: null, is_deleted: "0", e_id: 0 }])
    const [inputFieldsGold, setInputFieldsGold] = useState([{ rate: '', default: '0', price: '', weight: '', metalGroup: "", id: 0, isDeleted: 0 }])
    const [inputFieldsDiamond, setInputFieldsDiamond] = useState<any>([{
        d_id: 0, default: '0', diamondGroup: null, Stone_type: null, stone_mm_size: null,
        Stone_weight: 0, stone_cut: null, stone_color: null, stone_clarity: null, stone_shape: null,
        stone: null, stone_count: 0, is_carat: null, rate: 0, price: 0,
        id: 0, is_deleted: 0
    }])
    const [inputFieldGoldMetal, setInputFieldGoldMetal] = useState<{ karat: null, id_karat: null, tone: any[], price: '', rate: 0, id: 0, metal_weight: null, metal_tone: [], isDeleted: 0 }[]>([])
    const [inputFieldSilverMetal, setInputFieldSilverMetal] = useState([{ tone: [{ id: null, name: "" }], price: '', rate: 0, id: 0, metal_tone: [], metal_weight: null, isDeleted: 0 }])
    const [inputFieldPlatinumMetal, setInputFieldPlatinumMetal] = useState([{ tone: [{ id: null, name: "" }], price: '', rate: 0, id: 0, metal_tone: [], metal_weight: null, isDeleted: 0 }])
    const [productName, setProductName] = useState('')
    const [productSKU, setProductSKU] = useState<string>('')
    const [productSortDes, setProductSortDes] = useState('')
    const [productLongDes, setProductLongDes] = useState('')
    const [keywordsList, setKeywordsList] = useState([])
    const [keyword, setKeyword] = useState<{ id: null, name: "" }[]>([])
    const [gender, setGender] = useState<{ id: null, name: "" }[]>([])
    const [caratSizeList, setCaratSizeList] = useState([])
    const [settingType, setSettingType] = useState<{ id: null, name: "" }[]>([])
    const [itemSizeList, setItemSizeList] = useState([])
    const [itemSize, setItemSize] = useState<{ id: null, size: "" }[]>([])
    const [itemLengthList, setItemLengthList] = useState([])
    const [itemLength, setItemLength] = useState<{ id: null, length: "" }[]>([])
    const [metalGroupList, setMetalGroupList] = useState<any[]>([])
    const [diamondGroupList, setDiamondGroupList] = useState([])
    const [stoneTypeList, setStoneTypeList] = useState([{ id: 1, name: "Fix" }, { id: 2, name: "Changeable" }])
    const [metalToneList, setMetalToneList] = useState<any>([])
    const [silverToneList, setSilverToneList] = useState<any>([])
    const [paltinumToneList, setPaltinumToneList] = useState<any>([])
    const [stoneSettingList, setStoneSettingList] = useState([])
    const [categorysList, setCategorysList] = useState([])
    const [stoneList, setStoneList] = useState([])
    const [stoneShapeList, setStoneShapeList] = useState([])
    const [stoneColor, setStoneColor] = useState([])
    const [stoneClarity, setStoneClarity] = useState([])
    const [stoneCuts, setStoneCuts] = useState([])
    const [metalKaratList, setMetalKaratList] = useState<any>([])
    const [stoneMMSize, setStoneMMSize] = useState([]);
    const [activeStep, setActiveStep] = useState<number>(0)
    const [checkedSize, setCheckedSize] = useState<boolean>(false)
    const [checkedLength, setCheckedLength] = useState<boolean>(false)
    const [marketingCharge, setMarketingCharge] = useState<number>(0)
    const [findingCharge, setFindingCharge] = useState<number>(0)
    const [otherCharge, setOtherCharge] = useState<number>(0)
    const [checked, setChecked] = useState({})
    const [category, setCategory] = useState<any>()
    const [gemstoneCount, setGemstoneCount] = useState<string>('')
    const [productNumber, setProductNumber] = useState<any>()
    const [isDisabled, setIsDisabled] = useState(false);
    const [engravingText, setEngravingText] = useState("");
    const [engravingTextCount, setEngravingTextCount] = useState(1);
    const [characterCount, setCharacterCount] = useState("")
    const [imageFile, setImageFile] = useState<string>()
    const [imageShow, setImageShow] = useState("")
    const [removeimage, setRemoveImage] = useState("0")
    const router = useRouter();
    const { id, action } = router.query;
    const [inputFieldVariant, setInputFieldVariant] = useState<any[]>([])
    const [finalVariantArrayData, setFinalVariantArrayData] = useState<any>([])
    const [finalInputVariant, setFinalInputVariant] = useState<any>([])
    const [errorKeyWord, setErrorKeyWord] = useState(false)
    const [editerData, setEditerData] = useState<any>()
    const [edit, setEdit] = useState<String>('<p></p>')
    const [called, setCalled] = useState(true)
    const [errorData, setErrorData] = useState<any>()
    const [formErrorData, setFormErrorData] = useState({
        errors: {
            title: '',
            sku: '',
            sortDescription: '',
            longDescription: '',
            keyWordError: [],
            gemstoneError: '',
        }
    });

    const { viewid } = router.query;
    const handleChecked = (id: any) => (e: any) => {
        const { checked } = e.target;
        setChecked((values) => ({
            ...values,
            [id]: checked
        }));
    }
    productSizeLenghtFilter = categorysList.find((t: any) => t.id === inputFieldsCategory[0]?.category)

    useEffect(() => {
        const productDetailId: string = id as string

        if (productDetailId != undefined) {
            setProductId(parseInt(productDetailId))
        }
        getAllDropDownData(productDetailId)
    }, [router.isReady])

    // ******* GET_BY_ID API 

    const getByIdProductData = async (dropDownData: any, productDetailId: string) => {

        try {
            const data = await GET_BY_ID_BIRTHSTONE_PRODUCTS(parseInt(productDetailId));
            if (data.code === 200 || data.code === "200") {
                setImageShow(data.data.image_path)
                setProductId(data.data.id)
                setProductName(data.data.name)
                setProductSKU(data.data.sku)
                setProductSortDes(data.data.sort_description)
                setEdit(data.data.long_description)
                setFindingCharge(data.data.finding_charge)
                setMarketingCharge(data.data.making_charge)
                setOtherCharge(data.data.other_charge)
                setEngravingTextCount(data.data.engraving_count)
                setProductNumber(data.data.product_number)
                setGemstoneCount(data.data.gemstone_count)
                setImageFile(data.data.image_path)
                const tags = dropDownData.keyWords?.filter((t: any) => {
                    if (data.data.tag.indexOf(parseInt(t.id)) >= 0) return t;
                });
                setKeyword(tags)

                const genderDatas: any = genderData?.filter((t: any) => {
                    if (data.data.gender.indexOf(parseInt(t.id)) >= 0) return t;
                });
                setGender(genderDatas)

                const arrCategories: any[] = []
                {
                    data.data.birth_stone_product_categories.map((value: any, index: any) => {
                        const categoryList = dropDownData.categoryList;
                        let subCategoryList = []
                        let subSubCategoryList = []
                        if (value.id_sub_sub_category) {
                            subCategoryList = categoryList.filter((t: any) => parseInt(t.parent_id) === parseInt(value.id_category));
                            subSubCategoryList = categoryList.filter((t: any) => parseInt(t.parent_id) === parseInt(value.id_sub_category));
                        }
                        else {
                            subCategoryList = categoryList.filter((t: any) => parseInt(t.parent_id) === parseInt(value.id_category));
                        }

                        const data = {
                            category: value.id_category,
                            subCategory: value.id_sub_category,
                            subSubCategory: value.id_sub_sub_category,
                            categoryList: categoryList,
                            subCategoryList: subCategoryList,
                            subSubCategoryList: subSubCategoryList,
                            id: value.id,
                            is_deleted: "0",
                            c_id: index + 1
                        }
                        arrCategories.push(data)

                    })
                    setInputFieldsCategory(arrCategories)
                }
                const arrEngraving: any[] = []
                {
                    data.data.engravings.map((value: any, index: any) => {
                        const data: any = {
                            textEngraving: value.text,
                            countEngraving: value.max_text_count,
                            is_deleted: "0",
                            id: value.id,
                            e_id: index + 1
                        }
                        arrEngraving.push(data)
                    })
                }
                setInputFields(arrEngraving)

                const item_size = dropDownData.item_size?.filter((t: any) => {
                    if (data.data.size.indexOf(parseInt(t.id)) >= 0) return t;
                })
                setItemSize(item_size)

                const item_length = dropDownData.item_length?.filter((t: any) => {
                    if ((data.data.length as number[]).indexOf(parseInt(t.id)) >= 0) return t;
                })
                setItemLength(item_length)

                const categoryData = dropDownData.categoryList.find((t: any) => t.id == parseInt(data.data.birth_stone_product_categories[0].id_category))

                setCategory(categoryData)
                if (categoryData.id_size.length > 0) {
                    const sizeList: any = []
                    for (const list of categoryData.id_size) {
                        const sizeData: any = dropDownData.item_size.find((t: any) => t.id == parseInt(list))
                        if (sizeData) {
                            sizeList.push({ id: sizeData.id, size: sizeData.size })
                        }
                    }

                    setItemSizeList(sizeList)
                }
                if (categoryData.id_length.length > 0) {
                    const lengthList: any = []
                    for (const list of categoryData.id_length) {
                        const lengthData: any = dropDownData.item_length.find((t: any) => t.id == parseInt(list))
                        if (lengthData) {
                            lengthList.push({ id: lengthData.id, length: lengthData.length })
                        }
                    }
                    setItemLengthList(lengthList)
                }

                const birthstone_product = data.data.birthstone_PDO.map((value: any, index: any) => {
                    if (value.id_type == 1) {
                        const data = {
                            default: value.is_default,
                            Stone_type: value.id_type,
                            stone_mm_size: value.id_mm_size,
                            Stone_weight: value.weight,
                            stone_cut: value.id_cut,
                            stone_color: value.id_color,
                            stone_clarity: value.id_clarity,
                            stone_shape: value.id_shape,
                            stone: value.id_stone,
                            stone_count: value.count,
                            is_carat: value.id_carat,
                            id: value.id,
                            is_deleted: "0",
                            d_id: index + 1
                        }

                        return data
                    } else {
                        const data1 = {
                            default: value.is_default,
                            Stone_type: value.id_type,
                            stone_mm_size: value.id_mm_size,
                            Stone_weight: value.weight,
                            stone_cut: value.id_cut,
                            stone_color: value.id_color,
                            stone_clarity: value.id_clarity,
                            stone_shape: value.id_shape,
                            stone: value.id_stone,
                            stone_count: value.count,
                            is_carat: value.id_carat,
                            id: value.id,
                            is_deleted: "0",
                            d_id: index + 1
                        }

                        return data1
                    }
                })
                setInputFieldsDiamond(birthstone_product)

                //Gold Calculations

                const metalList = dropDownData.metal_list;
                const goldMetalRate = metalList.filter((m: any) => parseInt(m.id) === 1)[0].metal_rate;
                let arrMetalKarat: any[] = []
                const metalKarat = dropDownData.metal_karat || []
                const metalTone = dropDownData.metal_tone as number[] || []
                let checkedValues = {}
                {
                    data.data.birthstone_PMO.filter(((t: any) => t.id_karat !== null)).map((value: any) => {

                        const id_metal_tone = value.metal_tone ? value.metal_tone as number[] : [];

                        const idMetalTonesNumber = id_metal_tone.map((t: any) => {
                            return parseInt(t)
                        });
                        const selectedMetalTones = metalTone?.filter((r: any) => {
                            if (idMetalTonesNumber.indexOf(parseInt(r.id)) >= 0) return r;
                        });
                        const karatValue = metalKarat.filter((x: any) => parseInt(x.id) === parseInt(value.id_karat))[0]?.name;

                        const rate = ((parseFloat(goldMetalRate) / 31.104) * ((parseInt(karatValue) / 24))).toFixed(2)
                        const data = {
                            karat: karatValue,
                            id_karat: value.id_karat,
                            tone: selectedMetalTones,
                            price: '',
                            rate: rate,
                            id: value.id,
                            metal_weight: value.metal_weight,
                            metal_tone: metalTone,
                            is_deleted: 0

                        }

                        arrMetalKarat.push(data)

                    })
                }

                const selectedKarats = arrMetalKarat.map((t: any) => parseInt(t.id_karat));
                const arrNotExitsKarats = metalKarat.filter((x: any) => selectedKarats.indexOf(parseInt(x.id)) === -1);
                arrNotExitsKarats.map((value: any) => {
                    const rate = ((parseFloat(goldMetalRate) / 31.104) * ((parseInt(value.name) / 24))).toFixed(2)
                    const data = {
                        karat: value.name,
                        id_karat: value.id,
                        tone: [],
                        price: '',
                        rate: rate,
                        id: 0,
                        metal_weight: '',
                        metal_tone: metalTone,
                        is_deleted: 0

                    }
                    arrMetalKarat.push(data)
                });


                if (arrMetalKarat.length > 0) {
                    setInputFieldGoldMetal(arrMetalKarat)
                }
                if (arrMetalKarat.length > 0) {
                    checkedValues = {
                        [1]: true
                    }
                }

                //Silver Metal 

                arrMetalKarat = []
                const silverRate = metalList.filter((m: any) => parseInt(m.id) === 2)[0].metal_rate;
                data.data.birthstone_PMO.filter(((t: any) => (parseInt(t.id_metal) === 2))).map((value: any) => {
                    const id_metal_tone = value.metal_tone ? value.metal_tone as number[] : [];

                    const idMetalTonesNumber = id_metal_tone.map((t: any) => {
                        return parseInt(t)
                    });
                    const selectedMetalTones = metalTone?.filter((r: any) => {
                        if (idMetalTonesNumber.indexOf(parseInt(r.id)) >= 0) return r;
                    });

                    const data = {
                        karat: '',
                        id_karat: value.id_karat,
                        tone: selectedMetalTones,
                        price: '',
                        rate: silverRate,
                        id: value.id,
                        metal_weight: value.metal_weight,
                        metal_tone: metalTone,
                        is_deleted: 0
                    }

                    arrMetalKarat.push(data)
                })
                if (arrMetalKarat.length > 0) {
                    setInputFieldSilverMetal(arrMetalKarat)
                }
                if (arrMetalKarat.length > 0) {
                    checkedValues = {
                        ...checkedValues,
                        [2]: true
                    }
                }

                //Platinum 
                arrMetalKarat = []
                const platinumRate = metalList.filter((m: any) => parseInt(m.id) === 3)[0].metal_rate;
                {
                    data.data.birthstone_PMO.filter(((t: any) => (parseInt(t.id_metal) === 3))).map((value: any) => {

                        const id_metal_tone = value.metal_tone ? value.metal_tone as number[] : [];

                        const idMetalTonesNumber = id_metal_tone.map((t: any) => {
                            return parseInt(t)
                        });
                        const selectedMetalTones = metalTone?.filter((r: any) => {
                            if (idMetalTonesNumber.indexOf(parseInt(r.id)) >= 0) return r;
                        });


                        const data = {
                            karat: '',
                            id_karat: value.id_karat,
                            tone: selectedMetalTones,
                            price: '',
                            rate: platinumRate,
                            id: value.id,
                            metal_weight: value.metal_weight,
                            metal_tone: metalTone,
                            is_deleted: 0
                        }
                        arrMetalKarat.push(data)
                    })
                }
                if (arrMetalKarat.length > 0) {
                    setInputFieldPlatinumMetal(arrMetalKarat)
                }
                if (arrMetalKarat.length > 0) {
                    checkedValues = {
                        ...checkedValues,
                        [3]: true
                    }
                }
                setChecked(checkedValues)
                setFinalInputVariant(data.data.birthstone_PMO)
            } else {

                return toast.error(data.message);
            }
        } catch (e: any) {
            toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN)
        }
    }

    // ******* GET_ALL_DROPDOWN

    const getAllDropDownData = async (productDetailId: string) => {

        try {
            const data = await ADD_PRODUCT_DROPDOWN_LIST();
            if (data.code === 200 || data.code === "200") {

                const categoryData = data.data.categoryList.filter((t: any) => t.parent_id === null)
                setKeywordsList(data.data.keyWords)
                // inputFields.map((value) => value.categoryList = categoryData)
                setCategorysList(data.data.categoryList)
                setCaratSizeList(data.data.carat_size)
                setItemLengthList(data.data.item_length)
                setItemSizeList(data.data.item_size)
                setMetalGroupList(data.data.metal_list)
                setDiamondGroupList(data.data.diamond_master)
                setStoneSettingList(data.data.stone_setting)
                setMetalToneList(data.data.metal_tone.filter((m: any) => parseInt(m.id_metal) === MEATL_GOLD_ID))
                setSilverToneList(data.data.metal_tone.filter((m: any) => parseInt(m.id_metal) === MEATL_SILVER_ID))
                setPaltinumToneList(data.data.metal_tone.filter((m: any) => parseInt(m.id_metal) === MEATL_PLATINUM_ID))
                setStoneShapeList(data.data.stone_shape)
                setStoneList(data.data.stone)
                setStoneMMSize(data.data.MM_Size)
                setStoneColor(data.data.stone_color)
                setStoneClarity(data.data.stone_clarity)
                setStoneCuts(data.data.stone_cut)
                setMetalKaratList(data.data.metal_karat)

                const product_metal_gold = data.data.metal_karat.map((value: any) => {
                    const gold = {
                        karat: value.name,
                        id_karat: value.id,
                        tone: [{ id: null, name: "" }],
                        price: '',
                        rate: ((data.data.metal_list[0].metal_rate / 31.104) * (value.name / 24)).toFixed(2), id: 0, metal_tone: data.data.metal_tone
                    }

                    return gold
                })
                setInputFieldGoldMetal(product_metal_gold)

                const silverRate = data.data.metal_list[1].metal_rate
                const platinumRate = data.data.metal_list[2].metal_rate

                const dataDisplay = [...inputFieldSilverMetal]

                inputFieldSilverMetal.map((value: any, index) => {

                    dataDisplay[index].rate = silverRate
                    dataDisplay[index].metal_tone = silverToneList

                })
                setInputFieldSilverMetal(dataDisplay)

                const dataPlatinum = [...inputFieldPlatinumMetal]
                inputFieldPlatinumMetal.map((value: any, index) => {

                    dataPlatinum[index].rate = platinumRate
                    dataPlatinum[index].metal_tone = paltinumToneList

                })
                setInputFieldPlatinumMetal(dataPlatinum)

                if (productDetailId && productDetailId != undefined) {
                    getByIdProductData(data.data, productDetailId)
                }

            } else {

                return toast.error(data.message);
            }
        } catch (e: any) {
            toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN)
        }
    }

    /* Image add */

    const addImageApi = async (data: any) => {
        const formData = new FormData()
        formData.append("product_id", data)
        formData.append("image", imageFile || "")

        try {
            const data = await ADD_BIRTHSTONE_PRODUCT_IMAGE(formData);
            if (data.code === 200 || data.code === "200") {

            } else {
                return toast.error(data.message);
            }
        } catch (e: any) {
            toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN);
        }

        return false;
    }

    // ******* ADD_PRODUCT

    const addProductDetails = async () => {
        let errors: any = []
        const data = inputFieldsDiamond.filter((value: any) => value?.Stone_type === stoneTypeList[1]?.id)
        if (finalVariantArrayData.length === 0) {
            errors.push("Metal Data is required")
        } else if (data.length != gemstoneCount) {
            errors.push("Gemstone detail data not match with gemstone count")
        } else if (inputFieldsDiamond) {
            for (const [index, value] of inputFieldsDiamond.entries()) {
                if (value.Stone_type === BIRTHSTONE_STONE_TYPE.fix && ((value?.stone === null || value?.stone === '') || (value?.stone_shape === null || value?.stone_shape === '') || (value?.Stone_weight === 'null' || value.Stone_weight === 0) || (value?.stone_count === '' || value?.stone_count === 0))) {
                    errors.push(`Row ${index + 1} : Please enter fix stone, diamond shape, stone weight and stone count in diamond detail`)
                } else if (value.Stone_type === BIRTHSTONE_STONE_TYPE.changeable) {
                    if (value.Stone_type === BIRTHSTONE_STONE_TYPE.changeable && ((value?.stone_shape === null || value?.stone_shape === '') || (value?.stone_cut === null || value?.stone_cut === ''))) {
                        errors.push(`Row ${index + 1} : Please enter changeble stone, diamond shape and stone cut in diamond detail`)
                    }
                }
            }
        }
        if (errors.length > 0) {
            toast.error(errors)
        } else {
            try {
                const payload1 = {
                    "id_product": productId,
                    "name": productName,
                    "sku": productSKU,
                    "sort_description": productSortDes,
                    "long_description": editerData,
                    "tag": keyword.map((id) => id.id)[0] != null ? keyword.map((id) => id.id) : null,
                    "gender": gender.map((id) => id.id)[0] == null ? false : gender.map((id) => id.id),

                    "product_categories": inputFieldsCategory.map((value) => {
                        let data = {};
                        if (value.subCategory != null && value.subSubCategory != null) {
                            data = {
                                "id": value.id,
                                "id_category": value.category,
                                "id_sub_category": value.subCategory,
                                "id_sub_sub_category": value.subSubCategory
                            }
                        } else if (value.subCategory == null) {
                            data = {
                                "id": value.id,
                                "id_category": value.category,
                            }
                        } else {
                            if (value.subSubCategory == null) {
                                data = {
                                    "id": value.id,
                                    "id_category": value.category,
                                    "id_sub_category": value.subCategory,
                                }
                            }
                        }

                        return data
                    }),
                    "engraving_count": engravingTextCount,
                    "product_engraving": inputFields.map((value) => {
                        let data = {};
                        data = {
                            "id": value.id,
                            "text": value.textEngraving,
                            "text_count": value.countEngraving,
                            "is_deleted": "0"
                        }
                        return data
                    }),
                    "gemstone_count": gemstoneCount,
                    "product_number": productNumber,
                    "making_charge": marketingCharge,
                    "finding_charge": findingCharge,
                    "other_charge": otherCharge
                }
                let payload = {}
                payload = {
                    "size": itemSize.length == 0 ? false : itemSize.map((value) => value.id),
                    "length": itemLength.length == 0 ? false : itemLength.map((value) => value.id),
                    "product_metal_options":
                        finalVariantArrayData.map((value: any) => {
                            const data: any = {
                                "id": value?.id,
                                "id_metal": value?.id_metal ? value?.id_metal : null,
                                "id_karat": value?.id_karat ? value?.id_karat : null,
                                "id_metal_tone": value?.id_metal_tone ? value?.id_metal_tone : null,
                                "metal_weight": value?.metal_weight ? value?.metal_weight : null,
                                "price": value?.retail_price ? value?.retail_price : null,
                                "plu_no": value?.plu_no ? value?.plu_no : null,
                                "is_deleted": "0"
                            }
                            return data
                        }),
                    "product_diamond_options": inputFieldsDiamond.map((value: any) => {
                        const data = {
                            "id": value.id,
                            "id_type": value.Stone_type ? value.Stone_type : null,
                            "weight": value.Stone_weight ? value.Stone_weight : null,
                            "count": value.stone_count ? value.stone_count : null,
                            "is_default": value.default ? value.default : null,
                            "id_stone": value.stone ? value.stone : null,
                            "id_shape": value.stone_shape ? value.stone_shape : null,
                            "id_mm_size": value.stone_mm_size ? value.stone_mm_size : null,
                            "id_color": value.stone_color ? value.stone_color : null,
                            "id_clarity": value.stone_clarity ? value.stone_clarity : null,
                            "id_cuts": value.stone_cut ? value.stone_cut : null,
                            "is_carat": value.is_carat ? value.is_carat : null
                        }

                        return data
                    })

                }
                const finalPayload = {
                    ...payload1, ...payload
                }
                const data = await ADD_BIRTHSTONE_PRODUCT_DETAILS(finalPayload);
                if (data.code === 200 || data.code === "200") {
                    toast.success(data.message)
                    if (imageFile) {
                        addImageApi(data.data.id)
                    }
                    Router.push({ pathname: "/product/all-birthstone-products" })
                } else {
                    toast.error(data.message);
                }

            }
            catch (e: any) {
                toast.error(e?.data?.message);
            }
        }
    }

    // ******* EDIT_PRODUCT

    const editProductDetails = async () => {
        const errors: any = []
        const data = inputFieldsDiamond.filter((value: any) => value?.Stone_type === stoneTypeList[1]?.id)
        const finalData = data.filter((t: any) => t.is_deleted !== 1)
        if (finalVariantArrayData.length === 0) {
            errors.push("Metal Data is required")
        } else if (finalData.length != gemstoneCount) {
            errors.push("Gemstone detail data not match with gemstone count")
        }
        else if (inputFieldsDiamond) {
            for (const [index, value] of inputFieldsDiamond.entries()) {
                if (value.Stone_type === BIRTHSTONE_STONE_TYPE.fix && ((value?.stone === null || value?.stone === '') || (value?.stone_shape === null || value?.stone_shape === '') || (value?.Stone_weight === '' || value.Stone_weight === 0) || (value?.stone_count === '' || value?.stone_count === 0))) {
                    errors.push(`Row ${index + 1} : Please enter fix stone, diamond shape, stone weight and stone count in diamond detail`)
                } else if (value.Stone_type === BIRTHSTONE_STONE_TYPE.changeable) {
                    if (value.Stone_type === BIRTHSTONE_STONE_TYPE.changeable && ((value?.stone_shape === null || value?.stone_shape === '') || (value?.stone_cut === null || value?.stone_cut === ''))) {
                        errors.push(`Row ${index + 1} : Please enter changeble stone, diamond shape and stone cut in diamond detail`)
                    }
                }

            }
        }

        if (errors.length > 0) {
            return toast.error(errors)
        }
        else {
            try {
                let metalDataDetail: any[] = inputFieldVariant.map((value: any) => {
                    if (value.id != 0 && (value.metal_weight === '' || value.metal_weight === null || value.retail_price === '' || value.retail_price === null)) {
                        const data = {
                            "id": value?.id,
                            "id_metal": value?.id_metal ? value?.id_metal : null,
                            "id_karat": value?.id_karat ? value?.id_karat : null,
                            "id_metal_tone": value?.id_metal_tone ? value?.id_metal_tone : null,
                            "metal_weight": value?.metal_weight,
                            "plu_no": value?.plu_no ? value?.plu_no : null,
                            "price": value?.retail_price ? value?.retail_price : null,
                            "is_deleted": "1"
                        }
                        return data
                    } else if (value.id === 0 && (value.metal_weight != null && value.metal_weight != '') && (value.retail_price != null && value.retail_price != '')) {
                        const data = {
                            "id": value?.id,
                            "id_metal": value?.id_metal ? value?.id_metal : null,
                            "id_karat": value?.id_karat ? value?.id_karat : null,
                            "id_metal_tone": value?.id_metal_tone ? value?.id_metal_tone : null,
                            "metal_weight": value?.metal_weight ? value?.metal_weight : null,
                            "plu_no": value?.plu_no ? value?.plu_no : null,
                            "price": value?.retail_price ? value?.retail_price : null,
                            "is_deleted": "0"
                        }
                        return data
                    } else if (value.id != 0 && (value.metal_weight !== '' || value.metal_weight !== null || value.retail_price !== '' || value.retail_price !== null)) {
                        const data = {
                            "id": value?.id,
                            "id_metal": value?.id_metal ? value?.id_metal : null,
                            "id_karat": value?.id_karat ? value?.id_karat : null,
                            "id_metal_tone": value?.id_metal_tone ? value?.id_metal_tone : null,
                            "metal_weight": value?.metal_weight ? value?.metal_weight : null,
                            "plu_no": value?.plu_no ? value?.plu_no : null,
                            "price": value?.retail_price ? value?.retail_price : null,
                            "is_deleted": "0"
                        }
                        return data
                    }
                })
                const payload1 = {
                    "id_product": productId,
                    "name": productName,
                    "sku": productSKU,
                    "sort_description": productSortDes,
                    "long_description": editerData,
                    "tag": keyword.map((id) => id.id)[0] != null ? keyword.map((id) => id.id) : null,
                    "gender": gender.map((id) => id.id)[0] == null ? false : gender.map((id) => id.id),
                    "product_categories": inputFieldsCategory.map((value) => {
                        let data = {};
                        if (value.subCategory != null && value.subSubCategory != null) {
                            data = {
                                "id": value.id,
                                "id_category": value.category ? value.category : null,
                                "id_sub_category": value.subCategory ? value.subCategory : null,
                                "id_sub_sub_category": value.subSubCategory ? value.subSubCategory : null,
                                "is_deleted": value.is_deleted
                            }

                        } else if (value.subCategory == null) {
                            data = {
                                "id": value.id,
                                "id_category": value.category,
                                "is_deleted": value.is_deleted
                            }
                        } else {
                            if (value.subSubCategory == null) {
                                data = {
                                    "id": value.id,
                                    "id_category": value.category,
                                    "id_sub_category": value.subCategory,
                                    "is_deleted": value.is_deleted
                                }
                            }
                        }

                        return data
                    }),
                    "engraving_count": engravingTextCount,
                    "product_engraving": inputFields && inputFields.map((value) => {
                        let data = {};
                        data = {
                            "id": value.id,
                            "text": value.textEngraving,
                            "text_count": value.countEngraving,
                            "is_deleted": value.is_deleted
                        }
                        return data
                    }),
                    "gemstone_count": gemstoneCount,
                    "product_number": productNumber,
                    "making_charge": marketingCharge,
                    "finding_charge": findingCharge,
                    "other_charge": otherCharge
                }

                let payload = {}
                payload = {
                    "size": itemSize.length == 0 ? false : itemSize.map((value) => value.id),
                    "length": itemLength.length == 0 ? false : itemLength.map((value) => value.id),
                    "product_metal_options": metalDataDetail.filter((t: any) => t),
                    "product_diamond_options": inputFieldsDiamond.map((value: any) => {
                        const data = {
                            "id": value.id,
                            "id_type": value.Stone_type ? value.Stone_type : null,
                            "weight": value.Stone_weight ? value.Stone_weight : null,
                            "count": value.stone_count ? value.stone_count : null,
                            "is_default": value.default ? value.default : null,
                            "id_stone": value.stone ? value.stone : null,
                            "id_shape": value.stone_shape ? value.stone_shape : null,
                            "id_mm_size": value.stone_mm_size ? value.stone_mm_size : null,
                            "id_color": value.stone_color ? value.stone_color : null,
                            "id_clarity": value.stone_clarity ? value.stone_clarity : null,
                            "id_cuts": value.stone_cut ? value.stone_cut : null,
                            "is_carat": value.is_carat ? value.is_carat : null,
                            "is_deleted": value.is_deleted
                        }

                        return data
                    })

                }
                const finalPayload = {
                    ...payload1, ...payload
                }
                const data = await EDIT_BIRTHSTONE_PRODUCT_DETAILS(finalPayload);
                if (data.code === 200 || data.code === "200") {
                    toast.success(data.message)
                    if (imageFile) {
                        addImageApi(productId)
                    }
                    Router.push({ pathname: "/product/all-birthstone-products" })
                } else {
                    toast.error(data.message);
                }

            }
            catch (e: any) {
                toast.error(e.data?.message);
            }
        }
    }

    // Handle Stepper
    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1)
    }
    const handleNext = () => {
        if (steps[1].title === "Metal & Gemstone Details") {
            scrollTop()
        }
        if (editerData) {
            setEdit(editerData)
        }
        const data = inputFields.filter((value: any) => value?.is_deleted == 0)
        if (!productName || !productSKU || !editerData || !productSortDes || keyword.length === 0 || !gemstoneCount) {
            const productNameError = productName.trim() ? '' : 'Product name is required';
            const productSkuError = productSKU.trim() ? '' : 'Product sku is required';
            const sortDesError = productSortDes.length > 4 ? '' : 'Sort description must be a 4 to 400 characters';
            const longDesError = editerData.length >= 20 ? '' : 'Long description must be a 20 to 2000 characters';
            const keyWordError = keyword.length !== 0 ? '' : 'Keyword is required';
            const gemstoneError = gemstoneCount !== '' ? '' : 'Gemstont count is required'
            if (keyword.length === 0) {
                setErrorKeyWord(true)
            }
            setFormErrorData((prevState: any) => ({
                ...prevState,
                errors: {
                    title: productNameError,
                    sku: productSkuError,
                    sortDescription: sortDesError,
                    longDescription: longDesError,
                    keyWordError: keyWordError,
                    gemstoneError: gemstoneError,
                }
            }));
        } else if (productSizeLenghtFilter == null) {
            toast.error("please select category")
        } else if (engravingTextCount != data.length) {
            toast.error("Engraving data not match with engraving count")
        } else {
            setActiveStep(prevActiveStep => prevActiveStep + 1)
            if (activeStep === steps.length - 1) {
                toast.success('Form Submitted')
            }
        }
    }

    const handleReset = () => {
        setProductName('')
        setProductSKU('')
        setProductSortDes('')
        setProductLongDes('')
        setMarketingCharge(0)
        setCategorysList([])
        setKeyword([{ id: null, name: "" }])
        setGender([{ id: null, name: "" }])

        // inputFields.map((value) => value.category = null)
        // inputFields.map((value) => value.subCategory = null)
        // inputFields.map((value) => value.subSubCategory = null)
        setSettingType([{ id: null, name: "" }])
        setItemLength([{ id: null, length: "" }])
        setItemSize([{ id: null, size: "" }])
        inputFieldsGold.map((value) => value.metalGroup = "")
        inputFieldsGold.map((value) => value.weight = "")
        inputFieldsDiamond.map((value: any) => {
            value.diamondGroup = null
            value.Stone_type = null
            value.Stone_weight = 0
            value.stone_count = 0
            value.default = '0',
                value.stone = null,
                value.stone_color = null,
                value.stone_clarity = null,
                value.stone_mm_size = null,
                value.stone_shape = null
        })
        inputFieldGoldMetal.map((value) => {
            value.id = 0,
                value.id_karat = null,
                value.karat = null,
                value.metal_weight = null,
                value.tone = []
        })
        setImageShow("")
        setFindingCharge(0)
        setOtherCharge(0)
        setActiveStep(0)
        setCheckedSize(false)
        setRemoveImage("1")
        setCheckedLength(false)
    }

    // Handle repited
    const addFields = () => {
        const dataLength = inputFieldsCategory.length + 1
        const categoryData = categorysList.filter((t: any) => t.parent_id === null)
        const newfield = { c_id: dataLength, category: null, subCategory: null, subSubCategory: null, categoryList: categoryData, subCategoryList: [], subSubCategoryList: [], id: 0, is_deleted: "0" }
        const data = [...inputFieldsCategory, newfield]
        setInputFieldsCategory(data)
        setCount(data.length)
    }

    const addEngravingFields = () => {
        const dataLength = inputFields.length + 1
        const newfield = { textEngraving: null, countEngraving: null, id: 0, is_deleted: "0", e_id: dataLength }
        const data = [...inputFields, newfield]
        setInputFields(data)
        setCount(data.length)
    }

    const addGoldSettingFields = () => {
        const newfield = { rate: '', default: '0', price: '', weight: '', metalGroup: "", id: 0, isDeleted: 0 }
        const data = [...inputFieldsGold, newfield]
        setInputFieldsGold(data)
        setCount(data.length)
    }

    const addDiamondSettingFields = () => {
        const dataLength = inputFieldsDiamond.length + 1
        const newfield = {
            default: '0', diamondGroup: null, Stone_type: null,
            Stone_weight: 0, stone_cut: null, stone_color: null, stone_clarity: null, stone_shape: null, stone: null,
            stone_count: 0, is_carat: null, rate: 0, price: 0, stone_mm_size: null,
            id: 0, is_deleted: 0, d_id: dataLength
        }
        const data = [...inputFieldsDiamond, newfield]
        setInputFieldsDiamond(data)
        setCount(data.length)
    }

    const removeFields = (index: any) => {
        const data = [...inputFieldsCategory]
        data.splice(index, 1)
        setInputFieldsCategory(data)
    }
    const removeAddFields = (data: any, index: any) => {
        const finalData = [...inputFieldsCategory]
        finalData.splice(index, 1)
        setInputFieldsCategory(data)
    }
    const removeAddEngravingFields = (data: any, index: any) => {
        const finalData = [...inputFields]
        finalData.splice(index, 1)
        setInputFields(finalData)
    }

    const removeEditEngravingFields = (data: any) => {
        setInputFields(data)
    }

    const removeGoldSettingFields = (index: any) => {
        const data = [...inputFieldsGold]
        data.splice(index, 1)
        setInputFieldsGold(data)
    }

    const removeDiamondSettingFields = (data: any) => {
        setInputFieldsDiamond(data)
    }

    const removeAddDiamondSettingFields = (data: any, index: any) => {
        const finalData = [...inputFieldsDiamond]
        finalData.splice(index, 1)
        setInputFieldsDiamond(finalData)
    }

    const scrollTop = () => {
        window.scrollTo(0, 0);
    }

    const handleRadioChangeStripe = (event: ChangeEvent<HTMLInputElement>) => {
        setRadioButtonStripe((event.target as HTMLInputElement).value)
    }

    const handleChangeMetalDefaultValue = (event: ChangeEvent<HTMLInputElement>) => {
        inputFieldsGold.map((input, index) => {
            const data = [...inputFieldsGold]
            data[index].default = (event.target as HTMLInputElement).value === index.toString() ? "1" : "0"
            setInputFieldsGold(data)
        })
    }

    const handleChangeDiamoundDefaultValue = (event: ChangeEvent<HTMLInputElement>) => {
        inputFieldsDiamond.map((input: any, index: any) => {
            const data = [...inputFieldsDiamond]
            data[index].default = (event.target as HTMLInputElement).value === index.toString() ? "1" : "0"
            setInputFieldsDiamond(data)
        })
    }

    useEffect(() => {
        if (action == 'view') {
            setIsDisabled(true)
        } else {
            setIsDisabled(false)
        }
    }, [action])

    // ***** METAL/KARAT/METALTONE Combination

    useEffect(() => {
        let combinations: any = [];
        let metalArrayData: any = [];
        const updateMetalGroupList: any = metalGroupList.find((t: any) => t.id === parseInt(MEATL_GOLD_ID.toString()))

        for (let i: any = 0; i < metalKaratList.length; i++) {
            metalArrayData.push({ ...metalGroupList[i], karat_id: metalKaratList[i]?.id, name: updateMetalGroupList?.name, karat: metalKaratList[i]?.name, metal_id: updateMetalGroupList?.id })
        }
        for (let i: any = 0; i < metalGroupList.length; i++) {
            if (updateMetalGroupList?.id !== metalGroupList[i]?.id) {
                metalArrayData.push({ ...metalGroupList[i], metal_id: metalGroupList[i]?.id, karat_id: null, karat: null })
            }
        }
        for (let i: any = 0; i < metalArrayData.length; i++) {
            metalArrayData[i].id = i + 1
        }

        for (let karatData of metalArrayData) {
            if (karatData.karat_id) {
                for (let metalToneData of metalToneList) {
                    const finalData = finalInputVariant.find((value: any) => value.id_metal === karatData.metal_id && value.id_karat == karatData.karat_id && value.id_metal_tone == metalToneData.id)
                    combinations.push({
                        id: finalData && finalData != undefined && finalData.id ? finalData.id : 0,
                        id_metal: finalData && finalData != undefined && finalData.id_metal ? finalData.id_metal : karatData.metal_id,
                        id_karat: karatData.karat_id,
                        metal: karatData.name,
                        karat: karatData.karat ? karatData.karat : karatData.name,
                        id_metal_tone: finalData && finalData != undefined && finalData.id_metal_tone ? finalData.id_metal_tone : metalToneData?.id,
                        metal_tone: metalToneData,
                        plu_no: finalData && finalData != undefined && finalData.plu_no ? finalData.plu_no : null,
                        metal_weight: finalData && finalData != undefined && finalData.metal_weight ? finalData.metal_weight : null,
                        retail_price: finalData && finalData != undefined && finalData.price ? finalData.price : null,
                    });
                }
            } else if (karatData.metal_id === parseInt(MEATL_SILVER_ID.toString())) {
                for (let metalToneData of silverToneList) {
                    const finalData = finalInputVariant.find((value: any) => value.id_metal === karatData.metal_id && value.id_karat == karatData.karat_id && value.id_metal_tone == metalToneData.id)
                    combinations.push({
                        id: finalData && finalData != undefined && finalData.id ? finalData.id : 0,
                        id_metal: finalData && finalData != undefined && finalData.id_metal ? finalData.id_metal : karatData.metal_id,
                        id_karat: karatData.karat_id,
                        metal: karatData.name,
                        karat: karatData.karat ? karatData.karat : karatData.name,
                        id_metal_tone: finalData && finalData != undefined && finalData.id_metal_tone ? finalData.id_metal_tone : metalToneData?.id,
                        metal_tone: metalToneData,
                        plu_no: finalData && finalData != undefined && finalData.plu_no ? finalData.plu_no : null,
                        metal_weight: finalData && finalData != undefined && finalData.metal_weight ? finalData.metal_weight : null,
                        retail_price: finalData && finalData != undefined && finalData.price ? finalData.price : null,
                    });
                }
            } else if (karatData.metal_id === parseInt(MEATL_PLATINUM_ID.toString())) {
                for (let metalToneData of paltinumToneList) {
                    const finalData = finalInputVariant.find((value: any) => value.id_metal === karatData.metal_id && value.id_karat == karatData.karat_id && value.id_metal_tone == metalToneData.id)
                    combinations.push({
                        id: finalData && finalData != undefined && finalData.id ? finalData.id : 0,
                        id_metal: finalData && finalData != undefined && finalData.id_metal ? finalData.id_metal : karatData.metal_id,
                        id_karat: karatData.karat_id,
                        metal: karatData.name,
                        karat: karatData.karat ? karatData.karat : karatData.name,
                        id_metal_tone: finalData && finalData != undefined && finalData.id_metal_tone ? finalData.id_metal_tone : metalToneData?.id,
                        metal_tone: metalToneData,
                        plu_no: finalData && finalData != undefined && finalData.plu_no ? finalData.plu_no : null,
                        metal_weight: finalData && finalData != undefined && finalData.metal_weight ? finalData.metal_weight : null,
                        retail_price: finalData && finalData != undefined && finalData.price ? finalData.price : null,
                    });
                }
            }
        }
        setInputFieldVariant(combinations)

    }, [finalInputVariant, metalKaratList, metalToneList, metalGroupList, silverToneList, paltinumToneList])

    useEffect(() => {
        const arrayData: any = inputFieldVariant.filter((value: any) => (value.metal_weight !== null) && (value.metal_weight !== "") && (value.retail_price !== null) && (value.retail_price !== ""))
        setFinalVariantArrayData(arrayData)
    }, [inputFieldVariant])


    const getStepContent = (step: number) => {

        switch (step) {
            case 0:
                return (
                    <Fragment>
                        <Grid item xs={12} sm={6}>
                            <TccInput
                                InputProps={isDisabled}
                                fullWidth
                                label='Product SKU'
                                value={productSKU}
                                placeholder='ZG011AQA'
                                onChange={(e: any) => setProductSKU(e.target.value)}
                                error={!productSKU && formErrorData.errors.sku ? true : false}
                            />
                            {!productSKU && formErrorData.errors.sku && <FormHelperText sx={{ color: 'error.main' }}>{formErrorData.errors.sku}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TccInput
                                InputProps={isDisabled}
                                fullWidth
                                type='text'
                                label='Product Title'
                                value={productName}
                                placeholder=''
                                onChange={(e: any) => setProductName(e.target.value)}
                                error={!productName && formErrorData.errors.title ? true : false}
                            />
                            {!productName && formErrorData.errors.title && <FormHelperText sx={{ color: 'error.main' }}>{formErrorData.errors.title}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TccInput
                                InputProps={isDisabled}
                                fullWidth
                                type='text'
                                label='Product Short Description'
                                value={productSortDes}
                                placeholder=''
                                onChange={(e: any) => setProductSortDes(e.target.value)}
                                error={productSortDes.length < 4 && formErrorData.errors.sortDescription ? true : false}

                            />
                            {productSortDes.length < 4 && formErrorData.errors.sortDescription && <FormHelperText sx={{ color: 'error.main' }}>{formErrorData.errors.sortDescription}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <Typography sx={{ mb: 1, color: "gray" }}>Product Long Description</Typography>
                            <TccEditor wrapperClassName={errorData === true && formErrorData.errors.longDescription ? "demo-wrapper" : 'editor-validaton-wrapper'} getHtmlData={setEditerData} data={edit} called={called} errorData={setErrorData} readOnly={isDisabled} />
                            {errorData === true && formErrorData.errors.longDescription && <FormHelperText sx={{ color: 'error.main' }}>{formErrorData.errors.longDescription}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TccInput
                                InputProps={isDisabled}
                                fullWidth
                                label='Product Number'
                                value={productNumber || ''}
                                placeholder='ZG011AQA'
                                onChange={(e: any) => setProductNumber(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TccInput
                                InputProps={isDisabled}
                                fullWidth
                                type='number'
                                label='Gemstone Count'
                                value={gemstoneCount || ''}
                                placeholder=''
                                onChange={(e: any) =>
                                    setGemstoneCount(e.target.value)
                                }
                                error={!gemstoneCount && formErrorData.errors.gemstoneError ? true : false}
                            />
                            {!gemstoneCount && formErrorData.errors.gemstoneError && <FormHelperText sx={{ color: 'error.main' }}>{formErrorData.errors.gemstoneError}</FormHelperText>}

                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                readOnly={isDisabled}
                                fullWidth
                                multiple
                                options={keywordsList}
                                value={keyword}
                                onChange={(event, newItem) => {
                                    if (newItem.length !== 0) {
                                        setErrorKeyWord(false)
                                    } else {
                                        setErrorKeyWord(true)
                                    }
                                    setKeyword(newItem)
                                }}
                                filterSelectedOptions
                                size='small'
                                id='autocomplete-multiple-outlined'
                                getOptionLabel={(option: any) => option.name}
                                renderInput={(params: any) => <TextField error={errorKeyWord} {...params} label='Keywords' />}
                            />
                            {keyword.length === 0 && formErrorData.errors.keyWordError && <FormHelperText sx={{ color: 'error.main' }}>{formErrorData.errors.keyWordError}</FormHelperText>}

                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                readOnly={isDisabled}
                                fullWidth
                                multiple
                                options={genderData}
                                value={gender}
                                onChange={(event, newItem) => {
                                    setGender(newItem)
                                }}
                                filterSelectedOptions
                                size='small'
                                id='autocomplete-multiple-outlined'
                                getOptionLabel={(option: any) => option.name}
                                renderInput={(params: any) => <TextField {...params} label='Gender' />}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TccInput
                                InputProps={isDisabled}
                                fullWidth
                                type='number'
                                label='Engraving Text Count'
                                value={engravingTextCount}
                                placeholder=''
                                onChange={(e: any) =>
                                    setEngravingTextCount(e.target.value)
                                }
                            />
                        </Grid>
                        {inputFields && inputFields.filter((t: any) => productId ? t?.is_deleted == 0 : t).map((input, index) => {

                            return (
                                <>
                                    <Grid item xs={12} sm={5} key={"SUBCAT_" + index}>
                                        <TccInput
                                            key={input.id}
                                            InputProps={isDisabled}
                                            fullWidth
                                            type='text'
                                            label='Engraving Label'
                                            value={input.textEngraving || ''}
                                            placeholder=''
                                            onChange={(e: any) => {
                                                const data = [...inputFields]
                                                data.map((t: any, index: any) => {
                                                    if (t.e_id === input.e_id) {
                                                        data[index].textEngraving = e.target.value
                                                    }
                                                })
                                                setInputFields(data)
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={5} key={"SUBSUBCAT_" + index}>
                                        <TccInput
                                            InputProps={isDisabled}
                                            fullWidth
                                            type='number'
                                            label='Character Count'
                                            value={input.countEngraving || ''}
                                            placeholder=''
                                            onChange={(e: any) => {
                                                const data = [...inputFields]
                                                data.map((t: any, index: any) => {
                                                    if (t.e_id === input.e_id) {
                                                        data[index].countEngraving = e.target.value
                                                    }
                                                })
                                                setInputFields(data)
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={1}>
                                        <Button fullWidth
                                            variant='outlined'
                                            color='secondary'
                                            disabled={isDisabled ? true : false}
                                            onClick={() => {
                                                const data = [...inputFields]
                                                data[index].is_deleted = "1"
                                                for (let i = 0; i < data.length; i++) {
                                                    if (data[i].id === 0 && data[i].is_deleted === "1") {
                                                        data.splice(i, 1);
                                                        i--;
                                                    }
                                                }
                                                productId ? removeEditEngravingFields(data) : removeAddEngravingFields(data, index)
                                            }}
                                        >
                                            -
                                        </Button>
                                    </Grid>
                                    <Grid item xs={12} sm={1}>
                                        {action === "view" ? <></> : <Button variant='contained' onClick={addEngravingFields}>
                                            +
                                        </Button>}
                                    </Grid>
                                </>
                            )
                        })
                        }
                        {inputFieldsCategory && inputFieldsCategory.filter((t: any) => t.is_deleted == 0).map((input, index) => {
                            return (
                                <>
                                    <Grid item xs={12} sm={3.5} key={"CAT_" + index}>
                                        <TccSelect
                                            InputProps={isDisabled}
                                            sx={{ mb: 4 }}
                                            fullWidth
                                            inputLabel="Category"
                                            label='Category'
                                            value={input.category || ''}
                                            id='controlled-select'
                                            title='category_name'
                                            onChange={(e: any) => {
                                                const data = [...inputFieldsCategory]
                                                data.map((t: any, index: any) => {
                                                    if (t.c_id === input.c_id) {
                                                        data[index].category = e.target.value
                                                    }
                                                })
                                                const subCategoryData = categorysList.filter((t: any) =>
                                                    t.parent_id === e.target.value
                                                )
                                                if (index === 0) {
                                                    const CategoryData: any = categorysList.filter((t: any) =>
                                                        t.id === e.target.value
                                                    )
                                                    setCategory(CategoryData[0])

                                                    const sizeList: any = []
                                                    for (const list of CategoryData[0].id_size) {
                                                        const sizeData: any = itemSizeList.find((t: any) => t.id == parseInt(list))
                                                        if (sizeData) {
                                                            sizeList.push({ id: sizeData.id, size: sizeData.size })
                                                        }
                                                    }
                                                    setItemSizeList(sizeList)

                                                    const lengthList: any = []
                                                    for (const list of CategoryData[0].id_length) {
                                                        const lengthData: any = itemLengthList.find((t: any) => t.id == parseInt(list))
                                                        if (lengthData) {
                                                            lengthList.push({ id: lengthData.id, length: lengthData.length })
                                                        }
                                                    }

                                                    setItemLengthList(lengthList)
                                                }
                                                data.map((t: any, index: any) => {
                                                    if (t.c_id === input.c_id) {
                                                        data[index].subCategoryList = subCategoryData
                                                        data[index].subCategory = null
                                                        data[index].subSubCategory = null
                                                        data[index].subSubCategoryList = []
                                                    }
                                                })
                                                setInputFieldsCategory(data)
                                            }
                                            }
                                            Options={categorysList.filter((t: any) => t.parent_id == null)}

                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3.5} key={"SUBCAT_" + index}>
                                        <TccSelect
                                            InputProps={isDisabled}
                                            sx={{ mb: 4 }}
                                            fullWidth
                                            inputLabel="Sub Category"
                                            label='Sub Category'
                                            value={input.subCategory || ''}
                                            id='controlled-select'
                                            title='category_name'
                                            onChange={(e: any) => {
                                                const data = [...inputFieldsCategory]
                                                data.map((t: any, index: any) => {
                                                    if (t.c_id === input.c_id) {
                                                        data[index].subCategory = e.target.value
                                                    }
                                                })
                                                const subSubCategoryData = categorysList.filter((t: any) =>
                                                    t.parent_id === e.target.value
                                                )
                                                data.map((t: any, index: any) => {
                                                    if (t.c_id === input.c_id) {
                                                        data[index].subSubCategory = null
                                                        data[index].subSubCategoryList = subSubCategoryData
                                                    }
                                                })
                                                setInputFieldsCategory(data)
                                            }}
                                            Options={input.subCategoryList}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3} key={"SUBSUBCAT_" + index}>
                                        <TccSelect
                                            InputProps={isDisabled}
                                            sx={{ mb: 4 }}
                                            fullWidth
                                            inputLabel="Sub Sub Category"
                                            label='Sub Sub Category'
                                            value={input.subSubCategory || ''}
                                            id='controlled-select'
                                            title='category_name'
                                            onChange={(e: any) => {
                                                const data = [...inputFieldsCategory]
                                                data.map((t: any, index: any) => {
                                                    if (t.c_id === input.c_id) {
                                                        data[index].subSubCategory = e.target.value
                                                    }
                                                })
                                                setInputFieldsCategory(data)
                                            }}
                                            Options={input.subSubCategoryList}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={1}>
                                        <Button fullWidth
                                            variant='outlined'
                                            color='secondary'
                                            disabled={isDisabled ? true : false}
                                            onClick={() => removeFields(index)}
                                        >
                                            -
                                        </Button>
                                    </Grid>
                                    <Grid item xs={12} sm={1}>
                                        {action === "view" ? <></> : <Button variant='contained' onClick={addFields}>
                                            +
                                        </Button>}
                                    </Grid>
                                </>
                            )
                        })
                        }
                        <Grid item xs={4} sm={4}>
                            <TccInput
                                fullWidth
                                InputProps={isDisabled}
                                type='number'
                                label='Labor charges'
                                value={marketingCharge}
                                placeholder=''
                                onChange={(e: any) =>
                                    setMarketingCharge(e.target.value)
                                }
                            />
                        </Grid>
                        <Grid item xs={4} sm={4}>
                            <TccInput
                                fullWidth
                                InputProps={isDisabled}
                                type='number'
                                label='Finding Charge'
                                value={findingCharge}
                                placeholder=''
                                onChange={(e: any) =>
                                    setFindingCharge(e.target.value)
                                }
                            />
                        </Grid>
                        <Grid item xs={4} sm={4}>
                            <TccInput
                                fullWidth
                                InputProps={isDisabled}
                                type='number'
                                label='Other Charge'
                                value={otherCharge}
                                placeholder=''
                                onChange={(e: any) =>
                                    setOtherCharge(e.target.value)
                                }
                            />
                        </Grid>
                    </Fragment >
                )
            case 1:

                return (
                    <>
                        <Fragment key={"SET_" + step}>
                            <Grid item xs={12} sm={6}>
                                {category && category.is_size === "1" ?
                                    <Autocomplete
                                        readOnly={isDisabled}
                                        fullWidth
                                        multiple
                                        options={itemSizeList}
                                        value={itemSize}
                                        onChange={(event, newItem) => {
                                            setItemSize(newItem)
                                        }}
                                        filterSelectedOptions
                                        size='small'
                                        id='autocomplete-multiple-outlined'
                                        getOptionLabel={(option: any) => option.size}
                                        renderInput={(params: any) => <TextField {...params} label='Select size' />}
                                    />
                                    : <></>}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {category && category.is_length === "1" ?
                                    <Autocomplete
                                        readOnly={isDisabled}
                                        fullWidth
                                        multiple
                                        options={itemLengthList}
                                        value={itemLength}
                                        onChange={(event, newItem) => {
                                            setItemLength(newItem)
                                        }}
                                        filterSelectedOptions
                                        size='small'
                                        id='autocomplete-multiple-outlined'
                                        getOptionLabel={(option: any) => option.length}
                                        renderInput={(params: any) => <TextField {...params} label='Select Length' />}
                                    />
                                    : <></>}
                            </Grid>
                            <Grid item sm={12}>
                                <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                                    Metal Details
                                </Typography>
                                <Grid item xs={12} sm={12}>
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
                                    }}>
                                        <Table stickyHeader aria-label='sticky table'>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align='center'>Metal</TableCell>
                                                    <TableCell align='center'>Karat</TableCell>
                                                    <TableCell align='center' sx={{ minWidth: 270 }}>Metal Tone</TableCell>
                                                    <TableCell align='center' sx={{ minWidth: 270 }}>PLU NO.</TableCell>
                                                    <TableCell align='center'>Metal Weight</TableCell>
                                                    <TableCell align='center'> Retail Price</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {inputFieldVariant && inputFieldVariant.map((input: any, index) => {
                                                    return (
                                                        <TableRow>
                                                            <TableCell>
                                                                <TccInput
                                                                    disabled
                                                                    label='Metal'
                                                                    value={input?.metal || ""}
                                                                    onChange={(e: any) => e.target.value}
                                                                    placeholder=''
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <TccInput
                                                                    disabled
                                                                    label='karat'
                                                                    value={input?.karat ? input?.karat : input?.karat?.name || ""}
                                                                    onChange={(e: any) => e.target.value}
                                                                    placeholder=''
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <TccInput
                                                                    disabled
                                                                    label='Metal Tone'
                                                                    value={input?.metal_tone?.name || ""}
                                                                    onChange={(e: any) => e.target.value}
                                                                    placeholder=''
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <TccInput
                                                                    InputProps={isDisabled}
                                                                    label='PLU No.'
                                                                    value={input?.plu_no || ""}
                                                                    onChange={(e: any) => {
                                                                        const data = [...inputFieldVariant]
                                                                        data[index].plu_no = e.target.value
                                                                        setInputFieldVariant(data)
                                                                    }}
                                                                    placeholder=''
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <TccInput
                                                                    type='number'
                                                                    InputProps={isDisabled}
                                                                    label='Metal Weight'
                                                                    value={input?.metal_weight || ""}
                                                                    onChange={(e: any) => {
                                                                        const data = [...inputFieldVariant]
                                                                        data[index].metal_weight = e.target.value
                                                                        setInputFieldVariant(data)
                                                                    }}
                                                                    placeholder=''
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <TccInput
                                                                    type='number'
                                                                    label='Retail Price'
                                                                    InputProps={isDisabled}
                                                                    value={input?.retail_price || ""}
                                                                    onChange={(e: any) => {
                                                                        const data = [...inputFieldVariant]
                                                                        data[index].retail_price = e.target.value
                                                                        setInputFieldVariant(data)
                                                                    }}
                                                                    placeholder=''
                                                                />
                                                            </TableCell>
                                                        </TableRow>

                                                    )
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                                    Gemstone Details
                                </Typography>
                                {action === "view" ? <></> : <Button sx={{ mt: 8 }} variant='contained' onClick={addDiamondSettingFields}>
                                    Add Gemstone Details
                                </Button>}
                            </Grid>
                            <Grid item xs={12} sm={12}>
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
                                }}>
                                    <Table stickyHeader aria-label='sticky table'>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align='center' sx={{ minWidth: 200 }}>Stone Type</TableCell>
                                                <TableCell align='center' sx={{ minWidth: 200 }}>Count</TableCell>
                                                <TableCell align='center'>Stone</TableCell>
                                                <TableCell align='center'>Shape</TableCell>
                                                <TableCell align='center'>MM Size</TableCell>
                                                <TableCell align='center'>Color</TableCell>
                                                <TableCell align='center'>Clarity</TableCell>
                                                <TableCell align='center'>Cut</TableCell>
                                                <TableCell align='center' sx={{ minWidth: 200 }}>carat size</TableCell>
                                                <TableCell align='center' sx={{ minWidth: 170 }}>Stone Weight</TableCell>
                                                <TableCell align='center' sx={{ minWidth: 170 }}>Stone Pieces/count</TableCell>
                                                <TableCell align='center'>Delete </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {inputFieldsDiamond && inputFieldsDiamond.filter((t: any) => t.is_deleted == "0").map((input: any, index: any) => {
                                                return (
                                                    <TableRow key={"DIA_" + index}>
                                                        <TableCell>
                                                            <TccSelect
                                                                InputProps={isDisabled}
                                                                fullWidth
                                                                size='small'
                                                                inputLabel="Stone Type"
                                                                label='Stone Type'
                                                                value={input.Stone_type || ""}
                                                                id='controlled-select'
                                                                title='name'
                                                                onChange={(e: any) => {
                                                                    const data = [...inputFieldsDiamond]
                                                                    data.map((t: any, index: any) => {
                                                                        if (t.d_id === input.d_id) {
                                                                            data[index].Stone_type = e.target.value
                                                                        }
                                                                    })
                                                                    setInputFieldsDiamond(data)
                                                                }}
                                                                Options={stoneTypeList}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TccInput
                                                                InputProps={isDisabled}
                                                                fullWidth
                                                                type='text'
                                                                label='Stone Count'
                                                                name="Stone Count"
                                                                value={input.stone_count}
                                                                placeholder=''
                                                                onChange={(e: any) => {
                                                                    const data = [...inputFieldsDiamond]
                                                                    data.map((t: any, index: any) => {
                                                                        if (t.d_id === input.d_id) {
                                                                            data[index].stone_count = e.target.value
                                                                        }
                                                                    })
                                                                    setInputFieldsDiamond(data)
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TccSelect
                                                                InputProps={isDisabled}
                                                                fullWidth
                                                                size='small'
                                                                inputLabel="Stone"
                                                                label='Stone'
                                                                value={input.stone}
                                                                id='controlled-select'
                                                                title='name'
                                                                onChange={(e: any) => {
                                                                    const data = [...inputFieldsDiamond]
                                                                    data.map((t: any, index: any) => {
                                                                        if (t.d_id === input.d_id) {
                                                                            data[index].stone = e.target.value
                                                                        }
                                                                    })
                                                                    setInputFieldsDiamond(data)
                                                                }}
                                                                Options={stoneList}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TccSelect
                                                                InputProps={isDisabled}
                                                                fullWidth
                                                                size='small'
                                                                inputLabel="Shape"
                                                                label='Shape'
                                                                value={input.stone_shape}
                                                                id='controlled-select'
                                                                title='name'
                                                                onChange={(e: any) => {
                                                                    const data = [...inputFieldsDiamond]
                                                                    data.map((t: any, index: any) => {
                                                                        if (t.d_id === input.d_id) {
                                                                            data[index].stone_shape = e.target.value
                                                                        }
                                                                    })
                                                                    setInputFieldsDiamond(data)
                                                                }}
                                                                Options={stoneShapeList}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TccSelect
                                                                InputProps={isDisabled}
                                                                fullWidth
                                                                size='small'
                                                                inputLabel="MM Size"
                                                                label='MM Size'
                                                                value={input.stone_mm_size}
                                                                id='controlled-select'
                                                                title='value'
                                                                onChange={(e: any) => {
                                                                    const data = [...inputFieldsDiamond]
                                                                    data.map((t: any, index: any) => {
                                                                        if (t.d_id === input.d_id) {
                                                                            data[index].stone_mm_size = e.target.value
                                                                        }
                                                                    })
                                                                    setInputFieldsDiamond(data)
                                                                }}
                                                                Options={stoneMMSize}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TccSelect
                                                                InputProps={isDisabled}
                                                                fullWidth
                                                                size='small'
                                                                inputLabel="Color"
                                                                label='Color'
                                                                value={input.stone_color}
                                                                id='controlled-select'
                                                                title='name'
                                                                onChange={(e: any) => {
                                                                    const data = [...inputFieldsDiamond]
                                                                    data.map((t: any, index: any) => {
                                                                        if (t.d_id === input.d_id) {
                                                                            data[index].stone_color = e.target.value
                                                                        }
                                                                    })
                                                                    setInputFieldsDiamond(data)
                                                                }}
                                                                Options={stoneColor}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TccSelect
                                                                InputProps={isDisabled}
                                                                fullWidth
                                                                size='small'
                                                                inputLabel="Clarity"
                                                                label='Clarity'
                                                                value={input.stone_clarity}
                                                                id='controlled-select'
                                                                title='name'
                                                                onChange={(e: any) => {
                                                                    const data = [...inputFieldsDiamond]
                                                                    data.map((t: any, index: any) => {
                                                                        if (t.d_id === input.d_id) {
                                                                            data[index].stone_clarity = e.target.value
                                                                        }
                                                                    })
                                                                    setInputFieldsDiamond(data)
                                                                }}
                                                                Options={stoneClarity}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TccSelect
                                                                InputProps={isDisabled}
                                                                fullWidth
                                                                size='small'
                                                                inputLabel="Cut"
                                                                label='Cut'
                                                                value={input.stone_cut}
                                                                id='controlled-select'
                                                                title='value'
                                                                onChange={(e: any) => {
                                                                    const data = [...inputFieldsDiamond]
                                                                    data.map((t: any, index: any) => {
                                                                        if (t.d_id === input.d_id) {
                                                                            data[index].stone_cut = e.target.value
                                                                        }
                                                                    })
                                                                    setInputFieldsDiamond(data)
                                                                }}
                                                                Options={stoneCuts}
                                                            />
                                                        </TableCell>

                                                        <TableCell>
                                                            <TccSelect
                                                                InputProps={isDisabled}
                                                                fullWidth
                                                                size='small'
                                                                inputLabel="Carat size"
                                                                label='carat size'
                                                                value={input.is_carat}
                                                                id='controlled-select'
                                                                title='name'
                                                                onChange={(e: any) => {
                                                                    const data = [...inputFieldsDiamond]
                                                                    data.map((t: any, index: any) => {
                                                                        if (t.d_id === input.d_id) {
                                                                            data[index].is_carat = e.target.value
                                                                        }
                                                                    })
                                                                    setInputFieldsDiamond(data)
                                                                }}
                                                                Options={caratSizeList}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TccInput
                                                                InputProps={isDisabled}
                                                                fullWidth
                                                                type='number'
                                                                label='Stone Weight'
                                                                value={input.Stone_weight || ""}
                                                                placeholder=''
                                                                onChange={(e: any) => {
                                                                    const data = [...inputFieldsDiamond]
                                                                    data.map((t: any, index: any) => {
                                                                        if (t.d_id === input.d_id) {
                                                                            data[index].Stone_weight = e.target.value
                                                                        }
                                                                    })
                                                                    setInputFieldsDiamond(data)
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TccInput
                                                                InputProps={isDisabled}
                                                                fullWidth
                                                                type='number'
                                                                label='Stone Pieces'
                                                                value={input.stone_count || ""}
                                                                placeholder=''
                                                                onChange={(e: any) => {
                                                                    const data = [...inputFieldsDiamond]
                                                                    data.map((t: any, index: any) => {
                                                                        if (t.d_id === input.d_id) {
                                                                            data[index].stone_count = e.target.value
                                                                        }
                                                                    })
                                                                    setInputFieldsDiamond(data)
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button variant='outlined' color='error' disabled={isDisabled ? true : false}
                                                                onClick={() => {
                                                                    const data = [...inputFieldsDiamond]
                                                                    data[index].is_deleted = 1
                                                                    productId ? removeDiamondSettingFields(data) : removeAddDiamondSettingFields(data, index)
                                                                }}>
                                                                -
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}

                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <TccSingleFileUpload onDrop={setImageFile} onClick={removeimage} imageFile={imageShow} disabled={isDisabled ? true : false} />
                            </Grid>
                        </Fragment >
                    </>
                )
            default:
                return 'Unknown Step'
        }

    }

    const renderContent = () => {
        if (activeStep === steps.length) {
            return (
                <>
                    <Typography>All steps are completed!</Typography>
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button size='large' variant='contained' onClick={handleReset}>
                            Add New Products
                        </Button>
                    </Box>
                </>
            )
        } else {
            return (
                <form onSubmit={e => e.preventDefault()}>
                    <Grid container spacing={5}>
                        <Grid item xs={12}>
                            <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                                {activeStep === 2 ? "" : steps[activeStep].title}
                            </Typography>
                            <Typography variant='caption' component='p'>
                                {/* {steps[activeStep].subtitle} */}
                            </Typography>
                        </Grid>
                        {getStepContent(activeStep)}
                        <Grid item xs={12} sx={activeStep === 1 ? { display: 'flex', justifyContent: 'space-between' } : { display: 'flex', justifyContent: 'end' }}>
                            {activeStep === 1 && <Button
                                variant='outlined'
                                color='secondary'
                                onClick={handleBack}
                            >
                                Back
                            </Button>}
                            {activeStep === steps.length - 1 && action == "view" ? <></> :
                                <Button variant='contained'
                                    onClick={activeStep === 0 ?
                                        handleNext : activeStep === 1 ? id == undefined && productId == 0 ? addProductDetails : editProductDetails : handleNext}>
                                    {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                                </Button>}
                        </Grid>
                    </Grid>
                </form>
            )
        }
    }

    return (
        <>
            <Button variant='contained' sx={{ mr: 3, mb: 4, '& svg': { mr: 2 } }} onClick={() => {
                Router.back()
                setRemoveImage("1")
            }}>
                <Icon icon='material-symbols:arrow-back-rounded' />
                Back
            </Button>
            <Card>
                <CardContent>
                    <StepperWrapper>
                        <Stepper activeStep={activeStep} sx={{ display: 'flex', justifyContent: "start" }} connector={<Icon icon='tabler:chevron-right' />}>
                            {steps.map((step, index) => {
                                const RenderAvatar = activeStep >= index ? CustomAvatar : Avatar

                                return (
                                    <Step key={"THE_" + index}>
                                        <StepLabel StepIconComponent={StepperCustomDot}>
                                            <div className='step-label'>
                                                <RenderAvatar
                                                    variant='rounded'
                                                    {...(activeStep >= index && { skin: 'light' })}
                                                    {...(activeStep === index && { skin: 'filled' })}
                                                    {...(activeStep >= index && { color: 'primary' })}
                                                    sx={{
                                                        ...(activeStep === index && { boxShadow: theme => theme.shadows[3] }),
                                                        ...(activeStep > index && { color: theme => hexToRGBA(theme.palette.primary.main, 0.4) })
                                                    }}
                                                >
                                                    <Icon icon={step.icon} />
                                                </RenderAvatar>
                                                <div>
                                                    <Typography className='step-title'>{step.title}</Typography>
                                                </div>
                                            </div>
                                        </StepLabel>
                                    </Step>
                                )
                            })}
                        </Stepper>

                    </StepperWrapper>
                </CardContent>
                <Divider sx={{ m: '0 !important' }} />
                <CardContent>{renderContent()}</CardContent>
            </Card>
        </>
    )
}



export default ProductAddBirthStone;