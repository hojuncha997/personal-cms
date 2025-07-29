import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardTitle } from './ui/Card'

interface PostCardProps {
  title: string
  description: string
  date: string
  categorySlug: string
  imageUrl?: string
  slug: string
}

export default function PostCard({
  title,
  description,
  date,
  categorySlug,
  imageUrl,
  slug
}: PostCardProps) {
  return (
    <Link href={`/posts/${slug}`}>
      <Card>
        {imageUrl ? (
          <div className="relative h-48 w-full">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover grayscale"
            />
          </div>
        ) : (
          <div className="h-48 bg-black p-6 flex items-center justify-center">
            <h3 className="text-white text-xl font-bold text-center line-clamp-3">
              {title}
            </h3>
          </div>
        )}
        <CardContent>
          {imageUrl && (
            <CardTitle>{title}</CardTitle>
          )}
          <p className="text-gray-800 mb-2 line-clamp-2">{description}</p>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{categorySlug}</span>
            <span>{date}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}