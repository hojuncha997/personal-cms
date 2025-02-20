export const createThumbnail = async (imageUrl: string): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
                reject(new Error('Canvas context를 생성할 수 없습니다.'));
                return;
            }

            canvas.width = 300;
            canvas.height = 300;

            const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
            const x = (canvas.width - img.width * scale) / 2;
            const y = (canvas.height - img.height * scale) / 2;

            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('썸네일 생성 실패'));
                }
            }, 'image/jpeg', 0.8);
        };

        img.onerror = () => reject(new Error('이미지 로드 실패'));
        img.src = imageUrl;
    });
}; 