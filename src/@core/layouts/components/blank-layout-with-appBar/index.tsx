// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Hook
import { useSettings } from 'src/@core/hooks/useSettings'
import Cookies from 'js-cookie'

const LinkStyled = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  marginRight: theme.spacing(8)
}))

const BlankLayoutAppBar = () => {
  // ** Hooks & Vars
  const theme = useTheme()
  const { settings } = useSettings()
  const { skin } = settings
  const imageData = Cookies.get('Comapany_info')
  const finalKeyData = imageData && JSON.parse(imageData!);

  return (
    <AppBar
      color='default'
      position='sticky'
      elevation={skin === 'bordered' ? 0 : 3}
      sx={{
        backgroundColor: 'background.paper',
        ...(skin === 'bordered' && { borderBottom: `1px solid ${theme.palette.divider}` })
      }}
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          p: theme => `${theme.spacing(0, 6)} !important`,
          minHeight: `${(theme.mixins.toolbar.minHeight as number) - (skin === 'bordered' ? 1 : 0)}px !important`
        }}
      >
        <LinkStyled href='/'>
          <img width={90} height={50} src={`${process.env.NEXT_PUBLIC_IMG_ENDPOINT}/${finalKeyData?.dark_image_path}`} alt={""} />

          <Typography
            variant='h6'
            sx={{
              ml: 2.5,
              fontWeight: 600,
              lineHeight: '24px',
              fontSize: '1.375rem !important'
            }}
          >
            {themeConfig.templateName}
          </Typography>
        </LinkStyled>
      </Toolbar>
    </AppBar>
  )
}

export default BlankLayoutAppBar