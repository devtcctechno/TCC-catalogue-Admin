import Cookies from "js-cookie";
import { createContext, useState } from "react";
import { companyInfo } from "src/data/interface";

export const CompanyInfoContext = createContext({
    companyInfo:
        Cookies.get("Comapany_info") &&
            Cookies.get("Comapany_info") != null &&
            Cookies.get("Comapany_info") != undefined &&
            Cookies.get("Comapany_info") != "undefined"
            ? (JSON.parse(Cookies.get("Comapany_info") || "") as companyInfo)
            : ({} as companyInfo),
    updateCompanyInfo: (value: any) => { },
})

function CompanyInfoProvider({ children }: any) {
    const [companyInfo, setCompanyInfo] = useState(
        Cookies.get("Comapany_info") &&
            Cookies.get("Comapany_info") != null &&
            Cookies.get("Comapany_info") != undefined &&
            Cookies.get("Comapany_info") != "undefined"
            ? (JSON.parse(Cookies.get("Comapany_info") || "") as companyInfo)
            : ({} as companyInfo)
    );
    const updateCompanyInfo = (value: companyInfo) => {
        setCompanyInfo(value);
    };
    return (
        <CompanyInfoContext.Provider
            value={{
                companyInfo,
                updateCompanyInfo,
            }}>
            {children}
        </CompanyInfoContext.Provider>
    )
}

export default CompanyInfoProvider;