const ProfileImageSkeleton = () => (
    <div className="flex flex-col items-center">
        <div className="w-40 h-40 rounded-full bg-gray-200 animate-pulse"></div>
        <div className="mt-4 w-32 h-10 bg-gray-200 rounded-md animate-pulse"></div>
    </div>
);

const ProfileInfoSkeleton = () => (
    <div className="space-y-4">
        <div>
            <div className="w-20 h-5 bg-gray-200 rounded animate-pulse mb-1"></div>
            <div className="w-48 h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div>
            <div className="w-20 h-5 bg-gray-200 rounded animate-pulse mb-1"></div>
            <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div>
            <div className="w-20 h-5 bg-gray-200 rounded animate-pulse mb-1"></div>
            <div className="w-40 h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
    </div>
);

const MyPageSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="w-48 h-10 bg-gray-200 rounded animate-pulse mb-8"></div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <ProfileImageSkeleton />
                            <div className="md:col-span-2">
                                <ProfileInfoSkeleton />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 space-y-4">
                        {/* 비밀번호 변경 섹션 스켈레톤 */}
                        <div className="bg-white shadow rounded-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
                                <div className="w-24 h-8 bg-gray-200 rounded-md animate-pulse"></div>
                            </div>
                        </div>

                        {/* 회원 탈퇴 섹션 스켈레톤 */}
                        <div className="bg-white shadow rounded-lg p-6">
                            <div className="flex justify-between items-center">
                                <div className="w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
                                <div className="w-20 h-8 bg-gray-200 rounded-md animate-pulse"></div>
                            </div>
                            <div className="mt-2 w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyPageSkeleton; 