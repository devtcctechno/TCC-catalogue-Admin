// ** MUI Imports
import { Divider, CardHeader, Grid, Card, Drawer, Button, FormControl, TextField, FormHelperText } from '@mui/material'
import { useEffect, useState } from 'react'
import TCCTableHeader from '../../customComponents/data-table/header'
import TccDataTable from '../../customComponents/data-table/table'
import Box from '@mui/material/Box'
import TccSingleFileUpload from '../../customComponents/Form-Elements/file-upload/singleFile-upload'
import DrawerHeader from '../../customComponents/components/drawer-header'
import { ADD_PRODUCT_DROPDOWN_LIST, TEMPLATE_THREE_PRODUCT_MODEL_SECTION_ADD, TEMPLATE_THREE_PRODUCT_MODEL_SECTION_DELETE, TEMPLATE_THREE_PRODUCT_MODEL_SECTION_EDIT, TEMPLATE_THREE_PRODUCT_MODEL_SECTION_GET_ALL, TEMPLATE_THREE_PRODUCT_MODEL_SECTION_STATUS } from '../../services/AdminServices'
import { toast } from 'react-hot-toast'
import { appErrors, FIELD_REQUIRED, IMAGE_FIELD_REQUIRED, ONLY_POSITIVE_NUMBER_REGEX, SEARCH_DELAY_TIME } from '../../AppConstants'
import DeleteDataModel from '../../customComponents/delete-model'
import { createPagination } from '../../utils/sharedFunction'
import { ICommonPagination } from '../../data/interface'
import { Controller, useForm } from 'react-hook-form'
import React from 'react'
import TccSelect from 'src/customComponents/Form-Elements/select'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

const schema = yup.object().shape({
    sortOrder: yup.string()
        .matches(ONLY_POSITIVE_NUMBER_REGEX, 'Enter Valid Sort Code')
        .required(`${FIELD_REQUIRED}`),
})
const ProductModelSection = () => {
    let timer: any;
    const [searchFilter, setSearchFilter] = useState('');
    const [drawerAction, setDrawerAction] = useState(false)
    const [bannerLink, setBannerLink] = useState("");
    const [bannerName, setBannerName] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const [bannerId, setBannerId] = useState('')
    const [showModel, setShowModel] = useState(false)
    const [getBannerData, setBannerData] = useState([]);
    const [dialogTitle, setDialogTitle] = useState<'Add' | 'Edit'>('Add');
    const [imageFile, setImageFile] = useState<string>()
    const [imageShow, setImageShow] = useState("")
    const [removeimage, setRemoveImage] = useState("0")
    const [pagination, setPagination] = useState({ ...createPagination(), search_text: "" });
    const [imageValue, setImageValue] = useState('')
    const [categoryData, setCategoryData] = useState<any>([])
    const [categoryId, setCategoryId] = useState('')
    const [collectionData, setCollectionData] = useState<any>([])
    const [collectionId, setCollectionId] = useState('')

    const toggleAddBannerDrawer = () => {
        if (drawerAction == false) {
            setRemoveImage("1")
        } else {
            setRemoveImage("0")
        }
        setDrawerAction(!drawerAction)
    }

    const defaultValues = {
        bannerLink: bannerLink,
        sortOrder: sortOrder,
    }

    const {
        control,
        setValue,
        reset,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues,
        resolver: yupResolver(schema),
    })

    const clearFormData = () => {
        reset()
        setImageShow("")
        setSortOrder("")
        setCategoryId("")
        setCollectionId("")
    }

    const editOnClickHandler = (data: any) => {
        setImageShow(data.image_path);
        setBannerName(data.title)
        setValue("sortOrder", data.sort_order)
        setValue("bannerLink", data.link)
        setBannerId(data.id)
        setCollectionId(data.id_collection)
        setCategoryId(data.id_category)
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
                setCategoryData(data.data.categoryList)
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
            const data = await TEMPLATE_THREE_PRODUCT_MODEL_SECTION_GET_ALL(bPagination);
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
                position: "top-center"
            });
        } else {
            const formData = new FormData()
            formData.append("image", imageFile || "")
            formData.append("title", bannerName)
            formData.append("link", data.bannerLink)
            formData.append("sort_order", data?.sortOrder)
            categoryId && formData.append("id_category", categoryId)
            collectionId && formData.append("id_collection", collectionId)
            try {
                const data = await TEMPLATE_THREE_PRODUCT_MODEL_SECTION_ADD(formData)
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
        if (imageValue === '1') {
            toast.error(`${IMAGE_FIELD_REQUIRED}`, {
                position: "top-center"
            });
        }
        else {
            const formData = new FormData()
            formData.append("id", bannerId)
            formData.append("image", imageFile || "")
            formData.append("title", bannerName)
            formData.append("link", data.bannerLink)
            formData.append("sort_order", data?.sortOrder)
            categoryId && formData.append("id_category", categoryId)
            collectionId && formData.append("id_collection", collectionId)

            try {
                const data = await TEMPLATE_THREE_PRODUCT_MODEL_SECTION_EDIT(bannerId, formData)
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
    }
    const deleteBannerDataApi = async () => {
        try {
            const data = await TEMPLATE_THREE_PRODUCT_MODEL_SECTION_DELETE(bannerId);
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
            const datas = await TEMPLATE_THREE_PRODUCT_MODEL_SECTION_STATUS(row.id)

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
                    <CardHeader title='Product Model Section'></CardHeader>
                    <Divider />
                    <Box>
                        <TCCTableHeader isButton value={searchFilter}
                            onChange={(e: any) => setSearchFilter(e.target.value)}
                            toggle={(e: any) => {
                                setDialogTitle('Add')
                                toggleAddBannerDrawer()
                                clearFormData()
                            }}
                            ButtonName='Add Product Model Section'
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
                            iconTitle='Product Model Section'
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
                    title={`${dialogTitle} Product Model Section`}
                    onClick={() => {
                        clearFormData()
                        toggleAddBannerDrawer()
                    }}
                    tabBar
                />
                <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextField
                            fullWidth
                            sx={{ mb: 4 }}
                            autoFocus
                            size='small'
                            value={bannerName}
                            label='Title'
                            onChange={(e) => setBannerName(e.target.value)}
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
                        <FormControl fullWidth sx={{ mb: 4 }}>
                            <Controller
                                name='sortOrder'
                                control={control}
                                rules={{ required: true }}
                                render={({ field }: any) => (
                                    <TextField
                                        fullWidth
                                        label='Sort Order'
                                        size='small'
                                        type="number"
                                        value={sortOrder}
                                        onChange={(e) => setSortOrder(e.target.value)}
                                        error={Boolean(errors.sortOrder)}
                                        {...field}
                                    />
                                )}
                            />
                            {errors.sortOrder && <FormHelperText sx={{ color: 'error.main' }}>{FIELD_REQUIRED}</FormHelperText>}
                        </FormControl>
                        <TccSelect
                            sx={{ mb: 4 }}
                            fullWidth
                            inputLabel="Select Category"
                            label='Select Category'
                            value={categoryId}
                            id='controlled-select'
                            onChange={(event: any) => setCategoryId(event.target.value)}
                            title='category_name'
                            Options={categoryData.filter((value: any) => value.parent_id === null)}
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

export default ProductModelSection