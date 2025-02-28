/**
 * 이미지 URL을 받아서 300x300 크기의 썸네일 Blob을 생성하는 함수
 * @param imageUrl 원본 이미지 URL
 * @returns Promise<Blob> 썸네일 이미지 Blob
 */
export const createThumbnail = async (imageUrl: string): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        // CORS 이슈 방지를 위한 crossOrigin 설정
        img.crossOrigin = "anonymous";
        
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
                reject(new Error('Canvas context를 생성할 수 없습니다.'));
                return;
            }

            // 썸네일 크기 설정 (300x300 픽셀)
            canvas.width = 300;
            canvas.height = 300;

            // 이미지 비율 유지하면서 캔버스에 맞추기: 짧은 쪽을 기준으로 비율 맞추기
            const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
            // 이미지를 캔버스 중앙에 배치하기 위한 좌표 계산
            const x = (canvas.width - img.width * scale) / 2;
            const y = (canvas.height - img.height * scale) / 2;

            // 흰색 배경 그리기
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 이미지 그리기
            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

            // 캔버스를 JPEG Blob으로 변환 (품질: 80%)
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