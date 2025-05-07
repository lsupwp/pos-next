import db from "@/lib/database";

const updatePromotion = async (req, res) => {
    if (req.method === "POST") {
        const { barcode, quantity, price } = req.body

        if (!barcode || barcode.trim() === "") {
            return res.json({ status: "error", message: "โปรดกรอกบาร์โค้ดให้ถูกต้อง" })
        }
        if (!quantity || isNaN(quantity) || quantity <= 0) {
            return res.json({ status: "error", message: "โปรดกรอกจำนวนสินค้าให้ถูกต้อง" })
        }
        if (!price || isNaN(price) || price <= 0) {
            return res.json({ status: "error", message: "โปรดกรอกราคาสินค้าให้ถูกต้อง" })
        }

        const newQuantity = Math.floor(quantity)
        const parsePrice = parseFloat(price)

        try {
            // const [rows] = await db.query("SELECT * FROM products WHERE barcode = ?", [barcode])

            // if(rows.length === 0) {
            //     return res.json({status: "error", message: "ไม่พบสินค้านี้"})
            // }

            const [promotion] = await db.query("SELECT * FROM promotions WHERE product_barcode = ?", [barcode])

            if (promotion.length === 0) {
                return res.json({ status: "error", message: "ไม่พบโปรโมชั่นของสินค้านี้" })
            }

            await db.query("UPDATE promotions SET quantity = ?, price = ? WHERE product_barcode = ?", [newQuantity, parsePrice, barcode])

            return res.json({ status: "ok", message: "อัพเดทโปรโมชั่นสำเร็จ" })
        } catch (err) {
            console.log(err)
            return res.json({ status: "error", message: "Internal server error" })
        }
    }
}

export default updatePromotion;