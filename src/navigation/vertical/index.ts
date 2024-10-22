// ** Type import
import path from 'path'
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: 'tabler:smart-home'
    },
    {
      sectionTitle: 'ORDERS MANAGEMENT'
    },
    {
      title: 'Orders',
      path: '/orders/orders-list',
      icon: 'grommet-icons:cart'
    },
    {
      sectionTitle: 'PRODUCT MANAGEMENT'
    },
    {
      title: 'Product',
      icon: 'fluent-mdl2:product-variant',
      children: [
        {
          title: 'Add product',
          path: '/product/add-products'
        },
        {
          title: 'Add Birthstone Products',
          path: '/product/add-birthstone-products'
        },
        {
          title: 'All product',
          path: '/product/all-products'
        },
        {
          title: 'All Birthstone Products',
          path: '/product/all-birthstone-products'
        },
        {
          title: 'Product bulk upload',
          children: [
            {
              title: 'bulk upload',
              path: '/product/product-bulk-upload/bulk-upload'
            },
            {
              title: 'File import',
              path: '/product/product-bulk-upload/file-import'
            }
          ]
        },
        {
          title: 'Gift Sets',
          path: '/product/gift-set/gift-list'
        },
        {
          title: 'product Stocks',
          path: '/product/product-stocks'
        },
        {
          title: 'Loose Diamond',
          path: '/product/loose-diamond-products'
        }
      ]
    },
    {
      title: 'Category',
      path: '/category/category-master',
      icon: 'tabler:category'
    },
    {
      title: 'Attribute',
      icon: 'mdi:message-reply-outline',
      children: [
        {
          title: 'Diamond Shape',
          path: '/attribute/diamond-shape'
        },
        {
          title: 'Gemstone',
          path: '/attribute/gemstone'
        },
        {
          title: 'Carat Size',
          path: '/attribute/carat-size'
        },
        {
          title: 'Color',
          path: '/attribute/color'
        },
        {
          title: 'Clarity',
          path: '/attribute/clarity'
        },
        {
          title: 'Cut',
          path: '/attribute/cut'
        },
        {
          title: 'MM Size',
          path: '/attribute/mm-size'
        },
        {
          title: 'Diamond Group Master',
          path: '/attribute/diamond-group-master'
        },
        {
          title: 'Head',
          path: '/attribute/head'
        },
        {
          title: 'Shank',
          path: '/attribute/shank'
        },
        {
          title: 'Item Size Master',
          path: '/attribute/Item-Size-Master'
        },
        {
          title: 'Item Length Master',
          path: '/attribute/Item-Length-Master'
        },
        {
          title: 'Setting Type/Style',
          path: '/attribute/setting-style'
        },
        {
          title: 'Loose Diamond',
          children: [
            {
              title: 'Fluorescence',
              children: [
                {
                  title: 'Fluorescence Intensity',
                  path: '/attribute/fluorescence/fluorescenceIntensity'
                },
                {
                  title: 'Fluorescence Color',
                  path: '/attribute/fluorescence/fluorescenceColor'
                }
              ]
            },
            {
              title: 'Fancy Color',
              children: [
                {
                  title: 'Fancy Color',
                  path: '/attribute/fancyColor/fancyColor'
                },
                {
                  title: 'Fancy Color Intensity',
                  path: '/attribute/fancyColor/fancyColorIntensity'
                },
                {
                  title: 'Fancy Color Overtone',
                  path: '/attribute/fancyColor/fancyColorOvertone'
                }
              ]
            },
            {
              title: 'Girdle',
              children: [
                {
                  title: 'Girdle Thin',
                  path: '/attribute/girdle/girdleThin'
                },
                {
                  title: 'Girdle Thick',
                  path: '/attribute/girdle/girdleThick'
                },
                {
                  title: 'Girdle Condition',
                  path: '/attribute/girdle/girdleCondition'
                }
              ]
            },
            {
              title: 'Pair',
              children: [
                {
                  title: 'Pair',
                  path: '/attribute/pair/pair'
                },
                {
                  title: 'Pair Separable',
                  path: '/attribute/pair/pairSeparable'
                },
                {
                  title: 'Pair Stock',
                  path: '/attribute/pair/pairStock'
                }
              ]
            },
            {
              title: 'Inclusion',
              children: [
                {
                  title: 'Canter Inclusion',
                  path: '/attribute/inclusion/centerInclusion'
                },
                {
                  title: 'Black Inclusion',
                  path: '/attribute/inclusion/blackInclusion'
                }
              ]
            },
            {
              title: 'lab',
              children: [
                {
                  title: 'lab',
                  path: '/attribute/lab/lab'
                },
                {
                  title: 'lab Location',
                  path: '/attribute/lab/labLocation'
                }
              ]
            },
            {
              title: 'Parcel Stones',
              path: '/attribute/parcelStones'
            },
            {
              title: 'Availability',
              path: '/attribute/availability'
            },
            {
              title: 'Polish',
              path: '/attribute/polish'
            },
            {
              title: 'Symmetry',
              path: '/attribute/symmetry'
            },
            {
              title: 'Culet Condition',
              path: '/attribute/culetCondition'
            },
            {
              title: 'Laser Inscription',
              path: '/attribute/laserInscription'
            },
            {
              title: 'Certificate Comment',
              path: '/attribute/certComment'
            },
            {
              title: 'Time To Location',
              path: '/attribute/timetolocation'
            },
            {
              title: 'Trade Show',
              path: '/attribute/tradeShow'
            },
            {
              title: 'Shade',
              path: '/attribute/shade'
            },
            {
              title: 'Report Type',
              path: '/attribute/reportType'
            },
            {
              title: 'Milky',
              path: '/attribute/milky'
            },
            {
              title: 'BGM',
              path: '/attribute/bgm'
            },
            {
              title: 'H & A',
              path: '/attribute/handA'
            },
            {
              title: 'Growth Type',
              path: '/attribute/growthType'
            },
            {
              title: 'Country',
              path: '/attribute/country'
            },
            {
              title: 'State',
              path: '/attribute/state'
            },
            {
              title: 'City',
              path: '/attribute/city'
            }
          ]
        },
        {
          title: 'Metal',
          children: [
            {
              title: 'Carat Master',
              path: '/attribute/Metal/Carat-Master'
            },
            {
              title: 'Metal Tone',
              path: '/attribute/Metal/metal-tone'
            },
            {
              title: 'Metal Master',
              path: '/attribute/Metal/Metal-Master'
            },
            {
              title: 'Metal Group Master',
              path: '/attribute/Metal/Metal-Group-Master'
            }
          ]
        },
        {
          title: 'setting carat weight',
          path: '/attribute/setting-carat-weight'
        },
        {
          title: 'Gender for filter',
          path: '/attribute/gender-for-filter'
        },
        {
          title: 'Brands',
          path: '/attribute/brand'
        },
        {
          title: 'Tags',
          path: '/attribute/tags'
        }
      ]
    },
    {
      sectionTitle: 'CUSTOMER MANAGEMENT'
    },
    {
      title: 'Customers',
      path: '/customer/customers-list',
      icon: 'tabler:users'
    },
    {
      sectionTitle: 'BUSINESS SECTION'
    },
    {
      title: 'Customer Review',
      path: '/business-section/customer-review',
      icon: 'material-symbols:reviews-outline-sharp'
    },
    {
      title: 'Order Transactions',
      path: '/business-section/order-transactions',
      icon: 'tabler:id'
    },
    {
      title: 'Wishlist Products',
      path: '/business-section/wishlist-product',
      icon: 'mdi:cart-heart'
    },
    {
      title: 'Cart Products',
      path: '/business-section/cart-product',
      icon: 'mdi:cart-variant'
    },
    {
      sectionTitle: 'CUSTOMER REPORT SECTION'
    },
    {
      title: 'Customer Report',
      path: '/customer/customers-reports',
      icon: 'tabler:id'
    },
    {
      sectionTitle: 'PAYMENT MANAGEMENT'
    },
    {
      title: 'Payments',
      path: '/payments/payment',
      icon: 'fluent-mdl2:payment-card'
    },
    {
      sectionTitle: 'ENQUIRY MANAGEMENT'
    },
    {
      title: 'Enquiries',
      icon: 'material-symbols:record-voice-over-rounded',
      children: [
        {
          title: 'Product Enquiries',
          path: '/enquiries/product-enquiries'
        },
        {
          title: 'General Enquiries',
          path: '/enquiries/general-enquiries'
        }
      ]
    },
    {
      sectionTitle: 'FRONTEND MANAGEMENT'
    },

    {
      title: 'Template 1',
      path: '/frontend/template-1',
      icon: 'tabler:album'
    },
    {
      title: '3 Marketing Banner',
      path: '/frontend/3-marketing-banner',
      icon: 'tabler:box-multiple-3'
    },
    {
      title: 'Home About Section',
      path: '/frontend/home-about-section',
      icon: 'tabler:home'
    },
    {
      title: 'Features Sections',
      path: '/frontend/features-sections',
      icon: 'tabler:brand-tabler'
    },
    {
      title: 'Testimonials',
      path: '/frontend/testimonials',
      icon: 'tabler:brand-mastercard'
    },
    {
      title: 'Trending/Marketing Popup',
      path: '/frontend/trending-marketing-popup',
      icon: 'carbon:popup'
    },
    {
      title: 'Blog',
      path: '/frontend/blog/blog-list',
      icon: 'carbon:blog'
    },
    {
      sectionTitle: 'STATIC PAGES MANAGEMENT'
    },
    {
      title: 'Static Pages',
      path: '/static-pages/static-page-list',
      icon: 'tabler:file'
    },
    {
      sectionTitle: 'ROLES & PERMISSION'
    },
    {
      title: 'Roles & Permissions',
      icon: 'tabler:settings-2',
      children: [
        {
          title: 'Roles',
          path: '/roles-permission/roles'
        },
        {
          title: 'User Management',
          path: '/roles-permission/permission'
        }
      ]
    },
    {
      sectionTitle: 'WEB CONFIG & API MANAGEMENT'
    },
    {
      title: 'Email Set-UP',
      icon: 'tabler:mail',
      path: '/web-config-api/email-setup'
    },
    {
      title: 'Instagram ID',
      path: '/web-config-api/instagram-ID',
      icon: 'tabler:brand-instagram'
    },
    {
      title: 'Company Info setup',
      path: '/web-config-api/company-info-setup',
      icon: 'tabler:settings'
    },
    {
      sectionTitle: 'Settings'
    },
    {
      title: 'Config Settings',
      icon: 'fluent:slide-settings-24-regular',
      children: [
        {
          title: 'Ring Configurator',
          path: '/settings/config-setting/ring-configurator'
        },
        {
          title: 'Three Stones Configurator',
          path: '/settings/config-setting/three-stones-configurator'
        },
        {
          title: 'Eternity Configurator',
          path: '/settings/config-setting/eternity-configurator'
        },
        {
          title: 'Bracelet Configurator',
          path: '/settings/config-setting/bracelet-configurator'
        },
        {
          title: 'Pendant Configurator',
          path: '/settings/config-setting/pendant-configurator'
        },
        {
          title: 'Earring Configurator',
          path: '/settings/config-setting/erring-configurator'
        }
      ]
    },
    {
      title: 'Tax-Master',
      path: '/settings/tax-master',
      icon: 'la:percentage'
    },
    {
      title: 'Metal Rate Setting',
      path: '/settings/metal-rate-setting',
      icon: 'tabler:currency-rupee'
    },
    {
      title: 'Country-Master',
      icon: 'tabler:category',
      children: [
        {
          title: 'Country',
          path: '/country-master/Country'
        },
        {
          title: 'State',
          path: '/country-master/State'
        },
        {
          title: 'City',
          path: '/country-master/City'
        }
      ]
    },
    {
      title: 'Currency Master',
      path: '/settings/currency-master',
      icon: 'tabler:currency-dollar'
    }
  ]
}

export default navigation
