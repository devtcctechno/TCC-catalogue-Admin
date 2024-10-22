import { config } from 'process'
import { apiEndPoints } from 'src/AppConstants'
import {
  IBusinessUser,
  ICommonDiamondGroupPagination,
  ICommonOrderPagination,
  ICommonPagination,
  ICommonReportPagination,
  IRoleConfiguration
} from 'src/data/interface'
import {
  getEncryptedText,
  getQueryUrlDiamondGroupPagiantion,
  getQueryUrlFormPagiantion,
  getQueryUrlOrderPagiantion,
  getQueryUrlReportPagination
} from 'src/utils/sharedFunction'
import { httpMethods, serviceMaker } from './ServiceWarpper'

export const ADMIN_LOGIN = (payload: any) => serviceMaker(`${apiEndPoints.ADMIN_LOGIN}`, httpMethods.POST, payload)

export const GET_ALL_ROLES = () => serviceMaker(`${apiEndPoints.GET_ALL_ROLES}?no_pagination=1`, httpMethods.GET)

export const GET_ALL_MENU_ITEMS = () =>
  serviceMaker(`${apiEndPoints.GET_ALL_MENU_ITEMS}?no_pagination=1`, httpMethods.GET)

export const GET_ALL_ACTIONS = () => serviceMaker(`${apiEndPoints.GET_ALL_ACTIONS}?no_pagination=1`, httpMethods.GET)

export const ADD_ROLE_CONFIGURATION = (payload: IRoleConfiguration) =>
  serviceMaker(`${apiEndPoints.ADD_ROLE_CONFIGURATION}`, httpMethods.POST, payload)

export const GET_ROLE_CONFIGURATION = (id: number) =>
  serviceMaker(`${apiEndPoints.GET_ROLE_CONFIGURATION}/${id}`, httpMethods.GET)

export const UPDATE_ROLE_CONFIGRATION = (payload: IRoleConfiguration, id: number) =>
  serviceMaker(`${apiEndPoints.UPDATE_ROLE_CONFIGRATION}/${id}`, httpMethods.PUT, payload)

export const GET_ALL_BUSINESS_USER = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.GET_ALL_BUSINESS_USER}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)

export const GET_BUSINESS_USER_BY_ID = (id: number) =>
  serviceMaker(`${apiEndPoints.GET_BUSINESS_USER_BY_ID}/${id}`, httpMethods.GET)

export const ADD_BUSINESS_USER = (payload: FormData) =>
  serviceMaker(`${apiEndPoints.ADD_BUSINESS_USER}`, httpMethods.POST_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

export const UPDATE_BUSINESS_USER = (payload: FormData, id: number) =>
  serviceMaker(
    `${apiEndPoints.UPDATE_BUSINESS_USER}/${encodeURIComponent(getEncryptedText(id.toString()))}`,
    httpMethods.PUT_CONFIG,
    payload,
    {
      headers: { 'Content-Type': 'multipart/form-data' }
    }
  )

export const DELETE_BUSINESS_USER = (id: number) =>
  serviceMaker(
    `${apiEndPoints.DELETE_BUSINESS_USER}/${encodeURIComponent(getEncryptedText(id.toString()))}`,
    httpMethods.DELETE
  )

export const GET_ACCESS_MENU_ITEMS = () => serviceMaker(`${apiEndPoints.GET_ACCESS_MENU_ITEMS}`, httpMethods.GET)

export const BANNER_ADD = (payload: any) =>
  serviceMaker(`${apiEndPoints.BANNER_ADD}`, httpMethods.POST_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const BANNER_EDIT = (payload: any) =>
  serviceMaker(`${apiEndPoints.BANNER_EDIT}`, httpMethods.PUT_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const BANNER_GET_ALL = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.BANNER_GET_ALL}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const BANNER_DELETE = (payload: any) => serviceMaker(`${apiEndPoints.BANNER_DELETE}`, httpMethods.POST, payload)
export const BANNER_STATUS = (payload: any) => serviceMaker(`${apiEndPoints.BANNER_STATUS}`, httpMethods.PUT, payload)

export const TEMPLATE_TWO_BANNER_ADD = (payload: any) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_TWO_BANNER_ADD}`, httpMethods.POST_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const TEMPLATE_TWO_BANNER_EDIT = (payload: any) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_TWO_BANNER_EDIT}`, httpMethods.PUT_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const TEMPLATE_TWO_BANNER_GET_ALL = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_TWO_BANNER_GET_ALL}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const TEMPLATE_TWO_BANNER_DELETE = (payload: any) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_TWO_BANNER_DELETE}`, httpMethods.POST, payload)
export const TEMPLATE_TWO_BANNER_STATUS = (payload: any) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_TWO_BANNER_STATUS}`, httpMethods.PUT, payload)

export const TEMPLATE_TWO_HOME_ABOUT_BANNER_ADD = (payload: any) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_TWO_HOME_ABOUT_BANNER_ADD}`, httpMethods.POST_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const TEMPLATE_TWO_HOME_ABOUT_BANNER_EDIT = (payload: any) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_TWO_HOME_ABOUT_BANNER_EDIT}`, httpMethods.PUT_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const TEMPLATE_TWO_HOME_ABOUT_BANNER_GET_ALL = (payload: ICommonPagination) =>
  serviceMaker(
    `${apiEndPoints.TEMPLATE_TWO_HOME_ABOUT_BANNER_GET_ALL}?${getQueryUrlFormPagiantion(payload)}`,
    httpMethods.GET
  )
export const TEMPLATE_TWO_HOME_ABOUT_BANNER_DELETE = (payload: any) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_TWO_HOME_ABOUT_BANNER_DELETE}`, httpMethods.POST, payload)
export const TEMPLATE_TWO_HOME_ABOUT_BANNER_STATUS = (payload: any) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_TWO_HOME_ABOUT_BANNER_STATUS}`, httpMethods.PUT, payload)

export const TEMPLATE_TWO_HOME_ABOUT_FEATURES_SECTION_ADD = (payload: any) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_TWO_HOME_ABOUT_FEATURES_SECTION_ADD}`, httpMethods.POST_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const TEMPLATE_TWO_HOME_ABOUT_FEATURES_SECTION_EDIT = (payload: any) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_TWO_HOME_ABOUT_FEATURES_SECTION_EDIT}`, httpMethods.PUT_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const TEMPLATE_TWO_HOME_ABOUT_FEATURES_SECTION_GET_ALL = (payload: ICommonPagination) =>
  serviceMaker(
    `${apiEndPoints.TEMPLATE_TWO_HOME_ABOUT_FEATURES_SECTION_GET_ALL}?${getQueryUrlFormPagiantion(payload)}`,
    httpMethods.GET
  )
export const TEMPLATE_TWO_HOME_ABOUT_FEATURES_SECTION_DELETE = (payload: any) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_TWO_HOME_ABOUT_FEATURES_SECTION_DELETE}`, httpMethods.POST, payload)
export const TEMPLATE_TWO_HOME_ABOUT_FEATURES_SECTION_STATUS = (payload: any) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_TWO_HOME_ABOUT_FEATURES_SECTION_STATUS}`, httpMethods.PUT, payload)

export const TEMPLATE_TWO_HOME_ABOUT_MARKETING_SECTION_ADD = (payload: any) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_TWO_HOME_ABOUT_MARKETING_SECTION_ADD}`, httpMethods.POST_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const TEMPLATE_TWO_HOME_ABOUT_MARKETING_SECTION_EDIT = (payload: any) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_TWO_HOME_ABOUT_MARKETING_SECTION_EDIT}`, httpMethods.PUT_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const TEMPLATE_TWO_HOME_ABOUT_MARKETING_SECTION_GET_ALL = (payload: ICommonPagination) =>
  serviceMaker(
    `${apiEndPoints.TEMPLATE_TWO_HOME_ABOUT_MARKETING_SECTION_GET_ALL}?${getQueryUrlFormPagiantion(payload)}`,
    httpMethods.GET
  )
export const TEMPLATE_TWO_HOME_ABOUT_MARKETING_SECTION_DELETE = (payload: any) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_TWO_HOME_ABOUT_MARKETING_SECTION_DELETE}`, httpMethods.POST, payload)
export const TEMPLATE_TWO_HOME_ABOUT_MARKETING_SECTION_STATUS = (payload: any) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_TWO_HOME_ABOUT_MARKETING_SECTION_STATUS}`, httpMethods.PUT, payload)

