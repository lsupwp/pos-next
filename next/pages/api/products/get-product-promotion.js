import db from "@/lib/database"

const getProductPromotion = async (req, res) => {
    if (req.method === "GET") {
        try {
            const [rows] = await db.query(`
                SELECT
                    products.barcode,
                    products.name,
                    products.price,
                    products.cost,
                    products.quantity,
                    products.saled_quantity,
                    promotions.quantity AS promotion_quantity,
                    promotions.price AS promotion_price
                FROM products
                LEFT JOIN promotions ON products.barcode = promotions.product_barcode
            `)
            return res.json({ status: "ok", message: "ดึงข้อมูลสำเร็จ", products: rows })
        } catch (err) {
            console.log(err)
            return res.json({ status: "error", message: "Internal server error!" })
        }
    }
}

export default getProductPromotion