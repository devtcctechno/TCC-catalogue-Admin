// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardHeader from '@mui/material/CardHeader'
import { ChangeEvent, useEffect, useState } from 'react'
import { Box, Button, Divider } from '@mui/material'
import TCCTableHeader from 'src/customComponents/data-table/header'
import TccDataTable from 'src/customComponents/data-table/table'
import { ICommonPagination } from 'src/data/interface'
import { DELETE_PRODUCT_API, FEATURE_STATUS_UPDATE_PRODUCT, GET_ALL_PRODUCT_LIST, STATUS_UPDATE_PRODUCT, TRENDING_STATUS_UPDATE_PRODUCT } from 'src/services/AdminServices'
import { toast } from 'react-hot-toast'
import { appErrors, SEARCH_DELAY_TIME } from 'src/AppConstants'
import { createPagination } from 'src/utils/sharedFunction'
import DeleteDataModel from 'src/customComponents/delete-model'
import Router, { useRouter } from 'next/router'
import ProductAdd from '../add-products'
import EditProduct from '../add-product-variant'
import { Icon } from '@iconify/react'

const ProductList = () => {

  let timer: any;
  const [searchFilter, setSearchFilter] = useState('')
  const [checked, setChecked] = useState<boolean>(true)
  const [productList, setProductList] = useState([])
  const [pagination, setPagination] = useState({ ...createPagination(), search_text: "" })
  const [showModel, setShowModel] = useState(false)
  const [productId, setProductId] = useState()

  const editOnClickHandler = (data: any) => {
    if (data.product_type === 1) {
      <ProductAdd />
      Router.push({ pathname: "/product/add-products/", query: { id: data.id } })
    } else if (data.product_type === 2) {
      <EditProduct />
      Router.push({ pathname: "/product/add-product-variant/", query: { id: data.id } })
    }
  }

  const viewOnClickHandler = (data: any) => {
    if (data.product_type === 1) {
      Router.push({ pathname: "/product/add-products/", query: { id: data.id, action: "view" } })
    } else if (data.product_type === 2) {
      Router.push({ pathname: "/product/add-product-variant/", query: { id: data.id, action: "view" } })
    }
  }
  /////////////////// List API /////////////////// 

  const getAllProductList = async (mbPagination: ICommonPagination) => {
    try {
      const data = await GET_ALL_PRODUCT_LIST(mbPagination);
      if (data.code === 200 || data.code === "200") {

        setProductList(data.data.result);
        setPagination(data.data.pagination)

      } else {
        return toast.error(data.message);
      }
    } catch (e: any) {
      toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN)
    }
  }

  useEffect(() => {
    getAllProductList(pagination);
  }, []);

  const handleChangePerPageRows = (perPageRows: any) => {
    getAllProductList({ ...pagination, per_page_rows: perPageRows.pageSize, current_page: perPageRows.page + 1 })
  }

  const handleChangeSortBy = (orderSort: any) => {
    getAllProductList({ ...pagination, sort_by: orderSort == undefined ? "id" : orderSort.map((t: any) => t.field), order_by: orderSort == undefined ? "DESC" : orderSort.map((t: any) => t.sort) })
  }
  const searchBusinessUser = async () => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      getAllProductList({ ...pagination, current_page: 1, search_text: searchFilter });
    }, SEARCH_DELAY_TIME);
  }

  useEffect(() => {
    searchBusinessUser();
  }, [searchFilter]);

  /////////////////// STATUS API /////////////////// 

  const activeStatusDataApi = async (checked: boolean, row: any) => {
    const payload = {
      "id_product": row.id,
      "is_active": checked ? '1' : '0',
    }
    try {
      const datas = await STATUS_UPDATE_PRODUCT(payload)

      if (datas.code === 200 || datas.code === "200") {
        toast.success("Successfully updated")
        getAllProductList(pagination)

        return true
      } else {

      }
    } catch (error) {

      return toast.error(appErrors.UNKNOWN_ERROR_TRY_AGAIN)
    }
  }

  const featureproductStatusDataApi = async (checked: boolean, row: any) => {
    const payload = {
      "id_product": row.id,
      "is_featured": checked ? '1' : '0',
    }
    try {
      const datas = await FEATURE_STATUS_UPDATE_PRODUCT(payload)

      if (datas.code === 200 || datas.code === "200") {
        toast.success("Successfully updated")
        getAllProductList(pagination)

        return true
      } else {

      }
    } catch (error) {

      return toast.error(appErrors.UNKNOWN_ERROR_TRY_AGAIN)
    }
  }

  const trendingproductStatusDataApi = async (checked: boolean, row: any) => {
    const payload = {
      "id_product": row.id,
      "is_trending": checked ? '1' : '0',
    }
    try {
      const datas = await TRENDING_STATUS_UPDATE_PRODUCT(payload)

      if (datas.code === 200 || datas.code === "200") {
        toast.success("Successfully updated")
        getAllProductList(pagination)

        return true
      } else {

      }
    } catch (error) {

      return toast.error(appErrors.UNKNOWN_ERROR_TRY_AGAIN)
    }
  }

  /////////////////// DELETE API /////////////////// 

  const deleteOnclickHandler = (data: any) => {
    setProductId(data.id)
    setShowModel(!showModel)
  }

  const deleteProductApi = async () => {

    const payload = {
      "id": productId
    }
    try {
      const data = await DELETE_PRODUCT_API(payload);
      if (data.code === 200 || data.code === "200") {
        toast.success(data.message);
        setShowModel(!showModel)
        getAllProductList(pagination)
      } else {
        toast.error(data.message)
      }
    } catch (error) {

    }
  }

  const imagesUploadOnClick = (data: any) => {
    Router.push({ pathname: "/product/image-upload", query: { id: data.id } })
  }

  const column = [
    {
      width: 450,
      value: 'name',
      headerName: 'name',
      field: 'name',
      text: 'text'
    },
    {
      width: 200,
      value: 'sku',
      headerName: 'sku',
      field: 'sku',
      text: 'text'
    },
    {
      width: 200,
      value: 'category_name',
      field: 'category',
      text: 'text'
    },
    {
      width: 100,
      value: "is_active",
      headerName: 'Status',
      field: 'is_active',
      switch: 'switch',
      SwitchonChange: activeStatusDataApi
    },
    {
      width: 100,
      value: "is_featured",
      headerName: 'featured',
      field: 'is_featured',
      switch: 'switch',
      SwitchonChange: featureproductStatusDataApi
    },
    {
      width: 100,
      value: "is_trending",
      headerName: 'trending',
      field: 'is_trending',
      switch: 'switch',
      SwitchonChange: trendingproductStatusDataApi
    },
    {
      width: 150,
      value: 'action',
      headerName: 'action',
      field: 'action',
      view: 'view',
      edit: 'edit',
      deleted: 'deleted',
      deletedOnClick: deleteOnclickHandler,
      imageUpload: 'imageUpload',
      imageUploadOnClick: imagesUploadOnClick,
      editOnClick: editOnClickHandler,
      viewOnClick: viewOnClickHandler,
    },
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Product List'></CardHeader>
          <Divider />

          <TCCTableHeader value={searchFilter}
            isProductButton
            onChange={(e: any) => setSearchFilter(e.target.value)}
            variantProductClick={() => {
              Router.push("/product/add-product-variant")
            }}
            normalProductClick={() => {
              Router.push("/product/add-products")
            }}
          />
          <Box sx={{ width: '100%' }}>
            <TccDataTable
              column={column}
              rows={productList}
              handleSortChanges={handleChangeSortBy}
              pageSize={parseInt(pagination.per_page_rows.toString())}
              rowCount={pagination.total_items}
              page={pagination.current_page - 1}
              onPageChange={handleChangePerPageRows}
              iconTitle='Product'
            />
          </Box>
        </Card>
      </Grid>
      <DeleteDataModel showModel={showModel} toggle={(show: any) => setShowModel(show)} onClick={deleteProductApi} />

    </Grid>
  )
}

export default ProductList