export const ADD_MARKETING_BANNER = (payload: any) =>
  serviceMaker(`${apiEndPoints.ADD_MARKETING_BANNER}`, httpMethods.POST_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const EDIT_MARKETING_BANNER = (payload: any) =>
  serviceMaker(`${apiEndPoints.EDIT_MARKETING_BANNER}`, httpMethods.PUT_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const GET_ALL_MARKETING_BANNER = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.GET_ALL_MARKETING_BANNER}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const DELETE_MARKETING_BANNER = (payload: any) =>
  serviceMaker(`${apiEndPoints.DELETE_MARKETING_BANNER}`, httpMethods.POST, payload)
export const STATUS_UPDATE_MARKETING_BANNER = (payload: any) =>
  serviceMaker(`${apiEndPoints.STATUS_UPDATE_MARKETING_BANNER}`, httpMethods.PUT, payload)

export const TEMPLATE_TWO_ADD_MARKETING_BANNER = (payload: any) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_TWO_ADD_MARKETING_BANNER}`, httpMethods.POST_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const TEMPLATE_TWO_EDIT_MARKETING_BANNER = (payload: any) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_TWO_EDIT_MARKETING_BANNER}`, httpMethods.PUT_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const TEMPLATE_TWO_GET_ALL_MARKETING_BANNER = (payload: ICommonPagination) =>
  serviceMaker(
    `${apiEndPoints.TEMPLATE_TWO_GET_ALL_MARKETING_BANNER}?${getQueryUrlFormPagiantion(payload)}`,
    httpMethods.GET
  )
export const TEMPLATE_TWO_DELETE_MARKETING_BANNER = (payload: any) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_TWO_DELETE_MARKETING_BANNER}`, httpMethods.POST, payload)
export const TEMPLATE_TWO_STATUS_UPDATE_MARKETING_BANNER = (payload: any) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_TWO_STATUS_UPDATE_MARKETING_BANNER}`, httpMethods.PUT, payload)

export const MAIN_CONTENT_HOME_ABOUT_EDIT = (payload: any) =>
  serviceMaker(`${apiEndPoints.MAIN_CONTENT_HOME_ABOUT_EDIT}`, httpMethods.PUT, payload)
export const GET_MAIN_HOME_ABOUT_SECTION = () =>
  serviceMaker(`${apiEndPoints.GET_MAIN_HOME_ABOUT_SECTION}`, httpMethods.GET)
export const ADD_HOME_ABOUT_SECTION = (payload: any) =>
  serviceMaker(`${apiEndPoints.ADD_HOME_ABOUT_SECTION}`, httpMethods.POST_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const EDIT_HOME_ABOUT_SECTION = (payload: any) =>
  serviceMaker(`${apiEndPoints.EDIT_HOME_ABOUT_SECTION}`, httpMethods.PUT_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const GET_ALL_HOME_ABOUT_SECTION = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.GET_ALL_HOME_ABOUT_SECTION}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const DELETE_HOME_ABOUT_SECTION = (payload: any) =>
  serviceMaker(`${apiEndPoints.DELETE_HOME_ABOUT_SECTION}`, httpMethods.POST, payload)
export const STATUS_UPDATE_HOME_ABOUT_SECTION = (payload: any) =>
  serviceMaker(`${apiEndPoints.STATUS_UPDATE_HOME_ABOUT_SECTION}`, httpMethods.PUT, payload)

export const ADD_FEATURES_SECTION = (payload: any) =>
  serviceMaker(`${apiEndPoints.ADD_FEATURES_SECTION}`, httpMethods.POST_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const EDIT_FEATURES_SECTION = (payload: any) =>
  serviceMaker(`${apiEndPoints.EDIT_FEATURES_SECTION}`, httpMethods.PUT_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const GET_ALL_FEATURES_SECTION = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.GET_ALL_FEATURES_SECTION}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const DELETE_FEATURES_SECTION = (payload: any) =>
  serviceMaker(`${apiEndPoints.DELETE_FEATURES_SECTION}`, httpMethods.POST, payload)
export const STATUS_UPDATE_FEATURES_SECTION = (payload: any) =>
  serviceMaker(`${apiEndPoints.STATUS_UPDATE_FEATURES_SECTION}`, httpMethods.PUT, payload)

export const TEMPLATE_TWO_ADD_FEATURES_SECTION = (payload: any) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_TWO_ADD_FEATURES_SECTION}`, httpMethods.POST_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const TEMPLATE_TWO_EDIT_FEATURES_SECTION = (payload: any) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_TWO_EDIT_FEATURES_SECTION}`, httpMethods.PUT_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const TEMPLATE_TWO_GET_ALL_FEATURES_SECTION = (payload: ICommonPagination) =>
  serviceMaker(
    `${apiEndPoints.TEMPLATE_TWO_GET_ALL_FEATURES_SECTION}?${getQueryUrlFormPagiantion(payload)}`,
    httpMethods.GET
  )
export const TEMPLATE_TWO_DELETE_FEATURES_SECTION = (payload: any) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_TWO_DELETE_FEATURES_SECTION}`, httpMethods.POST, payload)
export const TEMPLATE_TWO_STATUS_UPDATE_FEATURES_SECTION = (payload: any) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_TWO_STATUS_UPDATE_FEATURES_SECTION}`, httpMethods.PUT, payload)

// ** Template Three Banner
export const TEMPLATE_THREE_BANNER_ADD = (payload: any) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_THREE_BANNER}`, httpMethods.POST_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const TEMPLATE_THREE_BANNER_EDIT = (id: any, payload: any) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_THREE_BANNER}/${id}`, httpMethods.PUT_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const TEMPLATE_THREE_BANNER_GET_ALL = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_THREE_BANNER}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const TEMPLATE_THREE_BANNER_DELETE = (id: any) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_THREE_BANNER}/${id}`, httpMethods.DELETE)
export const TEMPLATE_THREE_BANNER_STATUS = (id: any) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_THREE_BANNER}/${id}`, httpMethods.PATCH)

// ** Template Three Diamond Section
export const TEMPLATE_THREE_DIAMOND_SECTION_ADD = (payload: any) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_THREE_DIAMOND_SECTION}`, httpMethods.POST_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const TEMPLATE_THREE_DIAMOND_SECTION_EDIT = (id: any, payload: any) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_THREE_DIAMOND_SECTION}/${id}`, httpMethods.PUT_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const TEMPLATE_THREE_DIAMOND_SECTION_GET_ALL = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_THREE_DIAMOND_SECTION}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const TEMPLATE_THREE_DIAMOND_SECTION_DELETE = (id: any) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_THREE_DIAMOND_SECTION}/${id}`, httpMethods.DELETE)
export const TEMPLATE_THREE_DIAMOND_SECTION_STATUS = (id: any) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_THREE_DIAMOND_SECTION}/${id}`, httpMethods.PATCH)

// ** Template Three Category Section
export const TEMPLATE_THREE_CATEGORY_SECTION_ADD = (payload: any) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_THREE_CATEGORY_SECTION}`, httpMethods.POST_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const TEMPLATE_THREE_CATEGORY_SECTION_EDIT = (id: any, payload: any) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_THREE_CATEGORY_SECTION}/${id}`, httpMethods.PUT_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const TEMPLATE_THREE_CATEGORY_SECTION_GET_ALL = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_THREE_CATEGORY_SECTION}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const TEMPLATE_THREE_CATEGORY_SECTION_DELETE = (id: any) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_THREE_CATEGORY_SECTION}/${id}`, httpMethods.DELETE)
export const TEMPLATE_THREE_CATEGORY_SECTION_STATUS = (id: any) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_THREE_CATEGORY_SECTION}/${id}`, httpMethods.PATCH)

// ** Template Three Jewelry Section
export const TEMPLATE_THREE_JEWELRY_SECTION_ADD = (payload: any) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_THREE_JEWELRY_SECTION}`, httpMethods.POST_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const TEMPLATE_THREE_JEWELRY_SECTION_EDIT = (id: any, payload: any) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_THREE_JEWELRY_SECTION}/${id}`, httpMethods.PUT_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const TEMPLATE_THREE_JEWELRY_SECTION_GET_ALL = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_THREE_JEWELRY_SECTION}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const TEMPLATE_THREE_JEWELRY_SECTION_DELETE = (id: any) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_THREE_JEWELRY_SECTION}/${id}`, httpMethods.DELETE)
export const TEMPLATE_THREE_JEWELRY_SECTION_STATUS = (id: any) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_THREE_JEWELRY_SECTION}/${id}`, httpMethods.PATCH)

