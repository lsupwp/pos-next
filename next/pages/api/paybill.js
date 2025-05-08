import db from "@/lib/database"

function isValidProduct(products, res) {
    if (!products || products.length === 0) {
        return res.json({ status: "error", message: "ไม่พบสินค้าที่ต้องการซื้อ" });
    }

    for (let p of products) {
        if (typeof p.barcode !== 'string' || p.barcode.trim() === "") {
            return res.json({ status: "error", message: "รหัสบาร์โค้ดของสินค้าผิดพลาด" });
        }

        if (typeof p.name !== 'string' || p.name.trim() === "") {
            return res.json({ status: "error", message: "ชื่อสินค้าผิดพลาด" });
        }

        if (isNaN(p.cost) || p.cost <= 0) {
            return res.json({ status: "error", message: "ต้นทุนสินค้าต้องมากกว่า 0" });
        }

        if (isNaN(p.price) || p.price <= 0 || p.price <= p.cost) {
            return res.json({ status: "error", message: "ราคาสินค้าต้องมากกว่าต้นทุนและมากกว่า 0" });
        }

        if (isNaN(p.quantity)) {
            return res.json({ status: "error", message: "จำนวนสินค้าผิดพลาด" });
        }

        if (isNaN(p.saled_quantity)) {
            return res.json({ status: "error", message: "จำนวนสินค้าที่ขายผิดพลาด" });
        }

        if (!(isNaN(p.promotion_quantity) === false || p.promotion_quantity === null)) {
            return res.json({ status: "error", message: "จำนวนโปรโมชันของสินค้าผิดพลาด" });
        }

        if (!(isNaN(p.promotion_price) === false || p.promotion_price === null)) {
            return res.json({ status: "error", message: "ราคาโปรโมชันของสินค้าผิดพลาด" });
        }

        if (isNaN(p.total_price) || p.total_price <= 0) {
            return res.json({ status: "error", message: "ราคารวมของสินค้าต้องมากกว่า 0" });
        }

        if (isNaN(p.total_profit) || p.total_profit <= 0) {
            return res.json({ status: "error", message: "กำไรรวมของสินค้าต้องมากกว่า 0" });
        }

        if (isNaN(p.amount) || p.amount <= 0) {
            return res.json({ status: "error", message: "ยอดรวมของสินค้าต้องมากกว่า 0" });
        }
    }

    return true;
}



const paybill = async (req, res) => {
    if (req.method === "POST") {
        const { products, total_sales, total_profit, amount_received, change_amount } = req.body;

        console.log(products);

        if (!products || products.length === 0) {
            return res.json({ status: "error", message: "ไม่พบสินค้าที่ต้องการซื้อ" })
        }

        if (!isValidProduct(products, res)) {
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
                const newSaledQuantity = parseFloat(product.saled_quantity) + parseFloat(product.amount);

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