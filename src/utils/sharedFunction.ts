import { CRYPTO_JS_IV, CRYPTO_JS_KEY } from 'src/AppConfig'
import {
  CART_PAGINATION_INITIAL_VALUE,
  DIAMOND_GROUP_PAGINATION_INITIAL_VALUE,
  PAGINATION_INITIAL_VALUE
} from 'src/AppConstants'
import {
  ICommonDiamondGroupPagination,
  ICommonOrderPagination,
  ICommonPagination,
  ICommonReportPagination
} from 'src/data/interface'
import CryptoJS from 'crypto-js'
import * as XLSX from 'xlsx'
// const CryptoJS = require('crypto-js')

export const getQueryUrlFormPagiantion = (payload: ICommonPagination) => {
  let query = ''
  query += payload.current_page ? `current_page=${payload.current_page}&` : ''
  query += payload.per_page_rows ? `per_page_rows=${payload.per_page_rows}&` : ''
  query += payload.order_by ? `order_by=${payload.order_by}&` : ''
  query += payload.sort_by ? `sort_by=${payload.sort_by}&` : ''
  query += payload.search_text ? `search_text=${payload.search_text}&` : '&'

  return query.length > 0 ? query.slice(0, -1) : query
}

export const getQueryUrlDiamondGroupPagiantion = (payload: ICommonDiamondGroupPagination) => {
  let query = ''
  query += payload.current_page ? `current_page=${payload.current_page}&` : ''
  query += payload.per_page_rows ? `per_page_rows=${payload.per_page_rows}&` : ''
  query += payload.order_by ? `order_by=${payload.order_by}&` : ''
  query += payload.sort_by ? `sort_by=${payload.sort_by}&` : ''
  query += payload.search_text ? `search_text=${payload.search_text}&` : ''
  query += payload.stone && `stone=${payload.stone}&`
  query += payload.shape && `shape=${payload.shape}&`
  query += payload.color && `color=${payload.color}&`
  query += payload.clarity && `clarity=${payload.clarity}&`
  query += payload.carat && `carat=${payload.carat}&`
  query += payload.min_price && `min_price=${payload.min_price}&`
  query += payload.max_price && `max_price=${payload.max_price}&`
  return query.length > 0 ? query.slice(0, -1) : query
}

export const getQueryUrlOrderPagiantion = (payload: ICommonOrderPagination) => {
  let query = ''
  query += payload.current_page ? `current_page=${payload.current_page}&` : ''
  query += payload.per_page_rows ? `per_page_rows=${payload.per_page_rows}&` : ''
  query += payload.order_by ? `order_by=${payload.order_by}&` : ''
  query += payload.sort_by ? `sort_by=${payload.sort_by}&` : ''
  query += payload.order_status ? `order_status=${payload.order_status}&` : ''
  query += payload.start_date ? `start_date=${payload.start_date}&` : ''
  query += payload.end_date ? `end_date=${payload.end_date}&` : ''

  return query.length > 0 ? query.slice(0, -1) : query
}

export const getQueryUrlReportPagination = (payload: ICommonReportPagination) => {
  let query = ''
  query += payload.start_date ? `start_date=${payload.start_date}&` : null
  query += payload.end_date ? `end_date=${payload.end_date}&` : null

  return query.length > 0 ? query.slice(0, -1) : query
}

export const createPagination = (payload?: ICommonPagination) => {
  return {
    current_page: payload?.current_page || PAGINATION_INITIAL_VALUE.current_page,
    per_page_rows: payload?.per_page_rows || PAGINATION_INITIAL_VALUE.per_page_rows,
    order_by: payload?.order_by || PAGINATION_INITIAL_VALUE.order_by,
    sort_by: payload?.sort_by || PAGINATION_INITIAL_VALUE.sort_by,
    total_pages: payload?.total_pages || PAGINATION_INITIAL_VALUE.total_pages,
    total_items: payload?.total_items || PAGINATION_INITIAL_VALUE.total_items
  }
}

