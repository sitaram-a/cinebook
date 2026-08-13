package cinebook_backend.dto;

import java.util.List;

public record PaymentVerificationRequest(

        String razorpayOrderId,

        String razorpayPaymentId,

        String razorpaySignature,

        Long showId,

        List<Long> showSeatIds

) {
}