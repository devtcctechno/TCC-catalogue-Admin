// ** MUI Imports
import { Divider, CardHeader, Grid, Card, Drawer, Typography, IconButton, Button, FormControl, TextField, FormHelperText } from '@mui/material'
import { useEffect, useState } from 'react'
import TCCTableHeader from '../../customComponents/data-table/header'
import TccDataTable from '../../customComponents/data-table/table'
import TccInput from '../../customComponents/Form-Elements/inputField'
import Box, { BoxProps } from '@mui/material/Box'

import TccSingleFileUpload from '../../customComponents/Form-Elements/file-upload/singleFile-upload'

import DrawerHeader from '../../customComponents/components/drawer-header'
import { ADD_PRODUCT_DROPDOWN_LIST, CONFIG_MASTER_DROPDOWN, TEMPLATE_THREE_BANNER_ADD, TEMPLATE_THREE_BANNER_DELETE, TEMPLATE_THREE_BANNER_EDIT, TEMPLATE_THREE_BANNER_GET_ALL, TEMPLATE_THREE_BANNER_STATUS, TEMPLATE_THREE_DIAMOND_SECTION_ADD, TEMPLATE_THREE_DIAMOND_SECTION_DELETE, TEMPLATE_THREE_DIAMOND_SECTION_EDIT, TEMPLATE_THREE_DIAMOND_SECTION_GET_ALL, TEMPLATE_THREE_DIAMOND_SECTION_STATUS, TEMPLATE_TWO_BANNER_ADD, TEMPLATE_TWO_BANNER_DELETE, TEMPLATE_TWO_BANNER_EDIT, TEMPLATE_TWO_BANNER_GET_ALL, TEMPLATE_TWO_BANNER_STATUS } from '../../services/AdminServices'
import { toast } from 'react-hot-toast'
import { appErrors, FIELD_REQUIRED, IMAGE_FIELD_REQUIRED, SEARCH_DELAY_TIME } from '../../AppConstants'
import DeleteDataModel from '../../customComponents/delete-model'
import { createPagination } from '../../utils/sharedFunction'
import { ICommonPagination } from '../../data/interface'
import { Controller, useForm } from 'react-hook-form'
import React from 'react'
import TccColorPicker from 'src/customComponents/color-picker'
import TccSelect from 'src/customComponents/Form-Elements/select'

