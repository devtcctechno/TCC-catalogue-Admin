// ** MUI Imports
import { Divider, CardHeader, Grid, Card, Drawer, Typography, IconButton, Button, FormControl, TextField, FormHelperText } from '@mui/material'
import { useEffect, useState } from 'react'
import TCCTableHeader from 'src/customComponents/data-table/header'
import TccDataTable from 'src/customComponents/data-table/table'
import TccInput from 'src/customComponents/Form-Elements/inputField'
import Box, { BoxProps } from '@mui/material/Box'

import TccSingleFileUpload from 'src/customComponents/Form-Elements/file-upload/singleFile-upload'

import DrawerHeader from 'src/customComponents/components/drawer-header'
import { toast } from 'react-hot-toast'
import { appErrors, FIELD_REQUIRED, IMAGE_FIELD_REQUIRED, SEARCH_DELAY_TIME } from 'src/AppConstants'
import DeleteDataModel from 'src/customComponents/delete-model'
import { createPagination } from 'src/utils/sharedFunction'
import { ICommonPagination } from 'src/data/interface'
import { Controller, useForm } from 'react-hook-form'
import { TEMPLATE_TWO_HOME_ABOUT_FEATURES_SECTION_ADD, TEMPLATE_TWO_HOME_ABOUT_FEATURES_SECTION_DELETE, TEMPLATE_TWO_HOME_ABOUT_FEATURES_SECTION_EDIT, TEMPLATE_TWO_HOME_ABOUT_FEATURES_SECTION_GET_ALL, TEMPLATE_TWO_HOME_ABOUT_FEATURES_SECTION_STATUS } from 'src/services/AdminServices'