// ** Template Three Product Model Section
export const TEMPLATE_THREE_PRODUCT_MODEL_SECTION_ADD = (payload: any) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_THREE_PRODUCT_MODEL_SECTION}`, httpMethods.POST_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const TEMPLATE_THREE_PRODUCT_MODEL_SECTION_EDIT = (id: any, payload: any) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_THREE_PRODUCT_MODEL_SECTION}/${id}`, httpMethods.PUT_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const TEMPLATE_THREE_PRODUCT_MODEL_SECTION_GET_ALL = (payload: ICommonPagination) =>
  serviceMaker(
    `${apiEndPoints.TEMPLATE_THREE_PRODUCT_MODEL_SECTION}?${getQueryUrlFormPagiantion(payload)}`,
    httpMethods.GET
  )
export const TEMPLATE_THREE_PRODUCT_MODEL_SECTION_DELETE = (id: any) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_THREE_PRODUCT_MODEL_SECTION}/${id}`, httpMethods.DELETE)
export const TEMPLATE_THREE_PRODUCT_MODEL_SECTION_STATUS = (id: any) =>
  serviceMaker(`${apiEndPoints.TEMPLATE_THREE_PRODUCT_MODEL_SECTION}/${id}`, httpMethods.PATCH)

// color
export const ADD_COLOR = (payload: any) => serviceMaker(`${apiEndPoints.COLOR}`, httpMethods.POST, payload)
export const EDIT_COLOR = (id: any, payload: any) =>
  serviceMaker(`${apiEndPoints.COLOR}/${id}`, httpMethods.PUT, payload)
export const GET_ALL_COLOR = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.COLOR}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const DELETE_COLOR = (id: any) => serviceMaker(`${apiEndPoints.COLOR}/${id}`, httpMethods.DELETE)
export const STATUS_UPDATE_COLOR = (id: any) => serviceMaker(`${apiEndPoints.COLOR}/${id}`, httpMethods.PATCH)

// brand
export const ADD_BRAND = (payload: any) => serviceMaker(`${apiEndPoints.BRAND}`, httpMethods.POST, payload)
export const EDIT_BRAND = (id: any, payload: any) =>
  serviceMaker(`${apiEndPoints.BRAND}/${id}`, httpMethods.PUT, payload)
export const GET_ALL_BRAND = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.BRAND}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const DELETE_BRAND = (id: any) => serviceMaker(`${apiEndPoints.BRAND}/${id}`, httpMethods.DELETE)
export const STATUS_UPDATE_BRAND = (id: any) => serviceMaker(`${apiEndPoints.BRAND}/${id}`, httpMethods.PATCH)
export const BRAND_DROPDOWN_LIST = () =>
  serviceMaker(`${apiEndPoints.BRAND_DROPDOWN_LIST}?is_active=1&no_pagination=1`, httpMethods.GET)

// collection
export const ADD_COLLECTION = (payload: any) => serviceMaker(`${apiEndPoints.COLLECTION}`, httpMethods.POST, payload)
export const EDIT_COLLECTION = (id: any, payload: any) =>
  serviceMaker(`${apiEndPoints.COLLECTION}/${id}`, httpMethods.PUT, payload)
export const GET_ALL_COLLECTION = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.COLLECTION}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const DELETE_COLLECTION = (id: any) => serviceMaker(`${apiEndPoints.COLLECTION}/${id}`, httpMethods.DELETE)
export const STATUS_UPDATE_COLLECTION = (id: any) => serviceMaker(`${apiEndPoints.COLLECTION}/${id}`, httpMethods.PATCH)

export const ADD_STATIC_PAGE = (payload: any) =>
  serviceMaker(`${apiEndPoints.ADD_STATIC_PAGE}`, httpMethods.POST, payload)
export const EDIT_STATIC_PAGE = (payload: any) =>
  serviceMaker(`${apiEndPoints.EDIT_STATIC_PAGE}`, httpMethods.PUT, payload)
export const GET_ALL_STATIC_PAGE = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.GET_ALL_STATIC_PAGE}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const DELETE_STATIC_PAGE = (payload: any) =>
  serviceMaker(`${apiEndPoints.DELETE_STATIC_PAGE}`, httpMethods.POST, payload)

export const STATUS_UPDATE_STATIC_PAGE = (payload: any) =>
  serviceMaker(`${apiEndPoints.STATUS_UPDATE_STATIC_PAGE}`, httpMethods.PUT, payload)

// carat size
export const CARAT_SIZE_ADD = (payload: any) =>
  serviceMaker(`${apiEndPoints.CARAT_SIZE}`, httpMethods.POST_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const CARAT_SIZE_GET_ALL = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.CARAT_SIZE}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const CARAT_SIZE_EDIT = (id: any, payload: any) =>
  serviceMaker(`${apiEndPoints.CARAT_SIZE}/${id}`, httpMethods.PUT_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const CARAT_SIZE_DELETE = (id: any) => serviceMaker(`${apiEndPoints.CARAT_SIZE}/${id}`, httpMethods.DELETE)
export const CARAT_SIZE_STATUS = (id: any) => serviceMaker(`${apiEndPoints.CARAT_SIZE}/${id}`, httpMethods.PATCH)

// metal tone
export const METAL_TONE_ADD = (payload: any) =>
  serviceMaker(`${apiEndPoints.METAL_TONE}`, httpMethods.POST_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const METAL_TONE_GET_ALL = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.METAL_TONE}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const METAL_TONE_EDIT = (id: any, payload: any) =>
  serviceMaker(`${apiEndPoints.METAL_TONE}/${id}`, httpMethods.PUT_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const METAL_TONE_DELETE = (id: any) => serviceMaker(`${apiEndPoints.METAL_TONE}/${id}`, httpMethods.DELETE)
export const METAL_TONE_STATUS = (id: any) => serviceMaker(`${apiEndPoints.METAL_TONE}/${id}`, httpMethods.PATCH)
export const METAL_TONE_MASTER = () => serviceMaker(`${apiEndPoints.METAL_TONE_MASTER}`, httpMethods.GET)

// currency
export const CURRENCY_ADD = (payload: any) => serviceMaker(`${apiEndPoints.CURRENCY}`, httpMethods.POST, payload)
export const CURRENCY_GET_ALL = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.CURRENCY}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const CURRENCY_EDIT = (id: any, payload: any) =>
  serviceMaker(`${apiEndPoints.CURRENCY}/${id}`, httpMethods.PUT, payload)
export const CURRENCY_DELETE = (id: any) => serviceMaker(`${apiEndPoints.CURRENCY}/${id}`, httpMethods.DELETE)
export const CURRENCY_STATUS = (id: any) => serviceMaker(`${apiEndPoints.CURRENCY}/${id}`, httpMethods.PATCH)
export const DEFAULT_CURRENCY_STATUS = (id: any) =>
  serviceMaker(`${apiEndPoints.DEFAULT_CURRENCY_STATUS}/${id}`, httpMethods.PATCH)

// gold karat
export const GOLD_KT_ADD = (payload: any) =>
  serviceMaker(`${apiEndPoints.GOLD_KT}`, httpMethods.POST_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const GOLD_KT_GET_ALL = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.GOLD_KT}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const GOLD_KT_EDIT = (id: any, payload: any) =>
  serviceMaker(`${apiEndPoints.GOLD_KT}/${id}`, httpMethods.PUT, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const GOLD_KT_DELETE = (id: any) => serviceMaker(`${apiEndPoints.GOLD_KT}/${id}`, httpMethods.DELETE)
export const GOLD_KT_STATUS = (id: any) => serviceMaker(`${apiEndPoints.GOLD_KT}/${id}`, httpMethods.PATCH)
export const GOLD_KT_MASTER = () => serviceMaker(`${apiEndPoints.GOLD_KT_MASTER}`, httpMethods.GET)

// setting style
export const SETTING_STYLE_ADD = (payload: any) =>
  serviceMaker(`${apiEndPoints.SETTING_STYLE}`, httpMethods.POST_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const SETTING_STYLE_GET_ALL = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.SETTING_STYLE}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const SETTING_STYLE_EDIT = (id: any, payload: any) =>
  serviceMaker(`${apiEndPoints.SETTING_STYLE}/${id}`, httpMethods.PUT_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const SETTING_STYLE_DELETE = (id: any) => serviceMaker(`${apiEndPoints.SETTING_STYLE}/${id}`, httpMethods.DELETE)
export const SETTING_STYLE_STATUS = (id: any) => serviceMaker(`${apiEndPoints.SETTING_STYLE}/${id}`, httpMethods.PATCH)

// shank
export const SHANKS_ADD = (payload: any) =>
  serviceMaker(`${apiEndPoints.SHANKS}`, httpMethods.POST_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const SHANKS_GET_ALL = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.SHANKS}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const SHANKS_EDIT = (id: any, payload: any) =>
  serviceMaker(`${apiEndPoints.SHANKS}/${id}`, httpMethods.PUT_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const SHANKS_DELETE = (id: any) => serviceMaker(`${apiEndPoints.SHANKS}/${id}`, httpMethods.DELETE)
export const SHANKS_STATUS = (id: any) => serviceMaker(`${apiEndPoints.SHANKS}/${id}`, httpMethods.PATCH)

// head
export const HEADS_ADD = (payload: any) =>
  serviceMaker(`${apiEndPoints.HEAD}`, httpMethods.POST_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const HEADS_GET_ALL = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.HEAD}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const HEADS_EDIT = (id: any, payload: any) =>
  serviceMaker(`${apiEndPoints.HEAD}/${id}`, httpMethods.PUT_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const HEADS_DELETE = (id: any) => serviceMaker(`${apiEndPoints.HEAD}/${id}`, httpMethods.DELETE)
export const HEADS_STATUS = (id: any) => serviceMaker(`${apiEndPoints.HEAD}/${id}`, httpMethods.PATCH)

// stone
export const GEMSTONES_ADD = (payload: any) =>
  serviceMaker(`${apiEndPoints.STONE}`, httpMethods.POST_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const GEMSTONES_GET_ALL = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.STONE}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const GEMSTONES_EDIT = (id: any, payload: any) =>
  serviceMaker(`${apiEndPoints.STONE}/${id}`, httpMethods.PUT_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const GEMSTONES_DELETE = (id: any) => serviceMaker(`${apiEndPoints.STONE}/${id}`, httpMethods.DELETE)
export const GEMSTONES_STATUS = (id: any) => serviceMaker(`${apiEndPoints.STONE}/${id}`, httpMethods.PATCH)
export const GEMSTONES_DROPDOWN = () => serviceMaker(`${apiEndPoints.GEMSTONES_DROPDOWN}`, httpMethods.GET)

// diamond shape
export const DIAMOND_SHAPE_ADD = (payload: any) =>
  serviceMaker(`${apiEndPoints.DIAMOND_SHAPE}`, httpMethods.POST_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const DIAMOND_SHAPE_GET_ALL = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.DIAMOND_SHAPE}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const DIAMOND_SHAPE_EDIT = (id: any, payload: any) =>
  serviceMaker(`${apiEndPoints.DIAMOND_SHAPE}/${id}`, httpMethods.PUT_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const DIAMOND_SHAPE_DELETE = (id: any) => serviceMaker(`${apiEndPoints.DIAMOND_SHAPE}/${id}`, httpMethods.DELETE)
export const DIAMOND_SHAPE_STATUS = (id: any) => serviceMaker(`${apiEndPoints.DIAMOND_SHAPE}/${id}`, httpMethods.PATCH)

// clarity
export const CLARITY_ADD = (payload: any) => serviceMaker(`${apiEndPoints.CLARITY}`, httpMethods.POST, payload)
export const CLARITY_GET_ALL = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.CLARITY}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const CLARITY_EDIT = (id: any, payload: any) =>
  serviceMaker(`${apiEndPoints.CLARITY}/${id}`, httpMethods.PUT, payload)
export const CLARITY_DELETE = (id: any) => serviceMaker(`${apiEndPoints.CLARITY}/${id}`, httpMethods.DELETE)
export const CLARITY_STATUS = (id: any) => serviceMaker(`${apiEndPoints.CLARITY}/${id}`, httpMethods.PATCH)

// cut
export const CUT_ADD = (payload: any) => serviceMaker(`${apiEndPoints.CUT}`, httpMethods.POST, payload)
export const CUT_GET_ALL = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.CUT}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const CUT_EDIT = (id: any, payload: any) => serviceMaker(`${apiEndPoints.CUT}/${id}`, httpMethods.PUT, payload)
export const CUT_DELETE = (id: any) => serviceMaker(`${apiEndPoints.CUT}/${id}`, httpMethods.DELETE)
export const CUT_STATUS = (id: any) => serviceMaker(`${apiEndPoints.CUT}/${id}`, httpMethods.PATCH)

// setting carat weight
export const SETTING_WEIGHT_ADD = (payload: any) =>
  serviceMaker(`${apiEndPoints.SETTING_WEIGHT}`, httpMethods.POST, payload)
export const SETTING_WEIGHT_GET_ALL = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.SETTING_WEIGHT}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const SETTING_WEIGHT_EDIT = (id: any, payload: any) =>
  serviceMaker(`${apiEndPoints.SETTING_WEIGHT}/${id}`, httpMethods.PUT, payload)
export const SETTING_WEIGHT_DELETE = (id: any) =>
  serviceMaker(`${apiEndPoints.SETTING_WEIGHT}/${id}`, httpMethods.DELETE)
export const SETTING_WEIGHT_STATUS = (id: any) =>
  serviceMaker(`${apiEndPoints.SETTING_WEIGHT}/${id}`, httpMethods.PATCH)

// item Size
export const ITEM_SIZE_ADD = (payload: any) => serviceMaker(`${apiEndPoints.ITEM_SIZE}`, httpMethods.POST, payload)
export const ITEM_SIZE_GET_ALL = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.ITEM_SIZE}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const ITEM_SIZE_EDIT = (id: any, payload: any) =>
  serviceMaker(`${apiEndPoints.ITEM_SIZE}/${id}`, httpMethods.PUT, payload)
export const ITEM_SIZE_DELETE = (id: any) => serviceMaker(`${apiEndPoints.ITEM_SIZE}/${id}`, httpMethods.DELETE)
export const ITEM_SIZE_STATUS = (id: any) => serviceMaker(`${apiEndPoints.ITEM_SIZE}/${id}`, httpMethods.PATCH)

// item length
export const ITEM_LENGTH_ADD = (payload: any) => serviceMaker(`${apiEndPoints.ITEM_LENGTH}`, httpMethods.POST, payload)
export const ITEM_LENGTH_GET_ALL = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.ITEM_LENGTH}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const ITEM_LENGTH_EDIT = (id: any, payload: any) =>
  serviceMaker(`${apiEndPoints.ITEM_LENGTH}/${id}`, httpMethods.PUT, payload)
export const ITEM_LENGTH_DELETE = (id: any) => serviceMaker(`${apiEndPoints.ITEM_LENGTH}/${id}`, httpMethods.DELETE)
export const ITEM_LENGTH_STATUS = (id: any) => serviceMaker(`${apiEndPoints.ITEM_LENGTH}/${id}`, httpMethods.PATCH)

// metal
export const METAL_MASTER_ADD = (payload: any) => serviceMaker(`${apiEndPoints.METAL}`, httpMethods.POST, payload)
export const METAL_MASTER_GET_ALL = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.METAL}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const METAL_MASTER_EDIT = (id: any, payload: any) =>
  serviceMaker(`${apiEndPoints.METAL}/${id}`, httpMethods.PUT, payload)
export const METAL_MASTER_DELETE = (id: any) => serviceMaker(`${apiEndPoints.METAL}/${id}`, httpMethods.DELETE)
export const METAL_MASTER_STATUS = (id: any) => serviceMaker(`${apiEndPoints.METAL}/${id}`, httpMethods.PATCH)

export const METAL_MASTER_DROPDOWN = () => serviceMaker(`${apiEndPoints.METAL_MASTER_DROPDOWN}`, httpMethods.GET)
export const CARAT_MASTER_DROPDOWN = (id: any) => serviceMaker(`${apiEndPoints.GOLD_KT}/${id}`, httpMethods.GET)
export const METAL_TONE_DROPDOWN = (payload: any) =>
  serviceMaker(`${apiEndPoints.METAL_TONE_DROPDOWN}`, httpMethods.POST, payload)

export const METAL_GROUP_MASTER_ADD = (payload: any) =>
  serviceMaker(`${apiEndPoints.METAL_GROUP_MASTER_ADD}`, httpMethods.POST, payload)
export const METAL_GROUP_MASTER_GET_ALL = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.METAL_GROUP_MASTER_GET_ALL}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const METAL_GROUP_MASTER_EDIT = (payload: any) =>
  serviceMaker(`${apiEndPoints.METAL_GROUP_MASTER_EDIT}`, httpMethods.PUT, payload)
export const METAL_GROUP_MASTER_DELETE = (payload: any) =>
  serviceMaker(`${apiEndPoints.METAL_GROUP_MASTER_DELETE}`, httpMethods.POST, payload)
export const METAL_GROUP_MASTER_STATUS = (payload: any) =>
  serviceMaker(`${apiEndPoints.METAL_GROUP_MASTER_STATUS}`, httpMethods.PUT, payload)

export const GET_COMPANY_INFO = () => serviceMaker(`${apiEndPoints.GET_COMPANY_INFO}`, httpMethods.GET)
export const EDIT_COMPANY_INFO = (payload: any) =>
  serviceMaker(`${apiEndPoints.EDIT_COMPANY_INFO}`, httpMethods.PUT_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

export const EDIT_METAL_RATE = (id: any, payload: any) =>
  serviceMaker(`${apiEndPoints.METAL_RATE}/${id}`, httpMethods.PUT, payload)

export const ADD_PRODUCT_DROPDOWN_LIST = () =>
  serviceMaker(`${apiEndPoints.ADD_PRODUCT_DROPDOWN_LIST}`, httpMethods.GET)
export const METAL_TONE_DROPDOWN_LIST = (payload: any) =>
  serviceMaker(`${apiEndPoints.PRODUCT_METAL_TONE_LIST}`, httpMethods.POST, payload)
export const ADD_PRODUCT_BASIC_DETAILS = (payload: any) =>
  serviceMaker(`${apiEndPoints.ADD_PRODUCT_BASIC_DETAILS}`, httpMethods.POST, payload)
export const ADD_PRODUCT_DETAILS = (payload: any) =>
  serviceMaker(`${apiEndPoints.ADD_PRODUCT_DETAILS}`, httpMethods.POST, payload)
export const EDIT_PRODUCT_DETAILS = (payload: any) =>
  serviceMaker(`${apiEndPoints.EDIT_PRODUCT_DETAILS}`, httpMethods.POST, payload)
export const EDIT_VARIANT_PRODUCT_DETAILS = (payload: any) =>
  serviceMaker(`${apiEndPoints.EDIT_VARIANT_PRODUCT_DETAILS}`, httpMethods.POST, payload)

export const ADD_PRODUCT_METAL_DIAMOND_DETAILS = (payload: any) =>
  serviceMaker(`${apiEndPoints.ADD_PRODUCT_METAL_DIAMOND_DETAILS}`, httpMethods.POST, payload)
export const GET_ALL_PRODUCT_LIST = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.GET_ALL_PRODUCT_LIST}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET, payload)
export const STATUS_UPDATE_PRODUCT = (payload: any) =>
  serviceMaker(`${apiEndPoints.STATUS_UPDATE_PRODUCT}`, httpMethods.POST, payload)
export const FEATURE_STATUS_UPDATE_PRODUCT = (payload: any) =>
  serviceMaker(`${apiEndPoints.FEATURE_STATUS_UPDATE_PRODUCT}`, httpMethods.POST, payload)
export const TRENDING_STATUS_UPDATE_PRODUCT = (payload: any) =>
  serviceMaker(`${apiEndPoints.TRENDING_STATUS_UPDATE_PRODUCT}`, httpMethods.POST, payload)
export const DELETE_PRODUCT_API = (payload: any) =>
  serviceMaker(`${apiEndPoints.DELETE_PRODUCT_API}`, httpMethods.POST, payload)
export const ADD_PRODUCT_IMAGES = (payload: any) =>
  serviceMaker(`${apiEndPoints.ADD_PRODUCT_IMAGES}`, httpMethods.POST_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const ADD_PRODUCT_VIDEO = (payload: any) =>
  serviceMaker(`${apiEndPoints.ADD_PRODUCT_VIDEO}`, httpMethods.POST_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const GET_BY_ID_PRODUCTS = (id: number) =>
  serviceMaker(`${apiEndPoints.GET_BY_ID_PRODUCTS}/${id}`, httpMethods.GET)
export const ADD_PRODUCT_MRTAL_DATA = (payload: any) =>
  serviceMaker(`${apiEndPoints.ADD_PRODUCT_MRTAL_DATA}`, httpMethods.POST, payload)
export const BULK_UPLOAD_RETAIL_PRODUCT = (payload: any) =>
  serviceMaker(`${apiEndPoints.BULK_UPLOAD_RETAIL_PRODUCT}`, httpMethods.POST_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const BULK_UPLOAD_DYNAMIC_PRODUCT = (payload: any) =>
  serviceMaker(`${apiEndPoints.BULK_UPLOAD_DYNAMIC_PRODUCT}`, httpMethods.POST_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const ZIPFILE_BULK_UPLOAD_ADD_PRODUCT = (payload: any) =>
  serviceMaker(`${apiEndPoints.ZIPFILE_BULK_UPLOAD_ADD_PRODUCT}`, httpMethods.POST_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const PRODUCT_IMAGE_DELETE = (payload: any) =>
  serviceMaker(`${apiEndPoints.PRODUCT_IMAGE_DELETE}`, httpMethods.POST, payload)
export const CONFIG_PRODUCT = (payload: any) =>
  serviceMaker(`${apiEndPoints.CONFIG_PRODUCT}`, httpMethods.POST_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const ETERNITY_CONFIG_PRODUCT = (payload: any) =>
  serviceMaker(`${apiEndPoints.ETERNITY_CONFIG_PRODUCT}`, httpMethods.POST_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const GET_ALL_CONFIGPRODUCT = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.GET_ALL_CONFIGPRODUCT}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET, payload)

export const GET_CONFIGURATOR_DETAIL = (id: number) =>
  serviceMaker(`${apiEndPoints.GET_CONFIGURATOR_DETAIL}/${id}`, httpMethods.GET)

export const GET_ETERNITY_BAND_CONFIGURATOR_DETAIL = (id: number) =>
  serviceMaker(`${apiEndPoints.GET_ETERNITY_BAND_CONFIGURATOR_DETAIL}/${id}`, httpMethods.GET)

export const GET_ALL_THREESTONECONFIGPRODUCT = (payload: ICommonPagination) =>
  serviceMaker(
    `${apiEndPoints.GET_ALL_THREESTONECONFIGPRODUCT}?${getQueryUrlFormPagiantion(payload)}`,
    httpMethods.GET,
    payload
  )
export const CONFIG_PRODUCT_DELETE = (payload: any) =>
  serviceMaker(`${apiEndPoints.CONFIG_PRODUCT_DELETE}`, httpMethods.PUT, payload)

export const ADD_BIRTHSTONE_PRODUCT_DETAILS = (payload: any) =>
  serviceMaker(`${apiEndPoints.ADD_BIRTHSTONE_PRODUCT_DETAILS}`, httpMethods.POST, payload)
export const GET_ALL_BIRTHSTONE_PRODUCTS = (payload: ICommonPagination) =>
  serviceMaker(
    `${apiEndPoints.GET_ALL_BIRTHSTONE_PRODUCTS}?${getQueryUrlFormPagiantion(payload)}`,
    httpMethods.GET,
    payload
  )
export const FEATURE_STATUS_UPDATE_BIRTHSTONE_PRODUCT = (payload: any) =>
  serviceMaker(`${apiEndPoints.FEATURE_STATUS_UPDATE_BIRTHSTONE_PRODUCT}`, httpMethods.PUT, payload)
export const TRENDING_STATUS_UPDATE_BIRTHSTONE_PRODUCT = (payload: any) =>
  serviceMaker(`${apiEndPoints.TRENDING_STATUS_UPDATE_BIRTHSTONE_PRODUCT}`, httpMethods.PUT, payload)
export const STATUS_UPDATE_BIRTHSTONE_PRODUCT = (payload: any) =>
  serviceMaker(`${apiEndPoints.STATUS_UPDATE_BIRTHSTONE_PRODUCT}`, httpMethods.PUT, payload)
export const DELETE_BIRTHSTONE_PRODUCT_API = (payload: any) =>
  serviceMaker(`${apiEndPoints.DELETE_BIRTHSTONE_PRODUCT_API}`, httpMethods.PUT, payload)
export const GET_BY_ID_BIRTHSTONE_PRODUCTS = (id: number) =>
  serviceMaker(`${apiEndPoints.GET_BY_ID_BIRTHSTONE_PRODUCTS}/${id}`, httpMethods.GET)
export const EDIT_BIRTHSTONE_PRODUCT_DETAILS = (payload: any) =>
  serviceMaker(`${apiEndPoints.EDIT_BIRTHSTONE_PRODUCT_DETAILS}`, httpMethods.POST, payload)
export const ADD_BIRTHSTONE_PRODUCT_IMAGE = (payload: any) =>
  serviceMaker(`${apiEndPoints.ADD_BIRTHSTONE_PRODUCT_IMAGE}`, httpMethods.POST_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

// ** Eternity Band
export const GET_ALL_ETERNITY_BAND_PRODUCT = (payload: ICommonPagination) =>
  serviceMaker(
    `${apiEndPoints.GET_ALL_ETERNITY_BAND_PRODUCT}?${getQueryUrlFormPagiantion(payload)}`,
    httpMethods.GET,
    payload
  )

// mm size
export const ADD_MM_SIZE = (payload: any) => serviceMaker(`${apiEndPoints.MM_SIZE}`, httpMethods.POST, payload)
export const EDIT_MM_SIZE = (id: any, payload: any) =>
  serviceMaker(`${apiEndPoints.MM_SIZE}/${id}`, httpMethods.PUT, payload)
export const GET_MM_SIZE = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.MM_SIZE}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const DELETE_MM_SIZE = (id: any) => serviceMaker(`${apiEndPoints.MM_SIZE}/${id}`, httpMethods.DELETE)
export const STATUS_UPDATE_MM_SIZE = (id: any) => serviceMaker(`${apiEndPoints.MM_SIZE}/${id}`, httpMethods.PATCH)

// diamond group master
export const ADD_DIAMOND_GROUP_MASTER = (payload: any) =>
  serviceMaker(`${apiEndPoints.DIAMOND_GROUP_MASTER}`, httpMethods.POST, payload)
export const EDIT_DIAMOND_GROUP_MASTER = (id: any, payload: any) =>
  serviceMaker(`${apiEndPoints.DIAMOND_GROUP_MASTER}/${id}`, httpMethods.PUT, payload)
export const GET_DIAMOND_GROUP_MASTER = (payload: ICommonDiamondGroupPagination) =>
  serviceMaker(`${apiEndPoints.DIAMOND_GROUP_MASTER}?${getQueryUrlDiamondGroupPagiantion(payload)}`, httpMethods.GET)
export const DELETE_DIAMOND_GROUP_MASTER = (id: any) =>
  serviceMaker(`${apiEndPoints.DIAMOND_GROUP_MASTER}/${id}`, httpMethods.DELETE)
export const STATUS_UPDATE_DIAMOND_GROUP_MASTER = (id: any) =>
  serviceMaker(`${apiEndPoints.DIAMOND_GROUP_MASTER}/${id}`, httpMethods.PATCH)
export const BULK_UPLOAD_DIAMOND_GROUP_MASTER = (payload: any) =>
  serviceMaker(`${apiEndPoints.BULK_UPLOAD_DIAMOND_GROUP_MASTER}`, httpMethods.POST_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const ADD_TYPE_DIAMOND_GROUP_MASTER = (payload: any) =>
  serviceMaker(`${apiEndPoints.DIAMOND_GROUP_MASTER}`, httpMethods.PUT, payload)
export const DIAMOND_GROUP_MASTER_CINFIG_STATUS = (payload: any) =>
  serviceMaker(`${apiEndPoints.DIAMOND_GROUP_MASTER_CINFIG_STATUS}`, httpMethods.PUT, payload)

export const GET_ALL_DIAMOND_GROUP_MASTER = () =>
  serviceMaker(apiEndPoints.DIAMOND_GROUP_MASTER + `?no_pagination=1`, httpMethods.GET)

// ** coupon
export const ADD_COUPON = (payload: any) => serviceMaker(`${apiEndPoints.COUPON}`, httpMethods.POST, payload)
export const EDIT_COUPON = (id: any, payload: any) =>
  serviceMaker(`${apiEndPoints.COUPON}/${id}`, httpMethods.PUT, payload)
export const GET_ALL_COUPON = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.COUPON}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const DELETE_COUPON = (id: any) => serviceMaker(`${apiEndPoints.COUPON}/${id}`, httpMethods.DELETE)
export const STATUS_COUPON = (id: any) => serviceMaker(`${apiEndPoints.COUPON}/${id}`, httpMethods.PATCH)
export const GET_BY_ID_COUPON = (id: number) => serviceMaker(`${apiEndPoints.COUPON}/${id}`, httpMethods.GET)

// ** settings
export const ADD_PAGE_SETTINGS = (payload: any) =>
  serviceMaker(`${apiEndPoints.PAGE_SETTINGS}`, httpMethods.POST, payload)
export const EDIT_PAGE_SETTINGS = (id: any, payload: any) =>
  serviceMaker(`${apiEndPoints.PAGE_SETTINGS}/${id}`, httpMethods.PUT, payload)
export const GET_ALL_PAGE_SETTINGS = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.PAGE_SETTINGS}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const DELETE_PAGE_SETTINGS = (id: any) => serviceMaker(`${apiEndPoints.PAGE_SETTINGS}/${id}`, httpMethods.DELETE)
export const STATUS_PAGE_SETTINGS = (id: any) => serviceMaker(`${apiEndPoints.PAGE_SETTINGS}/${id}`, httpMethods.PATCH)
export const RESTRICT_STATUS = (id: any) => serviceMaker(`${apiEndPoints.RESTRICT_STATUS}/${id}`, httpMethods.PATCH)
export const PAGE_LIST_DROPDOWN_LIST = () => serviceMaker(`${apiEndPoints.PAGE_LIST_DROPDOWN_LIST}`, httpMethods.GET)
export const ADD_META_TAG = (payload: any) => serviceMaker(`${apiEndPoints.META_TAG}`, httpMethods.POST, payload)
export const EDIT_META_TAG = (id: any, payload: any) =>
  serviceMaker(`${apiEndPoints.META_TAG}/${id}`, httpMethods.PUT, payload)
export const GET_ALL_META_TAG = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.META_TAG}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const DELETE_META_TAG = (id: any) => serviceMaker(`${apiEndPoints.META_TAG}/${id}`, httpMethods.DELETE)
export const STATUS_META_TAG = (id: any) => serviceMaker(`${apiEndPoints.META_TAG}/${id}`, httpMethods.PATCH)

// country
export const COUNTRY_ADD = (payload: any) => serviceMaker(`${apiEndPoints.COUNTRY}`, httpMethods.POST, payload)
export const COUNTRY_GET_ALL = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.COUNTRY}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const COUNTRY_EDIT = (id: any, payload: any) =>
  serviceMaker(`${apiEndPoints.COUNTRY}/${id}`, httpMethods.PUT, payload)
export const COUNTRY_DELETE = (id: any) => serviceMaker(`${apiEndPoints.COUNTRY}/${id}`, httpMethods.DELETE)
export const COUNTRY_STATUS = (id: any) => serviceMaker(`${apiEndPoints.COUNTRY}/${id}`, httpMethods.PATCH)

// state
export const STATE_DROPDOWN_LIST = () =>
  serviceMaker(`${apiEndPoints.COUNTRY}?is_active=1&no_pagination=1`, httpMethods.GET)
export const STATE_ADD = (payload: any) => serviceMaker(`${apiEndPoints.STATE}`, httpMethods.POST, payload)
export const STATE_GET_ALL = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.STATE}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const STATE_EDIT = (id: any, payload: any) =>
  serviceMaker(`${apiEndPoints.STATE}/${id}`, httpMethods.PUT, payload)
export const STATE_DELETE = (id: any) => serviceMaker(`${apiEndPoints.STATE}/${id}`, httpMethods.DELETE)
export const STATE_STATUS = (id: any) => serviceMaker(`${apiEndPoints.STATE}/${id}`, httpMethods.PATCH)

// city
export const CITY_DROPDOWN_LIST = () =>
  serviceMaker(`${apiEndPoints.STATE}?is_active=1&no_pagination=1`, httpMethods.GET)
export const CITY_ADD = (payload: any) => serviceMaker(`${apiEndPoints.CITY}`, httpMethods.POST, payload)
export const CITY_GET_ALL = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.CITY}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const CITY_EDIT = (id: any, payload: any) => serviceMaker(`${apiEndPoints.CITY}/${id}`, httpMethods.PUT, payload)
export const CITY_DELETE = (id: any) => serviceMaker(`${apiEndPoints.CITY}/${id}`, httpMethods.DELETE)
export const CITY_STATUS = (id: any) => serviceMaker(`${apiEndPoints.CITY}/${id}`, httpMethods.PATCH)

export const CUSTOMER_COUNTRY = () =>
  serviceMaker(`${apiEndPoints.CUSTOMER_COUNTRY}?is_active=1&no_pagination=1`, httpMethods.GET)
export const CUSTOMER_ADD = (payload: any) =>
  serviceMaker(`${apiEndPoints.CUSTOMER_ADD}`, httpMethods.POST_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const CUSTOMER_GET_ALL = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.CUSTOMER_GET_ALL}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const CUSTOMER_EDIT = (payload: any) =>
  serviceMaker(`${apiEndPoints.CUSTOMER_EDIT}`, httpMethods.PUT_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const CUSTOMER_DELETE = (payload: any) =>
  serviceMaker(`${apiEndPoints.CUSTOMER_DELETE}`, httpMethods.POST, payload)
export const CUSTOMER_STATUS = (payload: any) =>
  serviceMaker(`${apiEndPoints.CUSTOMER_STATUS}`, httpMethods.PUT, payload)
export const CUSTOMER_GET_BY_ID = (id: number) =>
  serviceMaker(`${apiEndPoints.CUSTOMER_GET_BY_ID}/${id}`, httpMethods.GET)

export const TESTIMONIAL_ADD = (payload: any) =>
  serviceMaker(`${apiEndPoints.TESTIMONIAL_ADD}`, httpMethods.POST_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const TESTIMONIAL_GET_ALL = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.TESTIMONIAL_GET_ALL}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const TESTIMONIAL_EDIT = (payload: any) =>
  serviceMaker(`${apiEndPoints.TESTIMONIAL_EDIT}`, httpMethods.PUT_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const TESTIMONIAL_DELETE = (payload: any) =>
  serviceMaker(`${apiEndPoints.TESTIMONIAL_DELETE}`, httpMethods.POST, payload)
export const TESTIMONIAL_STATUS = (payload: any) =>
  serviceMaker(`${apiEndPoints.TESTIMONIAL_STATUS}`, httpMethods.PUT, payload)
export const GET_ALL_CATEGORY = () => serviceMaker(`${apiEndPoints.GET_ALL_CATEGORY}`, httpMethods.GET)

export const ADD_CATEGORY = (payload: any) =>
  serviceMaker(`${apiEndPoints.ADD_CATEGORY}`, httpMethods.POST_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const EDIT_CATEGORY = (payload: any) =>
  serviceMaker(`${apiEndPoints.EDIT_CATEGORY}`, httpMethods.PUT_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const DELETE_CATEGORY = (payload: any) =>
  serviceMaker(`${apiEndPoints.DELETE_CATEGORY}`, httpMethods.POST, payload)
export const STATUS_UPDATE_CATEGORY = (payload: any) =>
  serviceMaker(`${apiEndPoints.STATUS_UPDATE_CATEGORY}`, httpMethods.PUT, payload)
export const SEARCHABLE_CATEGORY = (payload: any) =>
  serviceMaker(`${apiEndPoints.SEARCHABLE_CATEGORY}`, httpMethods.PUT, payload)

export const TAG_ADD = (payload: any) => serviceMaker(`${apiEndPoints.TAG_ADD}`, httpMethods.POST, payload)
export const TAG_GET_ALL = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.TAG_GET_ALL}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const TAG_EDIT = (payload: any) => serviceMaker(`${apiEndPoints.TAG_EDIT}`, httpMethods.PUT, payload)
export const TAG_DELETE = (payload: any) => serviceMaker(`${apiEndPoints.TAG_DELETE}`, httpMethods.POST, payload)
export const TAG_STATUS = (payload: any) => serviceMaker(`${apiEndPoints.TAG_STATUS}`, httpMethods.PUT, payload)

export const ADD_MARKETING_POPUP = (payload: any) =>
  serviceMaker(`${apiEndPoints.ADD_MARKETING_POPUP}`, httpMethods.POST_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const EDIT_MARKETING_POPUP = (payload: any) =>
  serviceMaker(`${apiEndPoints.EDIT_MARKETING_POPUP}`, httpMethods.PUT_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const GET_ALL_MARKETING_POPUP = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.GET_ALL_MARKETING_POPUP}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const DELETE_MARKETING_POPUP = (payload: any) =>
  serviceMaker(`${apiEndPoints.DELETE_MARKETING_POPUP}`, httpMethods.POST, payload)
export const STATUS_MARKETING_POPUP = (payload: any) =>
  serviceMaker(`${apiEndPoints.STATUS_MARKETING_POPUP}`, httpMethods.PUT, payload)

export const ADD_BLOG = (payload: any) =>
  serviceMaker(`${apiEndPoints.ADD_BLOG}`, httpMethods.POST_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const EDIT_BLOG = (payload: any) =>
  serviceMaker(`${apiEndPoints.EDIT_BLOG}`, httpMethods.PUT_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const GET_ALL_BLOG = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.GET_ALL_BLOG}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const DELETE_BLOG = (payload: any) => serviceMaker(`${apiEndPoints.DELETE_BLOG}`, httpMethods.POST, payload)
export const GET_BY_ID_BLOG = (payload: any) =>
  serviceMaker(`${apiEndPoints.GET_BY_ID_BLOG}`, httpMethods.POST, payload)

export const GET_ALL_WISHLIST = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.GET_ALL_WISHLIST}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const GET_ALL_CART_PRODUCT = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.GET_ALL_CART_PRODUCT}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)

export const GET_ALL_GENERAL_ENQUIRIES = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.GET_ALL_GENERAL_ENQUIRIES}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const GET_ALL_PRODUCT_ENQUIRIES = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.GET_ALL_PRODUCT_ENQUIRIES}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const PRODUCT_INQUIRIES_DETAIL = (payload: any) =>
  serviceMaker(`${apiEndPoints.PRODUCT_INQUIRIES_DETAIL}`, httpMethods.POST, payload)
export const UPDATE_PRODUCT_INQUIRIES = (payload: any) =>
  serviceMaker(`${apiEndPoints.UPDATE_PRODUCT_INQUIRIES}`, httpMethods.POST, payload)

export const GET_ALL_CUSTOMER_REVIEW = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.GET_ALL_CUSTOMER_REVIEW}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const STATUS_CUSTOMER_REVIEW = (payload: any) =>
  serviceMaker(`${apiEndPoints.STATUS_CUSTOMER_REVIEW}`, httpMethods.PUT, payload)

export const GET_ALL_ORDERS = (payload: ICommonOrderPagination) =>
  serviceMaker(`${apiEndPoints.GET_ALL_ORDERS}?${getQueryUrlOrderPagiantion(payload)}`, httpMethods.GET)
export const ORDERS_DETAIL = (payload: any) => serviceMaker(`${apiEndPoints.ORDERS_DETAIL}`, httpMethods.POST, payload)
export const ORDER_STATUS_UPDATE = (payload: any) =>
  serviceMaker(`${apiEndPoints.ORDER_STATUS_UPDATE}`, httpMethods.PUT, payload)
export const DELIVERY_STATUS = (payload: any) =>
  serviceMaker(`${apiEndPoints.DELIVERY_STATUS}`, httpMethods.PUT, payload)
export const INVOICE_DETAIL = (payload: any) =>
  serviceMaker(`${apiEndPoints.INVOICE_DETAIL}`, httpMethods.POST, payload)
export const GET_ORDER_TRANSACTION = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.GET_ORDER_TRANSACTION}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)

export const GET_ALL_DASHBOARD = () => serviceMaker(`${apiEndPoints.GET_ALL_DASHBOARD}`, httpMethods.GET)

export const SIDE_SETTING_STYLE_ADD = (payload: any) =>
  serviceMaker(`${apiEndPoints.SIDE_SETTING_STYLE}`, httpMethods.POST_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const SIDE_SETTING_STYLE_GET_ALL = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.SIDE_SETTING_STYLE}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const SIDE_SETTING_STYLE_EDIT = (id: any, payload: any) =>
  serviceMaker(`${apiEndPoints.SIDE_SETTING_STYLE}/${id}`, httpMethods.PUT_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const SIDE_SETTING_STYLE_DELETE = (id: any) =>
  serviceMaker(`${apiEndPoints.SIDE_SETTING_STYLE}/${id}`, httpMethods.DELETE)
export const SIDE_SETTING_STYLE_STATUS = (id: any) =>
  serviceMaker(`${apiEndPoints.SIDE_SETTING_STYLE}/${id}`, httpMethods.PATCH)

export const USER_SUBSCRIPTION_LIST = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.USER_SUBSCRIPTION_LIST}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const USER_SUBSCRIPTION_STATUS = (payload: any) =>
  serviceMaker(`${apiEndPoints.USER_SUBSCRIPTION_STATUS}`, httpMethods.PUT, payload)

// tax
export const TAX_ADD = (payload: any) => serviceMaker(`${apiEndPoints.TAX}`, httpMethods.POST, payload)
export const TAX_GET_ALL = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.TAX}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const TAX_EDIT = (id: any, payload: any) => serviceMaker(`${apiEndPoints.TAX}/${id}`, httpMethods.PUT, payload)
export const TAX_DELETE = (id: any) => serviceMaker(`${apiEndPoints.TAX}/${id}`, httpMethods.DELETE)
export const TAX_STATUS = (id: any) => serviceMaker(`${apiEndPoints.TAX}/${id}`, httpMethods.PATCH)

export const CHANGE_PASSWORD = (payload: any) =>
  serviceMaker(`${apiEndPoints.CHANGE_PASSWORD}`, httpMethods.POST, payload)
export const FORGOT_PASSWORD = (payload: any) =>
  serviceMaker(`${apiEndPoints.FORGOT_PASSWORD}`, httpMethods.POST, payload)
export const RESET_PASSWORD = (payload: any) =>
  serviceMaker(`${apiEndPoints.RESET_PASSWORD}`, httpMethods.POST, payload)
export const CONFIG_MASTER_DROPDOWN = () => serviceMaker(`${apiEndPoints.CONFIG_MASTER_DROPDOWN}`, httpMethods.GET)
export const CONFIG_DROPDOWN_DATA = () => serviceMaker(`${apiEndPoints.CONFIG_DROPDOWN_DATA}`, httpMethods.GET)

export const GIFTSET_ADD = (payload: any) =>
  serviceMaker(`${apiEndPoints.GIFTSET_ADD}`, httpMethods.POST_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const GIFTSET_EDIT = (payload: any) =>
  serviceMaker(`${apiEndPoints.GIFTSET_EDIT}`, httpMethods.POST_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const GIFTSET_GET_ALL = (payload: ICommonPagination) =>
  serviceMaker(`${apiEndPoints.GIFTSET_GET_ALL}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)
