package com.example.orders;

import java.util.List;

/**
 * Core order business logic. Validates and persists orders.
 */
public class OrderService {

    private final OrderRepository repository;

    public OrderService(OrderRepository repository) {
        this.repository = repository;
    }

    public Order placeOrder(String customerId, List<String> items) {
        if (items == null || items.isEmpty()) {
            throw new IllegalArgumentException("Order must contain at least one item");
        }
        Order order = new Order(customerId, items);
        return repository.save(order);
    }

    public Order findById(String orderId) {
        return repository.findById(orderId);
    }
}
