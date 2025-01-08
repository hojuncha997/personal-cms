import { CommonPopover } from "@components/common/common-popover"
import { useAuthStore } from "@/store/useAuthStore"
import { useLogout } from "@/hooks/auth/useLogout"


export function NavProfile() {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated)
    const { mutate: logout } = useLogout()
    
    const email = useAuthStore(state => state.email)
    const role = useAuthStore(state => state.role)

    
    const roleType: { [key: string]: string } = {
        'ADMIN': '관리자',
        'USER': '사용자',
        'GUEST': '게스트'
    }



    return (
        <CommonPopover trigger={
            <div className=" text-gray-700 hover:text-blue-800 cursor-pointer">
                <div className="flex items-center">
                    <p>{email?.split('@')[0]}</p>
                </div>
            </div>}
            placement="bottom"
            offset={24}
            placementOffset="-8"
        >

            <div className="w-[14rem] min-h-[12rem] text-gray-700 text-sm">
                <div className="p-3">
                    <span className="pb-1 text-sm hover:text-blue-800 cursor-pointer">{email}</span>
                    <div className="pb-1">
                        <span>{role ? roleType[role] : '게스트'}</span>
                    </div>
                </div>
                <div className="bg-gray-200 p-3">
                    <div className="pb-1">
                        <span className="cursor-pointer">마이페이지</span>
                    </div>
                    <div className="pb-1">
                        <span className="cursor-pointer">설정</span>
                    </div>
                </div>
                <div className="pt-3 pl-3 pr-3">
                    <span className="cursor-pointer" onClick={() => logout()}>로그아웃</span>
                </div>
            </div>
        </CommonPopover>
    )
}