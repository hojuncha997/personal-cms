import Link from 'next/link'
import Image from 'next/image'

interface PostCardProps {
  title: string
  description: string
  date: string
  category: string
  imageUrl?: string
  slug: string
}

export default function PostCard({
  title,
  description,
  date,
  category,
  imageUrl,
  slug
}: PostCardProps) {
  return (
    <Link href={`/posts/${slug}`}>
      <article className="h-full rounded-lg overflow-hidden border border-gray-200 transition-all hover:shadow-lg">
        {imageUrl ? (
          <div className="relative h-48 w-full">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-500 p-6 flex items-center justify-center">
            <h3 className="text-white text-xl font-bold text-center line-clamp-3">
              {title}
            </h3>
          </div>
        )}
        <div className="p-4">
          {imageUrl && (
            <h3 className="text-xl font-bold mb-2 line-clamp-2">{title}</h3>
          )}
          <p className="text-gray-600 mb-2 line-clamp-2">{description}</p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{category}</span>
            <span>{date}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}