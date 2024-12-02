// ** React Imports
import { ReactNode, ReactElement, useEffect, useState, useContext } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Hooks Import
import { useAuth } from 'src/hooks/useAuth'
import Cookies from 'js-cookie'
import axios from 'axios'
import { decryptRequestData } from 'src/AppConstants'
import { PUBLIC_AUTHORIZATION_TOKEN, SECURE_COMMUNICATION } from 'src/AppConfig'
import { CompanyInfoContext } from 'src/context/company_info'

interface GuestGuardProps {
  children: ReactNode
}

const GuestGuard = (props: GuestGuardProps) => {
  const { children } = props
  const router = useRouter()
  const { companyInfo, updateCompanyInfo } = useContext(CompanyInfoContext);

  // ---- comapany info api call ----
  const fetchData = async () => {
    try {
      const token = PUBLIC_AUTHORIZATION_TOKEN;
      const data = await axios(`${process.env.NEXT_PUBLIC_API_ENDPOINT}companyinfo/user?key=${process.env.NEXT_PUBLIC_COMPANY_INFO_KEY}`, {
        headers: {
          'Authorization': `${token}`
        }
      }).then((value: any) => {
        return value.data
      }).catch((error) => {
        return error
      })
      if (SECURE_COMMUNICATION === "true") {
        if (decryptRequestData(data).code === 200 || decryptRequestData(data).code === '200') {
          const companyInfo = decryptRequestData(data).data
          const finalData = { 
            dark_image_path: `${companyInfo?.images?.darakImage}`, 
            favicon_image_path: `${companyInfo?.images?.faviconImage}`, 
            company_name: `${companyInfo?.companyInfo?.company_name}` ,
            copy_right: `${companyInfo?.companyInfo?.copy_right}`,
          company_phone: `${companyInfo?.companyInfo?.company_phone}`,
          web_link: `${companyInfo?.companyInfo?.web_link}`,
          company_address: `${companyInfo?.companyInfo?.company_address}`,
          }
          updateCompanyInfo(finalData)
          Cookies.set("Comapany_info", JSON.stringify(finalData))
        }
      } else {
        if (data.code === 200 || data.code === '200') {
          const companyInfo = data.data
          const finalData = { 
            dark_image_path: `${companyInfo?.images?.darakImage}`, 
            favicon_image_path: `${companyInfo?.images?.faviconImage}`, 
            company_name: `${companyInfo?.companyInfo?.company_name}`,
            company_phone: `${companyInfo?.companyInfo?.company_phone}`,
            web_link: `${companyInfo?.companyInfo?.web_link}`,
            company_address: `${companyInfo?.companyInfo?.company_address}` }
          updateCompanyInfo(finalData)
          Cookies.set("Comapany_info", JSON.stringify(finalData))
        }
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (document) {
      var link: any = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = `${process.env.NEXT_PUBLIC_IMG_ENDPOINT}/${companyInfo?.favicon_image_path}`;
    }
  }, [companyInfo])

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    if (window.localStorage.getItem('userData')) {
      router.replace('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.route])

  return <>{children}</>
}

export default GuestGuard
