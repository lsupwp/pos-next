import db from "@/lib/database";

const updateProductPromotion = async (req, res) => {
    if (req.method === "POST") {
        const { barcode, name, price, cost, quantity, saled_quantity, promotion_quantity, promotion_price } = req.body

        console.log(req.body)

        if (!barcode || barcode.trim() === "") {
            return res.json({ status: "error", message: "โปรดกรอกบาร์โค้ดให้ถูกต้อง" })
        }

        if (!name || name.trim() === "") {
            return res.json({ status: "error", message: "โปรดกรอกชื่อสินค้าให้ถูกต้อง" })
        }

        if (name.length > 100) {
            return res.json({ status: "error", message: "ชื่อต้องไม่เกิน 100 ตัวอักษร" })
        }

        if (isNaN(price) || price <= 0) {
            return res.json({ status: "error", message: "โปรดกรอกราคาสินค้าให้ถูกต้อง" })
        }

        if (isNaN(cost) || cost <= 0) {
            return res.json({ status: "error", message: "โปรดกรอกต้นทุนสินค้าให้ถูกต้อง" })
        }

        if (isNaN(quantity) || quantity <= 0) {
            return res.json({ status: "error", message: "โปรดกรอกจำนวนสินค้าให้ถูกต้อง" })
        }

        if (isNaN(saled_quantity) || saled_quantity < 0) {
            return res.json({ status: "error", message: "โปรดกรอกจำนวนสินค้าที่ขายไปแล้วให้ถูกต้อง" })
        }

        if (isNaN(promotion_quantity) || promotion_quantity <= 0) {
            return res.json({ status: "error", message: "โปรดกรอกจำนวนสินค้าที่จะจัดโปรโมชั่นให้ถูกต้อง" })
        }

        if (isNaN(promotion_price) || promotion_price <= 0) {
            return res.json({ status: "error", message: "โปรดกรอกราคาสินค้าที่จะจัดโปรโมชั่นให้ถูกต้อง" })
        }

        const parsePrice = parseFloat(price)
        const parseCost = parseFloat(cost)
        const newQuantity = parseFloat(quantity)
        const newSaledQuantity = parseFloat(saled_quantity)

        if (parsePrice <= parseCost) {
            return res.json({ status: "error", message: "ราคาสินค้าต้องมากกว่าราคาต้นทุน" })
        }

        try {
            const [rows] = await db.query("SELECT * FROM products WHERE barcode = ?", [barcode])

            if (rows.length === 0) {
                return res.json({ status: "error", message: "ไม่พบสินค้านี้" })
            }

            const [promotion] = await db.query("SELECT * FROM promotions WHERE product_barcode = ?", [barcode])

            if (promotion.length === 0) {
                return res.json({ status: "error", message: "ไม่พบโปรโมชั่นของสินค้านี้" })
            }

            await db.query("UPDATE products SET name = ?, price = ?, cost = ?, quantity = ?, saled_quantity = ? WHERE barcode = ?", [name, parsePrice, parseCost, newQuantity, newSaledQuantity, barcode])
            await db.query("UPDATE promotions SET quantity = ?, price = ? WHERE product_barcode = ?", [promotion_quantity, promotion_price, barcode])

            return res.json({ status: "ok", message: "อัพเดทข้อมูลสำเร็จ" })
        } catch (err) {
            console.log(err)
            return res.json({ status: "error", message: "Internal server error" })
        }
    }
}

export default updateProductPromotion