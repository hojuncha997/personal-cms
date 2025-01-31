import Image from 'next/image'

interface PostCardProps {
  title: string
  description: string
  date: string
  category: string
  imageUrl: string
  post?: {
    content?: string
  }
}

export default function PostCard({ title, description, date, category, imageUrl, post }: PostCardProps) {

  // if (!post?.content) {
  //   return null;
  // }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative h-48">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
            {category}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 line-clamp-2 text-gray-600">{title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{description}</p>
        <div className="text-gray-400 text-sm">{date}</div>
      </div>
    </div>
  )
}