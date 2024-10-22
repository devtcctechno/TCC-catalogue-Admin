import Axios from 'axios'
import { localStorageUtils } from '../utils/localStorageUtils'
import {
  API_ENDPOINT,
  ENCRYPT_DECRYPT_IV,
  ENCRYPT_DECRYPT_KEY,
  PUBLIC_AUTHORIZATION_TOKEN,
  SECURE_COMMUNICATION
} from '../AppConfig'
import { appConstant, decryptRequestData, encryptResponesData } from '../AppConstants'
import { useAuth } from 'src/hooks/useAuth'
import Router from 'next/router'
import crypto from 'crypto'
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

export function isValidResponse(resp: any) {
  return resp && resp.status === 200 && resp.data.status === 1
}

const baseURL = API_ENDPOINT
const apiPrefix = '/api/'

export const CONFIG = Axios.create({
  baseURL: baseURL
})

CONFIG.interceptors.request.use(async (config: any) => {
  try {
    let token = await localStorageUtils.getAccessToken()
    if (!token) {
      token = PUBLIC_AUTHORIZATION_TOKEN
    }

    // const token = PUBLIC_AUTHORIZATION_TOKEN
    config.headers.Authorization = `${token}`
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json'
    }
    config.headers['Accept'] = '*/*'

    if (config.data && SECURE_COMMUNICATION === 'true') {
      if (config.headers['Content-Type'] != 'multipart/form-data') {
        config.data = { data: encryptResponesData(config.data) }
      }
    }

    return config
  } catch (e) {}

  return config
})

export const httpMethods = {
  GET: 'GET',
  POST: 'POST',
  POST_CONFIG: 'POST_CONFIG',
  PUT: 'PUT',
  PUT_CONFIG: 'PUT_CONFIG',
  DELETE: 'DELETE',
  GET_IMAGE: 'GET_IMAGE',
  PATCH: 'PATCH'
}

export const serviceMaker = async (url: string, method: string, data = {}, config = {}) => {
  try {
    let result
    const APIInstance = CONFIG
    switch (method) {
      case httpMethods.GET: {
        result = await APIInstance.get(url, data)
        break
      }
      case httpMethods.POST: {
        result = await APIInstance.post(url, data)
        break
      }
      case httpMethods.POST_CONFIG: {
        result = await APIInstance.post(url, data as FormData, config)
        break
      }
      case httpMethods.PUT: {
        result = await APIInstance.put(url, data)
        break
      }
      case httpMethods.PUT_CONFIG: {
        result = await APIInstance.put(url, data as FormData, config)
        break
      }
      case httpMethods.PATCH: {
        result = await APIInstance.patch(url, data)
        break
      }
      case httpMethods.DELETE: {
        result = await APIInstance.delete(url, data)
        break
      }
      case httpMethods.GET_IMAGE: {
        result = await APIInstance.get(`${baseURL}${url}`, {
          responseType: 'arraybuffer'
        })
        break
      }
      default: {
        throw appConstant.INVALID_METHOD
      }
    }

    if (!isValidResponse) {
      throw appConstant.INVALID_RESPONSE
    }

    if (SECURE_COMMUNICATION && SECURE_COMMUNICATION === 'true') {
      return decryptRequestData(result.data)
    } else {
      return result.data
    }
  } catch (err: any) {
    console.log('error-------decrypt', err.response.data.data)

    if (err.response.data.code == 401 || err.response.data.code == '401') {
      localStorageUtils.removeAcessToken()
      localStorageUtils.removeUserInfo()
      Router.push('/login')
      window.location.reload()
    }
    console.log('err.response', decryptRequestData(err.response.data))

    throw new APIError(
      err.response
        ? SECURE_COMMUNICATION === 'true'
          ? { ...err.response, data: decryptRequestData(err.response.data) }
          : err.response
        : {
            data: {
              status: 'error',
              code: 500,
              message: 'Something went wrong',
              data: null
            }
          }
    )
  }
}

export class APIError {
  data
  constructor(msg: any) {
    this.data = msg.data
  }
}
