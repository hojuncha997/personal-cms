/**
 * ProseMirror 문서 구조에서 텍스트만 추출하는 함수
 */
export const extractTextFromContent = (content: any) => {
    if (!content?.content) return '';
    
    const fullText = content.content
        .map((block: any) => {
            if (block.type === 'paragraph' && block.content) {
                return block.content
                    .map((item: any) => item.text || '')
                    .join('')
            }
            return '';
        })
        .join('\n')
        .trim();

    const maxLength = 100;
    if (fullText.length <= maxLength) return fullText;
    
    return fullText.slice(0, maxLength).trim() + '...';
};

// 나중에 필요한 다른 게시글 관련 유틸리티 함수들도 여기에 추가할 수 있습니다. 