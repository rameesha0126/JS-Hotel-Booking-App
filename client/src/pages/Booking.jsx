import * as apiClient from "../api-clients";
import { useEffect, useState } from "react"
import { useQuery } from "react-query"
import { useParams } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { useSearchContext } from "../contexts/SearchContext";
import { Elements } from "@stripe/react-stripe-js";
import BookingForm from "../forms/BookingForm/BookingForm";
import BookingDetailsSummary from "../components/BookingDetailsSummary";

const Booking = () => {
    const { stripePromise } = useAppContext(); 
    const search = useSearchContext(); 
    const { hotelId } = useParams(); 

    const [numberOfNights, setNumberOfNights] = useState(0); 

    useEffect(() => {
        if (search.checkIn && search.checkOut) {
            const nights = 
                Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) / 
                (1000 * 60 * 60 * 24); 

            setNumberOfNights(Math.ceil(nights));
        }
    }, [search.checkIn, search.checkOut]);

    const { data: paymentIntentData } = useQuery(
        "createPaymentIntent", 
        () => 
            apiClient.createPaymentIntent(
                hotelId, 
                numberOfNights.toString(),
            ), 
        {
            enabled: !!hotelId && numberOfNights > 0,
        },
    );

    const { data: hotel } = useQuery(
        "fetchHotelById", 
        () => apiClient.fetchHotelById(hotelId), 
        {
            enabled: !!hotelId,
        }
    );

    const { data: currentUser } = useQuery(
        "fetchCurrentUser", 
        apiClient.fetchCurrentUser,
    );

    if (!hotel) {
        return <></>;
    }

    return (
        <div className="grid md:grid-cols-[1fr_2fr]">
            <BookingDetailsSummary 
                checkIn={search.checkIn} 
                checkOut={search.checkOut} 
                adultCount={search.adultCount} 
                childCount={search.childCount} 
                numberOfNights={numberOfNights} 
                hotel={hotel} 
            />
            {currentUser && paymentIntentData && (
                <Elements
                    stripe={stripePromise} 
                    options={{
                        clientSecret: paymentIntentData.clientSecret,
                    }}
                >
                    <BookingForm 
                        currentUser={currentUser} 
                        paymentIntent={paymentIntentData}
                    />
                </Elements>
            )}
        </div>
    );
}; 

export default Booking;