package com.example.orders;

import java.util.List;

/**
 * REST entry point for order operations.
 */
public class OrderController {

    private final OrderService service;

    public OrderController(OrderService service) {
        this.service = service;
    }

    // POST /orders
    public Order create(String customerId, List<String> items) {
        return service.placeOrder(customerId, items);
    }

    // GET /orders/{id}
    public Order get(String id) {
        return service.findById(id);
    }
}
