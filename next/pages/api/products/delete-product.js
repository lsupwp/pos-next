import db from "@/lib/database";

const deleteProduct = async (req, res)=>{
    if(req.method === "POST"){
        const {barcode} = req.body;

        if(!barcode || barcode.trim() === ""){
            res.json({status: "error", message: "ไม่พบบาร์โค้ดของสินค้า"});
            return;
        }

        try{
            const [rows] = await db.query("SELECT * FROM products WHERE barcode = ?", [barcode]);
            if(rows.length === 0){
                res.json({status: "error", message: "ไม่พบสินค้าชิ้นนี้"});
                return;
            }

            await db.query("DELETE FROM products WHERE barcode = ?", [barcode]);
            res.json({status: "ok", message: "ลบสินค้าสำเร็จ"});
            return;
        }catch (err) {
            console.log(err);
            res.json({status: "error", message: "Internal server error"});
        }
    }
}

export default deleteProduct;