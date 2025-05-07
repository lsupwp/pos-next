import db from "@/lib/database";

const getDetailsProduct = async (req, res) => {
    if (req.method === "GET") {
        const { id } = req.query;

        if(!id){
            res.json({status: "error", message: "ไม่พบ id ของสินค้า"})
            return;
        }

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
            WHERE products.id = ?
        `, [id])
            return res.json({ status: 'ok', message: 'ดึงข้อมูลสำเร็จ', product: rows })
        } catch (err) {
            console.log(err)
            return res.json({ status: "error", message: "Internal server error!" })
        }
    }
}

export default getDetailsProduct;