import { useEffect, useState, useRef } from "react";
import axios from "axios";

import Navbar from "@/components/Navbar";

import { calculatePrice, calculateProfit } from "@/modules/calculatePrice";
import DeleteProduct from "@/components/home/DeleteProduct";
import DeleteProductSales from "@/components/home/DeleteProductSales";
import PayBill from "@/components/home/PayBill";

const Home = () => {

    const inputRef = useRef(null);

    const [products, setProducts] = useState([]);
    const [productSales, setProductSales] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false)

    const deleteProduct = (barcode) => {
        setProductSales(prev => prev.filter(product => product.barcode !== barcode));
    };

    const handleQuantityChange = (e, barcode) => {
        const value = parseFloat(e.target.value);
    
        if (isNaN(value) || value < 0) return;
    
        const product = productSales.find(product => product.barcode === barcode);
        if (!product) return;
    
        const newProduct = {
            ...product,
            amount: value,
            total_price: calculatePrice(product, value),
            total_profit: calculateProfit(product, value)
        };
        console.log(newProduct);
    
        setProductSales(prev => prev.map(product => product.barcode === barcode ? newProduct : product));
    }
    

    const handleKeydown = (e) => {
        if (!products) return

        if (e.key === "Enter") {
            e.preventDefault();
            const barcode = e.target.value.trim();
            if (!barcode) return

            const product = products.find(product => product.barcode === barcode);
            if (!product) {
                alert("ไม่พบสินค้าในระบบ");
                e.target.value = ""
                return
            }

            const exists = productSales.find(productSale => productSale.barcode === barcode);

            if (exists) {
                const newProduct = {
                    ...exists,
                    amount: exists.amount + 1,
                    total_price: calculatePrice(exists, exists.amount + 1),
                    total_profit: calculateProfit(exists, exists.amount + 1)
                }

                setProductSales(prev => prev.map(product => product.barcode === barcode ? newProduct : product));
                e.target.value = ""
                return
            }

            const newProduct = {
                barcode: product.barcode,
                name: product.name,
                price: parseFloat(product.price),
                cost: parseFloat(product.cost),
                quantity: product.quantity,
                saled_quantity: product.saled_quantity,
                promotion_quantity: product.promotion_quantity,
                promotion_price: parseFloat(product.promotion_price),
                total_price: parseFloat(product.price),
                total_profit: parseFloat(product.price) - parseFloat(product.cost),
                amount: 1
            }

            setProductSales(prev => [...prev, newProduct]);

            e.target.value = ""
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/products/get-product-promotion`);
                const data = response.data;
                if (data.status === "error") {
                    alert(data.message);
                }
                setProducts(data.products);
            } catch (error) {
                alert("เกิดข้อผิดพลาดในการดึงข้อมูล");
            }
        }
        fetchData();
    }, [])

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.shiftKey && e.key === "Enter") {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [inputRef]);

    return (
        <>
            <Navbar />
            {products.length === 0 ? (
                <div className="flex flex-col items-center justify-start w-full h-screen">
                    <p>ไม่พบสินค้า</p>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-start w-full h-screen">
                    <div className="flex flex-row items-center justify-center w-full p-4 h-1/8">
                        <form onSubmit={e => e.preventDefault()} className="flex items-center justify-center w-full max-w-3/6  p-4">
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Type here"
                                onKeyDown={handleKeydown}
                                className="input w-full"
                                autoFocus
                            />
                        </form>
                        <DeleteProductSales onDelete={() => setProductSales([])} />
                    </div>
                    <div className="overflow-x-auto w-full h-6/8">
                        <table className="table">
                            {/* head */}
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>ชื่อสินค้า</th>
                                    <th>ราคาต่อหน่วย</th>
                                    <th>จำนวนสินค้า</th>
                                    <th>ราคารวม</th>
                                    <th>กำไรรวม</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {productSales.map((product, index) => (
                                    <tr key={index}>
                                        <th>{index + 1}</th>
                                        <td>{product.name}</td>
                                        <td>{product.price.toFixed(2)}</td>
                                        <td>
                                            <input
                                                className="input input-bordered w-20"
                                                type="number"
                                                min={0}
                                                step="any"   // <== เพิ่มตรงนี้เพื่อให้พิมพ์ทศนิยมได้
                                                value={product.amount}
                                                onChange={(e) => handleQuantityChange(e, product.barcode)}
                                                onKeyDown={(e) => handleQuantityChange(e, product.barcode)}
                                                onBlur={(e) => handleQuantityChange(e, product.barcode)}
                                            />
                                        </td>
                                        <td>{product.total_price.toFixed(2)}</td>
                                        <td>{product.total_profit.toFixed(2)}</td>
                                        <td><DeleteProduct name={product.name} onDelete={() => deleteProduct(product.barcode.trim())} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex flex-row items-center justify-around w-full p-4 h-1/8">
                        <h1 className="text-2xl font-bold">กำไรทั้งหมด: {productSales.reduce((acc, product) => acc + product.total_profit, 0).toFixed(2)} บาท</h1>
                        <h1 className="text-2xl font-bold text-green-500">รวมทั้งหมด: {productSales.reduce((acc, product) => acc + product.total_price, 0).toFixed(2)} บาท</h1>
                        <button className="btn btn-primary mt-4" onClick={() => setIsModalOpen(true)}>ชำระเงิน</button>
                    </div>
                </div>
            )}
            {
                productSales &&
                isModalOpen &&
                <PayBill
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    products={productSales}
                    total_sales={productSales.reduce((acc, product) => acc + product.total_price, 0).toFixed(2)}
                    total_profit={productSales.reduce((acc, product) => acc + product.total_profit, 0).toFixed(2)}
                    onReload={() => window.location.reload()}
                />}
        </>
    )
}

export default Home;