export const createDiamondGroupPagination = (payload?: ICommonDiamondGroupPagination) => {
  return {
    current_page: payload?.current_page || DIAMOND_GROUP_PAGINATION_INITIAL_VALUE.current_page,
    per_page_rows: payload?.per_page_rows || DIAMOND_GROUP_PAGINATION_INITIAL_VALUE.per_page_rows,
    order_by: payload?.order_by || DIAMOND_GROUP_PAGINATION_INITIAL_VALUE.order_by,
    sort_by: payload?.sort_by || DIAMOND_GROUP_PAGINATION_INITIAL_VALUE.sort_by,
    total_pages: payload?.total_pages || DIAMOND_GROUP_PAGINATION_INITIAL_VALUE.total_pages,
    total_items: payload?.total_items || DIAMOND_GROUP_PAGINATION_INITIAL_VALUE.total_items,
    stone: payload?.stone || DIAMOND_GROUP_PAGINATION_INITIAL_VALUE.stone,
    shape: payload?.shape || DIAMOND_GROUP_PAGINATION_INITIAL_VALUE.shape,
    color: payload?.color || DIAMOND_GROUP_PAGINATION_INITIAL_VALUE.color,
    clarity: payload?.clarity || DIAMOND_GROUP_PAGINATION_INITIAL_VALUE.clarity,
    carat: payload?.carat || DIAMOND_GROUP_PAGINATION_INITIAL_VALUE.carat,
    min_price: payload?.min_price || DIAMOND_GROUP_PAGINATION_INITIAL_VALUE.min_price,
    max_price: payload?.max_price || DIAMOND_GROUP_PAGINATION_INITIAL_VALUE.max_price
  }
}

export const createCartagination = (payload?: ICommonPagination) => {
  return {
    current_page: payload?.current_page || CART_PAGINATION_INITIAL_VALUE.current_page,
    per_page_rows: payload?.per_page_rows || CART_PAGINATION_INITIAL_VALUE.per_page_rows,
    order_by: payload?.order_by || CART_PAGINATION_INITIAL_VALUE.order_by,
    sort_by: payload?.sort_by || CART_PAGINATION_INITIAL_VALUE.sort_by,
    total_pages: payload?.total_pages || CART_PAGINATION_INITIAL_VALUE.total_pages,
    total_items: payload?.total_items || CART_PAGINATION_INITIAL_VALUE.total_items
  }
}

export const createOrderPagination = (payload?: ICommonOrderPagination) => {
  return {
    current_page: payload?.current_page || PAGINATION_INITIAL_VALUE.current_page,
    per_page_rows: payload?.per_page_rows || PAGINATION_INITIAL_VALUE.per_page_rows,
    order_by: payload?.order_by || PAGINATION_INITIAL_VALUE.order_by,
    sort_by: payload?.sort_by || PAGINATION_INITIAL_VALUE.sort_by,
    total_pages: payload?.total_pages || PAGINATION_INITIAL_VALUE.total_pages,
    total_items: payload?.total_items || PAGINATION_INITIAL_VALUE.total_items
  }
}

export const getEncryptedText = (text: string) => {
  const encryptedData = CryptoJS.AES.encrypt(text, CRYPTO_JS_KEY, {
    iv: CryptoJS.enc.Utf8.parse(CRYPTO_JS_IV),
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
  }).toString()

  return encryptedData
}

export const getDecryptedText = (text: string) => {
  const descryptedText = CryptoJS.AES.decrypt(text, CRYPTO_JS_KEY, {
    iv: CryptoJS.enc.Utf8.parse(CRYPTO_JS_IV),
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
  }).toString(CryptoJS.enc.Utf8)

  return descryptedText
}

export const firstLetterUpperCaseText = (text: string) => {
  const convertText = text.charAt(0).toUpperCase() + text.slice(1)

  return convertText
}

export const exportToExcel = (data: any, filename: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
  XLSX.writeFile(workbook, `${filename}.xlsx`)
}
