import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../lib/axios";

const toggleSavedApi = async (id: number): Promise<void> => {
    try {
        await api.post(`/saved/${id}`);
    } catch {
        // silently ignore — optimistic update already applied
    }
};

export const useToggleSaved = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: toggleSavedApi,

        // Optimistic update — update cache before request completes
        onMutate: async (id: number) => {
            await queryClient.cancelQueries({ queryKey: ["saved"] });
            const previous = queryClient.getQueryData<number[]>(["saved"]) ?? [];
            const updated = previous.includes(id)
                ? previous.filter((s) => s !== id)
                : [...previous, id];
            queryClient.setQueryData(["saved"], updated);
            return { previous };
        },

        // Roll back on error
        onError: (_err, _id, context) => {
            if (context?.previous) {
                queryClient.setQueryData(["saved"], context.previous);
            }
        },

        // Always sync with server after mutation
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["saved"] });
        },
    });
};