const DiamondSection = () => {
    let timer: any;
    const [searchFilter, setSearchFilter] = useState('');
    const [drawerAction, setDrawerAction] = useState(false)
    const [bannerLink, setBannerLink] = useState("");
    const [bannerName, setBannerName] = useState("");
    const [bannerTwoName, setBannerTwoName] = useState("");
    const [bannerContent, setBannerContent] = useState("");
    const [buttonName, setButtonName] = useState("");
    const [textColor, setTextColor] = useState("");
    const [buttonColor, setButtonColor] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const [bannerId, setBannerId] = useState('')
    const [showModel, setShowModel] = useState(false)
    const [getBannerData, setBannerData] = useState([]);
    const [dialogTitle, setDialogTitle] = useState<'Add' | 'Edit'>('Add');
    const [imageFile, setImageFile] = useState<string>()
    const [imageShow, setImageShow] = useState("")
    const [removeimage, setRemoveImage] = useState("0")
    const [imageValue, setImageValue] = useState('')
    const [imageTwoFile, setImageTWoFile] = useState<string>()
    const [imageTwoShow, setImageTwoShow] = useState("")
    const [removeTwoimage, setRemoveTwoImage] = useState("0")
    const [imageTwoValue, setImageTwoValue] = useState('')
    const [collectionData, setCollectionData] = useState<any>([])
    const [collectionId, setCollectionId] = useState("")
    const [pagination, setPagination] = useState({ ...createPagination(), search_text: "" });

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
        bannerLink: bannerLink,
        bannerTwoName: bannerTwoName
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
        setBannerTwoName("")
        setTextColor("")
        setButtonColor("")
        setSortOrder("")
        setCollectionId("")
        setImageTwoShow("")
    }

    const editOnClickHandler = (data: any) => {
        setImageShow(data.image_path);
        setImageTwoShow(data.Sub_image_path)
        setValue("bannerName", data.title)
        setValue("bannerTwoName", data.sub_title)
        setCollectionId(data.id_collection)
        setValue("bannerLink", data.link)
        setTextColor(data.button_text_color)
        setButtonColor(data.button_color)
        setButtonName(data.button_name)
        setBannerContent(data.description)
        setSortOrder(data.sort_order)
        setBannerId(data.id)
        setDialogTitle('Edit')
        toggleAddBannerDrawer();
    }
    const deleteOnclickHandler = (data: any) => {
        setBannerId(data.id)
        setShowModel(!showModel)
    }

    const dropDownDatApi = async () => {
        try {
            const data = await ADD_PRODUCT_DROPDOWN_LIST();
            if (data.code === 200 || data.code === "200") {
                setCollectionData(data.data.collection)
            } else {
                return toast.error(data.message);
            }
        } catch (e: any) {
            toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN);
        }

        return false;
    }

    useEffect(() => {
        dropDownDatApi()
    }, [])

    const getAllBannerDataApi = async (bPagination: ICommonPagination) => {
        try {
            const data = await TEMPLATE_THREE_DIAMOND_SECTION_GET_ALL(bPagination);
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

    // ---- Add API ----
    const addBannerApi = async (data: any) => {
        if (!imageFile) {
            toast.error(`${IMAGE_FIELD_REQUIRED}`, {
                position: "top-left"
            });
        } else {
            const formData = new FormData()
            formData.append("image", imageFile || "")
            formData.append("title", data.bannerName)
            formData.append("sub_image", imageTwoFile || "")
            formData.append("sub_title", data.bannerTwoName)
            formData.append("link", data.bannerLink)
            formData.append("description", bannerContent)
            formData.append("button_name", buttonName)
            formData.append("button_text_color", textColor)
            formData.append("button_color", buttonColor)
            formData.append("sort_order", sortOrder)
            formData.append("id_collection", collectionId)
            try {
                const data = await TEMPLATE_THREE_DIAMOND_SECTION_ADD(formData)
                if (data.code === 200 || data.code === "200") {
                    toggleAddBannerDrawer();
                    toast.success(data.message)
                    getAllBannerDataApi(pagination)
                    clearFormData();
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
        formData.append("image", imageFile || "")
        formData.append("title", data.bannerName)
        formData.append("sub_image", imageTwoFile || "")
        formData.append("sub_title", data.bannerTwoName)
        formData.append("link", data.bannerLink)
        formData.append("description", bannerContent)
        formData.append("button_name", buttonName)
        formData.append("button_text_color", textColor)
        formData.append("button_color", buttonColor)
        formData.append("sort_order", sortOrder)
        formData.append("id_collection", collectionId)
        try {
            const data = await TEMPLATE_THREE_DIAMOND_SECTION_EDIT(bannerId, formData)
            if (data.code === 200 || data.code === "200") {
                getAllBannerDataApi(pagination)
                toggleAddBannerDrawer();
                clearFormData();
                toast.success(data.message)
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
        try {
            const data = await TEMPLATE_THREE_DIAMOND_SECTION_DELETE(bannerId);
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
        try {
            const datas = await TEMPLATE_THREE_DIAMOND_SECTION_STATUS(row.id)

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

    const handleOnPageChange = (page: number) => {
        getAllBannerDataApi({ ...pagination, current_page: page + 1 })
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
            width: 300,
            value: 'title',
            headerName: 'title',
            field: 'title',
            text: 'text'
        },
        {
            width: 400,
            value: 'link',
            headerName: 'Link',
            field: 'link',
            text: 'text'
        },
        {
            width: 200,
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
        <Grid container spacing={6} sx={{ mt: 4 }}>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='Diamond Section'></CardHeader>
                    <Divider />
                    <Box>
                        <TCCTableHeader isButton value={searchFilter}
                            onChange={(e: any) => setSearchFilter(e.target.value)}
                            toggle={(e: any) => {
                                setDialogTitle('Add')
                                toggleAddBannerDrawer()
                                clearFormData()
                            }}
                            ButtonName='Add Diamond Section'
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
                            iconTitle='Diamond Section'
                        />
                    </Box>
                </Card>
            </Grid>
            <Drawer
                open={drawerAction}
                anchor='right'
                variant='temporary'
                onClose={() => {
                    clearFormData()
                    toggleAddBannerDrawer
                }}
                ModalProps={{ keepMounted: true }}
                sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
            >

                <DrawerHeader
                    title={`${dialogTitle} Diamond Section`}
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
                                name='bannerTwoName'
                                control={control}
                                rules={{ required: true }}
                                render={({ field }: any) => (
                                    <TextField
                                        autoFocus
                                        size='small'
                                        value={bannerTwoName}
                                        label='Sub Title'
                                        onChange={(e) => setBannerTwoName(e.target.value)}
                                        error={Boolean(errors.bannerTwoName)}
                                        {...field}
                                    />
                                )}
                            />
                            {errors.bannerTwoName && <FormHelperText sx={{ color: 'error.main' }}>{FIELD_REQUIRED}</FormHelperText>}
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 4 }}>
                            <Controller
                                name='bannerLink'
                                control={control}
                                rules={{ required: true }}
                                render={({ field }: any) => (
                                    <TextField
                                        autoFocus
                                        size='small'
                                        label='Link'
                                        value={bannerLink}
                                        onChange={(e) => setBannerLink(e.target.value)}
                                        error={Boolean(errors.bannerLink)}
                                        {...field}
                                    />
                                )}
                            />
                            {errors.bannerLink && <FormHelperText sx={{ color: 'error.main' }}>{FIELD_REQUIRED}</FormHelperText>}
                        </FormControl>
                        <TccInput
                            fullWidth
                            sx={{ mb: 4 }}
                            value={buttonName}
                            label='Button Name'
                            onChange={(e: any) => setButtonName(e.target.value)}
                        />
                        <TccSelect
                            sx={{ mb: 4 }}
                            fullWidth
                            inputLabel="Select Collection"
                            label='Select Collection'
                            value={collectionId}
                            id='controlled-select'
                            onChange={(event: any) => setCollectionId(event.target.value)}
                            title='name'
                            Options={collectionData}
                        />
                        <Typography variant='body2' sx={{ mb: 4 }}>Banner Text Color</Typography>
                        <TccColorPicker value={textColor} onChange={(e: any) => setTextColor(e.target.value)} sx={{ mb: 5, width: '100' }} />
                        <Typography variant='body2' sx={{ mb: 4 }}>Button Color</Typography>
                        <TccColorPicker value={buttonColor} onChange={(e: any) => setButtonColor(e.target.value)} sx={{ mb: 5, width: '100' }} />
                        <TextField fullWidth sx={{ mb: 4 }} label='Sort Order' size='small' type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} />
                        <TccInput
                            fullWidth
                            sx={{ mb: 4 }}
                            value={bannerContent}
                            rows={4}
                            multiline
                            label='Content'
                            onChange={(e: any) => setBannerContent(e.target.value)}
                        />
                        <Typography variant='body2' sx={{ mb: 2 }}>Image : </Typography>
                        <TccSingleFileUpload imageValue={setImageValue} onDrop={setImageFile} onClick={removeimage} imageFile={imageShow} />
                        <Typography variant='body2' sx={{ mt: 4, mb: 2 }}>Sub Image : </Typography>
                        <TccSingleFileUpload imageValue={setImageTwoValue} onDrop={setImageTWoFile} onClick={removeTwoimage} imageFile={imageTwoShow} />
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

export default DiamondSection