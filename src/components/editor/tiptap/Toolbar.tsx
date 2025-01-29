"use client"

import { Editor } from "@tiptap/react"
import { useCallback, useEffect, useRef, useState } from "react"
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Image as ImageIcon,
  Link,
  Palette
} from "lucide-react"
import { addImagePlaceholder } from "../ImagePlaceholder"

interface ToolbarProps {
    editor: Editor
    toolbarStyle?: string
}

const Divider = () => <div className="w-px h-6 bg-gray-300 mx-1" />

// 색상 옵션 배열 추가
const colors = [
    { name: '검정', value: '#000000' },
    { name: '회색', value: '#666666' },
    { name: '빨강', value: '#ff0000' },
    { name: '파랑', value: '#0000ff' },
    // { name: '초록', value: '#00ff00' },
    { name: '녹색', value: '#008000' },
    { name: '노랑', value: '#ffff00' },
]

export default function Toolbar({ 
  editor, 
  toolbarStyle = "border-b bg-gray-50 p-2 flex flex-wrap gap-1"
}: ToolbarProps) {
    if (!editor) return null

    // console.log('editor: ', editor)

    const addImage = useCallback(() => {
        const url = window.prompt('URL 입력:')
        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }, [editor])

    const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            const file = e.target.files[0]
            const reader = new FileReader()
            reader.onloadend = () => {
                const imageUrl = reader.result as string
                editor.chain().focus().setImage({ src: imageUrl }).run()
            }
            reader.readAsDataURL(file)
        }
    }, [editor])

    const addLink = useCallback(() => {
        // 현재 선택된 텍스트 가져오기
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL을 입력하세요:', previousUrl)
        
        // 취소를 누른 경우
        if (url === null) {
            return
        }

        // URL이 비어있는 경우 링크 제거
        if (url === '') {
            editor.chain().focus().unsetLink().run()
            return
        }

        // URL 유효성 검사
        try {
            new URL(url.startsWith('http') ? url : `https://${url}`)
        } catch {
            alert('유효하지 않은 URL입니다.')
            return
        }

        // 링크 설정
        editor.chain().focus().setLink({ 
            href: url.startsWith('http') ? url : `https://${url}`,
            target: '_blank' 
        }).run()
    }, [editor])

    // 링크 제거 버튼 추가
    const removeLink = useCallback(() => {
        editor.chain().focus().unsetLink().run()
    }, [editor])

    // 색상 선택 상태 관리
    const [showColorPicker, setShowColorPicker] = useState(false)

    const colorPickerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
                setShowColorPicker(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <div className={toolbarStyle}>
            {/* Text Style */}
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
                title="굵게"
            >
                <Bold size={20} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
                title="기울임"
            >
                <Italic size={20} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('strike') ? 'bg-gray-200' : ''}`}
                title="취소선"
            >
                <Strikethrough size={20} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('underline') ? 'bg-gray-200' : ''}`}
                title="밑줄"
            >
                <Underline size={20} />
            </button>

            <div className="relative" ref={colorPickerRef}>
                <button
                    type="button"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="p-2 rounded hover:bg-gray-200"
                    title="글자 색상"
                >
                    <Palette size={20} />
                </button>
                
                {showColorPicker && (
                    <div className="absolute z-10 top-full left-0 mt-1 p-2 w-32 bg-white rounded-lg shadow-lg border">
                        <div className="grid grid-cols-3 gap-1">
                            {colors.map((color) => (
                                <button
                                    key={color.value}
                                    onClick={() => {
                                        editor.chain().focus().setColor(color.value).run()
                                        setShowColorPicker(false)
                                    }}
                                    className="w-8 h-8 rounded border"
                                    style={{ backgroundColor: color.value }}
                                    title={color.name}
                                />
                            ))}
                            <button
                                onClick={() => {
                                    editor.chain().focus().unsetColor().run()
                                    setShowColorPicker(false)
                                }}
                                className="w-8 h-8 rounded border flex items-center justify-center"
                                title="색상 제거"
                            >
                                <span className="text-xs">없음</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <Divider />

            {/* Alignment */}
            <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}`}
                title="왼쪽 정렬"
            >
                <AlignLeft size={20} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}`}
                title="가운데 정렬"
            >
                <AlignCenter size={20} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}`}
                title="오른쪽 정렬"
            >
                <AlignRight size={20} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-200' : ''}`}
                title="양쪽 정렬"
            >
                <AlignJustify size={20} />
            </button>

            <Divider />

            {/* Headings */}
            {/* <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}`}
                title="제목 1"
            >
                <h1 className="text-lg leading-none">H1</h1>
            </button> */}
            <button
    type="button"
    onClick={() => {
      console.log('H1 button clicked')
      editor.chain().focus().toggleHeading({ level: 1 }).run()
      console.log('After toggle:', editor.isActive('heading', { level: 1 }))
    }}
    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}`}
    title="제목 1"
>
    <h1 className="text-lg leading-none">H1</h1>
</button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`}
                title="제목 2"
            >
                <h2 className="text-base leading-none">H2</h2>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}`}
                title="제목 3"
            >
                <h3 className="text-sm leading-none">H3</h3>
            </button>

            <Divider />

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
                title="글머리 기호"
            >
                <List size={20} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
                title="번호 매기기"
            >
                <ListOrdered size={20} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleTaskList().run()}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('taskList') ? 'bg-gray-200' : ''}`}
                title="체크리스트"
            >
                <CheckSquare size={20} />
            </button>

            <Divider />

            {/* Media */}
            <button
                type="button"
                // onClick={addImage}
                onClick={() => addImagePlaceholder(editor)}
                className="p-2 rounded hover:bg-gray-200"
                title="이미지 URL 삽입"
            >
                <ImageIcon size={20} />
            </button>
            <button
                type="button"
                onClick={addLink}
                className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('link') ? 'bg-gray-200' : ''}`}
                title="링크"
            >
                <Link size={20} />
            </button>
            {editor.isActive('link') && (
                <button
                    type="button"
                    onClick={removeLink}
                    className="p-2 rounded hover:bg-gray-200"
                    title="링크 제거"
                >
                    <Link size={20} className="text-red-500" />
                </button>
            )}
        </div>
    )
}