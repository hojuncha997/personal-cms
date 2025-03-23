import { useEditor, EditorContent, type JSONContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Heading from '@tiptap/extension-heading'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Color from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import { useEffect } from 'react'
import { Toolbar } from './index'
import { ImagePlaceholder } from '../ImagePlaceholder'
import { logger } from '@/utils/logger';

interface TiptapProps {
  // 본문 기본값
  initialContent: JSONContent
  // 내용변경 함수
  onChange?: (content: JSONContent) => void
  // 본문 편집 가능 여부
  editable?: boolean
  // 툴바 스타일
  toolbarStyle?: string
  // 본문 스타일
  contentStyle?: string
  //proseMirror 설정
  // proseSizeClass?: string
  wrapperStyle?: string;  // 새로운 prop 추가
  onImageClick?: (imageUrl: string) => void;
  selectedImages?: string[];
}

// 모듈 시작
const Tiptap = ({ 
  initialContent,
  onChange,
  editable = true,
  toolbarStyle = " ",
  contentStyle = "p-4 min-h-[200px]",
  // proseMirror가 자체적으로 기본 스타일링을 가지고 있기 때문에 설정이 필요할 수 있음.
  // proseSizeClass = "prose-sm sm:prose lg:prose-lg xl:prose-2xl"  // 기본값 설정
  wrapperStyle = "border rounded-lg overflow-hidden sticky top-0",  // 기본값 설정
  onImageClick,
  selectedImages = [],
}: TiptapProps) => {

  const CustomImage = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            class: {
                default: 'max-w-full h-auto cursor-pointer',
                rendered: false
            }
        }
    },

    renderHTML({ HTMLAttributes }) {
        const { src } = HTMLAttributes;
        const isSelected = selectedImages.includes(src as string);
        
        return ['div', { 
            class: 'image-wrapper'
        }, [
            'img', 
            {
                ...HTMLAttributes,
                class: `${HTMLAttributes.class} transition-all duration-200 ${
                    isSelected ? 'border-4 border-blue-500 shadow-lg scale-[0.98]' : 'hover:shadow-md hover:scale-[0.99]'
                }`,
                'data-image-select': 'true'
            }
        ]];
    },
  });

  const editor = useEditor({
    extensions: [
       
      StarterKit.configure({
        // StarterKit에서 모든 것을 비활성화
        document: false,
        paragraph: false,
        text: false,
        heading: false,
        // heading: {
        //   levels: [1, 2, 3]
        // },
        bulletList: false,
        orderedList: false,
        // 마크 관련 설정은 유지
        bold: {
          HTMLAttributes: {
            class: 'font-bold',
          },
        },
        italic: {
          HTMLAttributes: {
            class: 'italic',
          },
        },
        strike: {
          HTMLAttributes: {
            class: 'line-through',
          },
        },
      }),
      // 필수 확장기능
      Document,
      Paragraph,
      Text,
      TextStyle,
      // Color는 TextStyle을 확장
      Color.configure({
        types: ['textStyle'], // textStyle 마크 타입에 적용
      }),
      // 나머지 확장기능
      Heading.configure({
        levels: [1, 2, 3]
      }),
      BulletList.configure(),
      OrderedList.configure(),
      TaskList,
      TaskItem,
      CustomImage.configure({
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: true,
        linkOnPaste: true,
        autolink: true,
        HTMLAttributes: {
          class: 'cursor-pointer text-blue-500 hover:underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      ImagePlaceholder,
      // TextStyle.configure(),
      // Color.configure({
      //   types: ['textStyle'],
      // }),
      // Color,
    ],
    content: initialContent,
    // 수정 가능 여부 설정. false인 경우 readOnly
    editable,
    onUpdate: ({ editor }) => {
      // 디버깅을 위한 콘솔 로그 추가
      logger.info('Editor content updated:', editor.getJSON());
      if (onChange) {
        onChange(editor.getJSON());
      }
    },
    editorProps: {
        handleClick: (view, pos, event) => {
            const target = event.target as HTMLElement;
            if (target.matches('img[data-image-select]')) {
                const src = target.getAttribute('src');
                if (src && onImageClick) {
                    event.preventDefault();
                    onImageClick(src);
                }
                return true;
            }
            return false;
        }
    },
  })

  //   const editor = useEditor({
  //   extensions: [
  //     StarterKit.configure({
  //       document: false,
  //       heading: false,
  //       orderedList: false,
  //       bulletList: false,
  //     }),
  //     Document,
  //     Image.configure({
  //       allowBase64: true,
  //     }),
  //     Link.configure({
  //       openOnClick: false,
  //     }),
  //     TextAlign.configure({
  //       types: ['heading', 'paragraph'],
  //     }),
  //     BulletList,
  //     OrderedList,
  //     TaskList,
  //     TaskItem,
  //     Heading.configure({
  //       levels: [1, 2, 3]  // 사용할 heading 레벨을 지정
  //     }),
  //     Underline,
  //   ],
    
  //   content: initialContent,
  //   editable,
  //   onUpdate: ({ editor }) => {
  //       // 에디터 내용이 변경될 때마다 JSON으로 저장

  //       onChange(editor.getJSON())
  //   },
  // })

  useEffect(() => {
    if (editor && initialContent) {
      // 에디터 내용과 initialContent가 다른 경우에만 업데이트
      if (JSON.stringify(editor.getJSON()) !== JSON.stringify(initialContent)) {
        editor.commands.setContent(initialContent)
      }
    }
  }, [editor, initialContent])

  if (!editor) {
    return null
  }

  return (
    // <div className="border rounded-lg overflow-hidden sticky top-0">
    <div className={wrapperStyle}>
      {editable && <Toolbar editor={editor} toolbarStyle={toolbarStyle} />}

      {/* [&_*]:outline-none는 해당 div 내부의 모든 요소에 outline: none을 적용 */}
      <div 
        className="cursor-text [&_*]:outline-none" 
        onClick={() => editor?.commands.focus()}
      >
        <EditorContent 
          editor={editor} 
          // immediatelyRender={false}
          // className={contentStyle}
          // className={`prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto ${contentStyle}`}
          // className={`prose prose-sm sm:prose lg:prose-lg xl:prose-2xl w-full max-w-none ${contentStyle}`}
          // className={`prose ${proseSizeClass} w-full max-w-none ${contentStyle}`}
          className={`prose w-full max-w-none ${contentStyle}`}
        />
      </div>
    </div>
  )
}

export default Tiptap
