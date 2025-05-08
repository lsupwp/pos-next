import db from "@/lib/database";

const addProduct = async (req, res) => {
    if(req.method === "POST"){
        const { barcode, name, price, cost, quantity, promotion_quantity, promotion_price } = req.body;
            
        if (!barcode || barcode.trim() === "") {
            return res.json({ status: "error", message: "โปรดกรอกบาร์โค้ดให้ถูกต้อง" });
        }
    
        if (!name || name.trim() === "") {
            return res.json({ status: "error", message: "โปรดกรอกชื่อสินค้าให้ถูกต้อง" });
        }
    
        if (name.length > 100) {
            return res.json({ status: "error", message: "ชื่อต้องไม่เกิน 100 ตัวอักษร" });
        }
    
        if (isNaN(price) || price <= 0) {
            return res.json({ status: "error", message: "โปรกกรอกราคาสินค่าให้ถูกต้อง" })
        }
    
        if (isNaN(cost) || cost < 0) {
            return res.json({ status: "error", message: "โปรกกรอกต้นทุนสินค้าให้ถูกต้อง" })
        }
    
        if (isNaN(quantity) || quantity <= 0) {
            return res.json({ status: "error", message: "โปรกกรอกจำนวนสินค้าให้ถูกต้อง" })
        }
    
        if (price <= cost) {
            return res.json({ status: "error", message: "ราคาสินค้าต้องมากกว่าราคาต้นทุน" })
        }
    
        const parsePrice = parseFloat(price)
        const parseCost = parseFloat(cost)
        const newQuantity = parseFloat(quantity)
    
        const [rows] = await db.query("SELECT * FROM products WHERE barcode = ? OR name = ?", [barcode, name])
    
        if (rows.length > 0) {
            const duplicateBarcode = rows.find(row => row.barcode === barcode);
            const duplicateName = rows.find(row => row.name === name);
    
            if (duplicateBarcode) {
                return res.json({ status: "error", message: "มีบาร์โค้ดนี้อยู่แล้ว" });
            }
    
            if (duplicateName) {
                return res.json({ status: "error", message: "มีชื่อสินค้านี้อยู่แล้ว" });
            }
        }
    
        if (promotion_quantity !== undefined && promotion_price !== undefined) {
            if (isNaN(promotion_quantity) || promotion_quantity <= 0) {
                return res.json({ status: "error", message: "กรุณาใส่จำนวนสินค้าที่จะจัดโปรโมชั่น" })
            }
    
            if (isNaN(promotion_price) || promotion_price <= 0) {
                return res.json({ status: "error", message: "กรุณาใส่ราคาโปรโมชั่นของสินค้าให้ถูกต้อง" })
            }
    
            const promotionQuantity = parseFloat(promotion_quantity)
            const parsePromotionPrice = parseFloat(promotion_price)
    
            try {
                await db.query(
                    "INSERT INTO products (barcode, name, price, cost, quantity) VALUES (?, ?, ?, ?, ?)",
                    [barcode, name, parsePrice, parseCost, newQuantity]
                );
    
                await db.query(
                    "INSERT INTO promotions (product_barcode, quantity, price) VALUES (?, ?, ?)",
                    [barcode, promotionQuantity, parsePromotionPrice]
                )
    
                return res.json({ status: "ok", message: "เพิ่มสินค้าสำเร็จ" })
            } catch (err) {
                return res.json({ status: "error", message: "Internal server error" })
            }
        } else {
            try {
                await db.query(
                    "INSERT INTO products (barcode, name, price, cost, quantity) VALUES (?, ?, ?, ?, ?)",
                    [barcode, name, parsePrice, parseCost, newQuantity]
                );
    
                return res.json({ status: "ok", message: "เพิ่มสินค้าสำเร็จ" })
            } catch (err) {
                return res.json({ status: "error", message: "Internal server error" })
            }
        }
    }
}

export default addProduct