const HomeAboutFeatureSection = () => {
    let timer: any;
    const [searchFilter, setSearchFilter] = useState('');
    const [drawerAction, setDrawerAction] = useState(false)
    const [bannerLink, setBannerLink] = useState("");
    const [subTitle, setSubTitle] = useState("");
    const [bannerName, setBannerName] = useState("");
    const [bannerContent, setBannerContent] = useState("");
    const [buttonName, setButtonName] = useState("");
    const [bannerId, setBannerId] = useState('')
    const [showModel, setShowModel] = useState(false)
    const [getBannerData, setBannerData] = useState([]);
    const [dialogTitle, setDialogTitle] = useState<'Add' | 'Edit'>('Add');
    const [imageFile, setImageFile] = useState<string>()
    const [imageShow, setImageShow] = useState("")
    const [removeimage, setRemoveImage] = useState("0")
    const [pagination, setPagination] = useState({ ...createPagination(), search_text: "" });
    const [imageValue, setImageValue] = useState('')

    const toggleAddBannerDrawer = () => {
        if (drawerAction == false) {
            setRemoveImage("1")
        } else {
            setRemoveImage("0")
        }
        setDrawerAction(!drawerAction)
    }

    const defaultValues = {
        bannerName: bannerName,
        subTitle: subTitle,
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

    const clearFormData = () => {
        reset()
        setImageShow("")
        setButtonName("")
        setBannerContent("")
    }

    const editOnClickHandler = (data: any) => {
        setImageShow(data.image_path);
        setValue("bannerName", data.name)
        setValue("content", data.content)
        setValue("subTitle", data.sub_title)
        setButtonName(data.button_name)
        setBannerLink(data.target_url)
        setBannerId(data.id)
        setDialogTitle('Edit')
        toggleAddBannerDrawer();
    }
    const deleteOnclickHandler = (data: any) => {
        setBannerId(data.id)
        setShowModel(!showModel)
    }
    const getAllBannerDataApi = async (bPagination: ICommonPagination) => {
        try {
            const data = await TEMPLATE_TWO_HOME_ABOUT_FEATURES_SECTION_GET_ALL(bPagination);
            if (data.code === 200 || data.code === "200") {
                setBannerData(data.data.result);
                setPagination(data.data.pagination)

            } else {
                return toast.error(data.message);
            }
        } catch (e: any) {
            toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN)

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
            formData.append("target_url", bannerLink)
            formData.append("sub_title", data.subTitle)
            formData.append("content", data.content)
            formData.append("button_name", buttonName)
            try {
                const data = await TEMPLATE_TWO_HOME_ABOUT_FEATURES_SECTION_ADD(formData)
                if (data.code === 200 || data.code === "200") {

                    toggleAddBannerDrawer();
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
        formData.append("target_url", bannerLink)
        formData.append("sub_title", data.subTitle)
        formData.append("content", data.content)
        formData.append("button_name", buttonName)
        try {
            const data = await TEMPLATE_TWO_HOME_ABOUT_FEATURES_SECTION_EDIT(formData)
            if (data.code === 200 || data.code === "200") {

                toggleAddBannerDrawer();
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
            const data = await TEMPLATE_TWO_HOME_ABOUT_FEATURES_SECTION_DELETE(payload);
            if (data.code === 200 || data.code === "200") {
                toast.success(data.message);
                setShowModel(!showModel)
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
            const datas = await TEMPLATE_TWO_HOME_ABOUT_FEATURES_SECTION_STATUS(payload)

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

    const column = [
        {
            width: 80,
            value: "image_path",
            headerName: "image",
            field: "image_path",
            avatars: "avatars"
        },
        {
            width: 280,
            value: 'name',
            headerName: 'title',
            field: 'name',
            text: 'text'
        },
        {
            width: 400,
            value: 'sub_title',
            headerName: 'Sub Title',
            field: 'sub_title',
            text: 'text'
        },
        {
            width: 180,
            value: 'button_name',
            headerName: 'Button Name',
            field: 'button_name',
            text: 'text'
        },
        {
            width: 150,
            headerName: 'Status',
            field: '',
            chips: 'chip',
            value: 'is_active'
        },
        {
            width: 150,
            headerName: 'status',
            field: 'is_active',
            switch: 'switch',
            value: 'is_active',
            SwitchonChange: activeStatusDataApi
        },
        {
            width: 150,
            headerName: 'Action',
            field: 'action',
            edit: "edit",
            deleted: 'deleted',
            editOnClick: editOnClickHandler,
            deletedOnClick: deleteOnclickHandler

        },
    ]

    const onSubmit = (data: any) => {
        if (dialogTitle === 'Add') {
            addBannerApi(data)
        } else {
            editBannerDataApi(data)
        }
    }
    return (
        <Grid container spacing={6} sx={{ marginTop: 4 }}>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='About Page Our Mission Data'></CardHeader>
                    <Divider />
                    <Box>
                        <TCCTableHeader isButton value={searchFilter}
                            onChange={(e: any) => setSearchFilter(e.target.value)}
                            toggle={(e: any) => {
                                e.preventDefault()
                                clearFormData()
                                toggleAddBannerDrawer()
                                setDialogTitle('Add')
                            }}
                            ButtonName='Add Our Mission Data'
                        />

                    </Box>
                    <Box sx={{ width: '100%' }}>
                        <TccDataTable
                            column={column}
                            rows={getBannerData}
                            handleSortChanges={handleChangeSortBy}
                            pageSize={parseInt(pagination.per_page_rows.toString())}
                            rowCount={pagination.total_items}
                            page={pagination.current_page - 1}
                            onPageChange={handleChangePerPageRows}
                            iconTitle='Add Our Mission Data'
                        />
                    </Box>

                </Card>
            </Grid>
            <Drawer
                open={drawerAction}
                anchor='right'
                variant='temporary'
                onClose={() => {
                    toggleAddBannerDrawer()
                }}
                ModalProps={{ keepMounted: true }}
                sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
            >

                <DrawerHeader
                    title={`${dialogTitle} Our Mission Data`}
                    onClick={() => {
                        clearFormData()
                        toggleAddBannerDrawer()
                    }}
                    tabBar
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
                        <FormControl fullWidth sx={{ mb: 4 }}>
                            <Controller
                                name='subTitle'
                                control={control}
                                rules={{ required: true }}
                                render={({ field }: any) => (
                                    <TextField
                                        autoFocus
                                        size='small'
                                        label='Sub Title'
                                        value={subTitle}
                                        onChange={(e) => setSubTitle(e.target.value)}
                                        error={Boolean(errors.subTitle)}
                                        {...field}
                                    />
                                )}
                            />
                            {errors.subTitle && <FormHelperText sx={{ color: 'error.main' }}>{FIELD_REQUIRED}</FormHelperText>}
                        </FormControl>

                        <TccInput
                            fullWidth
                            sx={{ mb: 4 }}
                            value={buttonName}
                            label='Button Name'
                            onChange={(e: any) => setButtonName(e.target.value)}
                        />
                        <TccInput
                            fullWidth
                            sx={{ mb: 4 }}
                            value={bannerLink}
                            label='Link'
                            onChange={(e: any) => setBannerLink(e.target.value)}
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
                                        label='Content'
                                        rows={5}
                                        multiline
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


                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
                            <Button variant='contained' sx={{ mr: 3 }} type="submit" >
                                {dialogTitle === 'Add' ? "SUBMIT" : "EDIT"}
                            </Button>
                            <Button variant='outlined' color='secondary' onClick={() => {
                                toggleAddBannerDrawer()
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

export default HomeAboutFeatureSection