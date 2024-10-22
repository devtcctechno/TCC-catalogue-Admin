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
import { Autocomplete, CardHeader, Checkbox, FormControlLabel, FormGroup, FormHelperText, FormLabel, MenuItem, Paper, Radio, RadioGroup, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import TccSelect from 'src/customComponents/Form-Elements/select'
import { ADD_PRODUCT_BASIC_DETAILS, ADD_PRODUCT_DETAILS, ADD_PRODUCT_DROPDOWN_LIST, ADD_PRODUCT_METAL_DIAMOND_DETAILS, ADD_PRODUCT_MRTAL_DATA, EDIT_PRODUCT_DETAILS, EDIT_VARIANT_PRODUCT_DETAILS, GET_BY_ID_PRODUCTS } from 'src/services/AdminServices'
import { appErrors, STONE_TYPE } from 'src/AppConstants'
import Router, { useRouter } from 'next/router'

import { MEATL_GOLD_ID, MEATL_PLATINUM_ID, MEATL_SILVER_ID } from 'src/AppConfig'
import { useForm } from 'react-hook-form'

const steps = [
  {
    icon: 'fluent-mdl2:product-release',
    title: 'Product Basic Details',
  },
  {
    icon: 'ion:diamond-outline',
    title: 'Gold & Diamonds Details',
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

const discountTypeData: any = [
  {
    id: 1,
    name: "Percentage (%)",
  },
  {
    id: 2,
    name: "Other"
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

const EditProduct = () => {
  // ** States
  let productSizeLenghtFilter: any;
  const [productId, setProductId] = useState(0)
  const [count, setCount] = useState(1)
  const [radioButtonStripe, setRadioButtonStripe] = useState('')
  const [inputFields, setInputFields] = useState([{ c_id: 0, category: null, subCategory: null, subSubCategory: null, categoryList: [], subCategoryList: [], subSubCategoryList: [], id: 0, isDeleted: 0 }])
  const [inputFieldsGold, setInputFieldsGold] = useState([{ rate: '', default: '0', price: '', weight: '', metalGroup: "", id: 0, isDeleted: 0 }])
  const [inputFieldsDiamond, setInputFieldsDiamond] = useState<any>([{
    d_id: 0, default: '0', diamondGroup: null, Stone_type: null, stone_mm_size: null,
    Stone_weight: 0, stone_cut: null, stone_color: null, stone_clarity: null, stone_shape: null,
    stone: null, stone_count: 0, stone_setting: null,
    id: 0, is_deleted: "0"
  }])
  const [inputFieldGoldMetal, setInputFieldGoldMetal] = useState<{ karat: null, id_karat: null, tone: any[], price: '', rate: 0, id: 0, metal_weight: null, metal_tone: [], is_deleted: "0", retail_price: '', compare_price: '' }[]>([])
  const [inputFieldSilverMetal, setInputFieldSilverMetal] = useState([{ tone: [{ id: null, name: "" }], price: '', rate: 0, id: 0, metal_tone: [], metal_weight: null, is_deleted: "0", retail_price: '', compare_price: '' }])
  const [inputFieldPlatinumMetal, setInputFieldPlatinumMetal] = useState([{ tone: [{ id: null, name: "" }], price: '', rate: 0, id: 0, metal_tone: [], metal_weight: null, is_deleted: "0", retail_price: '', compare_price: '' }])
  const [productName, setProductName] = useState('')
  const [productSKU, setProductSKU] = useState<string>('')
  const [productSortDes, setProductSortDes] = useState('')
  const [productLongDes, setProductLongDes] = useState('')
  const [editerData, setEditerData] = useState<any>()
  const [edit, setEdit] = useState<string>('<p></p>')
  const [called, setCalled] = useState(true)
  const [keywordsList, setKeywordsList] = useState([])
  const [keyword, setKeyword] = useState<{ id: null, name: "" }[]>([])
  const [gender, setGender] = useState<{ id: null, name: "" }[]>([])
  const [settingTypeList, setSettingTypeList] = useState([])
  const [settingType, setSettingType] = useState<{ id: null, name: "" }[]>([])
  const [itemSizeList, setItemSizeList] = useState([])
  const [itemSize, setItemSize] = useState<{ id: null, size: "" }[]>([])
  const [itemLengthList, setItemLengthList] = useState([])
  const [itemLength, setItemLength] = useState<{ id: null, length: "" }[]>([])
  const [metalGroupList, setMetalGroupList] = useState<any[]>([])
  const [diamondGroupList, setDiamondGroupList] = useState([])
  const [stoneTypeList, setStoneTypeList] = useState([{ id: 1, name: "center" }, { id: 2, name: "side" }])
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
  const [metalKaratList, setMetalKaratList] = useState<any[]>([])
  const [stoneMMSize, setStoneMMSize] = useState([]);
  const [activeStep, setActiveStep] = useState<number>(0)
  const [checkedSize, setCheckedSize] = useState<boolean>(false)
  const [checkedLength, setCheckedLength] = useState<boolean>(false)
  const [marketingCharge, setMarketingCharge] = useState<number>(0)
  const [findingCharge, setFindingCharge] = useState<number>(0)
  const [otherCharge, setOtherCharge] = useState<number>(0)
  const [checked, setChecked] = useState({})
  const [editChecked, setEditChecked] = useState({})
  const [category, setCategory] = useState<any>()
  const [discountType, setDiscountType] = useState<string>('')
  const [discountValue, setDiscountValue] = useState<number>(0)
  const [isDisabled, setIsDisabled] = useState(false);

  const [variantChecked, setVariantChecked] = useState<boolean>(true)
  const [quntityTrackChecked, setQuntityTrackChecked] = useState<boolean>(true)
  const [quntityValue, setQuntityValue] = useState("")
  const [retailPriceValue, setRetailPriceValue] = useState("")
  const [comparePriceValue, setComparePriceValue] = useState("")
  const [metalWeightValue, setMetalWeightValue] = useState("")
  const [inputFieldVariant, setInputFieldVariant] = useState<any[]>([])
  const [brandList, setbrandList] = useState([])
  const [brandType, setBrandType] = useState<string>('')
  const [collectionList, setCollectionList] = useState([])
  const [collectionName, setCollectionName] = useState<{ id: null, name: "" }[]>([])
  const [withOutvariant, setWithOutVariant] = useState<any[]>([])
  const [finalInputVariant, setFinalInputVariant] = useState<any>([])
  const [finalVariantArrayData, setFinalVariantArrayData] = useState<any>([])
  const router = useRouter();
  const { id, action } = router.query;
  const [errorData, setErrorData] = useState<any>()
  const [errorKeyWord, setErrorKeyWord] = useState(false)

  const [formErrorData, setFormErrorData] = useState({
    errors: {
      title: '',
      sku: '',
      sortDescription: '',
      longDescription: '',
      keyWordError: []
    }
  });

  const defaultValues = {
    keyword: keyword,
  }

  const {
    control,
    formState: { errors }
  } = useForm({
    defaultValues,
  })

  const handleChangeDiscountType = (event: SelectChangeEvent) => {
    setDiscountType(event.target.value as string)
  }
  const scrollTop = () => {
    window.scrollTo(0, 0);
  }

  const handleChecked = (id: any) => (e: any) => {
    const { checked } = e.target;
    setChecked((values) => ({
      ...values,
      [id]: checked
    }));
  }

  const variantHandleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setVariantChecked(event.target.checked)
    const withOutVariantCombinations: any = [];
    if (event.target.checked === false) {
      if (withOutvariant.length === 0) {
        withOutVariantCombinations.push({
          id: 0,
          id_metal: null,
          id_karat: null,
          id_size: null,
          id_length: null,
          quantity: quntityValue,
          side_dia_weight: null,
          side_dia_count: null,
          id_metal_tone: null,
          metal_weight: null,
          retail_price: null,
          compare_price: null,
          is_deleted: "0"
        });
        setWithOutVariant(withOutVariantCombinations)
      }
    }
  }

  const quntityTrackHandleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuntityTrackChecked(event.target.checked)
  }

  productSizeLenghtFilter = categorysList.find((t: any) => t.id === inputFields[0]?.category)

  useEffect(() => {
    const productDetailId: string = id as string

    if (productDetailId != undefined) {
      setProductId(parseInt(productDetailId))
    }
    getAllDropDownData(productDetailId)
  }, [router.isReady])

  const getByIdProductData = async (dropDownData: any, productDetailId: string) => {
    try {
      const data = await GET_BY_ID_PRODUCTS(parseInt(productDetailId));
      if (data.code === 200 || data.code === "200") {
        setProductId(data.data.findProduct.id)
        setProductName(data.data.findProduct.name)
        setProductSKU(data.data.findProduct.sku)
        setProductSortDes(data.data.findProduct.sort_description)
        setEdit(data.data.findProduct.long_description)
        setFindingCharge(data.data.findProduct.finding_charge)
        setMarketingCharge(data.data.findProduct.making_charge)
        setOtherCharge(data.data.findProduct.other_charge)
        setDiscountType(data.data.findProduct.discount_type)
        if (data.data.findProduct.discount_type === 1) {
          setDiscountValue(data.data.findProduct.discount_value * 100)
        } else {
          setDiscountValue(data.data.findProduct.discount_value)
        }
        setBrandType(data.data.findProduct.id_brand)
        if (data.data.findProduct.PMO[0].id_metal === null) {
          setVariantChecked(false)
          setWithOutVariant([{
            id: data.data.findProduct.PMO[0]?.id,
            id_metal: null,
            id_karat: null,
            id_size: null,
            id_length: null,
            quantity: data.data.findProduct.PMO[0].quantity,
            side_dia_weight: null,
            side_dia_count: null,
            id_metal_tone: null,
            metal_weight: data.data.findProduct.PMO[0]?.metal_weight,
            retail_price: data.data.findProduct.PMO[0]?.retail_price,
            compare_price: data.data.findProduct.PMO[0]?.compare_price,
            is_deleted: "0"
          }])
        } else {
          setVariantChecked(true)
        }
        setQuntityTrackChecked(data.data.findProduct.is_quantity_track)
        setQuntityValue(data.data.findProduct.quantity)
        setMetalWeightValue(data?.data?.findProduct.PMO[0]?.metal_weight)
        setRetailPriceValue(data.data.findProduct.retail_price)
        setComparePriceValue(data.data.findProduct.compare_price)
        const collectionData = dropDownData.collection?.filter((t: any) => {
          if (data.data.findProduct.id_collection.indexOf(parseInt(t.id)) >= 0) return t;
        });
        setCollectionName(collectionData)

        const tags = dropDownData.keyWords?.filter((t: any) => {
          if (data.data.findProduct.tag.indexOf(parseInt(t.id)) >= 0) return t;
        });
        setKeyword(tags)

        const genderDatas: any = genderData?.filter((t: any) => {
          if (data.data.findProduct.gender.indexOf(parseInt(t.id)) >= 0) return t;
        });
        setGender(genderDatas)

        const setting_style_type = dropDownData.setting_type_list?.filter((t: any) => {
          if (data.data.findProduct.setting_style_type.indexOf(parseInt(t.id)) >= 0) return t;
        });

        setSettingType(setting_style_type)

        const item_size = dropDownData.item_size?.filter((t: any) => {
          if (data.data.findProduct.size.indexOf(parseInt(t.id)) >= 0) return t;
        })

        setItemSize(item_size)

        const item_length = dropDownData.item_length?.filter((t: any) => {
          if ((data.data.findProduct.length as number[]).indexOf(parseInt(t.id)) >= 0) return t;
        })
        setItemLength(item_length)

        const categoryData = dropDownData.categoryList.find((t: any) => t.id == parseInt(data.data.findProduct.product_categories[0].id_category))

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

        const arrCategories: any[] = []
        data.data.findProduct.product_categories.map((value: any, index: any) => {
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
            isDeleted: 0,
          }
          arrCategories.push(data)

        })
        setInputFields(arrCategories)
        setFinalInputVariant(data.data.findProduct.PMO)

        //Gold Calculations

        const metalList = dropDownData.metal_list;
        const goldMetalRate = metalList.filter((m: any) => parseInt(m.id) === 1)[0].metal_rate;
        let arrMetalKarat: any[] = []
        const metalKarat = dropDownData.metal_karat || []
        const metalTone = dropDownData.metal_tone as number[] || []
        let checkedValues = {}
        data.data.findProduct.PMO.filter(((t: any) => t.id_karat !== null)).map((value: any) => {
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
            retail_price: value.retail_price,
            compare_price: value.compare_price
          }
          arrMetalKarat.push(data)

        })

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
        const silverRateFindData: any = metalList.find((value: any) => value.name === "silver" || value.name === "Silver")
        const silverRate = silverRateFindData ? silverRateFindData.metal_rate : ''

        // const silverRate = metalList.filter((m: any) => parseInt(m.id) === 2)[0].metal_rate;
        data.data.findProduct.PMO.filter(((t: any) => (parseInt(t.id_metal) === 2))).map((value: any) => {
          const id_metal_tone = value.id_metal_tone ? value.id_metal_tone.split("|") as number[] : [];
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
            retail_price: value.retail_price,
            compare_price: value.compare_price
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
        const platinumRateFindData: any = metalList.find((value: any) => value.name === "platinum" || value.name === "Platinum")
        const platinumRate = platinumRateFindData ? platinumRateFindData.metal_rate : ''

        // const platinumRate = metalList.filter((m: any) => parseInt(m.id) === 3)[0].metal_rate;
        data.data.findProduct.PMO.filter(((t: any) => (parseInt(t.id_metal) === 3))).map((value: any) => {
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
            retail_price: value.retail_price,
            compare_price: value.compare_price
          }
          arrMetalKarat.push(data)
        })
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

        const product_diamond = data.data.findProduct.PDO.map((value: any, index: any) => {
          // const diamondRate = dropDownData.diamond_master.filter((t: any) =>
          //     t.id_cuts == value.rate.id_cuts &&
          //     t.id_clarity == value.rate.id_clarity &&
          //     t.id_stone == value.rate.id_stone &&
          //     t.id_shape == value.rate.id_shape &&
          //     t.id_mm_size == value.rate.id_mm_size &&
          //     t.id_color == value.rate.id_color

          // )
          // const selectedRate = diamondRate.length > 0 ? diamondRate.map((t: any) => t.rate)[0] : ""
          const data = {
            // default: value.is_default,
            diamondGroup: value.id_diamond_group,
            stone: value.id_stone,
            Stone_type: value.id_type,
            Stone_weight: value.weight,
            stone_cut: value.id_cut,
            stone_color: value.id_color,
            stone_mm_size: value.id_mm_size,
            stone_clarity: value.id_clarity,
            stone_shape: value.id_shape,
            stone_count: value.count,
            stone_setting: value.id_setting,

            // rate: selectedRate,
            // price: "",
            id: value.id,
            is_deleted: "0",
            d_id: index + 1
          }

          return data
        })
        setInputFieldsDiamond(product_diamond)
      } else {
        return toast.error(data.message);
      }
    } catch (e: any) {
      toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN)
    }
  }

  const getAllDropDownData = async (productDetailId: string) => {

    try {
      const data = await ADD_PRODUCT_DROPDOWN_LIST();
      if (data.code === 200 || data.code === "200") {
        const categoryData = data.data.categoryList.filter((t: any) => t.parent_id === null)
        setKeywordsList(data.data.keyWords)
        setCollectionList(data?.data?.collection)
        setbrandList(data?.data?.brands)
        inputFields.map((value) => value.categoryList = categoryData)
        setCategorysList(data.data.categoryList)
        setSettingTypeList(data.data.setting_type_list)
        setItemLengthList(data.data.item_length)
        setItemSizeList(data.data.item_size)
        setMetalGroupList(data.data.metal_list)
        setDiamondGroupList(data.data.diamond_master)
        setStoneSettingList(data.data.stone_setting)
        setMetalToneList(data.data.metal_tone.filter((m: any) => parseInt(m.id_metal) == MEATL_GOLD_ID))
        setSilverToneList(data.data.metal_tone.filter((m: any) => parseInt(m.id_metal) == MEATL_SILVER_ID))
        setPaltinumToneList(data.data.metal_tone.filter((m: any) => parseInt(m.id_metal) == MEATL_PLATINUM_ID))
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
            rate: ((data.data.metal_list[0].metal_rate / 31.104) * (value.name / 24)).toFixed(2), id: 0, metal_tone: data.data.metal_tone,
            retail_price: null,
            compare_price: null
          }

          return gold
        })
        setInputFieldGoldMetal(product_metal_gold)
        const silverRateFindData: any = data.data.metal_list.find((value: any) => value.name === "silver" || value.name === "Silver")
        const silverRate = silverRateFindData ? silverRateFindData.metal_rate : ''

        const platinumRateFindData: any = data.data.metal_list.find((value: any) => value.name === "platinum" || value.name === "Platinum")
        const platinumRate = platinumRateFindData ? platinumRateFindData.metal_rate : ''

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

  const addProductMetalDiamoundDetails = async (data: any) => {
    let payload = {}

    if (checked['1' as keyof typeof checked] === true && checked['2' as keyof typeof checked] === true && checked['3' as keyof typeof checked] === true) {
      // if (settingType.map((id) => id.id)[0] == null) {
      payload = {
        "id_product": data,
        "settingStyleType": settingType.map((id) => id.id)[0] == null ? false : settingType.map((id) => id.id),
        "size": itemSize.map((value) => value.id)[0] == null ? false : itemSize.map((value) => value.id),
        "length": itemLength.map((value) => value.id)[0] == null ? false : itemLength.map((value) => value.id),
        "product_Gold_metal_options": inputFieldGoldMetal.map((value) => {

          const data = {
            "id": value.id,
            "metal_weight": value.metal_weight,
            "id_metal_tone": value.tone.map((t: any) => t.id),
            "id_karat": value.id_karat,
            "id_metal": checked['1' as keyof typeof checked] === true && 1,
            "retail_price": value.retail_price,
            "compare_price": value.compare_price
          }

          return data
        }),
        "product_silver_options": inputFieldSilverMetal.map((value) => {
          const data = {
            "id": value.id,
            "metal_weight": value.metal_weight,
            "id_metal_tone": value.tone.map((t: any) => t.id),
            "id_metal": checked['2' as keyof typeof checked] === true && 2,
            "retail_price": value.retail_price,
            "compare_price": value.compare_price
          }

          return data
        }),

        "product_platinum_options": inputFieldPlatinumMetal.map((value) => {
          const data = {
            "id": value.id,
            "metal_weight": value.metal_weight,
            "id_metal_tone": value.tone.map((t: any) => t.id),
            "id_metal": checked['3' as keyof typeof checked] === true && 3,
            "retail_price": value.retail_price,
            "compare_price": value.compare_price
          }

          return data
        }),
        "product_diamond_options": inputFieldsDiamond.map((value: any) => {
          const data = {
            "id": value.id,
            "id_type": value.Stone_type,
            "id_setting": value.stone_setting,
            "weight": value.Stone_weight,
            "count": value.stone_count,
            "is_default": value.default,
            "id_stone": value.stone,
            "id_shape": value.stone_shape,
            "id_mm_size": value.stone_mm_size,
            "id_color": value.stone_color,
            "id_clarity": value.stone_clarity,
            "id_cuts": value.stone_cut
          }

          return data
        })

      }

    } else if (checked['1' as keyof typeof checked] === true && checked['2' as keyof typeof checked]) {
      payload = {
        "id_product": data,
        "settingStyleType": settingType.map((id) => id.id)[0] == null ? false : settingType.map((id) => id.id),
        "size": itemSize.map((value) => value.id)[0] == null ? false : itemSize.map((value) => value.id),
        "length": itemLength.map((value) => value.id)[0] == null ? false : itemLength.map((value) => value.id),
        "product_Gold_metal_options": inputFieldGoldMetal.map((value) => {
          const data = {
            "id": value.id,
            "metal_weight": value.metal_weight,
            "id_metal_tone": value.tone.map((t: any) => t.id),
            "id_karat": value.id_karat,
            "id_metal": checked['1' as keyof typeof checked] === true && 1
          }

          return data
        }),
        "product_silver_options": inputFieldSilverMetal.map((value) => {
          const data = {
            "id": value.id,
            "metal_weight": value.metal_weight,
            "id_metal_tone": value.tone.map((t: any) => t.id),
            "id_metal": checked['2' as keyof typeof checked] === true && 2
          }

          return data
        }),
        "product_diamond_options": inputFieldsDiamond.map((value: any) => {
          const data = {
            "id": value.id,
            "id_type": value.Stone_type,
            "id_setting": value.stone_setting,
            "weight": value.Stone_weight,
            "count": value.stone_count,
            "is_default": value.default,
            "id_stone": value.stone,
            "id_shape": value.stone_shape,
            "id_mm_size": value.stone_mm_size,
            "id_color": value.stone_color,
            "id_clarity": value.stone_clarity,
            "id_cuts": value.stone_cut
          }

          return data
        })
      }
    } else if (checked['1' as keyof typeof checked] === true && checked['3' as keyof typeof checked]) {

      payload = {
        "id_product": data,
        "settingStyleType": settingType.map((id) => id.id)[0] == null ? false : settingType.map((id) => id.id),
        "size": itemSize.map((value) => value.id)[0] == null ? false : itemSize.map((value) => value.id),
        "length": itemLength.map((value) => value.id)[0] == null ? false : itemLength.map((value) => value.id),
        "product_Gold_metal_options": inputFieldGoldMetal.map((value) => {
          const data = {
            "id": value.id,
            "metal_weight": value.metal_weight,
            "id_metal_tone": value.tone.map((t: any) => t.id),
            "id_karat": value.id_karat,
            "id_metal": checked['1' as keyof typeof checked] === true && 1
          }

          return data
        }),

        "product_platinum_options": inputFieldPlatinumMetal.map((value) => {
          const data = {
            "id": value.id,
            "metal_weight": value.metal_weight,
            "id_metal_tone": value.tone.map((t: any) => t.id),
            "id_metal": checked['3' as keyof typeof checked] === true && 3
          }

          return data
        }),
        "product_diamond_options": inputFieldsDiamond.map((value: any) => {
          const data = {
            "id": value.id,
            "id_type": value.Stone_type,
            "id_setting": value.stone_setting,
            "weight": value.Stone_weight,
            "count": value.stone_count,
            "is_default": value.default,
            "id_stone": value.stone,
            "id_shape": value.stone_shape,
            "id_mm_size": value.stone_mm_size,
            "id_color": value.stone_color,
            "id_clarity": value.stone_clarity,
            "id_cuts": value.stone_cut
          }

          return data
        })
      }
    } else if (checked['2' as keyof typeof checked] === true && checked['3' as keyof typeof checked]) {

      payload = {
        "id_product": data,
        "settingStyleType": settingType.map((id) => id.id)[0] == null ? false : settingType.map((id) => id.id),
        "size": itemSize.map((value) => value.id)[0] == null ? false : itemSize.map((value) => value.id),
        "length": itemLength.map((value) => value.id)[0] == null ? false : itemLength.map((value) => value.id),

        "product_silver_options": inputFieldSilverMetal.map((value) => {
          const data = {
            "id": value.id,
            "metal_weight": value.metal_weight,
            "id_metal_tone": value.tone.map((t: any) => t.id),
            "id_metal": checked['2' as keyof typeof checked] === true && 2
          }

          return data
        }),

        "product_platinum_options": inputFieldPlatinumMetal.map((value) => {
          const data = {
            "id": value.id,
            "metal_weight": value.metal_weight,
            "id_metal_tone": value.tone.map((t: any) => t.id),
            "id_metal": checked['3' as keyof typeof checked] === true && 3
          }

          return data
        }),
        "product_diamond_options": inputFieldsDiamond.map((value: any) => {
          const data = {
            "id": value.id,
            "id_type": value.Stone_type,
            "id_setting": value.stone_setting,
            "weight": value.Stone_weight,
            "count": value.stone_count,
            "is_default": value.default,
            "id_stone": value.stone,
            "id_shape": value.stone_shape,
            "id_mm_size": value.stone_mm_size,
            "id_color": value.stone_color,
            "id_clarity": value.stone_clarity,
            "id_cuts": value.stone_cut
          }

          return data
        })
      }
    } else {
      if (checked['1' as keyof typeof checked] === true) {

        payload = {
          "id_product": data,
          "settingStyleType": settingType.map((id) => id.id)[0] == null ? false : settingType.map((id) => id.id),
          "size": itemSize.map((value) => value.id)[0] == null ? false : itemSize.map((value) => value.id),
          "length": itemLength.map((value) => value.id)[0] == null ? false : itemLength.map((value) => value.id),
          "product_Gold_metal_options": inputFieldGoldMetal.map((value) => {
            const data = {
              "id": value.id,
              "metal_weight": value.metal_weight,
              "id_metal_tone": value.tone && value.tone.map((t: any) => t.id),
              "id_karat": value.id_karat,
              "id_metal": checked['1' as keyof typeof checked] === true && 1
            }

            return data
          }),
          "product_diamond_options": inputFieldsDiamond.map((value: any) => {
            const data = {
              "id": value.id,
              "id_type": value.Stone_type,
              "id_setting": value.stone_setting,
              "weight": value.Stone_weight,
              "count": value.stone_count,
              "is_default": value.default,
              "id_stone": value.stone,
              "id_shape": value.stone_shape,
              "id_mm_size": value.stone_mm_size,
              "id_color": value.stone_color,
              "id_clarity": value.stone_clarity,
              "id_cuts": value.stone_cut
            }

            return data
          })

        }
      }

      if (checked['2' as keyof typeof checked] === true) {
        payload = {
          "id_product": data,
          "settingStyleType": settingType.map((id) => id.id)[0] == null ? false : settingType.map((id) => id.id),
          "size": itemSize.map((value) => value.id)[0] == null ? false : itemSize.map((value) => value.id),
          "length": itemLength.map((value) => value.id)[0] == null ? false : itemLength.map((value) => value.id),

          "product_silver_options": inputFieldSilverMetal.map((value) => {
            const data = {
              "id": value.id,
              "metal_weight": value.metal_weight,
              "id_metal_tone": value.tone.map((t: any) => t.id),
              "id_metal": checked['2' as keyof typeof checked] === true && 2
            }

            return data
          }),
          "product_diamond_options": inputFieldsDiamond.map((value: any) => {
            const data = {
              "id": value.id,
              "id_type": value.Stone_type,
              "id_setting": value.stone_setting,
              "weight": value.Stone_weight,
              "count": value.stone_count,
              "is_default": value.default,
              "id_stone": value.stone,
              "id_shape": value.stone_shape,
              "id_mm_size": value.stone_mm_size,
              "id_color": value.stone_color,
              "id_clarity": value.stone_clarity,
              "id_cuts": value.stone_cut
            }

            return data
          })
        }
      }
      if (checked['3' as keyof typeof checked] === true) {

        payload = {
          "id_product": data,
          "settingStyleType": settingType.map((id) => id.id)[0] == null ? false : settingType.map((id) => id.id),
          "size": itemSize.map((value) => value.id)[0] == null ? false : itemSize.map((value) => value.id),
          "length": itemLength.map((value) => value.id)[0] == null ? false : itemLength.map((value) => value.id),

          "product_platinum_options": inputFieldPlatinumMetal.map((value) => {
            const data = {
              "id": value.id,
              "metal_weight": value.metal_weight,
              "id_metal_tone": value.tone.map((t: any) => t.id),
              "id_metal": checked['3' as keyof typeof checked] === true && 3
            }

            return data
          }),
          "product_diamond_options": inputFieldsDiamond.map((value: any) => {
            const data = {
              "id": value.id,
              "id_type": value.Stone_type,
              "id_setting": value.stone_setting,
              "weight": value.Stone_weight,
              "count": value.stone_count,
              "is_default": value.default,
              "id_stone": value.stone,
              "id_shape": value.stone_shape,
              "id_mm_size": value.stone_mm_size,
              "id_color": value.stone_color,
              "id_clarity": value.stone_clarity,
              "id_cuts": value.stone_cut
            }

            return data
          })
        }
      }

    }

    try {
      const data = await ADD_PRODUCT_MRTAL_DATA(payload);
      if (data.code === 200 || data.code === "200") {
        setActiveStep(prevActiveStep => prevActiveStep + 1)
        if (activeStep === steps.length - 1) {
          return toast.success('Form Submitted')
        }
      } else {

        return toast.error(data.message);

      }
    } catch (e: any) {
      toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN)
    }
  }

  useEffect(() => {
    const arrayData: any = inputFieldVariant.filter((value: any) => (value.metal_weight !== null) && (value.metal_weight !== "") && (value.retail_price !== null) && (value.retail_price !== ""))
    setFinalVariantArrayData(arrayData)
  }, [inputFieldVariant])

  const addProductDetails = async () => {
    const diamondData = inputFieldsDiamond.find((value: any) => value)
    if (variantChecked === true && finalVariantArrayData.length === 0) {
      toast.error("Metal Data is required")
    } else if (diamondData && diamondData?.Stone_type === 1) {
      const filterData = inputFieldsDiamond.filter((value: any) => value?.Stone_type === 1).length
      if (filterData > 1) {
        toast.error("you can only enter the center diamond detail once per product")
      }
      else if ((diamondData.stone_count === 0 || diamondData.stone_count === '') && (diamondData.Stone_weight === 0 || diamondData.Stone_weight === '')) {
        toast.error("Please enter stone weight & stone count in diamond detail")
      } else if ((diamondData?.Stone_weight === 0) || (diamondData.Stone_weight === '')) {
        toast.error("Please enter stone weight in diamond detail")
      } else if ((diamondData.stone_count == 0) || (diamondData.stone_count === '')) {
        toast.error("Please enter stone count in diamond detail")
      } else if (diamondData.stone_count && diamondData.Stone_weight) {
        try {
          const payload1 = {
            "id_product": 0,
            "title": productName,
            "sku": productSKU,
            "Short_Description": productSortDes,
            "long_description": editerData,
            "tag": keyword.map((id) => id.id)[0] != null ? keyword.map((id) => id.id) : null,
            "gender": gender.map((id) => id.id)[0] == null ? false : gender.map((id) => id.id),
            "id_brand": brandType ? brandType : null,
            "discount_type": discountType ? discountType : null,
            "discount_value": discountValue ? discountValue : null,
            "collection": collectionName.map((id) => id.id)[0] != null ? collectionName.map((id) => id.id) : [],
            "product_categories": inputFields.map((value) => {
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
            "making_charge": marketingCharge ? marketingCharge : 0,
            "finding_charge": findingCharge ? findingCharge : 0,
            "other_charge": otherCharge ? otherCharge : 0
          }

          let payload = {}
          payload = {
            "is_quantity_track": quntityTrackChecked,
            "quantity": quntityValue,
            "retail_price": retailPriceValue,
            "compare_price": comparePriceValue,
            "settingStyleType": settingType.map((id) => id.id)[0] == null ? false : settingType.map((id) => id.id),
            "size": itemSize.map((value) => value.id)[0] == null ? [] : itemSize.map((value) => value.id),
            "product_type": inputFieldGoldMetal && inputFieldGoldMetal[0].compare_price == null || inputFieldGoldMetal[0].compare_price == undefined && inputFieldGoldMetal[0].retail_price == null || inputFieldGoldMetal[0].retail_price == undefined ? 1 : 2,
            "length": itemLength.map((value) => value.id)[0] == null ? [] : itemLength.map((value) => value.id),
            "product_metal_options": variantChecked === true ?
              finalVariantArrayData.map((value: any) => {
                const data: any = {
                  "id": value?.id,
                  "id_size": value?.id_size ? value?.id_size : null,
                  "id_length": value?.id_length ? value?.id_length : null,
                  "id_metal": value?.id_metal ? value?.id_metal : null,
                  "id_karat": value?.id_karat ? value?.id_karat : null,
                  "quantity": value?.quantity ? value?.quantity : null,
                  "side_dia_weight": value?.side_dia_weight ? value?.side_dia_weight : null,
                  "side_dia_count": value?.side_dia_count ? value?.side_dia_count : null,
                  "id_metal_tone": value?.id_metal_tone ? value?.id_metal_tone : null,
                  "metal_weight": value?.metal_weight ? value?.metal_weight : null,
                  "retail_price": value?.retail_price ? value?.retail_price : null,
                  "compare_price": value?.compare_price ? value?.compare_price : null,
                  "is_deleted": "0"
                }

                return data
              }) : [
                {
                  "id": 0,
                  "id_size": null,
                  "id_length": null,
                  "id_metal": null,
                  "id_karat": null,
                  "quantity": quntityValue,
                  "side_dia_weight": null,
                  "side_dia_count": null,
                  "id_metal_tone": null,
                  "metal_weight": metalWeightValue ? metalWeightValue : null,
                  "retail_price": retailPriceValue,
                  "compare_price": comparePriceValue,
                  "is_deleted": "0"
                }
              ],

            "product_diamond_options": inputFieldsDiamond.find((value: any) => value?.stone === "" || value?.stone === null && value?.id === 0 && value?.is_deleted === "0") ? [] : inputFieldsDiamond.map((value: any) => {
              const data = {
                "id": value.id,
                "id_type": value.Stone_type,
                "id_setting": value.stone_setting,
                "weight": value.Stone_weight,
                "count": value.stone_count,
                "is_default": value.default,
                "id_stone": value.stone,
                "id_shape": value.stone_shape,
                "id_mm_size": value.stone_mm_size,
                "id_color": value.stone_color,
                "id_clarity": value.stone_clarity,
                "id_cuts": value.stone_cut,

                // "is_deleted": value?.stone === "" ? "1" : "0"
              }

              return data

            })

          }

          const finalPayload = {
            ...payload1, ...payload
          }

          const data = await EDIT_VARIANT_PRODUCT_DETAILS(finalPayload);
          if (data.code === 200 || data.code === "200") {
            toast.success(data.message)
            Router.push({ pathname: "/product/all-products" })
          } else {
            toast.error(data.message);
          }

        }
        catch (e: any) {
          toast.error(e.data?.message);
        }
      }
    } else {
      try {
        const payload1 = {
          "id_product": 0,
          "title": productName,
          "sku": productSKU,
          "Short_Description": productSortDes,
          "long_description": editerData,
          "tag": keyword.map((id) => id.id)[0] != null ? keyword.map((id) => id.id) : null,
          "gender": gender.map((id) => id.id)[0] == null ? false : gender.map((id) => id.id),
          "id_brand": brandType ? brandType : null,
          "discount_type": discountType ? discountType : null,
          "discount_value": discountValue ? discountValue : null,
          "collection": collectionName.map((id) => id.id)[0] != null ? collectionName.map((id) => id.id) : [],
          "product_categories": inputFields.map((value) => {
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
          "making_charge": marketingCharge ? marketingCharge : 0,
          "finding_charge": findingCharge ? findingCharge : 0,
          "other_charge": otherCharge ? otherCharge : 0
        }

        let payload = {}
        payload = {
          "is_quantity_track": quntityTrackChecked,
          "quantity": quntityValue,
          "retail_price": retailPriceValue,
          "compare_price": comparePriceValue,
          "settingStyleType": settingType.map((id) => id.id)[0] == null ? false : settingType.map((id) => id.id),
          "size": itemSize.map((value) => value.id)[0] == null ? [] : itemSize.map((value) => value.id),
          "product_type": inputFieldGoldMetal && inputFieldGoldMetal[0].compare_price == null || inputFieldGoldMetal[0].compare_price == undefined && inputFieldGoldMetal[0].retail_price == null || inputFieldGoldMetal[0].retail_price == undefined ? 1 : 2,
          "length": itemLength.map((value) => value.id)[0] == null ? [] : itemLength.map((value) => value.id),
          "product_metal_options": variantChecked === true ?
            finalVariantArrayData.map((value: any) => {
              const data: any = {
                "id": value?.id,
                "id_size": value?.id_size ? value?.id_size : null,
                "id_length": value?.id_length ? value?.id_length : null,
                "id_metal": value?.id_metal ? value?.id_metal : null,
                "id_karat": value?.id_karat ? value?.id_karat : null,
                "quantity": value?.quantity ? value?.quantity : null,
                "side_dia_weight": value?.side_dia_weight ? value?.side_dia_weight : null,
                "side_dia_count": value?.side_dia_count ? value?.side_dia_count : null,
                "id_metal_tone": value?.id_metal_tone ? value?.id_metal_tone : null,
                "metal_weight": value?.metal_weight ? value?.metal_weight : null,
                "retail_price": value?.retail_price ? value?.retail_price : null,
                "compare_price": value?.compare_price ? value?.compare_price : null,
                "is_deleted": "0"
              }

              return data
            }) : [
              {
                "id": 0,
                "id_size": null,
                "id_length": null,
                "id_metal": null,
                "id_karat": null,
                "quantity": quntityValue,
                "side_dia_weight": null,
                "side_dia_count": null,
                "id_metal_tone": null,
                "metal_weight": metalWeightValue ? metalWeightValue : null,
                "retail_price": retailPriceValue,
                "compare_price": comparePriceValue,
                "is_deleted": "0"
              }
            ],

          "product_diamond_options": inputFieldsDiamond.find((value: any) => value?.stone === "" || value?.stone === null && value?.id === 0 && value?.is_deleted === "0") ? [] : inputFieldsDiamond.map((value: any) => {
            const data = {
              "id": value.id,
              "id_type": value.Stone_type,
              "id_setting": value.stone_setting,
              "weight": value.Stone_weight,
              "count": value.stone_count,
              "is_default": value.default,
              "id_stone": value.stone,
              "id_shape": value.stone_shape,
              "id_mm_size": value.stone_mm_size,
              "id_color": value.stone_color,
              "id_clarity": value.stone_clarity,
              "id_cuts": value.stone_cut,

              // "is_deleted": value?.stone === "" ? "1" : "0"
            }

            return data

          })

        }

        const finalPayload = {
          ...payload1, ...payload
        }

        const data = await EDIT_VARIANT_PRODUCT_DETAILS(finalPayload);
        if (data.code === 200 || data.code === "200") {
          toast.success(data.message)
          Router.push({ pathname: "/product/all-products" })
        } else {
          toast.error(data.message);
        }

      }
      catch (e: any) {
        toast.error(e.data?.message);
      }
    }
  }

  const editProductDetails = async () => {
    const diamondData = inputFieldsDiamond.find((value: any) => value)
    if (variantChecked === true && finalVariantArrayData.length === 0) {
      toast.error("Metal Data is required")
    } else if (diamondData && diamondData?.Stone_type === 1) {
      const filterData = inputFieldsDiamond.filter((value: any) => value?.Stone_type === 1).length
      if (filterData > 1) {
        toast.error("you can only enter the center diamond detail once per product")
      }
      else if ((diamondData.stone_count === 0 || diamondData.stone_count === '') && (diamondData.Stone_weight === 0 || diamondData.Stone_weight === '') && (diamondData.stone_count === null || diamondData.stone_count === null)) {
        toast.error("Please enter stone weight & stone count in diamond detail")
      } else if ((diamondData?.Stone_weight === 0) || (diamondData.Stone_weight === '') || (diamondData.Stone_weight === null)) {
        toast.error("Please enter stone weight in diamond detail")
      } else if ((diamondData.stone_count == 0) || (diamondData.stone_count === '') || (diamondData.stone_count === '')) {
        toast.error("Please enter stone count in diamond detail")
      } else if (diamondData.stone_count && diamondData.Stone_weight) {
        try {
          const metalDataDetail: any[] = inputFieldVariant.map((value: any) => {
            if (variantChecked === true) {
              if (value.id !== 0 && ((value.metal_weight === '' || value.metal_weight === null) || (value.retail_price === '' || value.retail_price === null))) {
                const data = {
                  "id": value?.id,
                  "id_size": value?.id_size ? value?.id_size : null,
                  "id_length": value?.id_length ? value?.id_length : null,
                  "id_metal": value?.id_metal ? value?.id_metal : null,
                  "id_karat": value?.id_karat ? value?.id_karat : null,
                  "quantity": value?.quantity ? value?.quantity : null,
                  "side_dia_weight": value?.side_dia_weight ? value?.side_dia_weight : null,
                  "side_dia_count": value?.side_dia_count ? value?.side_dia_count : null,
                  "id_metal_tone": value?.id_metal_tone ? value?.id_metal_tone : null,
                  "metal_weight": value?.metal_weight,
                  "retail_price": value?.retail_price,
                  "compare_price": value?.compare_price ? value?.compare_price : null,
                  "is_deleted": "1"
                }

                return data
              } else if (value.id === 0 && (value.metal_weight != null && value.metal_weight != '') && (value.retail_price != null && value.retail_price != '')) {
                const data = {
                  "id": value?.id,
                  "id_size": value?.id_size ? value?.id_size : null,
                  "id_length": value?.id_length ? value?.id_length : null,
                  "id_metal": value?.id_metal ? value?.id_metal : null,
                  "id_karat": value?.id_karat ? value?.id_karat : null,
                  "quantity": value?.quantity ? value?.quantity : null,
                  "side_dia_weight": value?.side_dia_weight ? value?.side_dia_weight : null,
                  "side_dia_count": value?.side_dia_count ? value?.side_dia_count : null,
                  "id_metal_tone": value?.id_metal_tone ? value?.id_metal_tone : null,
                  "metal_weight": value?.metal_weight ? value?.metal_weight : null,
                  "retail_price": value?.retail_price ? value?.retail_price : null,
                  "compare_price": value?.compare_price ? value?.compare_price : null,
                  "is_deleted": "0"
                }

                return data
              } else if (value.id !== 0 && (value.metal_weight !== '' || value.metal_weight !== null) || (value.retail_price !== '' || value.retail_price !== null)) {
                const data = {
                  "id": value?.id,
                  "id_size": value?.id_size ? value?.id_size : null,
                  "id_length": value?.id_length ? value?.id_length : null,
                  "id_metal": value?.id_metal ? value?.id_metal : null,
                  "id_karat": value?.id_karat ? value?.id_karat : null,
                  "quantity": value?.quantity ? value?.quantity : null,
                  "side_dia_weight": value?.side_dia_weight ? value?.side_dia_weight : null,
                  "side_dia_count": value?.side_dia_count ? value?.side_dia_count : null,
                  "id_metal_tone": value?.id_metal_tone ? value?.id_metal_tone : null,
                  "metal_weight": value?.metal_weight ? value?.metal_weight : null,
                  "retail_price": value?.retail_price ? value?.retail_price : null,
                  "compare_price": value?.compare_price ? value?.compare_price : null,
                  "is_deleted": "0"
                }

                return data
              }
            }
          })
          if (withOutvariant && withOutvariant.length === 1 && withOutvariant[0].id != 0) {
            metalDataDetail.push({ ...withOutvariant[0], is_deleted: "1" })
          }
          const payload1 = {
            "id_product": productId,
            "title": productName,
            "sku": productSKU,
            "Short_Description": productSortDes,
            "long_description": editerData,
            "tag": keyword.map((id) => id.id)[0] != null ? keyword.map((id) => id.id) : null,
            "gender": gender.map((id) => id.id)[0] == null ? false : gender.map((id) => id.id),
            "id_brand": brandType ? brandType : null,
            "discount_type": discountType,
            "discount_value": discountValue,
            "collection": collectionName.map((id) => id.id)[0] != null ? collectionName.map((id) => id.id) : [],
            "product_categories": inputFields.map((value) => {
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
            "making_charge": marketingCharge ? marketingCharge : 0,
            "finding_charge": findingCharge ? findingCharge : 0,
            "other_charge": otherCharge ? otherCharge : 0
          }

          let payload = {}

          payload = {
            "is_quantity_track": quntityTrackChecked,
            "quantity": quntityValue,
            "retail_price": retailPriceValue,
            "compare_price": comparePriceValue,
            "settingStyleType": settingType.map((id) => id.id)[0] == null ? false : settingType.map((id) => id.id),
            "size": itemSize.map((value) => value.id)[0] == null ? [] : itemSize.map((value) => value.id),
            "product_type": inputFieldGoldMetal && inputFieldGoldMetal[0].compare_price == null || inputFieldGoldMetal[0].compare_price == undefined && inputFieldGoldMetal[0].retail_price == null || inputFieldGoldMetal[0].retail_price == undefined ? 1 : 2,
            "length": itemLength.map((value) => value.id)[0] == null ? [] : itemLength.map((value) => value.id),
            "product_metal_options": variantChecked === true ? metalDataDetail.filter((value: any) => value.metal_weight !== null) :
              withOutvariant && withOutvariant.map((value: any) => {
                const data = {
                  "id": value?.id ? value.id : 0,
                  "id_size": value?.id_size ? value?.id_size : null,
                  "id_length": value?.id_length ? value?.id_length : null,
                  "id_metal": value?.id_metal ? value?.id_metal : null,
                  "id_karat": value?.id_karat ? value?.id_karat : null,
                  "quantity": value?.quantity ? value?.quantity : quntityValue,
                  "side_dia_weight": value?.side_dia_weight ? value?.side_dia_weight : null,
                  "side_dia_count": value?.side_dia_count ? value?.side_dia_count : null,
                  "id_metal_tone": value?.id_m_tone ? value?.id_m_tone : null,
                  "metal_weight": metalWeightValue,
                  "retail_price": value?.retail_price ? value?.retail_price : retailPriceValue,
                  "compare_price": value?.compare_price ? value?.compare_price : comparePriceValue,
                  "is_deleted": "0"
                }

                return data
              }),
            "product_diamond_options": inputFieldsDiamond.map((value: any) => {
              const data = {
                "id": value.id,
                "id_type": value.Stone_type,
                "id_setting": value.stone_setting,
                "weight": value.Stone_weight,
                "count": value.stone_count,
                "is_default": value.default,
                "id_stone": value.stone,
                "id_shape": value.stone_shape,
                "id_mm_size": value.stone_mm_size,
                "id_color": value.stone_color,
                "id_clarity": value.stone_clarity,
                "id_cuts": value.stone_cut,
                "is_deleted": value?.is_deleted
              }

              return data
            })

          }

          const finalPayload = {
            ...payload1, ...payload
          }

          const data = await EDIT_VARIANT_PRODUCT_DETAILS(finalPayload);
          if (data.code === 200 || data.code === "200") {
            toast.success(data.message)
            Router.push({ pathname: "/product/all-products" })
          } else {
            toast.error(data.message);
          }

        }
        catch (e: any) {
          toast.error(e.data?.message);
        }
      }
    } else {
      try {
        const metalDataDetail: any[] = inputFieldVariant.map((value: any) => {
          if (variantChecked === true) {
            if (value.id !== 0 && ((value.metal_weight === '' || value.metal_weight === null) || (value.retail_price === '' || value.retail_price === null))) {
              const data = {
                "id": value?.id,
                "id_size": value?.id_size ? value?.id_size : null,
                "id_length": value?.id_length ? value?.id_length : null,
                "id_metal": value?.id_metal ? value?.id_metal : null,
                "id_karat": value?.id_karat ? value?.id_karat : null,
                "quantity": value?.quantity ? value?.quantity : null,
                "side_dia_weight": value?.side_dia_weight ? value?.side_dia_weight : null,
                "side_dia_count": value?.side_dia_count ? value?.side_dia_count : null,
                "id_metal_tone": value?.id_metal_tone ? value?.id_metal_tone : null,
                "metal_weight": value?.metal_weight,
                "retail_price": value?.retail_price,
                "compare_price": value?.compare_price ? value?.compare_price : null,
                "is_deleted": "1"
              }

              return data
            } else if (value.id === 0 && (value.metal_weight != null && value.metal_weight != '') && (value.retail_price != null && value.retail_price != '')) {
              const data = {
                "id": value?.id,
                "id_size": value?.id_size ? value?.id_size : null,
                "id_length": value?.id_length ? value?.id_length : null,
                "id_metal": value?.id_metal ? value?.id_metal : null,
                "id_karat": value?.id_karat ? value?.id_karat : null,
                "quantity": value?.quantity ? value?.quantity : null,
                "side_dia_weight": value?.side_dia_weight ? value?.side_dia_weight : null,
                "side_dia_count": value?.side_dia_count ? value?.side_dia_count : null,
                "id_metal_tone": value?.id_metal_tone ? value?.id_metal_tone : null,
                "metal_weight": value?.metal_weight ? value?.metal_weight : null,
                "retail_price": value?.retail_price ? value?.retail_price : null,
                "compare_price": value?.compare_price ? value?.compare_price : null,
                "is_deleted": "0"
              }

              return data
            } else if (value.id !== 0 && (value.metal_weight !== '' || value.metal_weight !== null) || (value.retail_price !== '' || value.retail_price !== null)) {
              const data = {
                "id": value?.id,
                "id_size": value?.id_size ? value?.id_size : null,
                "id_length": value?.id_length ? value?.id_length : null,
                "id_metal": value?.id_metal ? value?.id_metal : null,
                "id_karat": value?.id_karat ? value?.id_karat : null,
                "quantity": value?.quantity ? value?.quantity : null,
                "side_dia_weight": value?.side_dia_weight ? value?.side_dia_weight : null,
                "side_dia_count": value?.side_dia_count ? value?.side_dia_count : null,
                "id_metal_tone": value?.id_metal_tone ? value?.id_metal_tone : null,
                "metal_weight": value?.metal_weight ? value?.metal_weight : null,
                "retail_price": value?.retail_price ? value?.retail_price : null,
                "compare_price": value?.compare_price ? value?.compare_price : null,
                "is_deleted": "0"
              }

              return data
            }
          }
        })
        if (withOutvariant && withOutvariant.length === 1 && withOutvariant[0].id != 0) {
          metalDataDetail.push({ ...withOutvariant[0], is_deleted: "1" })
        }
        const payload1 = {
          "id_product": productId,
          "title": productName,
          "sku": productSKU,
          "Short_Description": productSortDes,
          "long_description": editerData,
          "tag": keyword.map((id) => id.id)[0] != null ? keyword.map((id) => id.id) : null,
          "gender": gender.map((id) => id.id)[0] == null ? false : gender.map((id) => id.id),
          "id_brand": brandType ? brandType : null,
          "discount_type": discountType,
          "discount_value": discountValue,
          "collection": collectionName.map((id) => id.id)[0] != null ? collectionName.map((id) => id.id) : [],
          "product_categories": inputFields.map((value) => {
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
          "making_charge": marketingCharge ? marketingCharge : 0,
          "finding_charge": findingCharge ? findingCharge : 0,
          "other_charge": otherCharge ? otherCharge : 0
        }

        let payload = {}

        payload = {
          "is_quantity_track": quntityTrackChecked,
          "quantity": quntityValue,
          "retail_price": retailPriceValue,
          "compare_price": comparePriceValue,
          "settingStyleType": settingType.map((id) => id.id)[0] == null ? false : settingType.map((id) => id.id),
          "size": itemSize.map((value) => value.id)[0] == null ? [] : itemSize.map((value) => value.id),
          "product_type": inputFieldGoldMetal && inputFieldGoldMetal[0].compare_price == null || inputFieldGoldMetal[0].compare_price == undefined && inputFieldGoldMetal[0].retail_price == null || inputFieldGoldMetal[0].retail_price == undefined ? 1 : 2,
          "length": itemLength.map((value) => value.id)[0] == null ? [] : itemLength.map((value) => value.id),
          "product_metal_options": variantChecked === true ? metalDataDetail.filter((value: any) => value.metal_weight !== null) :
            withOutvariant && withOutvariant.map((value: any) => {
              const data = {
                "id": value?.id ? value.id : 0,
                "id_size": value?.id_size ? value?.id_size : null,
                "id_length": value?.id_length ? value?.id_length : null,
                "id_metal": value?.id_metal ? value?.id_metal : null,
                "id_karat": value?.id_karat ? value?.id_karat : null,
                "quantity": value?.quantity ? value?.quantity : quntityValue,
                "side_dia_weight": value?.side_dia_weight ? value?.side_dia_weight : null,
                "side_dia_count": value?.side_dia_count ? value?.side_dia_count : null,
                "id_metal_tone": value?.id_m_tone ? value?.id_m_tone : null,
                "metal_weight": metalWeightValue,
                "retail_price": value?.retail_price ? value?.retail_price : retailPriceValue,
                "compare_price": value?.compare_price ? value?.compare_price : comparePriceValue,
                "is_deleted": "0"
              }

              return data
            }),
          "product_diamond_options": inputFieldsDiamond.map((value: any) => {
            const data = {
              "id": value.id,
              "id_type": value.Stone_type,
              "id_setting": value.stone_setting,
              "weight": value.Stone_weight,
              "count": value.stone_count,
              "is_default": value.default,
              "id_stone": value.stone,
              "id_shape": value.stone_shape,
              "id_mm_size": value.stone_mm_size,
              "id_color": value.stone_color,
              "id_clarity": value.stone_clarity,
              "id_cuts": value.stone_cut,
              "is_deleted": value?.is_deleted
            }

            return data
          })

        }

        const finalPayload = {
          ...payload1, ...payload
        }

        const data = await EDIT_VARIANT_PRODUCT_DETAILS(finalPayload);
        if (data.code === 200 || data.code === "200") {
          toast.success(data.message)
          Router.push({ pathname: "/product/all-products" })
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
    if (steps[1].title === "Gold & Diamonds Details") {
      scrollTop()
    }
    if (editerData) {
      setEdit(editerData)
    }
    if (!productName || !productSKU || errorData === true || !productSortDes || keyword.length === 0) {
      const productNameError = productName.trim() ? '' : 'Product name is required';
      const productSkuError = productSKU.trim() ? '' : 'Product sku is required';
      const sortDesError = productSortDes.trim() ? '' : 'Sort description is required';
      const longDesError = errorData === false ? '' : 'Long description is required';
      const keyWordError = keyword.length !== 0 ? '' : 'Keyword is required';
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
          keyWordError: keyWordError
        }
      }));
    } else if (productSizeLenghtFilter == null) {
      toast.error("please select category")
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
    setMarketingCharge(0)
    setCategorysList([])
    setKeyword([{ id: null, name: "" }])
    setGender([{ id: null, name: "" }])
    inputFields.map((value) => value.category = null)
    inputFields.map((value) => value.subCategory = null)
    inputFields.map((value) => value.subSubCategory = null)
    setSettingType([{ id: null, name: "" }])
    setItemLength([{ id: null, length: "" }])
    setItemSize([{ id: null, size: "" }])
    inputFieldsGold.map((value) => value.metalGroup = "")
    inputFieldsGold.map((value) => value.weight = "")
    inputFieldsDiamond.map((value: any) => {
      value.diamondGroup = null
      value.Stone_type = null
      value.Stone_weight = 0
      value.stone_setting = null
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

    setFindingCharge(0)
    setOtherCharge(0)
    setActiveStep(0)
    setCheckedSize(false)
    setCheckedLength(false)
  }

  // Handle repited
  const addFields = () => {
    const categoryData = categorysList.filter((t: any) => t.parent_id === null)
    const newfield = { c_id: 0, category: null, subCategory: null, subSubCategory: null, categoryList: categoryData, subCategoryList: [], subSubCategoryList: [], id: 0, isDeleted: 0 }
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
      d_id: dataLength, default: '0', diamondGroup: null, Stone_type: null,
      Stone_weight: 0, stone_cut: null, stone_color: null, stone_clarity: null, stone_shape: null, stone: null,
      stone_count: 0, stone_setting: null, stone_mm_size: null,
      id: 0, is_deleted: '0'
    }
    const data = [...inputFieldsDiamond, newfield]
    setInputFieldsDiamond(data)
    setCount(data.length)
  }

  const removeFields = (index: any) => {
    const data = [...inputFields]
    data.splice(index, 1)
    setInputFields(data)
  }

  const removeGoldSettingFields = (index: any) => {

    const data = [...inputFieldsGold]
    data.splice(index, 1)
    setInputFieldsGold(data)
  }

  const removeEditDiamondSettingFields = (data: any) => {
    setInputFieldsDiamond(data)
  }

  const removeDiamondSettingFields = (data: any, index: any) => {
    const finalData = [...inputFieldsDiamond]
    finalData.splice(index, 1)
    setInputFieldsDiamond(finalData)
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

  useEffect(() => {
    if (action == 'view') {
      setIsDisabled(true)
    } else {
      setIsDisabled(false)
    }
  }, [action])

  // ***** SIZE/LENGTH/KARAT/METALTONE Combination

  useEffect(() => {
    const combinations: any = [];
    const metalArrayData: any = [];
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

    if (itemSize) {
      for (const sizeData of itemSize) {
        for (const karatData of metalArrayData) {
          if (karatData.karat_id) {
            for (const metalToneData of metalToneList) {
              const finalSizeData = finalInputVariant.find((value: any) => value.id_metal === karatData.metal_id && value.id_karat == karatData.karat_id && value.id_m_tone == metalToneData.id && value.id_size == sizeData?.id)
              combinations.push({
                id: finalSizeData && finalSizeData != undefined && finalSizeData.id ? finalSizeData.id : 0,
                id_metal: finalSizeData && finalSizeData != undefined && finalSizeData.id_metal ? finalSizeData.id_metal : karatData.metal_id,
                id_karat: karatData.karat_id,
                id_size: sizeData?.id,
                size: sizeData,
                metal: karatData.name,
                karat: karatData.karat ? karatData.karat : karatData.name,
                id_metal_tone: finalSizeData && finalSizeData != undefined && finalSizeData.id_m_tone ? finalSizeData.id_m_tone : metalToneData.id,
                metal_tone: metalToneData,
                quantity: finalSizeData && finalSizeData != undefined && finalSizeData.quantity ? finalSizeData.quantity : quntityValue,
                metal_weight: finalSizeData && finalSizeData != undefined && finalSizeData.metal_weight ? finalSizeData.metal_weight : null,
                side_dia_weight: finalSizeData && finalSizeData != undefined && finalSizeData.side_dia_weight ? finalSizeData.side_dia_weight : null,
                side_dia_count: finalSizeData && finalSizeData != undefined && finalSizeData.side_dia_count ? finalSizeData.side_dia_count : null,
                retail_price: finalSizeData && finalSizeData != undefined && finalSizeData.retail_price ? finalSizeData.retail_price : retailPriceValue,
                compare_price: finalSizeData && finalSizeData != undefined && finalSizeData.compare_price ? finalSizeData.compare_price : comparePriceValue
              });
            }

          } else if (karatData.metal_id === parseInt(MEATL_SILVER_ID.toString())) {
            for (const metalToneData of silverToneList) {
              const finalSizeData = finalInputVariant.find((value: any) => value.id_metal === karatData.metal_id && value.id_karat == karatData.karat_id && value.id_m_tone == metalToneData.id && value.id_size == sizeData?.id)
              combinations.push({
                id: finalSizeData && finalSizeData != undefined && finalSizeData.id ? finalSizeData.id : 0,
                id_metal: finalSizeData && finalSizeData != undefined && finalSizeData.id_metal ? finalSizeData.id_metal : karatData.metal_id,
                id_karat: karatData.karat_id,
                id_size: sizeData?.id,
                size: sizeData,
                metal: karatData.name,
                karat: karatData.karat ? karatData.karat : karatData.name,
                id_metal_tone: finalSizeData && finalSizeData != undefined && finalSizeData.id_m_tone ? finalSizeData.id_m_tone : metalToneData.id,
                metal_tone: metalToneData,
                quantity: finalSizeData && finalSizeData != undefined && finalSizeData.quantity ? finalSizeData.quantity : quntityValue,
                metal_weight: finalSizeData && finalSizeData != undefined && finalSizeData.metal_weight ? finalSizeData.metal_weight : null,
                side_dia_weight: finalSizeData && finalSizeData != undefined && finalSizeData.side_dia_weight ? finalSizeData.side_dia_weight : null,
                side_dia_count: finalSizeData && finalSizeData != undefined && finalSizeData.side_dia_count ? finalSizeData.side_dia_count : null,
                retail_price: finalSizeData && finalSizeData != undefined && finalSizeData.retail_price ? finalSizeData.retail_price : retailPriceValue,
                compare_price: finalSizeData && finalSizeData != undefined && finalSizeData.compare_price ? finalSizeData.compare_price : comparePriceValue
              });
            }
          }
          else if (karatData.metal_id === parseInt(MEATL_PLATINUM_ID.toString())) {
            for (const metalToneData of paltinumToneList) {
              const finalSizeData = finalInputVariant.find((value: any) => value.id_metal === karatData.metal_id && value.id_karat == karatData.karat_id && value.id_m_tone == metalToneData.id && value.id_size == sizeData?.id)
              combinations.push({
                id: finalSizeData && finalSizeData != undefined && finalSizeData.id ? finalSizeData.id : 0,
                id_metal: finalSizeData && finalSizeData != undefined && finalSizeData.id_metal ? finalSizeData.id_metal : karatData.metal_id,
                id_karat: karatData.karat_id,
                id_size: sizeData?.id,
                size: sizeData,
                metal: karatData.name,
                karat: karatData.karat ? karatData.karat : karatData.name,
                id_metal_tone: finalSizeData && finalSizeData != undefined && finalSizeData.id_m_tone ? finalSizeData.id_m_tone : metalToneData.id,
                metal_tone: metalToneData,
                quantity: finalSizeData && finalSizeData != undefined && finalSizeData.quantity ? finalSizeData.quantity : quntityValue,
                metal_weight: finalSizeData && finalSizeData != undefined && finalSizeData.metal_weight ? finalSizeData.metal_weight : null,
                side_dia_weight: finalSizeData && finalSizeData != undefined && finalSizeData.side_dia_weight ? finalSizeData.side_dia_weight : null,
                side_dia_count: finalSizeData && finalSizeData != undefined && finalSizeData.side_dia_count ? finalSizeData.side_dia_count : null,
                retail_price: finalSizeData && finalSizeData != undefined && finalSizeData.retail_price ? finalSizeData.retail_price : retailPriceValue,
                compare_price: finalSizeData && finalSizeData != undefined && finalSizeData.compare_price ? finalSizeData.compare_price : comparePriceValue
              });
            }
          }

        }
      }
    }
    if (itemLength) {
      for (const lengthData of itemLength) {
        for (const karatData of metalArrayData) {
          if (karatData.karat_id) {
            for (const metalToneData of metalToneList) {
              const finalLengthData = finalInputVariant.find((value: any) => value.id_metal === karatData.metal_id && value.id_karat == karatData.karat_id && value.id_m_tone == metalToneData.id && value.id_length == lengthData?.id)
              combinations.push({
                id: finalLengthData && finalLengthData != undefined && finalLengthData.id ? finalLengthData.id : 0,
                id_metal: finalLengthData && finalLengthData != undefined && finalLengthData.id_metal ? finalLengthData.id_metal : karatData.metal_id,
                id_karat: karatData.karat_id,
                id_length: lengthData?.id,
                length: lengthData,
                metal: karatData.name,
                karat: karatData.karat ? karatData.karat : karatData.name,
                id_metal_tone: finalLengthData && finalLengthData != undefined && finalLengthData.id_m_tone ? finalLengthData.id_m_tone : metalToneData.id,
                metal_tone: metalToneData,
                quantity: finalLengthData && finalLengthData != undefined && finalLengthData.quantity ? finalLengthData.quantity : quntityValue,
                metal_weight: finalLengthData && finalLengthData != undefined && finalLengthData.metal_weight ? finalLengthData.metal_weight : null,
                side_dia_weight: finalLengthData && finalLengthData != undefined && finalLengthData.side_dia_weight ? finalLengthData.side_dia_weight : null,
                side_dia_count: finalLengthData && finalLengthData != undefined && finalLengthData.side_dia_count ? finalLengthData.side_dia_count : null,
                retail_price: finalLengthData && finalLengthData != undefined && finalLengthData.retail_price ? finalLengthData.retail_price : retailPriceValue,
                compare_price: finalLengthData && finalLengthData != undefined && finalLengthData.compare_price ? finalLengthData.compare_price : comparePriceValue
              })
            }
          } else if (karatData.metal_id === parseInt(MEATL_SILVER_ID.toString())) {
            for (const metalToneData of silverToneList) {
              const finalLengthData = finalInputVariant.find((value: any) => value.id_metal === karatData.metal_id && value.id_karat == karatData.karat_id && value.id_m_tone == metalToneData.id && value.id_length == lengthData?.id)
              combinations.push({
                id: finalLengthData && finalLengthData != undefined && finalLengthData.id ? finalLengthData.id : 0,
                id_metal: finalLengthData && finalLengthData != undefined && finalLengthData.id_metal ? finalLengthData.id_metal : karatData.metal_id,
                id_karat: karatData.karat_id,
                id_length: lengthData?.id,
                length: lengthData,
                metal: karatData.name,
                karat: karatData.karat ? karatData.karat : karatData.name,
                id_metal_tone: finalLengthData && finalLengthData != undefined && finalLengthData.id_m_tone ? finalLengthData.id_m_tone : metalToneData.id,
                metal_tone: metalToneData,
                quantity: finalLengthData && finalLengthData != undefined && finalLengthData.quantity ? finalLengthData.quantity : quntityValue,
                metal_weight: finalLengthData && finalLengthData != undefined && finalLengthData.metal_weight ? finalLengthData.metal_weight : null,
                side_dia_weight: finalLengthData && finalLengthData != undefined && finalLengthData.side_dia_weight ? finalLengthData.side_dia_weight : null,
                side_dia_count: finalLengthData && finalLengthData != undefined && finalLengthData.side_dia_count ? finalLengthData.side_dia_count : null,
                retail_price: finalLengthData && finalLengthData != undefined && finalLengthData.retail_price ? finalLengthData.retail_price : retailPriceValue,
                compare_price: finalLengthData && finalLengthData != undefined && finalLengthData.compare_price ? finalLengthData.compare_price : comparePriceValue
              });
            }
          } else if (karatData.metal_id === parseInt(MEATL_PLATINUM_ID.toString())) {
            for (const metalToneData of paltinumToneList) {
              const finalLengthData = finalInputVariant.find((value: any) => value.id_metal === karatData.metal_id && value.id_karat == karatData.karat_id && value.id_m_tone == metalToneData.id && value.id_length == lengthData?.id)
              combinations.push({
                id: finalLengthData && finalLengthData != undefined && finalLengthData.id ? finalLengthData.id : 0,
                id_metal: finalLengthData && finalLengthData != undefined && finalLengthData.id_metal ? finalLengthData.id_metal : karatData.metal_id,
                id_karat: karatData.karat_id,
                id_length: lengthData?.id,
                length: lengthData,
                metal: karatData.name,
                karat: karatData.karat ? karatData.karat : karatData.name,
                id_metal_tone: finalLengthData && finalLengthData != undefined && finalLengthData.id_m_tone ? finalLengthData.id_m_tone : metalToneData.id,
                metal_tone: metalToneData,
                quantity: finalLengthData && finalLengthData != undefined && finalLengthData.quantity ? finalLengthData.quantity : quntityValue,
                metal_weight: finalLengthData && finalLengthData != undefined && finalLengthData.metal_weight ? finalLengthData.metal_weight : null,
                side_dia_weight: finalLengthData && finalLengthData != undefined && finalLengthData.side_dia_weight ? finalLengthData.side_dia_weight : null,
                side_dia_count: finalLengthData && finalLengthData != undefined && finalLengthData.side_dia_count ? finalLengthData.side_dia_count : null,
                retail_price: finalLengthData && finalLengthData != undefined && finalLengthData.retail_price ? finalLengthData.retail_price : retailPriceValue,
                compare_price: finalLengthData && finalLengthData != undefined && finalLengthData.compare_price ? finalLengthData.compare_price : comparePriceValue
              });
            }
          }
        }
      }
    }
    if (itemLength.length === 0 && itemSize.length === 0) {
      for (const karatData of metalArrayData) {
        if (karatData.karat_id) {
          for (const metalToneData of metalToneList) {
            const finalData = finalInputVariant.find((value: any) => value.id_metal === karatData.metal_id && value.id_karat == karatData.karat_id && value.id_m_tone == metalToneData.id)
            combinations.push({
              id: finalData && finalData != undefined && finalData.id ? finalData.id : 0,
              id_metal: finalData && finalData != undefined && finalData.id_metal ? finalData.id_metal : karatData.metal_id,
              id_karat: karatData.karat_id,
              metal: karatData.name,
              karat: karatData.karat ? karatData.karat : karatData.name,
              id_metal_tone: finalData && finalData != undefined && finalData.id_m_tone ? finalData.id_m_tone : metalToneData.id,
              metal_tone: metalToneData,
              quantity: finalData && finalData != undefined && finalData.quantity ? finalData.quantity : quntityValue,
              metal_weight: finalData && finalData != undefined && finalData.metal_weight ? finalData.metal_weight : null,
              side_dia_weight: finalData && finalData != undefined && finalData.side_dia_weight ? finalData.side_dia_weight : null,
              side_dia_count: finalData && finalData != undefined && finalData.side_dia_count ? finalData.side_dia_count : null,
              retail_price: finalData && finalData != undefined && finalData.retail_price ? finalData.retail_price : retailPriceValue,
              compare_price: finalData && finalData != undefined && finalData.compare_price ? finalData.compare_price : comparePriceValue
            });
          }
        } else if (karatData.metal_id === parseInt(MEATL_SILVER_ID.toString())) {
          for (const metalToneData of silverToneList) {
            const finalData = finalInputVariant.find((value: any) => value.id_metal === karatData.metal_id && value.id_karat == karatData.karat_id && value.id_m_tone == metalToneData.id)
            combinations.push({
              id: finalData && finalData != undefined && finalData.id ? finalData.id : 0,
              id_metal: finalData && finalData != undefined && finalData.id_metal ? finalData.id_metal : karatData.metal_id,
              id_karat: karatData.karat_id,
              metal: karatData.name,
              karat: karatData.karat ? karatData.karat : karatData.name,
              id_metal_tone: finalData && finalData != undefined && finalData.id_m_tone ? finalData.id_m_tone : metalToneData.id,
              metal_tone: metalToneData,
              quantity: finalData && finalData != undefined && finalData.quantity ? finalData.quantity : quntityValue,
              metal_weight: finalData && finalData != undefined && finalData.metal_weight ? finalData.metal_weight : null,
              side_dia_weight: finalData && finalData != undefined && finalData.side_dia_weight ? finalData.side_dia_weight : null,
              side_dia_count: finalData && finalData != undefined && finalData.side_dia_count ? finalData.side_dia_count : null,
              retail_price: finalData && finalData != undefined && finalData.retail_price ? finalData.retail_price : retailPriceValue,
              compare_price: finalData && finalData != undefined && finalData.compare_price ? finalData.compare_price : comparePriceValue
            });
          }
        } else if (karatData.metal_id === parseInt(MEATL_PLATINUM_ID.toString())) {
          for (const metalToneData of paltinumToneList) {
            const finalData = finalInputVariant.find((value: any) => value.id_metal === karatData.metal_id && value.id_karat == karatData.karat_id && value.id_m_tone == metalToneData.id)
            combinations.push({
              id: finalData && finalData != undefined && finalData.id ? finalData.id : 0,
              id_metal: finalData && finalData != undefined && finalData.id_metal ? finalData.id_metal : karatData.metal_id,
              id_karat: karatData.karat_id,
              metal: karatData.name,
              karat: karatData.karat ? karatData.karat : karatData.name,
              id_metal_tone: finalData && finalData != undefined && finalData.id_m_tone ? finalData.id_m_tone : metalToneData.id,
              metal_tone: metalToneData,
              quantity: finalData && finalData != undefined && finalData.quantity ? finalData.quantity : quntityValue,
              metal_weight: finalData && finalData != undefined && finalData.metal_weight ? finalData.metal_weight : null,
              side_dia_weight: finalData && finalData != undefined && finalData.side_dia_weight ? finalData.side_dia_weight : null,
              side_dia_count: finalData && finalData != undefined && finalData.side_dia_count ? finalData.side_dia_count : null,
              retail_price: finalData && finalData != undefined && finalData.retail_price ? finalData.retail_price : retailPriceValue,
              compare_price: finalData && finalData != undefined && finalData.compare_price ? finalData.compare_price : comparePriceValue
            });
          }
        }
      }
    }
    setInputFieldVariant(combinations)
  }, [finalInputVariant, itemSize, metalKaratList, metalToneList, quntityValue, retailPriceValue, comparePriceValue, itemLength, metalGroupList, silverToneList, paltinumToneList])
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Fragment>
            <Grid item xs={12} sm={6}>
              <TccInput
                error={!productSKU && formErrorData.errors.sku ? true : false}
                InputProps={isDisabled}
                fullWidth
                label='Product SKU'
                value={productSKU}
                placeholder='ZG011AQA'
                onChange={(e: any) => setProductSKU(e.target.value)}
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
                error={!productSortDes && formErrorData.errors.sortDescription ? true : false}
                InputProps={isDisabled}
                fullWidth
                type='text'
                label='Product Short Description'
                value={productSortDes}
                placeholder=''
                onChange={(e: any) => setProductSortDes(e.target.value)}
              />
              {!productSortDes && formErrorData.errors.sortDescription && <FormHelperText sx={{ color: 'error.main' }}>{formErrorData.errors.sortDescription}</FormHelperText>}

            </Grid>
            <Grid item xs={12} sm={12}>
              <Typography sx={{ mb: 1, color: "gray" }}>Product Long Description</Typography>
              <TccEditor wrapperClassName={errorData === true && formErrorData.errors.longDescription ? "demo-wrapper" : 'editor-validaton-wrapper'} getHtmlData={setEditerData} data={edit} called={called} errorData={setErrorData} readOnly={isDisabled} />
              {errorData === true && formErrorData.errors.longDescription && <FormHelperText sx={{ color: 'error.main' }}>{formErrorData.errors.longDescription}</FormHelperText>}
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
                renderInput={(params: any) =>
                  <TextField {...params}
                    error={errorKeyWord}
                    label='Keywords'
                  />}
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
            <Grid item xs={12} sm={6}>
              <TccSelect
                fullWidth
                InputProps={isDisabled}
                inputLabel="Select Brand"
                label='Select Brand'
                value={brandType}
                id='controlled-select'
                onChange={(e: any) => setBrandType(e.target.value)}
                title='name'
                Options={brandList}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                readOnly={isDisabled}
                fullWidth
                multiple
                options={collectionList}
                value={collectionName}
                onChange={(event, newItem) => {
                  setCollectionName(newItem)
                }}
                filterSelectedOptions
                size='small'
                id='autocomplete-multiple-outlined'
                getOptionLabel={(option: any) => option.name}
                renderInput={(params: any) => <TextField {...params} label='Collection Name' />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TccSelect
                sx={{ mb: 4 }}
                fullWidth
                InputProps={isDisabled}
                inputLabel="Discount Type"
                label='Discount Type'
                value={discountType}
                id='controlled-select'
                onChange={handleChangeDiscountType}
                title='name'
                Options={discountTypeData}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TccInput
                InputProps={isDisabled}
                fullWidth
                type='number'
                label='Discount Value'
                value={discountValue || ""}
                placeholder=''
                onChange={(e: any) =>
                  setDiscountValue(e.target.value)
                }
              />
            </Grid>
            {inputFields.map((input, index) => {
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
                        const data = [...inputFields]
                        data[index].category = e.target.value
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
                        data[index].subCategoryList = subCategoryData
                        data[index].subCategory = null
                        data[index].subSubCategory = null
                        data[index].subSubCategoryList = []
                        setInputFields(data)
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
                        const data = [...inputFields]
                        data[index].subCategory = e.target.value
                        const subSubCategoryData = categorysList.filter((t: any) =>
                          t.parent_id === e.target.value
                        )
                        data[index].subSubCategory = null
                        data[index].subSubCategoryList = subSubCategoryData
                        setInputFields(data)
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
                        const data = [...inputFields]
                        data[index].subSubCategory = e.target.value
                        setInputFields(data)
                      }}
                      Options={input.subSubCategoryList}
                    />
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <Button fullWidth
                      variant='outlined'
                      color='secondary'
                      disabled={isDisabled ? true : false}
                      onClick={() => removeFields(index)}>
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

            <Grid item xs={12} sm={12} sx={{ display: "flex", justifyContent: "space-between" }}>
              <TccInput
                InputProps={isDisabled}
                type='number'
                label='Labor charges'
                value={marketingCharge}
                placeholder=''
                onChange={(e: any) => setMarketingCharge(e.target.value)}
              />
              <TccInput
                InputProps={isDisabled}
                type='number'
                label='Finding Charge'
                value={findingCharge}
                placeholder=''
                onChange={(e: any) => setFindingCharge(e.target.value)}
              />
              <TccInput
                InputProps={isDisabled}
                type='number'
                label='Other Charge'
                value={otherCharge}
                placeholder=''
                onChange={(e: any) => setOtherCharge(e.target.value)}
              />
            </Grid>

          </Fragment >
        )
      case 1:

        return (
          <>
            <Fragment key={"SET_" + step}>
              <Grid item xs={12} sm={6}>
                {category && category.is_setting_style === "1" ?
                  <Autocomplete
                    readOnly={isDisabled}
                    fullWidth
                    multiple
                    options={settingTypeList}
                    value={settingType}
                    onChange={(event, newItem) => {
                      setSettingType(newItem)
                    }}
                    filterSelectedOptions
                    size='small'
                    id='autocomplete-multiple-outlined'
                    getOptionLabel={(option: any) => option.name}
                    renderInput={(params: any) => <TextField {...params} label='Setting Type' />}
                  />
                  : <></>}
              </Grid>
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
                {category && category.is_length === "1" ?
                  <Autocomplete
                    sx={{ mt: 5 }}
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
                <FormControlLabel
                  label='Add Variant'
                  control={<Checkbox disabled={isDisabled} checked={variantChecked} onChange={variantHandleChange} name='Add Variant' />}
                />
                <FormControlLabel
                  label='Quantity Track'
                  control={<Checkbox disabled={isDisabled} checked={quntityTrackChecked} onChange={quntityTrackHandleChange} name='Add Variant' />}
                />
                <Box sx={{ display: 'flex', marginTop: '20px' }}>
                  <TccInput
                    type='number'
                    InputProps={isDisabled}
                    label='Quntity'
                    value={quntityValue}
                    onChange={(e: any) => {
                      const newData = finalInputVariant.map((item: any) => {
                        return {
                          ...item,
                          quantity: e.target.value
                        };
                      });
                      setFinalInputVariant(newData)
                      setQuntityValue(e.target.value)

                    }}
                    placeholder=''
                  />
                  {!variantChecked &&
                    <div style={{ marginLeft: "22px" }}>
                      <TccInput
                        type='number'
                        InputProps={isDisabled}
                        label='Metal Weight'
                        value={metalWeightValue}
                        onChange={(e: any) => setMetalWeightValue(e.target.value)}
                        placeholder=''
                      />
                    </div>}
                  <div style={{ marginLeft: "22px" }}>
                    <TccInput
                      type='number'
                      InputProps={isDisabled}
                      label='Final Retail Price'
                      value={retailPriceValue}
                      onChange={(e: any) => {
                        setRetailPriceValue(e.target.value)
                        const newData = finalInputVariant.map((item: any) => {
                          return {
                            ...item,
                            retail_price: e.target.value
                          };
                        });
                        setFinalInputVariant(newData)
                      }}
                      placeholder=''
                    />
                  </div>
                  <div style={{ marginLeft: "22px" }}>
                    <TccInput
                      type='number'
                      InputProps={isDisabled}
                      label='Final Compare Price'
                      value={comparePriceValue}
                      onChange={(e: any) => {
                        setComparePriceValue(e.target.value)
                        const newData = finalInputVariant.map((item: any) => {
                          return {
                            ...item,
                            compare_price: e.target.value
                          };
                        });
                        setFinalInputVariant(newData)
                      }}
                      placeholder=''
                    />
                  </div>
                </Box>
                {variantChecked &&
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
                      }, maxHeight: 350
                    }}>
                      <Table stickyHeader aria-label='sticky table'>
                        <TableHead>
                          <TableRow>
                            {itemSize.length !== 0 && <TableCell align='center' sx={{ minWidth: 150 }}>Size</TableCell>}
                            {itemLength.length !== 0 && <TableCell align='center' sx={{ minWidth: 150 }}>Length</TableCell>}
                            <TableCell align='center' sx={{ minWidth: 150 }}>Metal</TableCell>
                            <TableCell align='center' sx={{ minWidth: 150 }}>Karat</TableCell>
                            <TableCell align='center' sx={{ minWidth: 270 }}>Metal Tone</TableCell>
                            <TableCell align='center' sx={{ minWidth: 150 }}>Quntity</TableCell>
                            <TableCell align='center' sx={{ minWidth: 270 }}>Metal Weight</TableCell>
                            <TableCell align='center' sx={{ minWidth: 200 }}>Side Diamond Total Weight</TableCell>
                            <TableCell align='center' sx={{ minWidth: 200 }}>Side Diamond Total Count</TableCell>
                            <TableCell align='center' sx={{ minWidth: 150 }}>
                              <div title='All Price Included (Metal price , Side Diamond Price , Center Diamond Price)'>
                                <Icon style={{ position: 'absolute', left: '0px', top: '29px' }} height={20} icon="ion:information-circle-outline"></Icon>
                              </div>
                              Retail Price
                            </TableCell>
                            <TableCell align='center' sx={{ minWidth: 150 }}>Compare Price</TableCell>

                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {inputFieldVariant && inputFieldVariant.map((input: any, index) => {
                            return (
                              <TableRow>
                                {input?.size &&
                                  <TableCell>
                                    <TccInput
                                      disabled
                                      label='Size'
                                      value={input?.size?.size || ""}
                                      onChange={(e: any) => e.target.value}
                                      placeholder=''
                                    />
                                  </TableCell>
                                }
                                {input?.length &&
                                  <TableCell>
                                    <TccInput
                                      disabled
                                      label='Length'
                                      value={input?.length?.length || ""}
                                      onChange={(e: any) => e.target.value}
                                      placeholder=''
                                    />
                                  </TableCell>
                                }
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
                                    type='number'
                                    label='Quntity'
                                    InputProps={isDisabled}
                                    value={input?.quantity ? input?.quantity : "" || ""}
                                    onChange={(e: any) => {
                                      const data = [...inputFieldVariant]
                                      data[index].quantity = e.target.value
                                      if (e.target.value === '') {
                                        data[index].is_deleted = "1"
                                      }
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
                                    InputProps={isDisabled}
                                    label='Side Diamond Weight'
                                    value={input?.side_dia_weight || ""}
                                    onChange={(e: any) => {
                                      const data = [...inputFieldVariant]
                                      data[index].side_dia_weight = e.target.value
                                      setInputFieldVariant(data)
                                    }}
                                    placeholder=''
                                  />
                                </TableCell>
                                <TableCell>
                                  <TccInput
                                    type='number'
                                    InputProps={isDisabled}
                                    label='Side Diamond Count'
                                    value={input?.side_dia_count || ""}
                                    onChange={(e: any) => {
                                      const data = [...inputFieldVariant]
                                      data[index].side_dia_count = e.target.value
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
                                <TableCell>
                                  <TccInput
                                    type='number'
                                    InputProps={isDisabled}
                                    label='Compare price'
                                    value={input?.compare_price || ""}
                                    onChange={(e: any) => {
                                      const data = [...inputFieldVariant]
                                      data[index].compare_price = e.target.value
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
                }
              </Grid>
              <Grid item xs={12} sm={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                  Diamonds Details
                </Typography>
                {action === "view" ? <></> : <Button sx={{ mt: 8 }} variant='contained' onClick={addDiamondSettingFields}>
                  Add Diamond Details
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
                        <TableCell align='center' sx={{ minWidth: 200 }}>Stone</TableCell>
                        <TableCell align='center'>Shape</TableCell>
                        <TableCell align='center'>MM Size</TableCell>
                        <TableCell align='center'>Color</TableCell>
                        <TableCell align='center'>Clarity</TableCell>
                        <TableCell align='center'>Cut</TableCell>
                        <TableCell align='center' sx={{ minWidth: 200 }}>Stone Setting</TableCell>
                        <TableCell align='center' sx={{ minWidth: 170 }}>Stone Weight</TableCell>
                        <TableCell align='center' sx={{ minWidth: 170 }}>Stone Pieces/count</TableCell>
                        <TableCell align='center'>Delete </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {inputFieldsDiamond && inputFieldsDiamond.length !== 0 ? inputFieldsDiamond.filter((t: any) => t.is_deleted == "0").map((input: any, index: any) => {
                        return (
                          <TableRow key={"DIA_" + index}>
                            <TableCell>
                              <TccSelect
                                InputProps={isDisabled}
                                fullWidth
                                size='small'
                                inputLabel="Stone Type"
                                label='stone Type'
                                value={input.Stone_type}
                                id='controlled-select'
                                title='name'
                                onChange={(e: any) => {
                                  const data = [...inputFieldsDiamond]
                                  data[index].Stone_type = e.target.value
                                  const filterData = data.filter((value: any) => value.Stone_type === 1)
                                  filterData.length > 1 ? toast.error("you can only enter the center diamond detail once per product") : ""
                                  data.map((t: any, index: any) => {
                                    if (t.d_id === input.d_id) {
                                      setInputFieldsDiamond(data)
                                    }
                                  })
                                }}
                                Options={stoneTypeList}
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
                                      setInputFieldsDiamond(data)
                                    }
                                  })
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
                                      setInputFieldsDiamond(data)
                                    }
                                  })
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
                                inputLabel="Stone Setting"
                                label='Stone Setting'
                                value={input.stone_setting}
                                id='controlled-select'
                                title='name'
                                onChange={(e: any) => {
                                  const data = [...inputFieldsDiamond]
                                  data.map((t: any, index: any) => {
                                    if (t.d_id === input.d_id) {
                                      data[index].stone_setting = e.target.value
                                    }
                                  })
                                  setInputFieldsDiamond(data)
                                }}
                                Options={settingTypeList}
                              />
                            </TableCell>
                            <TableCell>
                              <TccInput
                                InputProps={isDisabled}
                                disabled={input.Stone_type === 2 ? true : false}
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
                                disabled={input.Stone_type === 2 ? true : false}
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
                              <Button variant='outlined' color='error'
                                disabled={isDisabled ? true : false}
                                onClick={() => {
                                  const data = [...inputFieldsDiamond]
                                  data[index].is_deleted = "1"
                                  productId ? removeEditDiamondSettingFields(data) : removeDiamondSettingFields(data, index)
                                }}
                              >
                                -
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      }) : (
                        <TableRow>
                          <TableCell colSpan={14} sx={{ textAlign: 'center', verticalAlign: 'middle' }}>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                              Data is not available
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
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
              </Typography>
            </Grid>
            {getStepContent(activeStep)}
            <Grid item xs={12} sx={activeStep === 1 ? { display: 'flex', justifyContent: 'space-between' } : { display: 'flex', justifyContent: 'end' }}>
              {activeStep === 1 &&
                <Button
                  variant='outlined'
                  color='secondary'
                  onClick={handleBack}
                >
                  Back
                </Button>
              }
              {activeStep === steps.length - 1 && action == "view" ? <></> : <Button variant='contained' onClick={
                activeStep === 0 ?
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
      <Button variant='contained' sx={{ mr: 3, mb: 4, '& svg': { mr: 2 } }} onClick={() => Router.back()}>
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

export default EditProduct
