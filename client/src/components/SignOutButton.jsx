import { useMutation, useQueryClient } from "react-query";
import { useAppContext } from "../contexts/AppContext";
import * as apiClient from "../api-clients";

const SignOutButton = () => {
    const queryClient = useQueryClient();
    const { showToast } = useAppContext(); 

    const mutation = useMutation(apiClient.signOut, {
        onSuccess: async () => {
            await queryClient.invalidateQueries("validateToken");
            showToast({ message: "Signed Out!", type: "SUCCESS"});
        }, 
        onError: (error) => {
            showToast({ message: error.message, type: "ERROR" });
        },
    }); 

    const handleClick = () => {
        mutation.mutate();
    }; 

    return (
        <button
            onClick={handleClick} 
            className="text-blue-600 font-bold bg-white hover:bg-gray-100"
        >
            Sign Out
        </button>
    );
}; 

export default SignOutButton;