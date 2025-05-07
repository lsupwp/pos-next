import db from "@/lib/database"

function isValidProduct(product) {
    return product.every(p => {
        const isBarcodeValid = typeof p.barcode === 'string' && p.barcode.trim() !== "";
        const isNameValid = typeof p.name === 'string' && p.name.trim() !== "";
        const isPriceValid = typeof p.price === 'number' && p.price > 0 && p.price > p.cost;
        const isCostValid = typeof p.cost === 'number' && p.cost > 0;
        const isQuantityValid = typeof p.quantity === "number";
        const isSaledQuantity = typeof p.saled_quantity === "number";
        const isPromotionQuantityValid = (typeof p.promotion_quantity === 'number' || p.promotion_quantity === null);
        const isPromotionPriceValid = (typeof p.promotion_price === 'number' || p.promotion_price === null);
        const isTotalPriceValid = typeof p.total_price === 'number' && p.total_price > 0;
        const isTatalProfitValid = typeof p.total_profit === 'number' && p.total_profit > 0;
        const isAmountValid = typeof p.amount === 'number' && p.amount > 0;

        return isBarcodeValid &&
            isNameValid &&
            isPriceValid &&
            isCostValid &&
            isQuantityValid &&
            isSaledQuantity &&
            isPromotionQuantityValid &&
            isPromotionPriceValid &&
            isTotalPriceValid &&
            isTatalProfitValid &&
            isAmountValid;
    });
}


const paybill = async (req, res) => {
    if (req.method === "POST") {
        const { products, total_sales, total_profit, amount_received, change_amount } = req.body;

        if (!products || products.length === 0) {
            return res.json({ status: "error", message: "ไม่พบสินค้าที่ต้องการซื้อ" })
        }

        if (!isValidProduct(products)) {
            return res.json({ status: "error", message: "สินค้าไม่ถูกต้อง" })
        }

        if (!total_sales || isNaN(total_sales)) {
            return res.json({ status: "error", message: "ยอดขายรวมไม่ถูกต้อง" })
        }

        if (!total_profit || isNaN(total_profit)) {
            return res.json({ status: "error", message: "กำไรรวมไม่ถูกต้อง" })
        }

        if (amount_received === undefined || isNaN(amount_received)) {
            return res.json({ status: "error", message: "ยอดเงินที่รับไม่ถูกต้อง" })
        }

        if (change_amount === undefined || isNaN(change_amount)) {
            return res.json({ status: "error", message: "เงินทอนไม่ถูกต้อง" })
        }

        const parseTotalSales = parseFloat(total_sales)
        const parseTotalProfit = parseFloat(total_profit)
        const parseAmountReceived = parseFloat(amount_received)
        const parseChangeAmount = parseFloat(change_amount)

        if (parseTotalSales <= 0) {
            return res.json({ status: "error", message: "ยอดขายรวมไม่ถูกต้อง" })
        }

        if (parseTotalProfit <= 0) {
            return res.json({ status: "error", message: "กำไรรวมไม่ถูกต้อง" })
        }

        if (parseAmountReceived < 0) {
            return res.json({ status: "error", message: "ยอดเงินที่รับไม่ถูกต้อง" })
        }

        try {
            const [result] = await db.query(
                "INSERT INTO sales_schedule (total_sales, total_profit, amount_received, change_amount) VALUES (?, ?, ?, ?)",
                [parseTotalSales, parseTotalProfit, parseAmountReceived, parseChangeAmount]
            )

            const insertId = result.insertId;

            for (let product of products) {

                await db.query(
                    "INSERT INTO sold_items (sales_schedule_id, product_barcode, quantity, total_sales, total_profit) VALUES (?, ?, ?, ?, ?)",
                    [insertId, product.barcode, product.amount, product.total_price, product.total_profit]
                )

                const newQuantity = product.quantity - product.amount;
                const newSaledQuantity = product.saled_quantity + product.amount;

                await db.query(
                    "UPDATE products SET quantity = ?, saled_quantity = ? WHERE barcode = ?",
                    [newQuantity, newSaledQuantity, product.barcode]
                )
            }

            return res.json({ status: "ok", message: "คิดเงินสำเร็จ" })

        } catch (err) {
            console.log(err)
            return res.json({ status: "error", message: "Internal server error (Backend)" })
        }
    }
}

export default paybill