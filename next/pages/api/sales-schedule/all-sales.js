import db from "@/lib/database";

const allSales = async (req, res) => {
    if (req.method === "GET") {
        try {
            const [rows] = await db.query(`
                SELECT DATE(sale_date) AS sale_date, SUM(total_profit) AS total_profit
                FROM sales_schedule
                GROUP BY DATE(sale_date)
                ORDER BY sale_date DESC
            `);

            // ตอนนี้ rows จะมีโครงสร้างประมาณนี้:
            // [
            //   { sale_date: '2025-05-12', total_profit: 54.87 },
            //   { sale_date: '2025-05-13', total_profit: 5.50 }
            // ]

            return res.json({ status: "ok", data: rows });
        } catch (err) {
            console.error("Error fetching and aggregating sales:", err);
            return res.status(500).json({ status: "error", message: "Internal server error" });
        }
    } else {
        return res.json({ status: "error", message: "Method Not Allowed" });
    }
}

export default allSales;