export const GIFTSET_DELETE = (payload: any) =>
  serviceMaker(`${apiEndPoints.GIFTSET_DELETE}`, httpMethods.POST, payload)
export const GIFTSET_STATUS = (payload: any) =>
  serviceMaker(`${apiEndPoints.GIFTSET_STATUS}`, httpMethods.POST, payload)
export const GIFTSET_GET_BY_ID = (payload: any) =>
  serviceMaker(`${apiEndPoints.GIFTSET_GET_BY_ID}`, httpMethods.POST, payload)
export const GIFTSET_IMAGE_DELETE = (payload: any) =>
  serviceMaker(`${apiEndPoints.GIFTSET_IMAGE_DELETE}`, httpMethods.POST, payload)

export const GET_ALL_CUSTOMER_REPORT = (payload: ICommonReportPagination) =>
  serviceMaker(`${apiEndPoints.GET_ALL_CUSTOMER_REPORT}?${getQueryUrlReportPagination(payload)}`, httpMethods.GET)
export const GET_ALL_CUSTOMER_SUBSCRIBER = (payload: ICommonReportPagination) =>
  serviceMaker(`${apiEndPoints.GET_ALL_CUSTOMER_SUBSCRIBER}?${getQueryUrlReportPagination(payload)}`, httpMethods.GET)
