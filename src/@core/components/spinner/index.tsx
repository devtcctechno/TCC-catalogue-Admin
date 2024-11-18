// ** MUI Imports
import { useTheme } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Cookies from 'js-cookie'
const FallbackSpinner = ({ sx }: { sx?: BoxProps['sx'] }) => {
  // ** Hook
  const theme = useTheme()
  const imageData = Cookies.get('Comapany_info')
  const finalKeyData = imageData && JSON.parse(imageData!);

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        ...sx
      }}
    >
      {/* <svg width={82} height={56.375} viewBox='0 0 32 22' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          fill={theme.palette.primary.main}
          d='M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z'
        />
        <path
          fill='#161616'
          opacity={0.06}
          fillRule='evenodd'
          clipRule='evenodd'
          d='M7.69824 16.4364L12.5199 3.23696L16.5541 7.25596L7.69824 16.4364Z'
        />
        <path
          fill='#161616'
          opacity={0.06}
          fillRule='evenodd'
          clipRule='evenodd'
          d='M8.07751 15.9175L13.9419 4.63989L16.5849 7.28475L8.07751 15.9175Z'
        />
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          fill={theme.palette.primary.main}
          d='M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z'
        />
      </svg> */}
      {/* <svg width={82} height={56.375} viewBox="0 0 2741 1604" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1034.29 0.0493233C1337.18 0.0493233 1640.06 -0.042238 1942.95 0.140885C2014.36 0.232446 2085.6 3.62021 2156.47 12.7763C2232.74 22.665 2307.91 38.4135 2381.89 59.3811C2397.73 63.8676 2412.11 72.4743 2426.66 80.0739C2556.13 147.829 2659.32 243.969 2735.87 368.584C2736.32 369.408 2736.87 370.14 2737.33 370.964C2742 379.205 2743.38 377.648 2734.4 382.959C2635.42 441.283 2536.35 499.699 2437.38 558.024C2436.1 558.756 2434.63 559.489 2433.44 560.313C2431.15 561.961 2429.59 561.229 2428.31 559.031C2425.47 554.361 2422.54 549.692 2419.52 545.114C2375.12 477.999 2315.97 428.098 2243.36 394.038C2231.55 388.544 2218.55 387.811 2206 385.98C2145.21 377.099 2083.95 375.084 2022.6 374.26C1994.86 373.894 1967.12 373.619 1939.38 373.619C1663.96 373.528 1388.54 373.619 1113.13 373.619C1099.76 373.619 1101.31 371.788 1101.31 385.065C1101.31 787.11 1101.31 1189.25 1101.31 1591.29C1101.31 1605.12 1103.15 1603.65 1089.41 1603.65C941.815 1603.65 794.127 1603.65 646.53 1603.65C633.803 1603.65 635.268 1604.75 635.268 1592.39C635.268 1190.35 635.268 788.209 635.268 386.163C635.268 371.422 637.191 373.619 622.724 373.619C419 373.528 215.185 373.619 11.4607 373.528C-1.63259 373.528 0.107077 374.718 0.107077 362.449C0.107077 245.891 0.0155155 129.334 0.107077 12.8679C0.107077 -1.50722 -1.99883 0.0493233 12.4679 0.0493233C352.893 0.0493233 693.592 0.0493233 1034.29 0.0493233Z" fill="#202E4A"/>
              <path d="M1215.03 754.055C1215.95 723.29 1216.86 693.441 1220.34 663.684C1221.07 657.733 1221.26 657.458 1226.93 658.099C1257.52 661.761 1288.01 665.424 1318.59 669.086C1346.15 672.382 1373.62 675.495 1401.18 678.792C1429.56 682.179 1458.03 685.659 1486.42 689.138C1513.98 692.434 1541.45 695.639 1569.01 698.935C1570.2 699.118 1571.48 699.027 1572.67 699.21C1578.35 699.942 1579.17 700.583 1578.35 706.077C1577.06 714.867 1577.06 723.748 1576.52 732.538C1573.95 770.536 1577.43 808.076 1585.31 845.25C1605.91 942.03 1653.15 1023.61 1727.04 1089.35C1790.04 1145.39 1863.47 1180.46 1946.61 1195.29C1975.81 1200.51 2005.21 1203.07 2034.87 1202.16C2125.33 1199.32 2207.92 1172.58 2282.18 1120.67C2325.12 1090.63 2361.47 1054.1 2391.59 1011.25C2391.78 1010.98 2391.96 1010.79 2392.14 1010.52C2397.73 1002.83 2397.73 1002.74 2405.42 1007.86C2426.48 1021.87 2447.54 1035.88 2468.6 1049.89C2541.66 1098.6 2614.73 1147.4 2687.7 1196.11C2688.71 1196.75 2689.72 1197.49 2690.72 1198.13C2697.13 1202.61 2697.23 1202.71 2692.56 1209.48C2676.81 1232.74 2659.78 1255.08 2641.65 1276.41C2590.56 1336.57 2532.05 1388.3 2465.94 1431.33C2374.56 1490.76 2275.22 1530.22 2168 1549.63C2132.29 1556.13 2096.31 1559.89 2059.96 1561.72C2029.38 1563.27 1998.98 1562.82 1968.58 1560.62C1881.32 1554.39 1796.99 1534.89 1716.05 1501.38C1627.88 1464.85 1548.41 1414.58 1478.09 1349.94C1371.97 1252.42 1297.25 1134.86 1253.21 997.791C1238.01 950.454 1227.67 901.926 1221.53 852.483C1217.5 819.521 1216.22 786.285 1215.03 754.055Z" fill="#E58A1F"/>
              <path d="M2067.29 1107.39C1989 1106.11 1919.78 1080.66 1861.18 1028.28C1804.87 978.015 1770.63 915.021 1760.83 840.398C1748.11 743.984 1774.57 658.558 1840.4 586.407C1885.36 537.056 1941.21 505.833 2006.58 493.015C2093.75 475.984 2174.23 493.381 2247.39 544.106C2253.71 548.501 2253.71 548.593 2249.22 554.544C2219.46 594.373 2189.71 634.111 2159.86 673.94C2155.92 679.159 2155.83 679.159 2149.97 675.222C2126.07 659.199 2099.52 650.5 2070.86 650.043C2033.87 649.493 2000.45 660.847 1972.43 685.385C1934.53 718.53 1916.95 760.923 1921.62 810.916C1926.28 860.542 1951.1 899.089 1994.31 924.085C2039.27 949.997 2085.88 950.73 2132.76 928.755C2140.36 925.184 2139.71 924.177 2144.38 932.418C2168.46 974.81 2192.55 1017.29 2216.53 1059.69C2220.65 1067.01 2220.56 1067.1 2212.96 1071.13C2176.98 1090.09 2138.8 1101.81 2098.24 1105.74C2087.98 1106.75 2077.73 1107.12 2067.29 1107.39Z" fill="#E58A1F"/>
          </svg> */}
      <img width={90} height={50} src={`${process.env.NEXT_PUBLIC_IMG_ENDPOINT}/${finalKeyData?.dark_image_path}`} alt={""} />

      <CircularProgress disableShrink sx={{ mt: 6 }} color='primary' />
    </Box>
  )
}

export default FallbackSpinner