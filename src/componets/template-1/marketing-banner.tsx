// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardHeader from '@mui/material/CardHeader'
import { Box, Button, Divider, Drawer, FormControl, FormHelperText, TextField } from '@mui/material'
import TCCTableHeader from 'src/customComponents/data-table/header'
import TccDataTable from 'src/customComponents/data-table/table'
import { useEffect, useState } from 'react'
import DrawerHeader from 'src/customComponents/components/drawer-header'
import { ICommonPagination } from 'src/data/interface'
import { createPagination } from 'src/utils/sharedFunction'
import { toast } from 'react-hot-toast'
import { appErrors, FIELD_REQUIRED, IMAGE_FIELD_REQUIRED, SEARCH_DELAY_TIME } from 'src/AppConstants'
import TccSingleFileUpload from 'src/customComponents/Form-Elements/file-upload/singleFile-upload'
import DeleteDataModel from 'src/customComponents/delete-model'
import { Controller, useForm } from 'react-hook-form'
import TccInput from 'src/customComponents/Form-Elements/inputField'
import { ADD_MARKETING_BANNER, DELETE_MARKETING_BANNER, EDIT_MARKETING_BANNER, GET_ALL_MARKETING_BANNER, STATUS_UPDATE_MARKETING_BANNER } from 'src/services/AdminServices'

