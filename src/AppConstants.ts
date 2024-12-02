import { number } from 'yup'
import { ENCRYPT_DECRYPT_IV, ENCRYPT_DECRYPT_KEY } from './AppConfig'
import crypto from 'crypto'
import { GET_DIAMOND_GROUP_MASTER, PAGE_LIST_DROPDOWN_LIST } from './services/AdminServices'
export const apiEndPoints = {
  ADMIN_LOGIN: 'admin/login',
  GET_ALL_ROLES: 'roles',
  GET_ALL_MENU_ITEMS: 'menu-items',
  GET_ALL_ACTIONS: 'actions',
  ADD_ROLE_CONFIGURATION: 'role-configuration',
  GET_ROLE_CONFIGURATION: 'role-configuration',
  UPDATE_ROLE_CONFIGRATION: 'role-configuration',
  GET_ALL_BUSINESS_USER: 'business-user',
  GET_BUSINESS_USER_BY_ID: 'business-user',
  ADD_BUSINESS_USER: 'business-user',
  UPDATE_BUSINESS_USER: 'business-user',
  DELETE_BUSINESS_USER: 'business-user',
  GET_ACCESS_MENU_ITEMS: 'user-access-menu-items',
  GET_MASTER_LIST_DATA: 'master-list',
  LOGIN: 'login',

  CURRENCY: 'currency',
  DEFAULT_CURRENCY_STATUS: 'currency/default',

  // carat size
  CARAT_SIZE: 'attribute/carat-size',

  METAL_TONE: 'attribute/metal-tone',
  METAL_TONE_MASTER: 'attribute/metal-master-list',

  // gold karat
  GOLD_KT: '/attribute/gold-karat',
  GOLD_KT_MASTER: 'attribute/metal-master-list',

  // setting type
  SETTING_STYLE: 'attribute/setting-type',

  // shank
  SHANKS: 'attribute/shank',

  // head
  HEAD: 'attribute/head',

  // stone
  STONE: 'attribute/stone',
  GEMSTONES_DROPDOWN: 'attribute/tone-list',

  // diamond shape
  DIAMOND_SHAPE: 'attribute/diamond-shape',

  // clarity
  CLARITY: 'attribute/clarity',

  // cut
  CUT: 'attribute/cut',

  // setting carat weight
  SETTING_WEIGHT: 'attribute/setting-weight',

  COLOR: 'attribute/color',

  BRAND: 'attribute/brand',
  BRAND_DROPDOWN_LIST: 'attribute/brand-list',

  // ** coupon
  COUPON: 'coupon',

  // ** settings
  PAGE_SETTINGS: 'page',
  RESTRICT_STATUS: 'restrict-page',
  PAGE_LIST_DROPDOWN_LIST: 'page-list',
  META_TAG: 'meta-data',

  // collection
  COLLECTION: 'attribute/collection',

  BANNER_ADD: 'banners',
  BANNER_GET_ALL: 'banners',
  BANNER_EDIT: 'banners/edit',
  BANNER_DELETE: 'banners/delete',
  BANNER_STATUS: 'banners/status',

  TEMPLATE_TWO_BANNER_ADD: 'template/two/banners',
  TEMPLATE_TWO_BANNER_GET_ALL: 'template/two/banners',
  TEMPLATE_TWO_BANNER_EDIT: 'template/two/banners/edit',
  TEMPLATE_TWO_BANNER_DELETE: 'template/two/banners/delete',
  TEMPLATE_TWO_BANNER_STATUS: 'template/two/banners/status',

  TEMPLATE_TWO_HOME_ABOUT_BANNER_ADD: 'template/two/home-about/banners',
  TEMPLATE_TWO_HOME_ABOUT_BANNER_GET_ALL: 'template/two/home-about/banners',
  TEMPLATE_TWO_HOME_ABOUT_BANNER_EDIT: 'template/two/home-about/banners/edit',
  TEMPLATE_TWO_HOME_ABOUT_BANNER_DELETE: 'template/two/home-about/banners/delete',
  TEMPLATE_TWO_HOME_ABOUT_BANNER_STATUS: 'template/two/home-about/banners/status',

  TEMPLATE_TWO_HOME_ABOUT_FEATURES_SECTION_ADD: 'template/two/home-about/featureSection/add',
  TEMPLATE_TWO_HOME_ABOUT_FEATURES_SECTION_GET_ALL: 'template/two/home-about/featureSection',
  TEMPLATE_TWO_HOME_ABOUT_FEATURES_SECTION_EDIT: 'template/two/home-about/featureSection/edit',
  TEMPLATE_TWO_HOME_ABOUT_FEATURES_SECTION_DELETE: 'template/two/home-about/featureSection/delete',
  TEMPLATE_TWO_HOME_ABOUT_FEATURES_SECTION_STATUS: 'template/two/home-about/featureSection/status',

  TEMPLATE_TWO_HOME_ABOUT_MARKETING_SECTION_ADD: 'template/two/home-about/marketingSection/add',
  TEMPLATE_TWO_HOME_ABOUT_MARKETING_SECTION_GET_ALL: 'template/two/home-about/marketingSection',
  TEMPLATE_TWO_HOME_ABOUT_MARKETING_SECTION_EDIT: 'template/two/home-about/marketingSection/edit',
  TEMPLATE_TWO_HOME_ABOUT_MARKETING_SECTION_DELETE: 'template/two/home-about/marketingSection/delete',
  TEMPLATE_TWO_HOME_ABOUT_MARKETING_SECTION_STATUS: 'template/two/home-about/marketingSection/status',

  ADD_MARKETING_BANNER: 'marketingBanner/add',
  GET_ALL_MARKETING_BANNER: 'marketingBanner',
  EDIT_MARKETING_BANNER: 'marketingBanner/edit',
  DELETE_MARKETING_BANNER: 'marketingBanner/delete',
  STATUS_UPDATE_MARKETING_BANNER: 'marketingBanner/status',

  TEMPLATE_TWO_ADD_MARKETING_BANNER: 'template/two/marketingBanner/add',
  TEMPLATE_TWO_GET_ALL_MARKETING_BANNER: 'template/two/marketingBanner',
  TEMPLATE_TWO_EDIT_MARKETING_BANNER: 'template/two/marketingBanner/edit',
  TEMPLATE_TWO_DELETE_MARKETING_BANNER: 'template/two/marketingBanner/delete',
  TEMPLATE_TWO_STATUS_UPDATE_MARKETING_BANNER: 'template/two/marketingBanner/status',

  GET_MAIN_HOME_ABOUT_SECTION: 'about/main',
  MAIN_CONTENT_HOME_ABOUT_EDIT: 'about/main/edit',
  ADD_HOME_ABOUT_SECTION: 'about/sub/add',
  GET_ALL_HOME_ABOUT_SECTION: 'about/sub',
  EDIT_HOME_ABOUT_SECTION: 'about/sub/edit',
  DELETE_HOME_ABOUT_SECTION: 'about/sub/delete',
  STATUS_UPDATE_HOME_ABOUT_SECTION: 'about/sub/status',

  ADD_FEATURES_SECTION: 'featureSection/add',
  GET_ALL_FEATURES_SECTION: 'featureSection',
  EDIT_FEATURES_SECTION: 'featureSection/edit',
  DELETE_FEATURES_SECTION: 'featureSection/delete',
  STATUS_UPDATE_FEATURES_SECTION: 'featureSection/status',

  TEMPLATE_TWO_ADD_FEATURES_SECTION: 'template/two/featureSection/add',
  TEMPLATE_TWO_GET_ALL_FEATURES_SECTION: 'template/two/featureSection',
  TEMPLATE_TWO_EDIT_FEATURES_SECTION: 'template/two/featureSection/edit',
  TEMPLATE_TWO_DELETE_FEATURES_SECTION: 'template/two/featureSection/delete',
  TEMPLATE_TWO_STATUS_UPDATE_FEATURES_SECTION: 'template/two/featureSection/status',

  ADD_STATIC_PAGE: 'staticPage/add',
  GET_ALL_STATIC_PAGE: 'staticPage',
  EDIT_STATIC_PAGE: 'staticPage/edit',
  DELETE_STATIC_PAGE: 'staticPage/delete',
  STATUS_UPDATE_STATIC_PAGE: 'staticPage/status',

  // ** Template Three
  TEMPLATE_THREE_BANNER: 'template-three/banner',
  TEMPLATE_THREE_DIAMOND_SECTION: 'template-three/diamond-section',
  TEMPLATE_THREE_CATEGORY_SECTION: 'template-three/category-section',
  TEMPLATE_THREE_JEWELRY_SECTION: 'template-three/jewelry-section',
  TEMPLATE_THREE_PRODUCT_MODEL_SECTION: 'product-model',

  // item size
  ITEM_SIZE: 'attribute/size',

  // item length
  ITEM_LENGTH: 'attribute/length',

  // metal
  METAL: 'attribute/metal',

  METAL_MASTER_DROPDOWN: 'attribute/metal-master-list',
  METAL_TONE_DROPDOWN: 'attribute/metalTone/list',

  METAL_GROUP_MASTER_ADD: 'attribute/metalGroupMaster/add',
  METAL_GROUP_MASTER_GET_ALL: 'attribute/metalGroupMaster',
  METAL_GROUP_MASTER_EDIT: 'attribute/metalGroupMaster/edit',
  METAL_GROUP_MASTER_DELETE: 'attribute/metalGroupMaster/delete',
  METAL_GROUP_MASTER_STATUS: 'attribute/metalGroupMaster/status',
  GET_COMPANY_INFO: '/companyinfo',
  EDIT_COMPANY_INFO: '/companyinfo/edit',

  // rate
  METAL_RATE: '/attribute/metal-rate',

  ADD_PRODUCT_DROPDOWN_LIST: '/add-product/dropDown/list',
  PRODUCT_METAL_TONE_LIST: '/product/metalTone',
  ADD_PRODUCT_BASIC_DETAILS: '/product-basic-details',
  ADD_PRODUCT_DETAILS: '/product/add/data',

  EDIT_PRODUCT_DETAILS: '/product/edit/data',
  EDIT_VARIANT_PRODUCT_DETAILS: '/product/variant',
  ADD_PRODUCT_METAL_DIAMOND_DETAILS: '/product-metal-diamond-details',
  GET_ALL_PRODUCT_LIST: '/product',
  ADD_PRODUCT_IMAGES: '/product-images',
  STATUS_UPDATE_PRODUCT: '/active-inactive-product',
  TRENDING_STATUS_UPDATE_PRODUCT: '/product/trending/status',
  FEATURE_STATUS_UPDATE_PRODUCT: '/product/featured/status',
  DELETE_PRODUCT_API: '/product',
  ADD_PRODUCT_VIDEO: '/product-videos',
  GET_BY_ID_PRODUCTS: '/product',
  ADD_PRODUCT_MRTAL_DATA: '/product/add/metal',
  BULK_UPLOAD_RETAIL_PRODUCT: '/product/variant/product-csv',
  BULK_UPLOAD_DYNAMIC_PRODUCT: '/product-csv',
  ZIPFILE_BULK_UPLOAD_ADD_PRODUCT: '/product-imagezip',
  PRODUCT_IMAGE_DELETE: '/product-images/deleted',
  CONFIG_PRODUCT: '/all/config/product/add',
  ETERNITY_CONFIG_PRODUCT: 'eternity-band-csv',
  GET_ALL_CONFIGPRODUCT: 'config/product/list/admin',
  GET_ALL_THREESTONECONFIGPRODUCT: 'three-stone/product/list/admin',
  CONFIG_PRODUCT_DELETE: 'product/config/delete',
  GET_CONFIGURATOR_DETAIL: 'admin/config/product',
  GET_ETERNITY_BAND_CONFIGURATOR_DETAIL: 'eternity-band',
  ADD_BIRTHSTONE_PRODUCT_DETAILS: 'product/birth-stone/add/price-add',
  GET_ALL_BIRTHSTONE_PRODUCTS: 'product/birth-stone/list',
  FEATURE_STATUS_UPDATE_BIRTHSTONE_PRODUCT: 'product/birth-stone/featured/status',
  TRENDING_STATUS_UPDATE_BIRTHSTONE_PRODUCT: 'product/birth-stone/trending/status',
  STATUS_UPDATE_BIRTHSTONE_PRODUCT: 'product/birth-stone/status',
  DELETE_BIRTHSTONE_PRODUCT_API: 'product/birth-stone/delete',
  GET_BY_ID_BIRTHSTONE_PRODUCTS: '/product/birth-stone',
  EDIT_BIRTHSTONE_PRODUCT_DETAILS: 'product/birth-stone/add/price-add',
  ADD_BIRTHSTONE_PRODUCT_IMAGE: '/product/birth-stone/image/add',
  GET_ALL_ETERNITY_BAND_PRODUCT: 'eternity-band',

  // mm size
  MM_SIZE: 'attribute/mm-size',

  DIAMOND_GROUP_MASTER: 'attribute/diamond-group',
  BULK_UPLOAD_DIAMOND_GROUP_MASTER: '/diamond/group/master/range/csv',
  DIAMOND_GROUP_MASTER_CINFIG_STATUS: 'attribute/diamond-group/config-status',

  // country
  COUNTRY: 'country',

  // state
  STATE: 'state',

  // city
  CITY: 'city',

  CUSTOMER_ADD: 'customer/add',
  CUSTOMER_GET_ALL: 'customer',
  CUSTOMER_EDIT: 'customer/edit',
  CUSTOMER_DELETE: 'customer/delete',
  CUSTOMER_STATUS: 'customer/status',
  CUSTOMER_COUNTRY: '/user/country/list',
  CUSTOMER_GET_BY_ID: '/customer',

  TESTIMONIAL_ADD: 'testimonial/add',
  TESTIMONIAL_GET_ALL: 'testimonial',
  TESTIMONIAL_EDIT: 'testimonial/edit',
  TESTIMONIAL_DELETE: 'testimonial/delete',
  TESTIMONIAL_STATUS: 'testimonial/status',

  GET_ALL_CATEGORY: '/category',
  ADD_CATEGORY: '/category/add',
  EDIT_CATEGORY: '/category/edit',
  STATUS_UPDATE_CATEGORY: '/category/status',
  SEARCHABLE_CATEGORY: '/category/searchable',
  DELETE_CATEGORY: '/category/delete',

  TAG: 'attribute/tag',

  ADD_MARKETING_POPUP: 'marketingPopup/add',
  EDIT_MARKETING_POPUP: 'marketingPopup/edit',
  GET_ALL_MARKETING_POPUP: 'marketingPopup',
  DELETE_MARKETING_POPUP: 'marketingPopup/delete',
  STATUS_MARKETING_POPUP: 'marketingPopup/status',

  ADD_BLOG: 'blogs/add',
  EDIT_BLOG: 'blog/edit',
  GET_ALL_BLOG: 'blog',
  DELETE_BLOG: 'blog/delete',
  GET_BY_ID_BLOG: 'blog',

  GET_ALL_WISHLIST: 'product/wish/list',
  GET_ALL_CART_PRODUCT: 'product/cart/list/admin',

  GET_ALL_GENERAL_ENQUIRIES: 'enquiries/general',
  GET_ALL_PRODUCT_ENQUIRIES: '/enquiries/product',
  PRODUCT_INQUIRIES_DETAIL: '/enquiries/product/details',
  UPDATE_PRODUCT_INQUIRIES: 'enquiries/product/update',

  GET_ALL_CUSTOMER_REVIEW: 'product/review/list/admin',
  STATUS_CUSTOMER_REVIEW: 'product/review/status',

  GET_ALL_ORDERS: 'order/list/admin',
  ORDERS_DETAIL: 'order/details/admin',
  ORDER_STATUS_UPDATE: 'order/status/update',
  DELIVERY_STATUS: 'order/delivery/status',
  INVOICE_DETAIL: 'invoice/details',
  GET_ORDER_TRANSACTION: '/order/transaction/list',

  SIDE_SETTING_STYLE: 'attribute/side-setting',

  USER_SUBSCRIPTION_LIST: '/admin/subscription/list',
  USER_SUBSCRIPTION_STATUS: '/admin/subsction/satus',

  GET_ALL_DASHBOARD: 'dashboard',

  TAX: 'tax',

  CHANGE_PASSWORD: '/change-password',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  CONFIG_MASTER_DROPDOWN: '/config/master/drop-down',
  CONFIG_DROPDOWN_DATA: 'config-select/dropDown/list',
  GIFTSET_ADD: 'gift-set/product/add',
  GIFTSET_GET_ALL: 'gift-set/products/list',
  GIFTSET_EDIT: 'gift-set/product/edit',
  GIFTSET_DELETE: 'gift-set/products/delete',
  GIFTSET_STATUS: 'gift-set/products/status',
  GIFTSET_GET_BY_ID: 'gift-set/products',
  GIFTSET_IMAGE_DELETE: 'gift-set/products/image/delete',

  GET_ALL_CUSTOMER_REPORT: 'report/customers',
  GET_ALL_CUSTOMER_SUBSCRIBER: 'report/customer-Subscriberes',
  GET_ALL_WISHLIST_PRODUCT: 'report/wishlist-product',
  GET_ALL_CARTLIST_PRODUCT: 'report/cart-product',
  GET_ALL_TOP_SELLING_PRODUCT: 'report/top-selling-product',

  // Master
  GET_ALL_MASTER: 'masters/',
  MASTER: 'master/',
  LOOSE_DIAMOND_BULK: 'loose-diamonds/csv',
  LOOSE_DIAMOND: 'admin/loose-diamond',
  DELETE_LOOSE_DIAMOND: 'loose-diamond',

  CONFIG_MASTER: 'configurator-master/',

  // info_section
  ADD_INFO: 'info-section',
  GET_INFO: 'info-section'
}

