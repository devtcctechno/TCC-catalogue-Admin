// ** MUI Imports

import { Icon } from '@iconify/react'
import { Avatar, Box, Button, IconButton, InputLabel, MenuItem, Rating, Select, Switch, Tooltip, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomChip from 'src/@core/components/mui/chip'
import { CURRENCY_VALUE, DATEPICKER_DATE_FORMAT, IMG_ENDPOINT } from 'src/AppConfig'
import TccSelect from 'src/customComponents/Form-Elements/select'
import TccSwitch from 'src/customComponents/Form-Elements/switch'
import { DataGrid, GridSortModel } from '@mui/x-data-grid'
const TccDataTable = ({ label, defaultValue, inputLabel, Options, onChange, value, fullWidth, sx, title, disabled, InputProps, rows, index, column, onChangepage, rowHeight, pageSize, iconTitle, rowCount, page, onPageChange, paginationMode, handleSortChanges, autoWidth }: any) => {
    const [paginationModels, setPaginationModel] = React.useState<any>({
        pageSize: pageSize,
        page: page,
    });

    const imagePath = IMG_ENDPOINT + "/"

    const orderStatus: any = {
        1: { title: 'Pending', color: 'primary' },
        2: { title: 'Confirmed', color: 'success' },
        3: { title: 'Processing', color: 'warning' },
        4: { title: 'OutOfDelivery', color: 'info' },
        5: { title: 'Delivered', color: 'success' },
        6: { title: 'Returned', color: 'warning' },
        7: { title: "Failed", color: "error" },
        8: { title: "Canceled", color: "error" }
    }

    const paymentStatusList: any = {
        0: { title: 'Pending', color: 'error' },
        1: { title: 'Paid', color: 'success' },
        2: { title: 'Failed', color: 'error' }
    }

    const columns = column.map((rows: any) => (

        {
            flex: rows.flex,
            headerName: rows.headerName,
            field: rows.field,
            width: rows.width,
            renderCell: ({ row }: any) => {
                return (
                    <div itemID={row.id}
                    >
                        {rows.hoverText && (
                            <Tooltip title={row[rows.hoverValue]}>
                                <Typography noWrap sx={{ marginTop: '20px', fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }} >
                                    {row[rows.value]}
                                </Typography>
                            </Tooltip>
                        )}
                        {rows.text && <Typography noWrap sx={{ marginTop: '20px', fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }} >
                            {row[rows.value] ? row[rows.value] : "-"}
                        </Typography>}
                        {rows.email && <Typography noWrap sx={{ marginTop: '20px', fontWeight: 500, color: 'text.secondary' }} >
                            {row[rows.value] ? row[rows.value] : "-"}
                        </Typography>}

                        {rows.date && <Typography noWrap sx={{ marginTop: '20px', fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
                            {moment(row[rows.value]).format(DATEPICKER_DATE_FORMAT)}
                        </Typography>}

                        {rows.price && <Typography noWrap sx={{ marginTop: '20px', fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
                            {`${CURRENCY_VALUE} ${parseFloat(row[rows.value]).toFixed(2)}`}
                        </Typography>}

                        {rows.avatars && <CustomAvatar
                            skin='light'
                            sx={{ mr: 4, width: 30, height: 30, marginTop: '15px', }}
                            src={`${imagePath}${row[rows.value]}`}
                        />
                        }
                        {rows.imageWithUrl && <CustomAvatar
                            skin='light'
                            sx={{ mr: 4, width: 30, height: 30 }}
                            src={`${row[rows.value]}`}
                            className='image-hover'
                        />
                        }
                        {rows.chips && <CustomChip
                            rounded
                            skin='light'
                            size='small'
                            label={row[rows.value] === '1' ? "Active" : "Inactive"}
                            color={row[rows.value] === '1' ? "success" : "error"}
                            sx={{ textTransform: 'capitalize' }}
                        />}
                        {rows.config_chips &&
                            <>
                                {row[rows.is_config] === '1' || row[rows.is_band] === '1' || row[rows.is_bracelet] === '1' || row[rows.is_earring] === '1' || row[rows.is_pendant] === '1' || row[rows.is_three_stone] === '1' ?
                                    <>
                                        {row[rows.is_config] === '1' && <CustomChip
                                            rounded
                                            skin='light'
                                            size='small'
                                            label={row[rows.is_config] === '1' ? "R" : ''}
                                            color={"primary"}
                                            sx={{ textTransform: 'capitalize', mr: '5px' }}
                                        />}
                                        {row[rows.is_band] === '1' && <CustomChip
                                            rounded
                                            skin='light'
                                            size='small'
                                            label={row[rows.is_band] === '1' ? "B" : ''}
                                            color={"warning"}
                                            sx={{ textTransform: 'capitalize', mr: '5px' }}
                                        />}
                                        {row[rows.is_bracelet] === '1' &&
                                            <CustomChip
                                                rounded
                                                skin='light'
                                                size='small'
                                                label={row[rows.is_bracelet] === '1' ? "BR" : ''}
                                                color={"error"}
                                                sx={{ textTransform: 'capitalize', mr: '5px' }}
                                            />
                                        }
                                        {row[rows.is_earring] === '1' && <CustomChip
                                            rounded
                                            skin='light'
                                            size='small'
                                            label={row[rows.is_earring] === '1' ? "ER" : ''}
                                            color={"success"}
                                            sx={{ textTransform: 'capitalize', mr: '5px' }}
                                        />}
                                        {row[rows.is_pendant] === '1' && <CustomChip
                                            rounded
                                            skin='light'
                                            size='small'
                                            label={row[rows.is_pendant] === '1' ? "P" : ''}
                                            color={"info"}
                                            sx={{ textTransform: 'capitalize', mr: '5px' }}
                                        />}
                                        {row[rows.is_three_stone] === '1' && <CustomChip
                                            rounded
                                            skin='light'
                                            size='small'
                                            label={row[rows.is_three_stone] === '1' ? "T" : ''}
                                            color={"secondary"}
                                            sx={{ textTransform: 'capitalize', mr: '5px' }}
                                        />}
                                    </> : '-'}
                            </>

                        }
                        {rows.order_status_chip && <CustomChip
                            rounded
                            skin='light'
                            size='small'
                            label={orderStatus[row.order_status]?.title}
                            color={orderStatus[row.order_status]?.color}
                            sx={{ textTransform: 'capitalize' }}
                        />}
                        {rows.payment_status_chip && <CustomChip
                            rounded
                            skin='light'
                            size='small'
                            label={paymentStatusList[row.payment_status]?.title}
                            color={paymentStatusList[row.payment_status]?.color}
                            sx={{ textTransform: 'capitalize' }}
                        />}
                        {rows.switch &&
                            <Tooltip title='Enable/Disable'>
                                <Switch checked={row[rows.value] === "1"} onChange={(event, checked) => rows.SwitchonChange(checked, row)} />
                            </Tooltip>
                        }
                        {rows.view &&
                            <Tooltip title='View Details'>
                                <IconButton
                                    size='small'
                                    sx={{ color: 'text.secondary' }}
                                    onClick={() => rows.viewOnClick(row)}
                                >
                                    <Icon icon='tabler:eye' />
                                </IconButton>
                            </Tooltip>
                        }
                        {rows.edit &&
                            <Tooltip title={`Edit ${iconTitle}`}>
                                <IconButton size='small'
                                    sx={{ color: 'text.secondary' }}
                                    onClick={() => rows.editOnClick(row)}
                                >
                                    <Icon icon='tabler:edit' />
                                </IconButton>
                            </Tooltip>
                        }
                        {
                            rows.deleted &&
                            <Tooltip title={`Delete ${iconTitle}`}>
                                <IconButton size='small'
                                    sx={{ color: 'text.secondary' }}
                                    onClick={() => rows.deletedOnClick(row)}
                                >
                                    <Icon icon='tabler:trash' />
                                </IconButton>
                            </Tooltip>
                        }
                        {rows.dropdown &&
                            <>
                                <InputLabel id='demo-simple-select-outlined-label'>{inputLabel}</InputLabel>
                                <Select
                                    style={{ height: '35px' }}
                                    fullWidth={fullWidth}
                                    label={label}
                                    defaultValue={defaultValue}
                                    id='demo-simple-select-outlined'
                                    labelId='demo-simple-select-outlined-label'
                                    value={row[rows.value]}
                                    disabled={disabled}
                                    onChange={(e) => rows.onChange(e, row)}
                                    inputProps={{ readOnly: InputProps }}

                                >
                                    {rows.Options?.map((option: any) => (
                                        <MenuItem key={option.id} value={option.id}>{option.title}</MenuItem>
                                    ))}
                                </Select>
                            </>
                        }
                        {
                            rows.imageUpload &&
                            <Tooltip title={`Images`}>
                                <IconButton size='small'
                                    sx={{ color: 'text.secondary' }}
                                    onClick={() => rows.imageUploadOnClick(row)}
                                >
                                    <Icon icon='uil:image-upload' />
                                </IconButton>
                            </Tooltip>
                        }
                        {
                            rows.rating &&
                            <Rating readOnly defaultValue={row[rows.value]} precision={0.5} name='read-only' />
                        }
                        {
                            rows.gustName &&
                            <div>{row[rows.value] ? <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
                                {row[rows.value]}
                            </Typography> : 
                            <div style={{ display: 'flex' }}><CustomChip
                                rounded
                                skin='light'
                                size='small'
                                label="G"
                                color="success"
                                sx={{ textTransform: 'capitalize', marginTop: '15px', }}
                            /><Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize', marginLeft: 2, marginTop: '15px', }}>
                                    {row[rows.value2]}
                                </Typography></div>}</div>
                        }
                        {
                            rows.gustEmail &&
                            <div>{row[rows.value] ? <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
                                {row[rows.value]}
                            </Typography> : <div style={{ display: 'flex' }}><CustomChip
                                rounded
                                skin='light'
                                size='small'
                                label="G"
                                color="success"
                                sx={{ textTransform: 'capitalize' }}
                            /><Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', marginLeft: 2 }}>
                                    {row[rows.value2]}
                                </Typography></div>}</div>
                        }

                    </div >
                )
            }
        }
    ))


    useEffect(() => {
        if (onPageChange) {
            onPageChange(paginationModels)
        }
    }, [paginationModels])

    return (
        <Grid item xs={12}>
            <div style={{ height: '70vh', width: '100%' }}>
                <DataGrid
                    disableRowSelectionOnClick
                    disableColumnFilter={true}
                    rowHeight={rowHeight ? rowHeight : 70}
                    rows={rows}
                    columns={columns}
                    pageSizeOptions={[{ value: 25, label: '25' }, { value: 50, label: '50' }, { value: 75, label: '75' }, { value: 100, label: '100' }]}
                    rowCount={rowCount}
                    onSortModelChange={handleSortChanges}
                    paginationMode='server'
                    paginationModel={{ page: page, pageSize: pageSize }}
                    onPaginationModelChange={setPaginationModel}
                />
            </div>
        </Grid>

    )
}


export default TccDataTable

