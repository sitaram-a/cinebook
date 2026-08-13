package cinebook_backend.controller;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;

import cinebook_backend.dto.BookingRequest;
import cinebook_backend.dto.PaymentOrderRequest;
import cinebook_backend.dto.PaymentVerificationRequest;
import cinebook_backend.entity.Booking;
import cinebook_backend.service.BookingService;

import org.json.JSONObject;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    private final BookingService bookingService;

    public PaymentController(BookingService bookingService) {
        this.bookingService = bookingService;
    }


    // =========================================================
    // CREATE RAZORPAY ORDER
    // =========================================================

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(
            @RequestBody PaymentOrderRequest request
    ) {

        try {

            // -------------------------------------------------
            // Validate amount
            // -------------------------------------------------

            if (request == null || request.amount() <= 0) {

                return ResponseEntity
                        .badRequest()
                        .body("Invalid payment amount");
            }


            // -------------------------------------------------
            // Convert rupees to paise
            // -------------------------------------------------

            int amountInPaise =
                    (int) Math.round(
                            request.amount() * 100
                    );


            // -------------------------------------------------
            // Razorpay client
            // -------------------------------------------------

            RazorpayClient razorpayClient =
                    new RazorpayClient(
                            razorpayKeyId,
                            razorpayKeySecret
                    );


            // -------------------------------------------------
            // Razorpay order request
            // -------------------------------------------------

            JSONObject orderRequest =
                    new JSONObject();

            orderRequest.put(
                    "amount",
                    amountInPaise
            );

            orderRequest.put(
                    "currency",
                    "INR"
            );

            orderRequest.put(
                    "receipt",
                    "cinebook_" +
                    System.currentTimeMillis()
            );


            // -------------------------------------------------
            // Create Razorpay order
            // -------------------------------------------------

            Order order =
                    razorpayClient.orders.create(
                            orderRequest
                    );


            // -------------------------------------------------
            // Convert order to JSON
            // -------------------------------------------------

            JSONObject orderJson =
                    order.toJson();


            // -------------------------------------------------
            // Response
            // -------------------------------------------------

            JSONObject response =
                    new JSONObject();

            response.put(
                    "orderId",
                    orderJson.getString("id")
            );

            response.put(
                    "amount",
                    orderJson.getInt("amount")
            );

            response.put(
                    "currency",
                    orderJson.getString("currency")
            );

            response.put(
                    "keyId",
                    razorpayKeyId
            );


            return ResponseEntity.ok(
                    response.toMap()
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Unable to create Razorpay order: "
                                    + e.getMessage()
                    );
        }
    }


    // =========================================================
    // VERIFY PAYMENT + CREATE BOOKING
    // =========================================================

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(
            @RequestBody PaymentVerificationRequest request,
            Authentication authentication
    ) {

        try {

            // -------------------------------------------------
            // Validate Razorpay response
            // -------------------------------------------------

            if (request == null ||
                    request.razorpayOrderId() == null ||
                    request.razorpayPaymentId() == null ||
                    request.razorpaySignature() == null) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Payment information is missing"
                        );
            }


            // -------------------------------------------------
            // Create signature payload
            // -------------------------------------------------

            String payload =
                    request.razorpayOrderId()
                            + "|"
                            + request.razorpayPaymentId();


            // -------------------------------------------------
            // Verify Razorpay signature
            // -------------------------------------------------

            boolean isValid =
                    com.razorpay.Utils.verifySignature(
                            payload,
                            request.razorpaySignature(),
                            razorpayKeySecret
                    );


            if (!isValid) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Invalid Razorpay payment signature"
                        );
            }


            // -------------------------------------------------
            // Payment verified
            // -------------------------------------------------

            System.out.println(
                    "===================================="
            );

            System.out.println(
                    "RAZORPAY PAYMENT VERIFIED"
            );

            System.out.println(
                    "Order ID: "
                            + request.razorpayOrderId()
            );

            System.out.println(
                    "Payment ID: "
                            + request.razorpayPaymentId()
            );

            System.out.println(
                    "===================================="
            );


            // -------------------------------------------------
            // Validate show and seats
            // -------------------------------------------------

            if (request.showId() == null ||
                    request.showSeatIds() == null ||
                    request.showSeatIds().isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Show or seats information is missing"
                        );
            }


            // -------------------------------------------------
            // Create BookingRequest
            // -------------------------------------------------

            BookingRequest bookingRequest =
                    new BookingRequest(
                            request.showId(),
                            request.showSeatIds()
                    );


            // -------------------------------------------------
            // Create CineBook booking
            // -------------------------------------------------

            Booking booking =
                    bookingService.createBooking(
                            bookingRequest,
                            authentication.getName()
                    );


            // -------------------------------------------------
            // Return booking
            // -------------------------------------------------

            return ResponseEntity.ok(
                    booking
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Unable to verify payment or create booking: "
                                    + e.getMessage()
                    );
        }
    }
}