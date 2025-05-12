import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Link from "next/link";

import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import ShowErrorScreen from "@/components/ShowErrorScreen";

const Products = () => {

    const searchRef = useRef(null);

    const [products, setProducts] = useState([])
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [searchKey, setSearchKey] = useState("")

    const filterProduct = products.filter(product => {
        return product.name.toLowerCase().includes(searchKey.toLowerCase()) || product.barcode.toLowerCase().includes(searchKey.toLowerCase())
    })

    const handleDelete = async (name, barcode) => {
        if (confirm("ต้องการลบ " + name + " ใช่หรือไม่")) {
            try {
                const response = await axios.post("/api/products/delete-product", { barcode: barcode });
                const result = response.data;
                if (result.status === "error") {
                    alert(result.message);
                    return;
                }
                window.location.reload();
            } catch (err) {
                alert("Internal server error")
            }
        }
    }

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true)
            try {
                const response = await axios.get(`/api/products/get-products`)
                const data = response.data;
                setProducts(data.products)
                setError("")
            } catch (err) {
                setError("Internal server error");
            } finally {
                setIsLoading(false)
            }
        }

        fetchProducts();
    }, [])

    useEffect(() => {
        const handelSearch = (e) => {
            console.log('handelSearch called');
            if (e.shiftKey && e.key === "Enter") {
                e.preventDefault();
                searchRef.current?.focus();
            }
        }

        window.addEventListener("keydown", handelSearch);
        return () => window.removeEventListener("keydown", handelSearch);
    }, [])

    if (isLoading) return <Loading />

    return (
        <>
            <Navbar />

            {error ?
                (<ShowErrorScreen text={error} />)
                : products.length === 0 ?
                    (
                        <ShowErrorScreen text={"ไม่พบสินค้า"} />
                    ) :
                    (
                        <>
                            <div className="flex items-center justify-center w-full p-4">
                                <label className="input w-3/6">
                                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <g
                                            strokeLinejoin="round"
                                            strokeLinecap="round"
                                            strokeWidth="2.5"
                                            fill="none"
                                            stroke="currentColor"
                                        >
                                            <circle cx="11" cy="11" r="8"></circle>
                                            <path d="m21 21-4.3-4.3"></path>
                                        </g>
                                    </svg>
                                    <input
                                        ref={searchRef}
                                        type="search"
                                        className="grow"
                                        placeholder="Search"
                                        value={searchKey}
                                        onChange={e => setSearchKey(e.target.value)}
                                        autoFocus
                                    />
                                </label>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="table table-zebra">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>บาร์โค้ด</th>
                                            <th>ชื่อสินค้า</th>
                                            <th>ราคาสินค้า</th>
                                            <th>ต้นทุนสินค้า</th>
                                            <th>จำนวนสินค้าคงเหลือ</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filterProduct.map((product, index) => (
                                            <tr key={index}>
                                                <th>{index}</th>
                                                <td>{product.barcode}</td>
                                                <td>{product.name}</td>
                                                <td>{product.price}</td>
                                                <td>{product.cost}</td>
                                                <td>{product.quantity}</td>
                                                <td><button onClick={() => { handleDelete(product.name, product.barcode) }} className="btn btn-error">ลบสินค้า</button></td>
                                                <td><Link href={`/products/${product.id}`} asChild><button className="btn btn-info">จัดการสินค้า</button></Link></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )
            }
        </>
    )
}

export default Products;