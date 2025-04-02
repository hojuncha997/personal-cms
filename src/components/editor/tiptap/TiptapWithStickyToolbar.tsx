'use client'

import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Heading from '@tiptap/extension-heading';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import { TiptapToolbar } from './TiptapToolbar';
import { TiptapContent } from './TiptapContent';
import { ImagePlaceholder } from '../ImagePlaceholder';

interface TiptapWithStickyToolbarProps {
    initialContent?: any;
    onChange?: (content: any) => void;
    onImageClick?: (imageUrl: string) => void;
    selectedImages?: string[];
    editable?: boolean;
}

export const TiptapWithStickyToolbar: React.FC<TiptapWithStickyToolbarProps> = ({
    initialContent,
    onChange,
    onImageClick,
    selectedImages = [],
    editable = true,
}) => {
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
                document: false,
                paragraph: false,
                text: false,
                heading: false,
                bulletList: false,
                orderedList: false,
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
            Document,
            Paragraph,
            Text,
            TextStyle,
            Color.configure({
                types: ['textStyle'],
            }),
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
        ],
        content: initialContent,
        editable,
        onUpdate: ({ editor }) => {
            onChange?.(editor.getJSON());
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
    });

    if (!editor) {
        return null;
    }

    return (
        <div className="relative">
            <div className="sticky top-[64px] z-50 border-b bg-gray-50 p-2 flex flex-wrap gap-1">
                <TiptapToolbar editor={editor} />
            </div>
            <TiptapContent 
                editor={editor} 
                onImageClick={onImageClick}
                selectedImages={selectedImages}
            />
        </div>
    );
};

export default TiptapWithStickyToolbar; 