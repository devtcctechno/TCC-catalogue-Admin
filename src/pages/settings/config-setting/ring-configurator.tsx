import { CONFIGURATOR_MANAGE_KEY } from "src/AppConstants"
import ConfigSetting from "src/customComponents/config-setting"

const RingConfigurator = () => {
    return (
        <>
            <ConfigSetting title="Ring" configKey={CONFIGURATOR_MANAGE_KEY.RingConfigurator} />
        </>
    )
}
export default RingConfigurator