export const GET_ALL_WISHLIST_PRODUCT = (payload: ICommonReportPagination) =>
  serviceMaker(`${apiEndPoints.GET_ALL_WISHLIST_PRODUCT}?${getQueryUrlReportPagination(payload)}`, httpMethods.GET)
export const GET_ALL_CARTLIST_PRODUCT = (payload: ICommonReportPagination) =>
  serviceMaker(`${apiEndPoints.GET_ALL_CARTLIST_PRODUCT}?${getQueryUrlReportPagination(payload)}`, httpMethods.GET)
export const GET_ALL_TOP_SELLING_PRODUCT = (payload: ICommonReportPagination) =>
  serviceMaker(`${apiEndPoints.GET_ALL_TOP_SELLING_PRODUCT}?${getQueryUrlReportPagination(payload)}`, httpMethods.GET)

//  MASTER
export const ADD_MASTER = (payload: any) =>
  serviceMaker(`${apiEndPoints.MASTER}`, httpMethods.POST_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

export const EDIT_MASTER = (payload: any, id: any) =>
  serviceMaker(`${apiEndPoints.MASTER}${id}/`, httpMethods.PUT_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

export const DELETE_MASTER = (id: any, master_type: any) =>
  serviceMaker(`${apiEndPoints.MASTER}${id}/${master_type}`, httpMethods.DELETE)

export const STATUS_UPDATE_MASTER = (id: any, master_type: any) =>
  serviceMaker(`${apiEndPoints.MASTER}${id}/${master_type}`, httpMethods.PATCH)

export const GET_ALL_MASTER = (payload: ICommonPagination, master_type: any) =>
  serviceMaker(`${apiEndPoints.GET_ALL_MASTER}${master_type}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)

// Loose Diamond
export const LOOSE_DIAMOND_BULK = (payload: any) =>
  serviceMaker(`${apiEndPoints.LOOSE_DIAMOND_BULK}`, httpMethods.POST_CONFIG, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

export const LOOSE_DIAMOND_LIST = (payload: any) =>
  serviceMaker(`${apiEndPoints.LOOSE_DIAMOND}?${getQueryUrlFormPagiantion(payload)}`, httpMethods.GET)

export const LOOSE_DIAMOND_DETAIL = (product_id: string) =>
  serviceMaker(`${apiEndPoints.LOOSE_DIAMOND}/${product_id}`, httpMethods.GET)

export const LOOSE_DIAMOND_DELETE = (product_id: string) =>
  serviceMaker(`${apiEndPoints.DELETE_LOOSE_DIAMOND}/${product_id}`, httpMethods.DELETE)

export const GET_MASTER_LIST_DATA = () => serviceMaker(`${apiEndPoints.GET_MASTER_LIST_DATA}`, httpMethods.GET)

export const EDIT_CONFIG_MASTER = (config_key: string, payload: any) =>
  serviceMaker(apiEndPoints.CONFIG_MASTER + config_key, httpMethods.PUT, payload)
export const ADD_INFO = (payload: any) => serviceMaker(`${apiEndPoints.ADD_INFO}`, httpMethods.POST, payload)
export const GET_INFO = (key: any) => serviceMaker(`${apiEndPoints.GET_INFO}/${key}`, httpMethods.GET)
