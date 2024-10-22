// ** MUI Imports
import { Icon } from '@iconify/react'
import { CircularProgress, IconButton } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

// ** Icon Imports


const TCCTableHeader = ({ onChange, toggle, value, isButton, ButtonName, searchField, exportButton, infoButton, infotoggle, importButton, uploadOnClick, onChangeUpload, configButton, fileDownload, uploadFileName, loading, exportClick, isProductButton, normalProductClick, variantProductClick }: any) => {

    return (
        <Box
            sx={{
                py: 4,
                px: 6,
                pr: 4,
                pl: 4,
                rowGap: 2,
                columnGap: 4,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}
        >
            {exportButton ? <Button variant='contained' startIcon={<Icon icon='tabler:upload' />} onClick={exportClick}>
                Export
            </Button> : <></>}


            {importButton ?
                <>
                    <div style={{ display: 'flex', alignItems: 'center', marginRight: '-15px' }}>
                        <div>
                            <Button component='label' variant='contained' htmlFor='account-settings-upload-image' sx={{ '& svg': { mr: 2 }, mr: 1 }}>
                                <input className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium css-ya582n-MuiButtonBase-root-MuiButton-root"
                                    hidden
                                    style={{ fontSize: '15px' }}
                                    type="file"
                                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                    onChange={onChangeUpload}
                                    id="account-settings-upload-image"
                                />
                                <Icon icon='material-symbols:upload' fontSize='1.125rem' /> upload File
                            </Button>
                        </div>
                        {uploadFileName && <div style={{ marginRight: '10px' }}>
                            <p>{uploadFileName}</p>
                        </div>}
                    </div>
                    <div style={{ display: 'flex' }}>
                        <Button onClick={uploadOnClick} variant='contained' sx={{ '& svg': { mr: 2 }, mr: 1 }}>
                            <Icon icon='vaadin:refresh' fontSize='1.125rem' /> Apply Changes
                        </Button>
                        <Button onClick={toggle} variant='contained' sx={{ '& svg': { mr: 2 } }}>
                            <Icon fontSize='1.125rem' icon='tabler:plus' />
                            Add diamond group master
                        </Button>
                    </div>
                </> :
                <>
                    <TextField
                        size='small'
                        value={value}
                        placeholder='Search'
                        onChange={onChange}
                    />

                    {infoButton ? <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button variant='contained' sx={{ '& svg': { mr: 2 }, mr: 2 }} onClick={infotoggle}>
                            <Icon icon='uil:info' fontSize='1.125rem' /> Info
                        </Button>

                        {isButton ? <Button onClick={toggle} variant='contained' sx={{ '& svg': { mr: 2 } }}>
                            <Icon fontSize='1.125rem' icon='tabler:plus' />
                            {ButtonName}
                        </Button> : <></>} </Box> :
                        <>
                            {isButton ? <Button onClick={toggle} variant='contained' sx={{ '& svg': { mr: 2 } }}>
                                <Icon fontSize='1.125rem' icon='tabler:plus' />
                                {ButtonName}
                            </Button> : <></>}
                        </>
                    }

                </>
            }

            {configButton ? <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                <Button hidden onClick={fileDownload} variant='contained' sx={{ mr: 2, py: 2.5 }}>
                    <Icon icon='material-symbols:download' fontSize='1.125rem' />
                </Button>
                <Button component='label' variant='contained' htmlFor='account-settings-upload-image' sx={{ mr: 2, py: 2.5 }}>
                    <Icon icon='material-symbols:upload' fontSize='1.125rem' />
                    <input
                        hidden
                        id='account-settings-upload-image'
                        // className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium css-ya582n-MuiButtonBase-root-MuiButton-root"
                        style={{ marginRight: '5px', fontSize: '15' }}
                        type="file"
                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        onChange={onChangeUpload}
                    />

                </Button>
                <p>{uploadFileName}</p>
                {/* <input
                    hidden
                    // className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium css-ya582n-MuiButtonBase-root-MuiButton-root"
                    style={{ marginRight: '5px', fontSize: '15' }}
                    type="file"
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    onChange={onChangeUpload}
                /> */}


                {/* <label htmlFor="contained-button-file">
                    <Button variant="contained" color="primary" component="span" sx={{ '& svg': { mr: 2 }, mr: 2 }}>
                        <Icon icon='material-symbols:upload-rounded' fontSize='1.125rem' />
                        Upload
                    </Button>
                </label> */}
                <Button onClick={uploadOnClick} variant='contained' sx={{ '& svg': { mr: 2 }, mr: 2 }}>
                    {loading === true ?
                        <div> <CircularProgress size={25} sx={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "column",
                            color: 'white'
                        }} />
                        </div> : <Icon icon='vaadin:refresh' fontSize='1.125rem' />}
                    <div style={{ marginLeft: '10px' }}>Apply Changes</div>
                </Button>
            </Box> :
                <></>
            }
            {searchField && <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                <TextField
                    size='small'
                    value={value}
                    placeholder='Search'
                    onChange={onChange}
                />

                {infoButton ? <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button variant='contained' sx={{ '& svg': { mr: 2 }, mr: 2 }} onClick={infotoggle}>
                        <Icon icon='uil:info' fontSize='1.125rem' /> Info
                    </Button>

                    {isButton ? <Button onClick={toggle} variant='contained' sx={{ '& svg': { mr: 2 } }}>
                        <Icon fontSize='1.125rem' icon='tabler:plus' />
                        {ButtonName}
                    </Button> : <></>} </Box> :
                    <>
                        {isButton ? <Button onClick={toggle} variant='contained' sx={{ '& svg': { mr: 2 } }}>
                            <Icon fontSize='1.125rem' icon='tabler:plus' />
                            {ButtonName}
                        </Button> : <></>}
                    </>
                }

            </Box>}
            {isProductButton ? <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                <Button onClick={normalProductClick} variant='contained' sx={{ '& svg': { mr: 2 }, mr: 2 }}>
                    <Icon fontSize='1.125rem' icon='tabler:plus' />
                    Add Normal Product
                </Button>
                <Button onClick={variantProductClick} variant='contained' sx={{ '& svg': { mr: 2 } }}>
                    <Icon fontSize='1.125rem' icon='tabler:plus' />
                    Add Variant Product
                </Button> : <></>
            </Box> : <></>}
        </Box>
    )
}

export default TCCTableHeader
