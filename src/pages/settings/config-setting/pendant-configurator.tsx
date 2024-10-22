import { CONFIGURATOR_MANAGE_KEY } from "src/AppConstants"
import ConfigSetting from "src/customComponents/config-setting"

const PendantConfigurator = () => {
    return (
        <>
            <ConfigSetting title="Pendant" configKey={CONFIGURATOR_MANAGE_KEY.PendantConfigurator} />
        </>
    )
}
export default PendantConfigurator
