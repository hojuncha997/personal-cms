import { CommonPopover } from "@components/common/common-popover"
import { useAuthStore } from "@/store/useAuthStore"
import { useLogout } from "@/hooks/auth/useLogout"
import { useWindowSize } from "@/hooks/layout/useWindowSize"
import { CommonDrawer } from "@/components/common/common-drawer"
import { useState } from 'react'

export function NavProfile() {
    const { mutate: logout } = useLogout()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    
    const email = useAuthStore(state => state.email)
    const role = useAuthStore(state => state.role)
    const {isMobile, isTablet} = useWindowSize()

    const roleType: { [key: string]: string } = {
        'ADMIN': '관리자',
        'USER': '사용자',
        'GUEST': '게스트'
    }

    // 프로필 메뉴 아이템 정의
    const profileMenuItems = [
        {
            id: 'profile',
            section: 'info',
            label: email,
            subLabel: role ? roleType[role] : '게스트',
            onClick: () => {},
        },
        {
            id: 'mypage',
            section: 'menu',
            label: '마이페이지',
            onClick: () => {},
        },
        {
            id: 'settings',
            section: 'menu',
            label: '설정',
            onClick: () => {},
        },
        {
            id: 'logout',
            section: 'footer',
            label: '로그아웃',
            onClick: () => logout(),
        },
    ]

    // 프로필 메뉴 컨텐츠 컴포넌트
    const ProfileMenuContent = ({ inDrawer = false }) => (
        <div className={`min-h-[12rem] text-gray-700 text-sm ${!inDrawer && 'w-[14rem]'}`}>
            {/* 프로필 정보 섹션 */}
            <div className="px-3 py-3">
                {profileMenuItems
                    .filter(item => item.section === 'info')
                    .map(item => (
                        <div key={item.id} className="pb-1">
                            <span className="text-sm hover:text-blue-800 cursor-pointer">{item.label}</span>
                            {item.subLabel && (
                                <div className="pb-1">
                                    <span>{item.subLabel}</span>
                                </div>
                            )}
                        </div>
                    ))}
            </div>

            {/* 메인 메뉴 섹션 */}
            <div className="bg-gray-100">
                <div className="px-3 py-3">
                    {profileMenuItems
                        .filter(item => item.section === 'menu')
                        .map(item => (
                            <div key={item.id} className="pb-1">
                                <span 
                                    className="cursor-pointer hover:text-blue-800"
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
                        <span 
                            key={item.id}
                            className="cursor-pointer hover:text-blue-800"
                            onClick={item.onClick}
                        >
                            {item.label}
                        </span>
                    ))}
            </div>
        </div>
    )

    if(isMobile() || isTablet()) {
        return (
            <>
                <div onClick={() => setIsDrawerOpen(true)}>
                    <p className="text-gray-700 hover:text-blue-800 cursor-pointer">{email?.split('@')[0]}</p>
                </div>
                <CommonDrawer 
                    trigger={null}
                    isOpen={isDrawerOpen} 
                    onClose={() => setIsDrawerOpen(false)}
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
                <div className="text-gray-700 hover:text-blue-800 cursor-pointer">
                    <div className="flex items-center">
                        <p>{email?.split('@')[0]}</p>
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