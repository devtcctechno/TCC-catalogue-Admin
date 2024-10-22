
// ** MUI Imports
import { Divider, CardHeader, Grid, Card } from '@mui/material'
import { useEffect, useState } from 'react'
import TCCTableHeader from 'src/customComponents/data-table/header'
import TccDataTable from 'src/customComponents/data-table/table'
import Box, { BoxProps } from '@mui/material/Box'
import { toast } from 'react-hot-toast'
import { USER_SUBSCRIPTION_LIST, USER_SUBSCRIPTION_STATUS } from 'src/services/AdminServices'
import { createPagination } from 'src/utils/sharedFunction'
import { ICommonPagination } from 'src/data/interface'
import { SEARCH_DELAY_TIME, appErrors } from 'src/AppConstants'


const SideSettingStyle = () => {

    let timer: any;
    const [searchFilter, setSearchFilter] = useState()
    const [pagination, setPagination] = useState({ ...createPagination(), search_text: "" })
    const [result, setResult] = useState([])


    //////////////////////// GET API ////////////////////////

    const userSubscriberList = async (mbPagination: ICommonPagination) => {
        try {
            const data = await USER_SUBSCRIPTION_LIST(mbPagination);
            if (data.code === 200 || data.code === "200") {
                setPagination(data.data.pagination)
                setResult(data.data.result)
            } else {
                return toast.error(data.message);
            }
        } catch (e: any) {
            toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN);
        }

        return false;
    }
    useEffect(() => {
        userSubscriberList(pagination);
    }, []);

    const handleChangePerPageRows = (perPageRows: any) => {
        userSubscriberList({ ...pagination, per_page_rows: perPageRows.pageSize, current_page: perPageRows.page + 1 })
    }

    const handleChangeSortBy = (orderSort: any) => {
        userSubscriberList({ ...pagination, sort_by: orderSort == undefined ? "id" : orderSort.map((t: any) => t.field), order_by: orderSort == undefined ? "DESC" : orderSort.map((t: any) => t.sort) })
    }
    const searchBusinessUser = async () => {
        if (timer) {
            clearTimeout(timer);
        }

        timer = setTimeout(() => {
            userSubscriberList({ ...pagination, current_page: 1, search_text: searchFilter });
        }, SEARCH_DELAY_TIME);
    }

    useEffect(() => {
        searchBusinessUser();
    }, [searchFilter])


    //////////////////// STATUS API ///////////////////////

    const userSubscriberStatusUpdate = async (checked: boolean, row: any) => {
        const payload = {
            "id": row.id,
            "is_subscribe": checked ? '1' : '0',
        };
        try {
            const data = await USER_SUBSCRIPTION_STATUS(payload);

            if (data.code === 200 || data.code === "200") {
                toast.success(data.message);
                userSubscriberList(pagination)

            } else {
                return toast.error(data.message);
            }
        } catch (e: any) {
            toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN);
        }

        return false;
    }
    const column = [

        {
            width: 350,
            value: 'email',
            headerName: 'email',
            field: 'email',
            email: 'text'
        },
        {
            width: 250,
            headerName: 'Add date',
            field: 'created_date',
            date: 'date',
            value: 'created_date'

        },
        {
            width: 350,
            headerName: 'Action',
            field: 'is_subscribe',
            switch: 'switch',
            value: 'is_subscribe',
            SwitchonChange: userSubscriberStatusUpdate

        }
    ]

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='User Subscriber'></CardHeader>
                    <Divider />
                    <Box>
                        <TCCTableHeader value={searchFilter}
                            onChange={(e: any) => setSearchFilter(e.target.value)}
                            ButtonName='Add User Subscriber'
                        />

                    </Box>
                    <TccDataTable
                        column={column}
                        rows={result}
                        handleSortChanges={handleChangeSortBy}
                        pageSize={parseInt(pagination.per_page_rows.toString())}
                        rowCount={pagination.total_items}
                        page={pagination.current_page - 1}
                        onPageChange={handleChangePerPageRows}
                        iconTitle='User Subscriber'
                    />
                </Card>
            </Grid>

        </Grid>
    )
}


export default SideSettingStyle