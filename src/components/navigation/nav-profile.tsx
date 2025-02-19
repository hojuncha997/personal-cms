import { CommonPopover } from "@components/common/common-popover"
import { useAuthStore } from "@/store/useAuthStore"
import { useLogout } from "@/hooks/auth/useLogout"
import { useWindowSize } from "@/hooks/layout/useWindowSize"
import { CommonDrawer } from "@/components/common/common-drawer"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function NavProfile() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    const { mutateAsync: logoutMutation, isPending: isLogoutPending } = useLogout({
        // alert는 숨기고, 로그인 폼 상태는 자동으로 초기화됨
        showAlert: false,
        onSuccess: () => setIsDrawerOpen(false)
    });
    
    const email = useAuthStore(state => state.email)
    const role = useAuthStore(state => state.role)
    const {isMobile, isTablet} = useWindowSize()
    const router = useRouter()
    const roleType: { [key: string]: string } = {
        'ADMIN': '관리자',
        'USER': '사용자',
        'GUEST': '게스트'
    }

    // const handleLogout = async () => {
    //     try {
    //         await logout()
    //         setIsDrawerOpen(false)  // 드로어 닫기
    //     } catch (error) {
    //         console.error('로그아웃 실패:', error)
    //     }
    // }

    const handleLogout = async () => {
        try {
            await logoutMutation(); // 폼 리셋 + 로그아웃 api 호출
            // setIsDrawerOpen(false)는 onSuccess 옵션으로 이동했으므로 여기서는 제거
        } catch (error) {
            console.error('로그아웃 실패:', error)
        }
    }

    // 프로필 메뉴 아이템 정의
    const profileMenuItems = [
        {
            id: 'profile',
            section: 'info',
            label: email,
            subLabel: role ? roleType[role] : '게스트',
            onClick: () => {
                router.push('/mypage')
            },
        },
        // {
        //     id: 'mypage',
        //     section: 'menu',
        //     label: '마이페이지',
        //     onClick: () => {
        //         router.push('/mypage')
        //     },
        // },
        {
            id: 'settings',
            section: 'menu',
            label: 'Settings',
            onClick: () => {},
        },
        {
            id: 'logout',
            section: 'footer',
            label: 'Logout',
            onClick: handleLogout,
            isLoading: isLogoutPending
        },
    ]

    // 프로필 메뉴 컨텐츠 컴포넌트
    const ProfileMenuContent = ({ inDrawer = false }) => (
        <div className={`min-h-[12rem] text-black text-sm ${!inDrawer && 'w-[14rem]'}`}>
            {/* 프로필 정보 섹션 */}
            <div className="px-3 py-3 hover:bg-gray-100 hover:text-blue-500 rounded-t-xl">
                {profileMenuItems
                    .filter(item => item.section === 'info')
                    .map(item => (
                        <div key={item.id} className="pb-1 cursor-pointer p-1" onClick={item.onClick}>
                            <span className="">{item.label}</span>
                            {/* {item.subLabel && (
                                <div className="pb-1">
                                    <span>{item.subLabel}</span>
                                </div>
                            )} */}
                        </div>
                    ))}
            </div>

            {/* 메인 메뉴 섹션 */}
            <div className="hover:bg-gray-100 hover:text-blue-500">
                <div className="px-3 py-3">
                    {profileMenuItems
                        .filter(item => item.section === 'menu')
                        .map(item => (
                            <div key={item.id} className="pb-1">
                                <span 
                                    className="cursor-pointer hoer:text-blue-800"
                                    onClick={item.onClick}
                                >
                                    {item.label}
                                </span>
                            </div>
                        ))}
                </div>
            </div>

            {/* 푸터 섹션 */}
            <div className="px-3 pt-3">
                {profileMenuItems
                    .filter(item => item.section === 'footer')
                    .map(item => (
                        <div 
                            key={item.id}
                            className="flex items-center cursor-pointer hover:text-blue-800"
                            onClick={item.onClick}
                        >
                            <span>{item.label}</span>
                            {item.isLoading && (
                                <svg className="animate-spin ml-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                        </div>
                    ))}
            </div>
        </div>
    )

    if(isMobile || isTablet) {
        return (
            <>
                <div onClick={() => setIsDrawerOpen(true)}>
                    {/* <p>{email?.split('@')[0]}</p> */}
                    <svg 
                            className="w-6 h-6" 
                            viewBox="0 0 24 24" 
                            fill="currentColor"
                        >
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                        </svg>
                </div>
                <CommonDrawer 
                    trigger={null}
                    isOpen={isDrawerOpen} 
                    onClose={() => setIsDrawerOpen(false)}
                    title={`${email}`}
                    portalTo="drawer-root"
                >
                    <ProfileMenuContent inDrawer={true} />
                </CommonDrawer>
            </>
        )
    }

    return (
        <CommonPopover 
            trigger={
                <div>
                    <div className="flex items-center">
                    {/* <p>{email?.split('@')[0]}</p> */}
                        <svg 
                            className="w-6 h-6" 
                            viewBox="0 0 24 24" 
                            fill="currentColor"
                        >
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                        </svg>
                    </div>
                </div>
            }
            placement="bottom"
            offset={24}
            placementOffset="-8"
        >
            <ProfileMenuContent inDrawer={false} />
        </CommonPopover>
    )
}