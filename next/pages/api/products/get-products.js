import db from "@/lib/database"

const getProducts = async (req, res)=>{
    if(req.method === "GET"){
        try{
            const [rows] = await db.query("SELECT * FROM products ORDER BY quantity ASC")
    
            return res.json({status: "ok", message: "ดึงข้อมูลสำเร็จ", products: rows})
        }catch (err){
            return res.json({status: "error", message: "Internal server error"})
        }
    }
}

export default getProducts;