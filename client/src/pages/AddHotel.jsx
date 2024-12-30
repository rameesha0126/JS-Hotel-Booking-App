import { useMutation } from "react-query";
import { useAppContext } from "../contexts/AppContext";
import * as apiClient from "../api-clients";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";

const AddHotel = () => {
    const { showToast } = useAppContext();

    const { mutate, isLoading } = useMutation(apiClient.addMyHotel, {
        onSuccess: () => {
            showToast({ message: "Hotel Saved!", type: "SUCCESS" });
        }, 
        onError: () => {
            showToast({ message: "Error Saving Hotel", type: "ERROR" });
        },
    })

    const handleSave = (hotelFormData) => {
        mutate(hotelFormData);
    }

    return <ManageHotelForm onSave={handleSave} isLoading={isLoading} />;
}; 

export default AddHotel;