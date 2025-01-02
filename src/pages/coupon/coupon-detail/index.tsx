import { Button, Card, CardContent, CardHeader, FormControl, FormHelperText, Grid, TextField, Typography } from "@mui/material";
import { Icon } from '@iconify/react'
import Router, { useRouter } from 'next/router'
import { forwardRef, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { appErrors, FIELD_REQUIRED } from "src/AppConstants";
import TccSelect from "src/customComponents/Form-Elements/select";
import { COUPON_DISCOUNT_TYPE, COUPON_DURATION } from "src/data/enum";
import TccInput from "src/customComponents/Form-Elements/inputField";
import * as yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup";
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";
import DatePicker from 'react-datepicker'
import format from "date-fns/format";
import { ADD_COUPON, EDIT_COUPON, GET_BY_ID_COUPON } from "src/services/AdminServices";
import toast from "react-hot-toast";
import Editor from "src/customComponents/ck-editor";

interface PickerProps {
    label?: string
    end: Date | number
    start: Date | number
}

// ** DISCOUNT TYPE DATA 
const discountTypeData = [
    {
        id: COUPON_DISCOUNT_TYPE.FixedAmountDiscount,
        name: "Fixed Amount Discount"
    },
    {
        id: COUPON_DISCOUNT_TYPE.PercentageDiscount,
        name: 'Percentage Discount'
    },
]

// **  DURATION DATA
const durationData = [
    {
        id: COUPON_DURATION.Once,
        name: "Once"
    },
    {
        id: COUPON_DURATION.Forever,
        name: "Forever"
    },
]

// ** REQUIRED VALUE
const schema = yup.object().shape({
    name: yup.string().required(),
    code: yup.string().required(),
    discount_type: yup.string().required(),
    percentage_off: yup.number()
        .typeError('Must be a number')
        .required('This field is required')
        .min(0, 'Number must be greater than or equal to 0')
        .max(100, 'Number must be less than or equal to 100'),
    duration: yup.string().required(),
    min_total_amount: yup.number()
        .typeError('Must be a number')
        .required('This field is required')
        .min(0, 'Number must be greater than or equal to 0'),
    max_total_amount: yup.number()
        .typeError('Must be a number')
        .required('This field is required')
        .min(0, 'Number must be greater than or equal to 0'),
})

// ** REQUIRED VALUE
const secSchema = yup.object().shape({
    name: yup.string().required(),
    code: yup.string().required(),
    discount_type: yup.string().required(),
    duration: yup.string().required(),
    discount_amount: yup.number()
        .typeError('Must be a number')
        .required('This field is required')
        .min(0, 'Number must be greater than or equal to 0')
        .max(100, 'Number must be less than or equal to 100'),
    discount_amount_currency: yup.string().required(),
    min_total_amount: yup.number()
        .typeError('Must be a number')
        .required('This field is required')
        .min(0, 'Number must be greater than or equal to 0'),
    max_total_amount: yup.number()
        .typeError('Must be a number')
        .required('This field is required')
        .min(0, 'Number must be greater than or equal to 0'),
})

// ** SET DEFAULT VALUES 
const defaultValues = {
    name: '',
    code: '',
    description: '',
    discount_type: '',
    percentage_off: '',
    discount_amount: '',
    discount_amount_currency: '',
    start_date: '',
    end_date: '',
    min_total_amount: '',
    max_total_amount: '',
    duration: ''
}

type DateType = Date | undefined

const CouponDetail = () => {

    // ** STATE
    const [dialogTitle, setDialogTitle] = useState<'Add' | 'Edit'>('Add')
    const [couponData, setCouponData] = useState({
        name: '',
        code: '',
        id_discount_type: '',
        usage_limit: '',
        uses_per_customer: '',
        maximum_discount_amount: '',

    })
    const [editorData, setEditorData] = useState("")
    const [startDate, setStartDate] = useState<DateType>(new Date())
    const [endDate, setEndDate] = useState<DateType>(new Date())
    const [detailId, setDetailId] = useState(0)
    const [data, setData] = useState<boolean>(false)

    // ** Const's
    const router = useRouter();

    const formatDate = (date: any) => {
        if (startDate && endDate) {
            const year = date?.getFullYear();
            const month = String(date?.getMonth() + 1).padStart(2, '0'); // Months are zero-based
            const day = String(date?.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
    };

    const CustomInput = forwardRef((props: PickerProps, ref) => {
        const startDate = props.start !== null ? format(props.start, 'MM/dd/yyyy') : ""
        const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : ""
        const value = `${startDate}${endDate !== null ? endDate : ''}`
        return <TextField
            sx={{ mb: 4 }}
            size='small'
            fullWidth
            inputRef={ref}
            label={props.label || ''} {...props}
            value={value}
        />
    })

    // ** USE FORM 
    const {
        control,
        setValue,
        reset,
        watch,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues,
        resolver: data ? yupResolver(schema) : yupResolver(secSchema)
    })

    const getdiscountTypeData: any = watch('discount_type')
    const getDurationData: any = watch('duration')
    useEffect(() => {
        if (getdiscountTypeData === COUPON_DISCOUNT_TYPE.PercentageDiscount) {
            setData(true)
        } else {
            setData(false)
        }
    }, [getdiscountTypeData, COUPON_DISCOUNT_TYPE])

    // ** HANDLE CHANGES
    const handleOnChange = (dates: any) => {
        const [start, end] = dates
        setStartDate(start)
        setEndDate(end)
    }

    const handleEditorChange = (editor: any) => {
        const data = editor
        setEditorData(data)
    }

    // ** GET ALL API CALL
    const getAllApi = async (id: number) => {
        try {
            const data = await GET_BY_ID_COUPON(id);
            if (data.code === 200 || data.code === "200") {
                setCouponData((prevState: any) => ({
                    ...prevState,
                    "usage_limit": data?.data?.usage_limit,
                    "user_per_customer": data?.data?.user_limits,
                    "percentage_off": data.data.percentage_off,
                    "maximum_discount_amount": data?.data?.maximum_discount_amount,
                }))
                setValue("name", data?.data?.name)
                setValue("code", data?.data?.coupon_code)
                setValue("discount_type", data?.data?.discount_type)
                setEditorData(data?.data?.description)
                setValue("discount_amount", data?.data?.discount_amount)
                setValue("discount_amount_currency", data?.data?.discount_amount_currency)
                setValue("duration", data?.data?.duration)
                setValue("min_total_amount", data?.data?.min_total_amount)
                setValue("max_total_amount", data?.data?.max_total_amount)
                setStartDate(new Date(data?.data?.start_date))
                setEndDate(new Date(data?.data?.end_date))
                setDetailId(parseInt(data?.data?.id))
            } else {
                return toast.error(data.message);
            }
        } catch (e: any) {
            toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN);
        }
        return false;
    }

    useEffect(() => {
        const coupontId = router.asPath.split("/?id=")[1]
        if (coupontId !== undefined) {
            setDialogTitle('Edit')
            getAllApi(parseInt(coupontId))
            setDetailId(parseInt(coupontId))
        } else {
            setDialogTitle('Add')
        }
    }, [router, router.isReady])

    // ** ADD API CALL
    const addApi = async (data: any) => {
        const payload = {
            "name": data.name,
            "description": editorData,
            "coupon_code": data?.code,
            "discount_type": data?.discount_type,
            "percentage_off": data?.percentage_off ? data?.percentage_off : null,
            "discount_amount": data?.discount_amount ? data?.discount_amount : null,
            "discount_amount_currency": data?.discount_amount_currency ? data?.discount_amount_currency : null,
            "duration": data?.duration,
            "usage_limit": parseInt(couponData?.usage_limit),
            "user_limits": parseInt(couponData?.uses_per_customer),
            "start_date": formatDate(startDate),
            "end_date": formatDate(endDate),
            "min_total_amount": data?.min_total_amount ? data?.min_total_amount : null,
            "max_total_amount": data?.max_total_amount ? data?.max_total_amount : null,
            "maximum_discount_amount": couponData?.maximum_discount_amount ? couponData?.maximum_discount_amount : null
        }

        try {
            const data = await ADD_COUPON(payload)
            if (data.code === 200 || data.code === "200") {
                Router.push({ pathname: "/coupon/coupon-list/" })
                toast.success(data.message)

            } else {
                return toast.error(data.message)
            }
        } catch (e: any) {
            toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN, {
                position: "top-center"
            })
        }
        return false
    }

    // ** EDIT API CALL
    const editApi = async (data: any) => {
        const payload = {
            "name": data.name,
            "description": editorData,
            "coupon_code": data?.code,
            "discount_type": data?.discount_type,
            "percentage_off": data?.percentage_off ? data?.percentage_off : null,
            "discount_amount": data?.discount_amount ? data?.discount_amount : null,
            "discount_amount_currency": data?.discount_amount_currency ? data?.discount_amount_currency : null,
            "duration": data?.duration,
            "usage_limit": parseInt(couponData?.usage_limit),
            "user_limits": parseInt(couponData?.uses_per_customer),
            "start_date": formatDate(startDate),
            "end_date": formatDate(endDate),
            "min_total_amount": data?.min_total_amount ? data?.min_total_amount : null,
            "max_total_amount": data?.max_total_amount ? data?.max_total_amount : null,
            "maximum_discount_amount": couponData?.maximum_discount_amount ? couponData?.maximum_discount_amount : null
        }
        try {
            const data = await EDIT_COUPON(detailId, payload)
            if (data.code === 200 || data.code === "200") {
                toast.success(data.message)
                Router.push({ pathname: "/coupon/coupon-list/" })
            } else {
                return toast.error(data.message)
            }
        } catch (e: any) {
            toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN, {
                position: "top-center"
            })
        }
        return false
    }

    // **  ADD / EDIT SUBMIT
    const onSubmit = (data: any) => {
        if (dialogTitle === 'Add') {
            addApi(data)
        } else {
            editApi(data)
        }
    }

    return (
        <>
            <Button variant='contained' sx={{ ml: 1, mb: 4, mt: -2, '& svg': { mr: 2 } }} onClick={() => Router.back()}>
                <Icon icon='material-symbols:arrow-back-rounded' />
                Back
            </Button>
            <Card>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent>
                        <CardHeader sx={{ mt: -5, ml: -5 }} title={`${dialogTitle} Coupon`}></CardHeader>
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                            <Grid item xs={6}>
                                <FormControl fullWidth sx={{ mb: 4 }}>
                                    <Controller
                                        name='name'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }: any) => (
                                            <TextField
                                                size='small'
                                                label='Name'
                                                error={Boolean(errors.name)}
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{FIELD_REQUIRED}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth sx={{ mb: 4 }}>
                                    <Controller
                                        name='code'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }: any) => (
                                            <TextField
                                                size='small'
                                                label='Coupon Code'
                                                error={Boolean(errors.code)}
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.code && <FormHelperText sx={{ color: 'error.main' }}>{FIELD_REQUIRED}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography sx={{ mb: 1 }}>Description</Typography>
                                <Editor
                                    onChange={(value: any) => {
                                        handleEditorChange(value)
                                    }}
                                    value={editorData}
                                    label={"Descrption"}
                                />
                            </Grid>
                            <Grid item xs={6} sx={{ mt: 4 }}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='discount_type'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }: any) => (
                                            <TccSelect
                                                fullWidth
                                                size='small'
                                                inputLabel="Discount Type"
                                                label='Discount Type'
                                                id='controlled-select'
                                                title='name'
                                                Options={discountTypeData}
                                                error={Boolean(errors.discount_type)}
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.discount_type && <FormHelperText sx={{ color: 'error.main' }}>{errors.discount_type.message}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            {getdiscountTypeData === COUPON_DISCOUNT_TYPE.PercentageDiscount ?
                                <Grid item xs={6} sx={{ mt: 4 }}>
                                    <Controller
                                        name='percentage_off'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }: any) => (
                                            <TccInput
                                                fullWidth
                                                sx={{ mb: errors.percentage_off ? 0 : 4 }}
                                                disabled={getdiscountTypeData === COUPON_DISCOUNT_TYPE.PercentageDiscount ? false : true}
                                                label='Percentage Off'
                                                error={Boolean(getdiscountTypeData === COUPON_DISCOUNT_TYPE.PercentageDiscount && errors.percentage_off)}
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.percentage_off && <FormHelperText sx={{ color: 'error.main' }}>{FIELD_REQUIRED}</FormHelperText>}
                                </Grid> : <Grid item xs={6} sx={{ mt: 4 }}>
                                    <FormControl fullWidth>
                                        <Controller
                                            name='discount_amount'
                                            control={control}
                                            render={({ field }: any) => (
                                                <TccInput
                                                    fullWidth
                                                    sx={{ mb: errors.discount_amount ? 0 : 4 }}
                                                    disabled={getdiscountTypeData === COUPON_DISCOUNT_TYPE.FixedAmountDiscount ? false : true}
                                                    label='Discount Amount'
                                                    error={Boolean(getdiscountTypeData === COUPON_DISCOUNT_TYPE.FixedAmountDiscount && errors.discount_amount)}
                                                    {...field}
                                                />
                                            )}
                                        />
                                        {getdiscountTypeData === COUPON_DISCOUNT_TYPE.FixedAmountDiscount && errors.discount_amount && <FormHelperText sx={{ color: 'error.main' }}>{errors.discount_amount.message}</FormHelperText>}
                                    </FormControl>
                                </Grid>}
                            {getdiscountTypeData === COUPON_DISCOUNT_TYPE.FixedAmountDiscount && <Grid item xs={getdiscountTypeData === COUPON_DISCOUNT_TYPE.FixedAmountDiscount ? 4 : 6} sx={{ mb: 4 }}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='discount_amount_currency'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }: any) => (
                                            <TextField
                                                fullWidth
                                                size='small'
                                                disabled={getdiscountTypeData === COUPON_DISCOUNT_TYPE.FixedAmountDiscount ? false : true}
                                                label='Discount Amount Currency'
                                                error={Boolean(getdiscountTypeData === COUPON_DISCOUNT_TYPE.FixedAmountDiscount && errors.discount_amount_currency)}
                                                {...field}
                                            />
                                        )}
                                    />
                                    {getdiscountTypeData === COUPON_DISCOUNT_TYPE.FixedAmountDiscount && errors.discount_amount_currency && <FormHelperText sx={{ color: 'error.main' }}>{errors.discount_amount_currency.message}</FormHelperText>}
                                </FormControl>
                            </Grid>}
                            <Grid item xs={getdiscountTypeData === COUPON_DISCOUNT_TYPE.FixedAmountDiscount ? 4 : 6}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='duration'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }: any) => (
                                            <TccSelect
                                                fullWidth
                                                size='small'
                                                inputLabel="Duration"
                                                label='Duration'
                                                id='controlled-select'
                                                title='name'
                                                Options={durationData}
                                                error={Boolean(errors.duration)}
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.duration && <FormHelperText sx={{ color: 'error.main' }}>{errors.duration.message}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            {getDurationData !== COUPON_DURATION.Once && <Grid item xs={getdiscountTypeData === COUPON_DISCOUNT_TYPE.FixedAmountDiscount ? 4 : 6}>
                                <TccInput
                                    fullWidth
                                    sx={{ mb: 4 }}
                                    value={couponData.usage_limit}
                                    onChange={(e: any) => {
                                        setCouponData(prevState => ({ ...prevState, usage_limit: e.target.value }))
                                    }}
                                    label='Limit Total Number Of Users'
                                />
                            </Grid>}
                            <Grid item xs={getDurationData === COUPON_DURATION.Once && getdiscountTypeData === COUPON_DISCOUNT_TYPE.FixedAmountDiscount ? 4 : 6} sx={{ mt: errors.duration ? 2 : 0 }}>
                                <TccInput
                                    fullWidth
                                    sx={{ mb: 4 }}
                                    value={couponData.uses_per_customer}
                                    onChange={(e: any) => {
                                        setCouponData(prevState => ({ ...prevState, uses_per_customer: e.target.value }))
                                    }}
                                    label='Limit Number Of Uses Per Customer'
                                />
                            </Grid>
                            <Grid item xs={getDurationData === COUPON_DURATION.Once ? 12 : 6} sm={getDurationData === COUPON_DURATION.Once ? 12 : 6} sx={{ mt: errors.duration ? 2 : 0 }}>
                                <DatePickerWrapper>
                                    <DatePicker
                                        selectsRange
                                        endDate={endDate}
                                        selected={startDate}
                                        startDate={startDate}
                                        id='date-range-picker'
                                        onChange={handleOnChange}
                                        shouldCloseOnSelect={true}
                                        customInput={
                                            <CustomInput label='Start Date & End Date' start={startDate as Date | number} end={endDate as Date | number} />
                                        }
                                    />
                                </DatePickerWrapper>
                            </Grid>
                            <Grid item xs={4}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='min_total_amount'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }: any) => (
                                            <TccInput
                                                fullWidth
                                                label='Min total amount'
                                                error={Boolean(errors.min_total_amount)}
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.min_total_amount && <FormHelperText sx={{ color: 'error.main' }}>{errors.min_total_amount.message}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid item xs={4}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='max_total_amount'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }: any) => (
                                            <TccInput
                                                fullWidth
                                                label='Max total amount'
                                                error={Boolean(errors.max_total_amount)}
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.max_total_amount && <FormHelperText sx={{ color: 'error.main' }}>{errors.max_total_amount.message}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid item xs={4}>
                                <TccInput
                                    fullWidth
                                    sx={{ mb: 4 }}
                                    value={couponData.maximum_discount_amount}
                                    onChange={(e: any) => {
                                        setCouponData(prevState => ({ ...prevState, maximum_discount_amount: e.target.value }))
                                    }}
                                    label='Maximum discount amount'
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} sx={{ display: "flex", justifyContent: "end", mt: 4 }}>
                                <Button variant='contained' sx={{ mr: 3 }} type="submit">
                                    {dialogTitle === "Add" ? "SUBMIT" : "EDIT"}
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </form>
            </Card >
        </>
    )
}
export default CouponDetail;