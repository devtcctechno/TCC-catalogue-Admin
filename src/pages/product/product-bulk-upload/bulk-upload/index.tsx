// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardHeader from '@mui/material/CardHeader'
import Link from 'next/link'
import { Box, Button, CardContent, Divider, Typography } from '@mui/material'
import TccMultipleImageUpload from 'src/customComponents/Form-Elements/file-upload/zip-file-upload'
import { ZIPFILE_BULK_UPLOAD_ADD_PRODUCT } from 'src/services/AdminServices'
import { toast } from 'react-hot-toast'
import { apiEndPoints, appErrors } from 'src/AppConstants'
import { useEffect, useState } from 'react'
import Router from 'next/router'
import TccZipImageUpload from 'src/customComponents/Form-Elements/file-upload/zip-file-upload'
import ProcessLinearWithLabel from 'src/customComponents/progress-bar'
import axios from 'axios'

interface CustomRequestInit extends RequestInit {
  onUploadProgress?: (progressEvent: ProgressEvent) => void;
}

const ProductBulkUpload = () => {

  const [files, setFiles] = useState<File[]>([])
  const [progress, setProgress] = useState<number>()
  const accessToken = localStorage.getItem('tcc:accessToken')

  const clearFileInput = async () => {
    if (progress === 100) {
      await setProgress(0);
    }
  };

  /////////////////////// BULK UPLOAD API ///////////////////////

  const bulkUploadApiData = async () => {
    const formData = new FormData();
    files.map((t: any) => {
      formData.append("product_zip", t)
    })
    try {
      const data: any = await axios.post(`http://localhost:2525/api/v2/product-imagezip`,
        formData,
        {
          headers: {
            'Authorization': accessToken,

            // ... add other header lines like: 'Content-Type': 'application/json'
          },
          onUploadProgress: (progressEvent: any) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          },

        }
      );

      if (data.status === 200 || data.status === "200") {
        toast.success(data.message);

        // Router.push({ pathname: "/product/all-products" })
      } else {
        toast.error(data.message);

        return toast.error(data.data.map((t: any) => t.error_message));
      }
    } catch (e: any) {
      toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN);
    }

    return false;
  }


  const bulkUploadApi = async () => {
    const formData: any = new FormData()
    files.map((t: any) => {
      formData.append("product_zip", t)

    })

    try {
      const data = await ZIPFILE_BULK_UPLOAD_ADD_PRODUCT(formData);
      if (data.code === 200 || data.code === "200") {
        toast.success(data.message);
        Router.push({ pathname: "/product/all-products" })
      } else {
        toast.error(data.message);

        return toast.error(data.data.map((t: any) => t.error_message));
      }
    } catch (e: any) {
      toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN);
    }

    return false;
  }

  return (
    <>
      {/* <Button variant='contained' sx={{ mr: 3, mb: 4, '& svg': { mr: 2 } }} onClick={() => Router.back()}>
        <Icon icon='material-symbols:arrow-back-rounded' />
        Back
      </Button> */}

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title='Media ZIP Import'></CardHeader>
            <Divider />
            <CardContent>
              <form>
                <TccZipImageUpload onDrop={setFiles} />
                <Button variant='contained' sx={{ mt: 4 }} type='button'
                  onClick={bulkUploadApiData}
                >
                  Submit
                </Button>
              </form>
              {progress && <ProcessLinearWithLabel style={{ marginTop: '10px' }} value={progress} />}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default ProductBulkUpload