export const configProductPath =
  'https://tcctech-staging.s3.ap-south-1.amazonaws.com/samplecsv/CONFIG_PRODUCT_BULK_UPLOAD.xlsx'
export const looseDiamondSampleFile =
  'https://tcctech-staging.s3.ap-south-1.amazonaws.com/samplecsv/LOOSE_DIAMOND_BULK_IMPORT_SHEET.xlsx'
export const appConstant = {
  INVALID_METHOD: 'Invalid Method',
  INVALID_RESPONSE: 'Invalid Response'
}

export const publicRoutePath = {
  login: '/login'
}

export const appErrors = {
  UNKNOWN_ERROR_TRY_AGAIN: 'Unknown Errror Occured...! Try again.'
}

export const DEFAULT_STATUS_CODE_SUCCESS = 200
export const UNAUTHORIZED_ACCESS_CODE_SUCCESS = 401

export const PAGINATION_INITIAL_VALUE = {
  current_page: 1,
  per_page_rows: 50,
  order_by: 'DESC',
  sort_by: 'id',
  total_pages: 0,
  total_items: 0
}

export const DIAMOND_GROUP_PAGINATION_INITIAL_VALUE = {
  current_page: 1,
  per_page_rows: 50,
  order_by: 'DESC',
  sort_by: 'id',
  total_pages: 0,
  total_items: 0,
  stone: '',
  shape: '',
  color: '',
  clarity: '',
  min_price: '',
  max_price: '',
  carat: ''
}
export const CART_PAGINATION_INITIAL_VALUE = {
  current_page: 1,
  per_page_rows: 50,
  order_by: 'DESC',
  sort_by: 'created_date',
  total_pages: 0,
  total_items: 0
}