const MarketingBanner = () => {

    let timer: any;
    const [searchFilter, setSearchFilter] = useState('')
    const [drawerAction, setDrawerAction] = useState(false)
    const [bannerLink, setBannerLink] = useState("")
    const [bannerName, setBannerName] = useState("")
    const [buttonNameOne, setButtonNameOne] = useState("")
    const [buttonNameTwo, setButtonNameTwo] = useState("")
    const [bannerLinkTwo, setBannerLinkTwo] = useState("")
    const [dialogTitle, setDialogTitle] = useState<'Add' | 'Edit'>('Add')
    const [imageFile, setImageFile] = useState<string>()
    const [imageShow, setImageShow] = useState("")
    const [removeimage, setRemoveImage] = useState("0")
    const [bannerId, setBannerId] = useState("");
    const [showModel, setShowModel] = useState(false)
    const [getBannerData, setBannerData] = useState([]);
    const [pagination, setPagination] = useState({ ...createPagination(), search_text: "" });
    const [bannerContent, setBannerContent] = useState("");
    const [bannerSubTitle, setBannerSubTitle] = useState("");
    const [imageValue, setImageValue] = useState('')

    const defaultValues = {
        bannerName: bannerName,
        bannerLink: bannerLink,
        buttonNameOne: buttonNameOne,
        content: bannerContent
    }
    const {
        control,
        setValue,
        reset,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues
    })

    const toggleAddMarketingBanner = () => {
        if (drawerAction == false) {
            setRemoveImage("1")
        } else {
            setRemoveImage("0")
        }
        setDrawerAction(!drawerAction)
    }
    const clearFormData = () => {
        setImageShow("")
        setBannerSubTitle("")
        setButtonNameTwo("")
        setBannerLinkTwo("")
        reset()
    }

    const editOnClickHandler = (data: any) => {
        setImageShow(data.image_path)
        setValue("bannerName", data.title)
        setValue("bannerLink", data.target_url_one)
        setValue("buttonNameOne", data.button_name_one)
        setValue("content", data.content)
        setBannerLinkTwo(data.target_link_two)
        setButtonNameTwo(data.button_two_name)
        setBannerSubTitle(data.sub_title)
        setBannerId(data.id)
        setDialogTitle('Edit')
        toggleAddMarketingBanner()
    }
    const deleteOnclickHandler = (data: any) => {
        setBannerId(data.id)
        setShowModel(!showModel)
    }

    const getAllBannerDataApi = async (mbPagination: ICommonPagination) => {
        try {
            const data = await GET_ALL_MARKETING_BANNER(mbPagination);
            if (data.code === 200 || data.code === "200") {

                setBannerData(data.data.result);
                setPagination(data.data.pagination)

            } else {

                return toast.error(data.message);
            }
        } catch (error) {

            return error
        }
    }

    const addBannerApi = async (data: any) => {
        if (!imageFile) {
            toast.error(`${IMAGE_FIELD_REQUIRED}`, {
                position: "top-left"
            });
        } else {
            const formData = new FormData()
            formData.append("image", imageFile || "")
            formData.append("title", data.bannerName)
            formData.append("target_url_1", data.bannerLink)
            formData.append("button_name_1", data.buttonNameOne)
            formData.append("content", data.content)
            formData.append("button_name_2", buttonNameTwo)
            formData.append("sub_title", bannerSubTitle)
            formData.append("target_url_2", bannerLinkTwo)
            try {
                const data = await ADD_MARKETING_BANNER(formData)
                if (data.code === 200 || data.code === "200") {
                    toggleAddMarketingBanner();
                    clearFormData();
                    toast.success(data.message)
                    getAllBannerDataApi(pagination)

                } else {
                    toast.error(data.message)
                }
            } catch (e: any) {
                toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN)
            }
        }
        return false
    }

    const editBannerDataApi = async (data: any) => {
        // if (imageValue === '1') {
        //     toast.error(`${IMAGE_FIELD_REQUIRED}`, {
        //         position: "top-left"
        //     });
        // } else {
        const formData = new FormData()
        formData.append("id", bannerId)
        formData.append("image", imageFile || "")
        formData.append("title", data.bannerName)
        formData.append("target_url_1", data.bannerLink)
        formData.append("button_name_1", data.buttonNameOne)
        formData.append("content", data.content)
        formData.append("button_name_2", buttonNameTwo)
        formData.append("sub_title", bannerSubTitle)
        formData.append("target_url_2", bannerLinkTwo)
        try {
            const data = await EDIT_MARKETING_BANNER(formData)
            if (data.code === 200 || data.code === "200") {

                toggleAddMarketingBanner();
                clearFormData();
                toast.success(data.message)
                getAllBannerDataApi(pagination)
            } else {
                toast.error(data.message)
            }
        } catch (e: any) {

            toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN)
        }
        // }
        return false

    }

    const deleteBannerDataApi = async () => {

        const payload = {
            "id": bannerId
        }
        try {
            const data = await DELETE_MARKETING_BANNER(payload);
            if (data.code === 200 || data.code === "200") {
                toast.success(data.message);
                setShowModel(!showModel)
                clearFormData()
                getAllBannerDataApi(pagination)
            } else {
                toast.error(data.message)
            }
        } catch (error) {

        }
    }

    const activeStatusDataApi = async (checked: boolean, row: any) => {
        const payload = {
            "id": row.id,
            "is_active": checked ? '1' : '0',
        }
        try {
            const datas = await STATUS_UPDATE_MARKETING_BANNER(payload)

            if (datas.code === 200 || datas.code === "200") {
                toast.success("Successfully updated")
                getAllBannerDataApi(pagination)

                return true
            } else {

            }
        } catch (error) {

            return toast.error(appErrors.UNKNOWN_ERROR_TRY_AGAIN)
        }
    }

    useEffect(() => {

        getAllBannerDataApi(pagination);

    }, []);

    const handleChangePerPageRows = (perPageRows: any) => {
        getAllBannerDataApi({ ...pagination, per_page_rows: perPageRows.pageSize, current_page: perPageRows.page + 1 })
    }

    const handleChangeSortBy = (orderSort: any) => {
        getAllBannerDataApi({ ...pagination, sort_by: orderSort == undefined ? "id" : orderSort.map((t: any) => t.field), order_by: orderSort == undefined ? "DESC" : orderSort.map((t: any) => t.sort) })
    }

    const searchBusinessUser = async () => {
        if (timer) {
            clearTimeout(timer);
        }

        timer = setTimeout(() => {
            getAllBannerDataApi({ ...pagination, current_page: 1, search_text: searchFilter });
        }, SEARCH_DELAY_TIME);
    }
    useEffect(() => {

        searchBusinessUser();

    }, [searchFilter]);

    const onSubmit = (data: any) => {
        if (dialogTitle === 'Add') {
            addBannerApi(data)
        } else {
            editBannerDataApi(data)
        }
    }

    const column = [
        {
            flex: 1,
            value: "image_path",
            headerName: "image",
            field: "image_path",
            avatars: "avatars"
        },
        {
            flex: 1,
            value: 'title',
            headerName: 'title',
            field: 'title',
            text: 'text'
        },
        {
            flex: 1,
            value: 'sub_title',
            headerName: 'Sub Title',
            field: 'sub_title',
            text: 'text'
        },
        {
            flex: 2,
            value: 'target_url_one',
            headerName: 'Link',
            field: 'target_url_one',
            text: 'text'
        },
        {
            flex: 1,
            headerName: 'Status',
            field: '',
            chips: 'chip',
            value: 'is_active'
        },
        {
            flex: 1,
            headerName: 'status',
            field: 'is_active',
            switch: 'switch',
            value: 'is_active',
            SwitchonChange: activeStatusDataApi
        },
        {
            flex: 1,
            headerName: 'Action',
            field: 'action',
            edit: "edit",
            deleted: 'deleted',
            editOnClick: editOnClickHandler,
            deletedOnClick: deleteOnclickHandler

        },
    ]

    return (
        <Grid container spacing={6} sx={{ marginTop: 4 }}>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='Marketing Banner'></CardHeader>
                    <Divider />
                    <TCCTableHeader
                        isButton
                        value={searchFilter}
                        onChange={(e: any) => setSearchFilter(e.target.value)}
                        ButtonName='Add Banner Marketing'
                        toggle={() => {
                            setDialogTitle('Add')
                            toggleAddMarketingBanner()
                            clearFormData()
                        }}
                    />

                    <TccDataTable
                        column={column}
                        rows={getBannerData}
                        handleSortChanges={handleChangeSortBy}
                        pageSize={parseInt(pagination.per_page_rows.toString())}
                        rowCount={pagination.total_items}
                        page={pagination.current_page - 1}
                        onPageChange={handleChangePerPageRows}
                        iconTitle='Banner'
                    />

                </Card>
            </Grid>
            <Drawer
                open={drawerAction}
                anchor='right'
                variant='temporary'
                onClose={toggleAddMarketingBanner}
                ModalProps={{ keepMounted: true }}
                sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
            >

                <DrawerHeader
                    title={`${dialogTitle} Marketing Banner`}
                    onClick={() => {
                        toggleAddMarketingBanner()
                        clearFormData()
                    }}
                />

                <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FormControl fullWidth sx={{ mb: 4 }}>
                            <Controller
                                name='bannerName'
                                control={control}
                                rules={{ required: true }}
                                render={({ field }: any) => (
                                    <TextField
                                        autoFocus
                                        size='small'
                                        value={bannerName}
                                        label='Title'
                                        onChange={(e) => setBannerName(e.target.value)}
                                        error={Boolean(errors.bannerName)}
                                        {...field}
                                    />
                                )}
                            />
                            {errors.bannerName && <FormHelperText sx={{ color: 'error.main' }}>{FIELD_REQUIRED}</FormHelperText>}
                        </FormControl>
                        <TccInput
                            fullWidth
                            sx={{ mb: 4 }}
                            value={bannerSubTitle}
                            label='Sub Title'
                            onChange={(e: any) => setBannerSubTitle(e.target.value)}
                        />
                        <FormControl fullWidth sx={{ mb: 4 }}>
                            <Controller
                                name='bannerLink'
                                control={control}
                                rules={{ required: true }}
                                render={({ field }: any) => (
                                    <TextField
                                        autoFocus
                                        size='small'
                                        label='Link One'
                                        value={bannerLink}
                                        onChange={(e) => setBannerLink(e.target.value)}
                                        error={Boolean(errors.bannerLink)}
                                        {...field}
                                    />
                                )}
                            />
                            {errors.bannerLink && <FormHelperText sx={{ color: 'error.main' }}>{FIELD_REQUIRED}</FormHelperText>}
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 4 }}>
                            <Controller
                                name='buttonNameOne'
                                control={control}
                                rules={{ required: true }}
                                render={({ field }: any) => (
                                    <TextField
                                        autoFocus
                                        size='small'
                                        label='Button Name One'
                                        value={buttonNameOne}
                                        onChange={(e) => setButtonNameOne(e.target.value)}
                                        error={Boolean(errors.buttonNameOne)}
                                        {...field}
                                    />
                                )}
                            />
                            {errors.buttonNameOne && <FormHelperText sx={{ color: 'error.main' }}>{FIELD_REQUIRED}</FormHelperText>}
                        </FormControl>
                        <TccInput
                            fullWidth
                            sx={{ mb: 4 }}
                            value={buttonNameTwo}
                            label='Button Name Two'
                            onChange={(e: any) => setButtonNameTwo(e.target.value)}
                        />
                        <TccInput
                            fullWidth
                            sx={{ mb: 4 }}
                            value={bannerLinkTwo}
                            label='Link Two'
                            onChange={(e: any) => setBannerLinkTwo(e.target.value)}
                        />
                        <FormControl fullWidth sx={{ mb: 4 }}>
                            <Controller
                                name='content'
                                control={control}
                                rules={{ required: true }}
                                render={({ field }: any) => (
                                    <TextField
                                        autoFocus
                                        size='small'
                                        rows={4}
                                        multiline
                                        label='Content'
                                        value={bannerContent}
                                        onChange={(e) => setBannerContent(e.target.value)}
                                        error={Boolean(errors.content)}
                                        {...field}
                                    />
                                )}
                            />
                            {errors.content && <FormHelperText sx={{ color: 'error.main' }}>{FIELD_REQUIRED}</FormHelperText>}
                        </FormControl>
                        <TccSingleFileUpload imageValue={setImageValue} onDrop={setImageFile} onClick={removeimage} imageFile={imageShow} />

                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 6 }}>
                            <Button variant='contained' sx={{ mr: 3 }} type="submit">
                                {dialogTitle === 'Add' ? "SUBMIT" : "EDIT"}
                            </Button>
                            <Button variant='outlined' color='secondary' onClick={() => {
                                toggleAddMarketingBanner()
                                clearFormData()
                            }}>
                                Cancel
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Drawer>
            <DeleteDataModel showModel={showModel} toggle={(show: any) => setShowModel(show)} onClick={deleteBannerDataApi} />

        </Grid>
    )
}

export default MarketingBanner