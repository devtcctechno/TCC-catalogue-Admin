import { CONFIGURATOR_MANAGE_KEY } from "src/AppConstants"
import ConfigSetting from "src/customComponents/config-setting"

const ThreeStoneConfigurator = () => {
    return (
        <>
            <ConfigSetting title="Three Stone Ring" configKey={CONFIGURATOR_MANAGE_KEY.ThreeStoneConfigurator} showHead={false} />
        </>
    )
}
export default ThreeStoneConfigurator