import { CONFIGURATOR_MANAGE_KEY } from "src/AppConstants"
import ConfigSetting from "src/customComponents/config-setting"

const EternityConfigurator = () => {
    return (
        <>
            <ConfigSetting title="Eternity Band" configKey={CONFIGURATOR_MANAGE_KEY.EternityBandConfigurator} showHead={false} showShank={false} />
        </>
    )
}
export default EternityConfigurator
