import { CONFIGURATOR_MANAGE_KEY } from "src/AppConstants"
import ConfigSetting from "src/customComponents/config-setting"

const ErringConfigurator = () => {
    return (
        <>
            <ConfigSetting title="Earring" configKey={CONFIGURATOR_MANAGE_KEY.EarringConfigurator} />
        </>
    )
}
export default ErringConfigurator
