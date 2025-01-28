import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewProps } from '@tiptap/react'
import React, { useRef } from 'react'
import { Image as ImageIcon } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

// Supabase 클라이언트 초기화
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface ImagePlaceholderProps extends NodeViewProps {
  editor: any;
  updateAttributes: (attrs: Record<string, any>) => void;
}

const ImagePlaceholderComponent = ({ node, updateAttributes }: ImagePlaceholderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]    
    
    // 파일 업로드 테스트: 에디터 본문에 표시
    // if (file) {
    //     const reader = new FileReader()
    //     reader.onloadend = () => {
    //       updateAttributes({
    //         src: reader.result,
    //         isPlaceholder: false
    //       })
    //     }
    //     reader.readAsDataURL(file)

    if (!file) return

    try {
      // 파일 이름 생성 (timestamp-originalname)
      const fileExt = file.name.split('.').pop()    // 파일 확장자 추출
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`    // 파일 이름 생성
      const filePath = `images/project-images/${fileName}`    // 파일 경로 생성. 버킷 내의 디렉토리명(버킷은 스토리지의 하위 디렉토리)

      // 스토리지에 업로드
      const { error: uploadError, data } = await supabase.storage
        .from('media-storage') // 수파베이스 버킷 이름으로 변경
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // 공개 URL 가져오기
      const { data: { publicUrl } } = supabase.storage
        .from('media-storage')
        .getPublicUrl(filePath)

      // 이미지 URL 업데이트
      updateAttributes({
        src: publicUrl,
        isPlaceholder: false
      })
    } catch (error) {
      console.error('Upload error:', error)
      alert('이미지 업로드에 실패했습니다.')
    }
  }

  if (!node.attrs.isPlaceholder) {
    return (
      <NodeViewWrapper>
        <img 
          src={node.attrs.src} 
          alt={node.attrs.alt} 
          className="max-w-full h-auto"
        />
      </NodeViewWrapper>
    )
  }

  return (
    <NodeViewWrapper>
      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50"
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />
        <ImageIcon className="mx-auto mb-2 text-gray-400" size={32} />
        <p className="text-gray-500">클릭하여 이미지 업로드</p>
      </div>
    </NodeViewWrapper>
  )
}

export const ImagePlaceholder = Node.create({
  name: 'imagePlaceholder',
  
  group: 'block',
  
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      isPlaceholder: {
        default: true,
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="image-placeholder"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'image-placeholder' })]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImagePlaceholderComponent)
  },
})

export const addImagePlaceholder = (editor: any) => {
  editor.chain().focus().insertContent({
    type: 'imagePlaceholder',
    attrs: {
      isPlaceholder: true
    }
  }).run()
}

// import { Node, mergeAttributes, Editor } from '@tiptap/core'
// import { ReactNodeViewRenderer, NodeViewProps } from '@tiptap/react'
// import React, { useRef } from 'react'
// import { Image as ImageIcon } from 'lucide-react'

// interface ImagePlaceholderProps extends NodeViewProps {
//   editor: Editor;
//   updateAttributes: (attrs: Record<string, any>) => void;
// }

// // 이미지 플레이스홀더 컴포넌트
// const ImagePlaceholderComponent = ({ node, updateAttributes, editor }: ImagePlaceholderProps) => {
//   const fileInputRef = useRef<HTMLInputElement>(null)

//   const handleClick = () => {
//     fileInputRef.current?.click()
//   }

//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (file) {
//       const reader = new FileReader()
//       reader.onloadend = () => {
//         // 플레이스홀더를 실제 이미지로 교체
//         updateAttributes({
//           src: reader.result,
//           isPlaceholder: false
//         })
//       }
//       reader.readAsDataURL(file)
//     }
//   }

//   if (!node.attrs.isPlaceholder) {
//     return (
//       <img 
//         src={node.attrs.src} 
//         alt={node.attrs.alt} 
//         className="max-w-full h-auto"
//       />
//     )
//   }

//   return (
//     <div 
//       className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50"
//       onClick={handleClick}
//     >
//       <input
//         ref={fileInputRef}
//         type="file"
//         accept="image/*"
//         className="hidden"
//         onChange={handleFileUpload}
//       />
//       <ImageIcon className="mx-auto mb-2 text-gray-400" size={32} />
//       <p className="text-gray-500">클릭하여 이미지 업로드</p>
//     </div>
//   )
// }

// // 이미지 플레이스홀더 익스텐션
// export const ImagePlaceholder = Node.create({
//   name: 'imagePlaceholder',
  
//   group: 'block',
  
//   atom: true,

//   addAttributes() {
//     return {
//       src: {
//         default: null,
//       },
//       alt: {
//         default: null,
//       },
//       isPlaceholder: {
//         default: true,
//       }
//     }
//   },

//   parseHTML() {
//     return [
//       {
//         tag: 'image-placeholder',
//       },
//     ]
//   },

//   renderHTML({ HTMLAttributes }) {
//     return ['image-placeholder', mergeAttributes(HTMLAttributes)]
//   },

//   addNodeView() {
//     return ReactNodeViewRenderer(ImagePlaceholderComponent)
//   },
// })

// // Toolbar의 이미지 버튼을 위한 수정된 addImage 함수
// export const addImagePlaceholder = (editor: Editor) => {
//   editor.chain().focus().insertContent({
//     type: 'imagePlaceholder',
//   }).run()
// }

// // 기존 Tiptap 컴포넌트의 extensions 배열에 추가할 내용:
// // ImagePlaceholder,