export const ORDER_PAGINATION_INITIAL_VALUE = {
  current_page: 1,
  per_page_rows: 50,
  order_by: 'DESC',
  sort_by: 'id',
  total_pages: 0,
  total_items: 0,
  order_status: number
}

export const STONE_TYPE = {
  center: 1,
  side: 2
}

export enum BIRTHSTONE_STONE_TYPE {
  fix = 1,
  changeable = 2
}
export enum PAYMENT_STATUS {
  pendding = 0,
  paid = 1,
  failed = 2
}

export enum All_PRODUCT_TYPE {
  Product = 1,
  GiftSet_product = 2,
  Config_Ring_product = 3,
  BirthStone_product = 4,
  Config_band_product = 5
}

export enum CONFIGURATOR_MANAGE_KEY {
  RingConfigurator = 'RING_CONFIGURATOR',
  ThreeStoneConfigurator = 'THREE_STONE_CONFIGURATOR',
  EternityBandConfigurator = 'ETERNITY_BAND_CONFIGURATOR',
  BraceletConfigurator = 'BRACELET_CONFIGURATOR',
  PendantConfigurator = 'PENDANT_CONFIGURATOR',
  EarringConfigurator = 'EARRING_CONFIGURATOR'
}
export const encryptResponesData = (text: any) => {
  const key = Buffer.from(ENCRYPT_DECRYPT_KEY, 'hex')
  const iv = Buffer.from(ENCRYPT_DECRYPT_IV, 'hex')

  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv)
  let encryptedData = cipher.update(JSON.stringify(text), 'utf-8', 'hex')
  encryptedData += cipher.final('hex')

  return encryptedData
}

export const decryptRequestData = (text: any) => {
  const key = Buffer.from(ENCRYPT_DECRYPT_KEY, 'hex')
  const iv = Buffer.from(ENCRYPT_DECRYPT_IV, 'hex')

  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv)
  let decryptedData = decipher.update(text, 'hex', 'utf-8')
  decryptedData += decipher.final('utf-8')

  return JSON.parse(decryptedData)
}
export const ONLY_POSITIVE_NUMBER_REGEX = /^[0-9\b]+$/
export const NON_NEGATIVE_VALUE = /^(?!-)\S+$/
export const FIELD_REQUIRED = 'This Field is required'
export const LONG_DESCRIPTION = 'Long description must be a 20 to 2000 characters'
export const KARAT_POSITIVE_REQUIRED = 'The karat must be positive'
export const SIZE_POSITIVE_REQUIRED = 'The size must be positive'
export const SLUG_POSITIVE_REQUIRED = 'The slug must be positive'
export const IMAGE_FIELD_REQUIRED = 'image is required'
export const SEARCH_DELAY_TIME = 1000 // in milisecond
