import PostCard from './PostCard'

const posts = [
  {
    title: "인공지능의 미래: 새로운 시대의 시작",
    description: "최근 AI 기술의 발전으로 인한 산업 변화와 미래 전망에 대해 알아봅니다. 딥러닝과 머신러닝이 가져올 혁신적인 변화들을 상세히 분석해봅니다.",
    date: "2024.03.15",
    category: "기술",
    imageUrl: "/posts/tech-1.jpg"
  },
  {
    title: "효과적인 코드 리뷰 방법론",
    description: "개발팀의 생산성을 높이는 코드 리뷰 문화를 만드는 방법과 실제 적용 사례를 공유합니다.",
    date: "2024.03.14",
    category: "개발문화",
    imageUrl: "/posts/dev-1.jpg"
  },
  {
    title: "클라우드 네이티브 아키텍처의 이해",
    description: "현대적인 클라우드 네이티브 아키텍처의 핵심 개념과 구현 방법에 대해 알아봅니다.",
    date: "2024.03.13",
    category: "인프라",
    imageUrl: "/posts/cloud-1.jpg"
  },
  {
    title: "웹 성능 최적화 가이드",
    description: "사용자 경험을 향상시키는 웹 성능 최적화 기법들을 실제 사례와 함께 살펴봅니다.",
    date: "2024.03.12",
    category: "웹개발",
    imageUrl: "/posts/web-1.jpg"
  }
]

export default function PostSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-gray-600 text-3xl font-bold mb-8">최신 포스트</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {posts.map((post, index) => (
          <PostCard key={index} {...post} />
        ))}
      </div>
    </section>
  )
} 