import db from "@/lib/database"

const addPromotion = async (req, res) => {
    if (req.method === "POST") {
        const { barcode, quantity, price } = req.body

        if (!barcode || barcode.trim() === "") {
            return res.json({ status: "error", message: "ไม่พบบาร์โค้ด" })
        }

        if (!quantity || isNaN(quantity) || quantity <= 0) {
            return res.json({ status: "error", message: "จำนวนสินค้าที่จะจัดโปรโมชั่นไม่ถูกต้อง" })
        }

        if (!price || isNaN(price) || price <= 0) {
            return res.json({ status: "error", message: "ราคาสินค้าที่จะจัดโปรโมชั่นไม่ถูกต้อง" })
        }

        try {
            const [product] = await db.query("SELECT * FROM products WHERE barcode = ?", [barcode])

            if (product.length === 0) {
                return res.json({ status: "error", message: "ไม่มีสินค้านี้ในฐานข้อมูล" })
            }

            const [promotion] = await db.query("SELECT * FROM promotions WHERE product_barcode = ?", [barcode])

            if (promotion.length > 0) {
                return res.json({ status: "error", message: "สินค้ามีโปรโมชั่นอยู่แล้ว" })
            }

            const newQuantity = parseFloat(quantity)
            const parsePrice = parseFloat(price)

            await db.query("INSERT INTO promotions (product_barcode, quantity, price) VALUES (?, ?, ?)", [barcode, newQuantity, parsePrice])

            return res.json({ status: "ok", message: "เพิ่มโปรโมชั่นสำเร็จ" })

        } catch (err) {
            console.log(err)
            return res.json({ status: "error", message: "Internal server error" })
        }
    }
}

export default addPromotion;