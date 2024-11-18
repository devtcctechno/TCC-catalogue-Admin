
// ** React Imports
import { useState, ReactNode, MouseEvent, useEffect, useContext } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import useMediaQuery from '@mui/material/useMediaQuery'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import useBgColor from 'src/@core/hooks/useBgColor'
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import AuthIllustrationV1Wrapper from 'src/views/pages/auth/AuthIllustrationV1Wrapper'
import { Card, CardContent } from '@mui/material'
import { toast } from 'react-hot-toast'
import { DEFAULT_STATUS_CODE_SUCCESS, UNAUTHORIZED_ACCESS_CODE_SUCCESS, decryptRequestData } from 'src/AppConstants'
import { LOGIN } from 'src/services/AppServices'
import { localStorageUtils } from 'src/utils/localStorageUtils'
import Cookies from 'js-cookie'
import axios from 'axios'
import { PUBLIC_AUTHORIZATION_TOKEN, SECURE_COMMUNICATION } from 'src/AppConfig'
import { CompanyInfoContext } from 'src/context/company_info'
import { UserDataContext } from 'src/context/user_data'

// ** Styled Components
const LoginIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 680,
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(12),
  [theme.breakpoints.down(1540)]: {
    maxHeight: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxHeight: 500
  }
}))

const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 450
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 600
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: 750
  }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(5).required()
})

const defaultValues = {
  password: '',
  email: ''
}

interface FormData {
  email: string
  password: string
}

const LoginPage = () => {
  const [rememberMe, setRememberMe] = useState<boolean>(true)
  const [showPassword, setShowPassword] = useState<boolean>(false)

  // ** Hooks
  const auth = useAuth()
  const theme = useTheme()
  const bgColors = useBgColor()
  const { settings } = useSettings()
  const { companyInfo, updateCompanyInfo } = useContext(CompanyInfoContext)
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const imageData = Cookies.get('Comapany_info')

  // ** Vars
  const { skin } = settings

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })
  const { updateUserInfo } = useContext(UserDataContext)

  // ** Company info api call
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
          const finalData = { dark_image_path: `${companyInfo?.images?.darakImage}`, favicon_image_path: `${companyInfo?.images?.faviconImage}`, company_name: `${companyInfo?.companyInfo?.company_name}` }
          updateCompanyInfo(finalData)
          Cookies.set("Comapany_info", JSON.stringify(finalData))
        }
      } else {
        if (data.code === 200 || data.code === '200') {
          const companyInfo = data.data
          const finalData = { dark_image_path: `${companyInfo?.images?.darakImage}`, favicon_image_path: `${companyInfo?.images?.faviconImage}`, company_name: `${companyInfo?.companyInfo?.company_name}` }
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

  const onSubmit = async (data: FormData) => {
    const { email, password } = data
    try {
      const data = await LOGIN({ username: email, password });
      if (data.code === DEFAULT_STATUS_CODE_SUCCESS) {
        localStorageUtils.setAccessToken(data.data.tokens.token, data.data.tokens.refreshToken);
        localStorageUtils.setUserInfo(data.data.user_detail)
        updateUserInfo(data.data.user_detail)
        auth.login({ email, password, rememberMe }, () => {
          setError('email', {
            type: 'manual',
            message: 'Email or Password is invalid'
          })
        })
      } else {
        toast.error(data?.message);

      }
    } catch (e: any) {
      if (e?.data?.code === UNAUTHORIZED_ACCESS_CODE_SUCCESS) {
        localStorageUtils.removeAcessToken();
      }
      toast.error(e?.data?.message);
    }

    // auth.login({ email, password, rememberMe }, () => {
    //   setError('email', {
    //     type: 'manual',
    //     message: 'Email or Password is invalid'
    //   })
    // })
  }

  const imageSource = skin === 'bordered' ? 'auth-v2-login-illustration-bordered' : 'auth-v2-login-illustration'

  return (
    <Box className='content-center'>
      <AuthIllustrationV1Wrapper>
        <Card>
          <CardContent sx={{ p: theme => `${theme.spacing(10.5, 8, 8)} !important` }}>
            <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={`${process.env.NEXT_PUBLIC_IMG_ENDPOINT}/${companyInfo?.dark_image_path}`} height={60} alt='logo image' />

            </Box>
            <Box sx={{ mb: 6 }}>
              <Typography variant='h6' sx={{ mb: 1.5 }}>
                {`Welcome to ${companyInfo?.company_name}! 👋🏻`}
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                Please sign-in to your account
              </Typography>
            </Box>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      size='small'
                      label='Email'
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.email)}
                      placeholder='Enter Your Email'
                    />
                  )}
                />
                {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
              </FormControl>
              <FormControl fullWidth sx={{ mb: 1.5 }} size="small">
                <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.password)}>
                  Password
                </InputLabel>
                <Controller
                  name='password'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <OutlinedInput
                      value={value}
                      onBlur={onBlur}
                      label='Password'
                      onChange={onChange}
                      id='auth-login-v2-password'
                      error={Boolean(errors.password)}
                      type={showPassword ? 'text' : 'password'}
                      placeholder='Enter Your Password'
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onMouseDown={e => e.preventDefault()}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <Icon icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} fontSize={20} />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {errors.password && (
                  <FormHelperText sx={{ color: 'error.main' }} id=''>
                    {errors.password.message}
                  </FormHelperText>
                )}
              </FormControl>
              <Box
                sx={{
                  mb: 1.75,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'end'
                }}
              >
                {/* <LinkStyled href='/reset-password'>Reset Password</LinkStyled> */}
                <LinkStyled href='/forgot-password'>Forgot Password?</LinkStyled>

                {/* <FormControlLabel
                  label='Remember Me'
                  control={<Checkbox checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />}
                /> */}
              </Box>
              <Button fullWidth type='submit' variant='contained' sx={{ mt: 4 }} >
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </AuthIllustrationV1Wrapper>
    </Box>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

LoginPage.guestGuard = true

export default LoginPage