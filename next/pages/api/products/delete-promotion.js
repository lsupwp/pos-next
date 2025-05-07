import db from "@/lib/database";

const deletePromotion = async (req, res) => {
    if (req.method === "POST") {
        const { barcode } = req.body

        if (!barcode || barcode.trim() === "") {
            return res.json({ status: "error", message: "ไม่พบบาร์โค้ด" })
        }

        try {
            const [response] = await db.query("SELECT * FROM promotions WHERE product_barcode = ?", [barcode]);

            if (response.length === 0) {
                return res.json({ status: "error", message: "ไม่พบโปรโมชั่นของสินค้านี้" })
            }

            await db.query("DELETE FROM promotions WHERE product_barcode = ?", [barcode]);

            return res.json({ status: "ok", message: "ลบโปรโมชั่นสำเร็จ" })
        } catch (err) {
            console.log(err)
            return res.json({ status: "error", message: "Internal server error" })
        }
    }
}

export default deletePromotion;