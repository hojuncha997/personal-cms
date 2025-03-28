import { useMutation } from "@tanstack/react-query";
import { fetchClient } from "@/lib/fetchClient";

export const useIncrementViewCount = () => {
    return useMutation({
        mutationFn: async (publicId: string) => {
            const response = await fetchClient(`/posts/${publicId}/views`, {
                method: 'POST',
                skipAuth: true
            });
            return response.json();
        }
    });
}; 