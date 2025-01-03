import { useState, useEffect } from 'react'
import Image from 'next/image'

const images = [
  {
    src: '/carousel/slide1.jpg',
    alt: '슬라이드 1',
    title: '새로운 시작',
    description: '당신의 여정을 시작하세요'
  },
  {
    src: '/carousel/slide2.jpg',
    alt: '슬라이드 2',
    title: '특별한 경험',
    description: '새로운 경험을 만나보세요'
  },
  {
    src: '/carousel/slide3.jpg',
    alt: '슬라이드 3',
    title: '무한한 가능성',
    description: '함께 성장하는 여정'
  },
]

export default function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  // 자동 슬라이드
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length)
    }, 5000) // 5초마다 슬라이드 변경

    return () => clearInterval(timer)
  }, [])

  // 이전 슬라이드
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length)
  }

  // 다음 슬라이드
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length)
  }

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      {/* 슬라이드 이미지 */}
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute w-full h-full transition-transform duration-500 ease-in-out ${
            index === currentSlide ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
            priority={index === 0}
          />
          {/* 텍스트 오버레이 */}
          <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center text-white">
            <h2 className="text-4xl font-bold mb-4">{image.title}</h2>
            <p className="text-xl">{image.description}</p>
          </div>
        </div>
      ))}

      {/* 네비게이션 버튼 */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full hover:bg-opacity-75"
      >
        &#8249;
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full hover:bg-opacity-75"
      >
        &#8250;
      </button>

      {/* 인디케이터 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  )
} 