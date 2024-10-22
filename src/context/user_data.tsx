import { createContext, useState } from "react";
import { localStorageUtils } from "src/utils/localStorageUtils";

export const UserDataContext = createContext({
    userInfo: typeof window !== 'undefined' && window.localStorage && localStorageUtils?.getUserInfo(),
    updateUserInfo: (value: any) => { },
})

function UserDataProvider({ children }: any) {
    const [userInfo, setUserInfo] = useState<any>(
        typeof window !== 'undefined' && window.localStorage && localStorageUtils?.getUserInfo()
    );
    const updateUserInfo = (value: any) => {
        setUserInfo(value);
    };
    return (
        <UserDataContext.Provider
            value={{
                userInfo,
                updateUserInfo,
            }}>
            {children}
        </UserDataContext.Provider>
    )
}

export default UserDataProvider;