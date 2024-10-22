import { CONFIGURATOR_MANAGE_KEY } from "src/AppConstants"
import ConfigSetting from "src/customComponents/config-setting"

const BraceletConfigurator = () => {
    return (
        <>
            <ConfigSetting title="Bracelet" configKey={CONFIGURATOR_MANAGE_KEY.BraceletConfigurator} showHead={false} showShank={false} />
        </>
    )
}
export default BraceletConfigurator
