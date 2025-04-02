'use client'

import React from 'react';
import { Editor, EditorContent } from '@tiptap/react';

interface TiptapContentProps {
    editor: Editor;
    onImageClick?: (imageUrl: string) => void;
    selectedImages?: string[];
}

export const TiptapContent: React.FC<TiptapContentProps> = ({
    editor,
    onImageClick,
    selectedImages = [],
}) => {
    React.useEffect(() => {
        const handleImageClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (target.tagName === 'IMG' && onImageClick) {
                const src = target.getAttribute('src');
                if (src) {
                    onImageClick(src);
                }
            }
        };

        editor.view.dom.addEventListener('click', handleImageClick);
        return () => {
            editor.view.dom.removeEventListener('click', handleImageClick);
        };
    }, [editor, onImageClick]);

    return (
        <div className="p-4 min-h-[200px] bg-white prose-sm">
            <EditorContent editor={editor} />
        </div>
    );
};

export default TiptapContent; 