import { Box, Button, Card, CardContent, CardHeader, Checkbox, Divider, Grid, Tab, Tabs, TextField } from "@mui/material"
import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CONFIGURATOR_MANAGE_KEY, DEFAULT_STATUS_CODE_SUCCESS } from "src/AppConstants";
import { Diamond_type } from "src/data/enum";
import { EDIT_CONFIG_MASTER, GET_MASTER_LIST_DATA } from "src/services/AdminServices";

interface PropType {
    configKey: string;
    title: string;
    showMetal?: boolean
    showMetalTone?: boolean
    showMetalKarat?: boolean
    showDiamondShape?: boolean
    showDiamondColorClarity?: boolean
    showStone?: boolean
    showDiamondCut?: boolean
    showSideSetting?: boolean
    showCarat?: boolean
    showShank?: boolean
    showHead?: boolean
}

const ConfigSetting: FC<PropType> = props => {

    const { configKey, title, showCarat = true, showDiamondColorClarity = true, showDiamondCut = true, showDiamondShape = true, showHead = true, showMetal = true, showMetalKarat = true, showMetalTone = true, showShank = true, showSideSetting = true, showStone = true } = props

    const configValue = configKey === CONFIGURATOR_MANAGE_KEY.RingConfigurator ? 'is_config' : configKey === CONFIGURATOR_MANAGE_KEY.ThreeStoneConfigurator ? 'is_three_stone' : configKey === CONFIGURATOR_MANAGE_KEY.PendantConfigurator ? 'is_pendant' : configKey === CONFIGURATOR_MANAGE_KEY.EternityBandConfigurator ? 'is_band' : configKey === CONFIGURATOR_MANAGE_KEY.BraceletConfigurator ? 'is_bracelet' : configKey === CONFIGURATOR_MANAGE_KEY.EarringConfigurator ? 'is_earring' : 'is_config'

    // constant 
    const thStyle: any = { position: "sticky", top: "0%", background: "white", zIndex: "2" }
    const tableBox: any = { overflowY: 'auto', height: "50vh" }

    const [masterData, setMasterData] = useState<any>()
    const [selectedBtn, setSelectedBtn] = useState<number>(0);

    const fetchMasterList = async () => {
        try {
            const data = await GET_MASTER_LIST_DATA();
            if (data.code === DEFAULT_STATUS_CODE_SUCCESS) {
                setMasterData(data.data)
            } else {
                toast.error(data?.message)
            }
        } catch (e: any) {
            toast.error(e?.data?.message)
        }
    }

    useEffect(() => {
        fetchMasterList()
    }, [])

    const handleSave = async (payload: any) => {
        try {
            const data = await EDIT_CONFIG_MASTER(configKey, payload)
            if (data.code === DEFAULT_STATUS_CODE_SUCCESS) {
                fetchMasterList()
                toast.success(data?.message)
            } else {
                toast.error(data?.message)
            }
        } catch (e: any) {
            toast.error(e?.data?.message)
        }
    }

    const filterData = (data: any, returnValues: any) => {
        const filterList = data.filter((value: any) => (`${value[configValue]}` === '1'))

        if (returnValues.length === 1) {
            return filterList.map((item: any) => item[returnValues[0]]);
        } else {
            return filterList.map((item: any) => {
                const result: any = {};
                returnValues.forEach((value: any) => {
                    if (item.hasOwnProperty(value)) {
                        if (typeof item[value] === 'object' && !Array.isArray(item[value])) {
                            result[value] = item[value]?.[configKey];
                        } else {
                            result[value] = item[value];

                        }
                    }
                });
                return result;
            });
        }
    }

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedBtn(newValue);
    };


    const masterMenuList = [
        {
            id: 1,
            name: "Metal Master",
            show: showMetal,
        },
        {
            id: 2,
            name: "Metal Tone Master",
            show: showMetalTone,
        },
        {
            id: 3,
            name: "Metal Karat Master",
            show: showMetalKarat,
        },
        {
            id: 4,
            name: "Diamond Shape",
            show: showDiamondShape,
        },
        {
            id: 5,
            name: "Diamond Color and Clarity",
            show: showDiamondColorClarity,
        },
        {
            id: 6,
            name: "Stone Master",
            show: showStone,
        },
        {
            id: 7,
            name: "Diamond Cut Master",
            show: showDiamondCut,
        },
        {
            id: 8,
            name: "Side Setting Master",
            show: showSideSetting,
        },
        {
            id: 9,
            name: "Carat Master",
            show: showCarat,
        },
        {
            id: 10,
            name: "Shank Master",
            show: showShank,
        },
        {
            id: 11,
            name: "Head Master",
            show: showHead,
        },
    ]

    return (
        <>
            <Card sx={{ mb: 5 }}>
                <CardHeader title={`${title} Configurator Setting`} />
                <Divider />
            </Card>
            <Grid container>
                <Grid item xs={2.4}>
                    <Box sx={{ height: "100%", borderRadius: 1 }}>
                        <Tabs orientation="vertical" variant="fullWidth" value={selectedBtn} onChange={handleChange} sx={{ backgroundColor: "white", position: "sticky", top: "100px", borderRadius: 1, px: 1, py: 2 }}>
                            {masterMenuList.map((t, index) => {
                                return t.show && <Tab label={t.name} sx={{ textTransform: "capitalize", alignItems: "start", textAlign: "start", background: `${selectedBtn === index ? "linear-gradient(72.47deg, #072957 22.16%, rgba(7, 41, 87, 0.7) 76.47%)" : "white"}`, "&.Mui-selected": { color: "white" }, m: 1, borderRadius: 1 }} key={t.id} />;
                            })}
                        </Tabs>
                    </Box>
                </Grid>
                <Grid item xs={9.6}>
                    <Card>
                        <CardHeader title={masterMenuList[selectedBtn].name} />
                        <CardContent sx={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                            {selectedBtn === 0 && <>
                                <Box sx={tableBox}>
                                    <table style={{ width: '100%' }}>
                                        <tr>
                                            <th style={thStyle} align='center'></th>
                                            <th style={thStyle} align='center'>Active</th>
                                        </tr>
                                        {masterData?.metal_master?.map((value: any, index: any) => <tr>
                                            <td align='center' style={{ textAlign: 'left' }}>
                                                {value?.name}
                                            </td>
                                            <td align='center'>
                                                <Checkbox checked={value[configValue] === '1' ? true : false} onChange={(e) => {
                                                    const data = [...masterData.metal_master];
                                                    if (e.target.checked) {
                                                        data[index][configValue] = "1";
                                                    } else {
                                                        data[index][configValue] = "0";
                                                    }
                                                    setMasterData({ ...masterData, metal_master: data });
                                                }} />
                                            </td>
                                        </tr>)}
                                    </table>
                                </Box>
                                <div style={{ display: 'flex', justifyContent: 'end', marginTop: 10 }}>
                                    <Button variant='contained' onClick={() => handleSave({ metal_master: filterData(masterData?.metal_master, ['id']) })}>Save</Button>
                                </div>
                            </>}
                            {selectedBtn === 1 && <>
                                <Box style={tableBox}>
                                    <table style={{ width: '100%' }}>
                                        <tr>
                                            <th align='center' style={thStyle}></th>
                                            <th align='center' style={thStyle}>Active</th>
                                        </tr>
                                        {masterData?.metal_tone_master?.map((value: any, index: any) => <tr>
                                            <td align='center' style={{ textAlign: 'left' }}>
                                                {value?.name}
                                            </td>
                                            <td align='center'>
                                                <Checkbox checked={value[configValue] === '1' ? true : false} onChange={(e) => {
                                                    const data = [...masterData.metal_tone_master];
                                                    if (e.target.checked) {
                                                        data[index][configValue] = "1";
                                                    } else {
                                                        data[index][configValue] = "0";
                                                    }
                                                    setMasterData({ ...masterData, metal_tone_master: data });
                                                }} />

                                            </td>
                                        </tr>)}
                                    </table>
                                </Box>
                                <div style={{ display: 'flex', justifyContent: 'end', marginTop: 10 }}>
                                    <Button variant='contained' onClick={() => handleSave({ metal_tone_master: filterData(masterData?.metal_tone_master, ['id']) })}>Save</Button>
                                </div>
                            </>}
                            {selectedBtn === 2 && <>
                                <Box style={tableBox}>
                                    <table style={{ width: '100%' }}>
                                        <tr>
                                            <th align='center' style={thStyle}></th>
                                            <th align='center' style={thStyle}>Active</th>
                                        </tr>
                                        {masterData?.metal_karat_master?.map((value: any, index: any) => <tr>
                                            <td align='center' style={{ textAlign: 'left' }}>
                                                {value?.name}KT
                                            </td>
                                            <td align='center'>
                                                <Checkbox checked={value[configValue] === '1' ? true : false} onChange={(e) => {
                                                    const data = [...masterData.metal_karat_master];
                                                    if (e.target.checked) {
                                                        data[index][configValue] = "1";
                                                    } else {
                                                        data[index][configValue] = "0";
                                                    }
                                                    setMasterData({ ...masterData, metal_karat_master: data });
                                                }} />
                                            </td>
                                        </tr>)}
                                    </table>
                                </Box>
                                <div style={{ display: 'flex', justifyContent: 'end', marginTop: 10 }}>
                                    <Button variant='contained' onClick={() => handleSave({ metal_karat_master: filterData(masterData?.metal_karat_master, ['id']) })}>Save</Button>
                                </div>
                            </>}
                            {selectedBtn === 3 && <>
                                <Box sx={tableBox}>
                                    <table style={{ width: '100%' }}>
                                        <tr>
                                            <th align='center' style={thStyle}></th>
                                            <th align='center' style={thStyle}>Active</th>
                                            <th align='center' style={thStyle}>Natural</th>
                                            <th align='center' style={thStyle}>Lab Grown</th>
                                            <th align='center' style={thStyle}>Both</th>
                                            {masterData?.diamond_carat_size?.filter((t: any) => t[configValue] === "1").map((t: any) => {
                                                return <th align="center" style={thStyle}>{t.value}</th>;
                                            })}
                                            <th align="center" style={thStyle}>Sort Order</th>
                                        </tr>
                                        {masterData?.diamond_shape?.map((value: any, index: any) => <tr>
                                            <td align='center' style={{ textAlign: 'left', position: 'sticky', left: 0, backgroundColor: "white", zIndex: '1' }}>
                                                {value?.name}
                                            </td>
                                            <td align='center'>
                                                <Checkbox checked={value[configValue] === '1' ? true : false} onChange={(e) => {
                                                    const data = [...masterData.diamond_shape];
                                                    if (e.target.checked) {
                                                        data[index][configValue] = "1";
                                                    } else {
                                                        data[index][configValue] = "0";
                                                    }
                                                    setMasterData({ ...masterData, diamond_shape: data });
                                                }} />
                                            </td>
                                            <td align='center'>
                                                <Checkbox checked={value.diamond_type && value.diamond_type[configKey] === Diamond_type.Natural ? true : false} onChange={(e) => {
                                                    const data = [...masterData.diamond_shape];
                                                    data[index].diamond_type = {
                                                        ...data[index].diamond_type,
                                                        [configKey]: Diamond_type.Natural
                                                    };
                                                    setMasterData({ ...masterData, diamond_shape: data });
                                                }} />
                                            </td><td align='center'>
                                                <Checkbox checked={value.diamond_type && value.diamond_type[configKey] === Diamond_type.Lab_grown ? true : false} onChange={(e) => {
                                                    const data = [...masterData.diamond_shape];
                                                    data[index].diamond_type = {
                                                        ...data[index].diamond_type,
                                                        [configKey]: Diamond_type.Lab_grown
                                                    };
                                                    setMasterData({ ...masterData, diamond_shape: data });
                                                }} />
                                            </td><td align='center'>
                                                <Checkbox checked={value.diamond_type && value.diamond_type[configKey] === Diamond_type.Both ? true : false} onChange={(e) => {
                                                    const data = [...masterData.diamond_shape];
                                                    data[index].diamond_type = {
                                                        ...data[index].diamond_type,
                                                        [configKey]: Diamond_type.Both
                                                    };
                                                    setMasterData({ ...masterData, diamond_shape: data });
                                                }} />
                                            </td>
                                            {masterData?.diamond_carat_size?.filter((t: any) => t[configValue] === "1").map((t: any) => {
                                                return <td align='center'>
                                                    <Checkbox checked={value.diamond_size && value.diamond_size[configKey]?.includes(t.id)} onChange={(e) => {
                                                        const data = [...masterData.diamond_shape];
                                                        if (e.target.checked) {
                                                            const size = data[index].diamond_size && data[index].diamond_size[configKey] || [];
                                                            data[index].diamond_size = {
                                                                [configKey]: [...size, t.id]
                                                            };
                                                        } else {
                                                            const size = data[index].diamond_size[configKey].indexOf(t.id);
                                                            data[index].diamond_size[configKey].splice(size, 1);
                                                        }
                                                        setMasterData({ ...masterData, diamond_shape: data });
                                                    }} />
                                                </td>;
                                            })}
                                            <td align='center'>
                                                <TextField size='small' type="number" value={value.sort_order && value.sort_order[configKey]} onChange={(e) => {
                                                    const data = [...masterData.diamond_shape];
                                                    data[index].sort_order = {
                                                        ...data[index].sort_order,
                                                        [configKey]: parseInt(e.target.value)
                                                    };
                                                    setMasterData({ ...masterData, diamond_shape: data });
                                                }} />
                                            </td>
                                        </tr>)}
                                    </table>
                                </Box>

                                <div style={{ display: 'flex', justifyContent: 'end', marginTop: 10 }}>
                                    <Button variant='contained' onClick={() => handleSave({ diamond_shape_master: filterData(masterData?.diamond_shape, ['id', 'sort_order', 'diamond_type', 'diamond_size']) })}>Save</Button>
                                </div>
                            </>}
                            {selectedBtn === 4 && <>
                                <Box style={tableBox}>
                                    <table style={{ width: '100%' }}>
                                        <tr>
                                            <th align='center' style={thStyle}></th>
                                            <th align='center' style={thStyle}>Active</th>
                                            <th align='center' style={thStyle}>Natural</th>
                                            <th align='center' style={thStyle}>Lab Grown</th>
                                            <th align='center' style={thStyle}>Both</th>
                                        </tr>
                                        {masterData?.color_clarity_master?.map((value: any, index: any) => {
                                            return <tr>
                                                <td align='center' style={{ textAlign: 'left' }}>
                                                    {value?.color_name}/{value?.clarity_name}
                                                </td>
                                                <td align='center'>
                                                    <Checkbox checked={value[configValue] === 1 ? true : false} onChange={(e) => {
                                                        const data = [...masterData.color_clarity_master];
                                                        if (e.target.checked) {
                                                            data[index][configValue] = 1;
                                                        } else {
                                                            data[index][configValue] = 0;
                                                        }
                                                        setMasterData({ ...masterData, color_clarity_master: data });
                                                    }} />
                                                </td>
                                                <td align='center'>
                                                    <Checkbox checked={value.diamond_type && value.diamond_type[configKey] === Diamond_type.Natural ? true : false} onChange={(e) => {
                                                        const data = [...masterData.color_clarity_master];
                                                        data[index].diamond_type = {
                                                            ...data[index].diamond_type,
                                                            [configKey]: Diamond_type.Natural
                                                        };
                                                        setMasterData({ ...masterData, color_clarity_master: data });
                                                    }} />
                                                </td><td align='center'>
                                                    <Checkbox checked={value.diamond_type && value.diamond_type[configKey] === Diamond_type.Lab_grown ? true : false} onChange={(e) => {
                                                        const data = [...masterData.color_clarity_master];
                                                        data[index].diamond_type = {
                                                            ...data[index].diamond_type,
                                                            [configKey]: Diamond_type.Lab_grown
                                                        };
                                                        setMasterData({ ...masterData, color_clarity_master: data });
                                                    }} />
                                                </td><td align='center'>
                                                    <Checkbox checked={value.diamond_type && value.diamond_type[configKey] === Diamond_type.Both ? true : false} onChange={(e) => {
                                                        const data = [...masterData.color_clarity_master];
                                                        data[index].diamond_type = {
                                                            ...data[index].diamond_type,
                                                            [configKey]: Diamond_type.Both
                                                        };
                                                        setMasterData({ ...masterData, color_clarity_master: data });
                                                    }} />
                                                </td>
                                            </tr>;
                                        })}
                                    </table>
                                </Box>
                                <div style={{ display: 'flex', justifyContent: 'end', marginTop: 10 }}>
                                    <Button variant='contained' onClick={() => handleSave({ color_clarity_master: filterData(masterData?.color_clarity_master, ['id_color', 'id_clarity', 'diamond_type']) })}>Save</Button>

                                </div>
                            </>}
                            {selectedBtn === 5 && <>
                                <Box style={tableBox}>
                                    <table style={{ width: '100%' }}>
                                        <tr>
                                            <th align='center' style={thStyle}></th>
                                            <th align='center' style={thStyle}>Active</th>
                                        </tr>
                                        {masterData?.stone_master?.map((value: any, index: any) => <tr>
                                            <td align='center' style={{ textAlign: 'left' }}>
                                                {value?.name}
                                            </td>
                                            <td align='center'>
                                                <Checkbox checked={value[configValue] === '1' ? true : false} onChange={(e) => {
                                                    const data = [...masterData.stone_master];
                                                    if (e.target.checked) {
                                                        data[index][configValue] = "1";
                                                    } else {
                                                        data[index][configValue] = "0";
                                                    }
                                                    setMasterData({ ...masterData, stone_master: data });
                                                }} />
                                            </td>
                                        </tr>)}
                                    </table>
                                </Box>
                                <div style={{ display: 'flex', justifyContent: 'end', marginTop: 10 }}>
                                    <Button variant='contained' onClick={() => handleSave({ stone_master: filterData(masterData?.stone_master, ['id']) })}>Save</Button>

                                </div>
                            </>}
                            {selectedBtn === 6 && <>
                                <Box style={tableBox}>
                                    <table style={{ width: '100%' }}>
                                        <tr>
                                            <th align='center' style={thStyle}></th>
                                            <th align='center' style={thStyle}>Active</th>
                                        </tr>
                                        {masterData?.diamond_cuts?.map((value: any, index: any) => <tr>
                                            <td align='center' style={{ textAlign: 'left' }}>
                                                {value?.value}
                                            </td>
                                            <td align='center'>
                                                <Checkbox checked={value[configValue] === '1' ? true : false} onChange={(e) => {
                                                    const data = [...masterData.diamond_cuts];
                                                    if (e.target.checked) {
                                                        data[index][configValue] = "1";
                                                    } else {
                                                        data[index][configValue] = "0";
                                                    }
                                                    setMasterData({ ...masterData, diamond_cuts: data });
                                                }} />
                                            </td>
                                        </tr>)}
                                    </table>
                                </Box>
                                <div style={{ display: 'flex', justifyContent: 'end', marginTop: 10 }}>
                                    <Button variant='contained' onClick={() => handleSave({ cut_master: filterData(masterData?.diamond_cuts, ['id']) })}>Save</Button>

                                </div>
                            </>}
                            {selectedBtn === 7 && <>
                                <Box style={tableBox}>
                                    <table style={{ width: '100%' }}>
                                        <tr>
                                            <th align='center' style={thStyle}></th>
                                            <th align='center' style={thStyle}>Active</th>
                                            <th align='center' style={thStyle}>Sort Order</th>

                                        </tr>
                                        {masterData?.side_setting_master?.map((value: any, index: any) => <tr>
                                            <td align='center' style={{ textAlign: 'left' }}>
                                                {value?.name}
                                            </td>
                                            <td align='center'>
                                                <Checkbox checked={value[configValue] === '1' ? true : false} onChange={(e) => {
                                                    const data = [...masterData.side_setting_master];
                                                    if (e.target.checked) {
                                                        data[index][configValue] = "1";
                                                    } else {
                                                        data[index][configValue] = "0";
                                                    }
                                                    setMasterData({ ...masterData, side_setting_master: data });
                                                }} />
                                            </td>
                                            <td align='center'>
                                                <TextField size='small' type="number" value={value.sort_order && value.sort_order[configKey]} onChange={(e) => {
                                                    const data = [...masterData.side_setting_master];
                                                    data[index].sort_order = {
                                                        ...data[index].sort_order,
                                                        [configKey]: parseInt(e.target.value)
                                                    };
                                                    setMasterData({ ...masterData, side_setting_master: data });
                                                }} />
                                            </td>
                                        </tr>)}
                                    </table>
                                </Box>
                                <div style={{ display: 'flex', justifyContent: 'end', marginTop: 10 }}>
                                    <Button variant='contained' onClick={() => handleSave({ side_setting_master: filterData(masterData?.side_setting_master, ['id', 'sort_order']) })}>Save</Button>

                                </div>
                            </>}
                            {selectedBtn === 8 && <>
                                <Box style={tableBox}>
                                    <table style={{ width: '100%', height: "100%" }}>
                                        <thead>
                                            <tr>
                                                <th style={thStyle} align='center'></th>
                                                <th style={thStyle} align='center'>Active</th>
                                                <th style={thStyle} align='center'>Diamond</th>
                                                <th style={thStyle} align='center'>Gemstone</th>
                                                <th style={thStyle} align='center'>Both</th>
                                            </tr>
                                        </thead>
                                        {masterData?.diamond_carat_size?.map((value: any, index: any) => {
                                            return <tr>
                                                <td align='center' style={{ textAlign: 'left' }}>
                                                    {value?.value}
                                                </td>
                                                <td align='center'>
                                                    <Checkbox checked={value[configValue] === '1' ? true : false} onChange={(e) => {
                                                        const data = [...masterData.diamond_carat_size];
                                                        if (e.target.checked) {
                                                            data[index][configValue] = '1';
                                                        } else {
                                                            data[index][configValue] = '0';
                                                        }
                                                        setMasterData({ ...masterData, diamond_carat_size: data });
                                                    }} />
                                                </td>
                                                <td align='center'>
                                                    <Checkbox checked={value.diamond_type && value.diamond_type[configKey] === Diamond_type.Natural ? true : false} onChange={(e) => {
                                                        const data = [...masterData.diamond_carat_size];
                                                        data[index].diamond_type = {
                                                            ...data[index].diamond_type,
                                                            [configKey]: Diamond_type.Natural
                                                        };
                                                        setMasterData({ ...masterData, diamond_carat_size: data });
                                                    }} />
                                                </td><td align='center'>
                                                    <Checkbox checked={value.diamond_type && value.diamond_type[configKey] === Diamond_type.Lab_grown ? true : false} onChange={(e) => {
                                                        const data = [...masterData.diamond_carat_size];
                                                        data[index].diamond_type = {
                                                            ...data[index].diamond_type,
                                                            [configKey]: Diamond_type.Lab_grown
                                                        };
                                                        setMasterData({ ...masterData, diamond_carat_size: data });
                                                    }} />
                                                </td><td align='center'>
                                                    <Checkbox checked={value.diamond_type && value.diamond_type[configKey] === Diamond_type.Both ? true : false} onChange={(e) => {
                                                        const data = [...masterData.diamond_carat_size];
                                                        data[index].diamond_type = {
                                                            ...data[index].diamond_type,
                                                            [configKey]: Diamond_type.Both
                                                        };
                                                        setMasterData({ ...masterData, diamond_carat_size: data });
                                                    }} />
                                                </td>
                                            </tr>;
                                        })}
                                    </table>
                                </Box>
                                <div style={{ display: 'flex', justifyContent: 'end', marginTop: 10 }}>
                                    <Button variant='contained' onClick={() => handleSave({ diamond_carat_size_master: filterData(masterData?.diamond_carat_size, ['id', 'diamond_type']) })}>Save</Button>
                                </div>
                            </>}
                            {selectedBtn === 9 && <>
                                <Box sx={tableBox}>
                                    <table style={{ width: '100%' }}>
                                        <tr>
                                            <th align='center' style={thStyle}></th>
                                            <th align='center' style={thStyle}>Active</th>
                                            {masterData?.side_setting_master?.filter((t: any) => t[configValue] === "1").map((t: any) => {
                                                return <th align="center" style={thStyle}>{t.name}</th>;
                                            })}
                                            <th align="center" style={thStyle}>Sort Order</th>
                                        </tr>
                                        {masterData?.shank_master?.map((value: any, index: any) => <tr>
                                            <td align='center' style={{ textAlign: 'left', position: 'sticky', left: 0, backgroundColor: 'white', zIndex: 1 }}>
                                                {value?.name}
                                            </td>
                                            <td align='center'>
                                                <Checkbox checked={value[configValue] === '1' ? true : false} onChange={(e) => {
                                                    const data = [...masterData.shank_master];
                                                    if (e.target.checked) {
                                                        data[index][configValue] = "1";
                                                    } else {
                                                        data[index][configValue] = "0";
                                                    }
                                                    setMasterData({ ...masterData, shank_master: data });
                                                }} />
                                            </td>
                                            {masterData?.side_setting_master?.filter((t: any) => t[configValue] === "1").map((t: any) => {
                                                return <td align='center'>
                                                    <Checkbox checked={value.side_setting && value.side_setting[configKey]?.includes(t.id)} onChange={(e) => {
                                                        const data = [...masterData.shank_master];
                                                        if (e.target.checked) {
                                                            const size = data[index].side_setting && data[index].side_setting[configKey] || [];
                                                            data[index].side_setting = {
                                                                [configKey]: [...size, t.id]
                                                            };
                                                        } else {
                                                            const size = data[index].side_setting[configKey].indexOf(t.id);
                                                            data[index].side_setting[configKey].splice(size, 1);
                                                        }
                                                        setMasterData({ ...masterData, shank_master: data });
                                                    }} />
                                                </td>;
                                            })}
                                            <td align='center'>
                                                <TextField size='small' type="number" value={value.sort_order && value.sort_order[configKey]} onChange={(e) => {
                                                    const data = [...masterData.shank_master];
                                                    data[index].sort_order = {
                                                        ...data[index].sort_order,
                                                        [configKey]: parseInt(e.target.value)
                                                    };
                                                    setMasterData({ ...masterData, shank_master: data });
                                                }} />
                                            </td>
                                        </tr>)}
                                    </table>
                                </Box>

                                <div style={{ display: 'flex', justifyContent: 'end', marginTop: 10 }}>
                                    <Button variant='contained' onClick={() => handleSave({ shank_master: filterData(masterData?.shank_master, ['id', 'sort_order', 'side_setting']) })}>Save</Button>
                                </div>
                            </>}
                            {selectedBtn === 10 && <>
                                <Box sx={tableBox}>
                                    <table style={{ width: '100%' }}>
                                        <thead>
                                            <tr>
                                                <th align='center' style={thStyle}></th>
                                                <th align='center' style={thStyle}>Active</th>
                                                {masterData?.diamond_carat_size?.filter((t: any) => t[configValue] === "1").map((t: any) => {
                                                    return <th align="center" style={thStyle}>{t.value}</th>;
                                                })}
                                                {masterData?.diamond_shape?.filter((t: any) => t[configValue] === "1").map((t: any) => {
                                                    return <th align="center" style={thStyle}>{t.name}</th>;
                                                })}
                                                <th align="center" style={{ ...thStyle }}>Sort Order</th>
                                            </tr>
                                        </thead>
                                        {masterData?.head_master?.map((value: any, index: any) => <tr>
                                            <td align='center' style={{ textAlign: 'left', position: 'sticky', left: 0, backgroundColor: 'white', zIndex: 1 }}>
                                                {value?.name}
                                            </td>
                                            <td align='center'>
                                                <Checkbox checked={value[configValue] === '1' ? true : false} onChange={(e) => {
                                                    const data = [...masterData.head_master];
                                                    if (e.target.checked) {
                                                        data[index][configValue] = "1";
                                                    } else {
                                                        data[index][configValue] = "0";
                                                    }
                                                    setMasterData({ ...masterData, head_master: data });
                                                }} />
                                            </td>
                                            {masterData?.diamond_carat_size?.filter((t: any) => t[configValue] === "1").map((t: any) => {
                                                return <td align='center'>
                                                    <Checkbox checked={value.diamond_size && value.diamond_size[configKey]?.includes(t.id)} onChange={(e) => {
                                                        const data = [...masterData.head_master];
                                                        if (e.target.checked) {
                                                            const size = data[index].diamond_size && data[index].diamond_size[configKey] || [];
                                                            data[index].diamond_size = {
                                                                [configKey]: [...size, t.id]
                                                            };
                                                        } else {
                                                            const size = data[index].diamond_size[configKey].indexOf(t.id);
                                                            data[index].diamond_size[configKey].splice(size, 1);
                                                        }
                                                        setMasterData({ ...masterData, head_master: data });
                                                    }} />
                                                </td>;
                                            })}
                                            {masterData?.diamond_shape?.filter((t: any) => t[configValue] === "1").map((t: any) => {
                                                return <td align='center'>
                                                    <Checkbox checked={value.diamond_shape && value.diamond_shape[configKey]?.includes(t.id)} onChange={(e) => {
                                                        const data = [...masterData.head_master];
                                                        if (e.target.checked) {
                                                            const size = data[index].diamond_shape && data[index].diamond_shape[configKey] || [];
                                                            data[index].diamond_shape = {
                                                                [configKey]: [...size, t.id]
                                                            };
                                                        } else {
                                                            const size = data[index].diamond_shape[configKey].indexOf(t.id);
                                                            data[index].diamond_shape[configKey].splice(size, 1);
                                                        }
                                                        setMasterData({ ...masterData, head_master: data });
                                                    }} />
                                                </td>;
                                            })}
                                            <td align='center'>
                                                <TextField size='small' type="number" value={value.sort_order && value.sort_order[configKey]} onChange={(e) => {
                                                    const data = [...masterData.head_master];
                                                    data[index].sort_order = {
                                                        ...data[index].sort_order,
                                                        [configKey]: parseInt(e.target.value)
                                                    };
                                                    setMasterData({ ...masterData, head_master: data });
                                                }} />
                                            </td>
                                        </tr>)}
                                    </table>
                                </Box>

                                <div style={{ display: 'flex', justifyContent: 'end', marginTop: 10 }}>
                                    <Button variant='contained' onClick={() => handleSave({ head_master: filterData(masterData?.head_master, ['id', 'sort_order', 'diamond_type', 'diamond_size', 'diamond_shape']) })}>Save</Button>
                                </div>
                            </>}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    )
}

export default ConfigSetting