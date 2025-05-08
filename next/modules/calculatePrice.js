const calculatePrice = (product, amount) => {
    if (!product) return 0;
    if (!amount || amount <= 0) return 0;

    const promotionPrice = product.promotion_price;
    const promotionQuantity = product.promotion_quantity;
    const normalPrice = parseFloat(product.price);

    if (promotionPrice && promotionQuantity) {
        const promotionAmount = Math.floor(amount / promotionQuantity);
        const normalAmount = amount % promotionQuantity;
        const totalPrice = (promotionPrice * promotionAmount) + (normalPrice * normalAmount);
        return totalPrice;
    } else {
        return normalPrice * amount;
    }
};

const calculateProfit = (product, amount) => {
    if (!product) return 0;
    if (!amount || amount <= 0) return 0;

    const cost = parseFloat(product.cost);
    const price = calculatePrice(product, amount);
    const profit = price - (cost * amount);
    return profit;
};

export { calculatePrice, calculateProfit };