package cinebook_backend.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class RazorpayService {

    private final RazorpayClient razorpayClient;

    public RazorpayService(
            @Value("${razorpay.key.id}") String keyId,
            @Value("${razorpay.key.secret}") String keySecret
    ) throws Exception {

        this.razorpayClient =
                new RazorpayClient(keyId, keySecret);
    }

    public Order createOrder(
            double amount,
            String receipt
    ) throws Exception {

        // Razorpay expects amount in paise
        int amountInPaise =
                (int) Math.round(amount * 100);

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
                receipt
        );

        orderRequest.put(
                "payment_capture",
                true
        );

        return razorpayClient.orders.create(
                orderRequest
        );
    }
}