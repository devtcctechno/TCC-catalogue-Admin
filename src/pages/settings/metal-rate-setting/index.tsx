import { Button, Card, CardContent, CardHeader, Divider, Grid, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { appErrors } from "src/AppConstants"
import TccInput from "src/customComponents/Form-Elements/inputField"
import { EDIT_METAL_RATE, METAL_MASTER_DROPDOWN } from "src/services/AdminServices"
import Box from '@mui/material/Box'

const MetalRateSetting = () => {

    const [goldRate, setGoldRate] = useState<any>()
    const [silverRate, setSilverRate] = useState<any>()
    const [platinumRate, setPlatinumRate] = useState<any>()


    const metalMasterListData = async () => {

        try {
            const data = await METAL_MASTER_DROPDOWN();
            if (data.code === 200 || data.code === "200") {
                const goldRates = data.data.find((ele: any) => ele.id == 1)
                const silverRates = data.data.find((ele: any) => ele.id == 2)
                const platinumRates = data.data.find((ele: any) => ele.id == 3)
                setGoldRate(goldRates)
                setSilverRate(silverRates)
                setPlatinumRate(platinumRates)
            } else {

                return toast.error(data.message);
            }
        } catch (e: any) {
            toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN)
        }
    }

    const goldRateUpdate = async () => {
        const payload = {
            "rate": goldRate?.metal_rate
        }
        try {
            const data = await EDIT_METAL_RATE(goldRate.id, payload);
            if (data.code === 200 || data.code === "200") {

                return toast.success(data.message)
            } else {

                return toast.error(data.message);
            }
        } catch (e: any) {
            toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN)
        }
    }

    const silverRateUpdate = async () => {
        const payload = {
            "rate": silverRate?.metal_rate
        }
        try {
            const data = await EDIT_METAL_RATE(silverRate.id, payload);
            if (data.code === 200 || data.code === "200") {

                return toast.success(data.message)
            } else {

                return toast.error(data.message);
            }
        } catch (e: any) {
            toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN)
        }
    }

    const platinumRateUpdate = async () => {
        const payload = {
            "rate": platinumRate?.metal_rate
        }
        try {
            const data = await EDIT_METAL_RATE(platinumRate?.id, payload);
            if (data.code === 200 || data.code === "200") {

                return toast.success(data.message)
            } else {
                return toast.error(data.message);
            }
        } catch (e: any) {
            toast.error(e?.data?.message || appErrors.UNKNOWN_ERROR_TRY_AGAIN)
        }
    }


    useEffect(() => {
        metalMasterListData()
    }, [])


    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='Metal Rate Setting'></CardHeader>
                    <Divider />
                    <CardContent>
                        <Box sx={{ display: 'flex' }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', marginRight: '10px' }}>Gold Rate : </Typography>
                            <TccInput
                                fullWidth
                                type="number"
                                label='Gold Rate'
                                value={goldRate?.metal_rate || ''}
                                placeholder=''
                                onChange={(e: any) => setGoldRate((prev: any) => {
                                    return {
                                        ...prev,
                                        metal_rate: e.target.value
                                    }
                                })}
                            />
                            <Button variant='contained' style={{ marginLeft: '10px' }} onClick={goldRateUpdate}>
                                UPDATE
                            </Button>
                        </Box>
                        <Box sx={{ display: "flex", mt: 10 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', marginRight: '10px' }}>Silver Rate: </Typography>
                            <TccInput
                                fullWidth
                                type='number'
                                label='Silver Rate'
                                value={silverRate?.metal_rate || ''}
                                placeholder=''
                                onChange={(e: any) => setSilverRate((prev: any) => {
                                    return {
                                        ...prev,
                                        metal_rate: e.target.value
                                    }
                                })}
                            />
                            <Button variant='contained' style={{ marginLeft: '10px' }} onClick={silverRateUpdate}>
                                UPDATE
                            </Button>
                        </Box>
                        <Box sx={{ display: "flex", mt: 10 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', marginRight: '10px' }}>Platinum Rate: </Typography>
                            <TccInput
                                fullWidth
                                type='number'
                                label='Platinum Rate'
                                value={platinumRate?.metal_rate || ''}
                                placeholder=''
                                onChange={(e: any) => setPlatinumRate((prev: any) => {
                                    return {
                                        ...prev,
                                        metal_rate: e.target.value
                                    }
                                })}
                            />
                            <Button variant='contained' style={{ marginLeft: '10px' }} onClick={platinumRateUpdate}>
                                UPDATE
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid >
    )
}

export default MetalRateSetting