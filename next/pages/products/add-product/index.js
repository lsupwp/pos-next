import { useState, useEffect, useRef } from "react"

import Navbar from "@/components/Navbar";
import ModalAddPromotion from "@/components/products/ModalAddPromotion";

const AddProduct = () => {

    const barcodeKey = useRef(null);
    const nameKey = useRef(null);
    const priceKey = useRef(null);
    const costKey = useRef(null);
    const quantityKey = useRef(null);

    const [barcode, setBarcode] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [cost, setCost] = useState("");
    const [quantity, setQuantity] = useState("");
    const [productDetail, setProductDetail] = useState(null)

    const [error, setError] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()

        if (barcode.trim() === "") {
            setError("กรุณากรอกบาร์โค้ด")
            return
        }
        if (name.trim() === "") {
            setError("กรุณากรอกชื่อสินค้า")
            return
        }
        if (isNaN(price) || price <= 0) {
            setError("ราคาต้องเป็นตัวเลขที่มากกว่า 0")
            return
        }
        if (isNaN(cost) || cost < 0) {
            setError("ต้นทุนต้องเป็นตัวเลขที่มากกว่า -1")
            return
        }
        if (isNaN(quantity) || quantity <= 0) {
            setError("จำนวนสินค้าต้องเป็นตัวเลขที่มากกว่า 0")
            return
        }
        if (parseFloat(price) <= parseFloat(cost)) {
            setError("ราคาขายต้องมากกว่าต้นทุน")
            return
        }

        const newProduct = {
            barcode: barcode,
            name: name,
            price: parseFloat(price),
            cost: parseFloat(cost),
            quantity: parseFloat(quantity)
        }

        setError("")
        setProductDetail(newProduct)
        setIsModalOpen(true)
    }

    const clearData = () => {
        setBarcode("");
        setName("");
        setPrice("");
        setCost("");
        setQuantity("");
    }

    useEffect(()=>{
        const handleKeyDown = (e)=>{
            if(e.ctrlKey && e.key === "1"){
                barcodeKey.current?.focus();
                return;
            }
            if(e.ctrlKey && e.key === "2"){
                nameKey.current?.focus();
                return;
            }
            if(e.ctrlKey && e.key === "3"){
                priceKey.current?.focus();
                return;
            }
            if(e.ctrlKey && e.key === "4"){
                costKey.current?.focus();
                return;
            }
            if(e.ctrlKey && e.key === "5"){
                quantityKey.current?.focus();
                return;
            }
        }

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [])

    return (
        <>
            <Navbar />
            <div className="flex flex-col items-center justify-center h-screen w-full">
                <h1 className="text-3xl font-bold mb-4">เพิ่มรายการสินค้า</h1>
                <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center w-full max-w-3/6">
                    {error &&
                        <div role="alert" className="alert alert-error w-full max-w-5/6 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    }
                    <div className="flex flex-col items-start justify-center w-full max-w-5/6 mb-4">
                        <label htmlFor="barcode" className="mb-2">Barcode</label>
                        <input
                            ref={barcodeKey}
                            type="text"
                            id="barcode"
                            placeholder="Barcode"
                            value={barcode}
                            onChange={e => setBarcode(e.target.value)}
                            className="input w-full"
                            autoFocus
                            required
                        />
                    </div>
                    <div className="flex flex-col items-start justify-center w-full max-w-5/6 mb-4">
                        <label htmlFor="name" className="mb-2">ชื่อสินค้า</label>
                        <input
                            ref={nameKey}
                            type="text"
                            id="name"
                            placeholder="Name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="input w-full"
                            required
                        />
                    </div>
                    <div className="flex flex-col items-start justify-center w-full max-w-5/6 mb-4">
                        <label htmlFor="price" className="mb-2">ราคาสินค้า</label>
                        <input
                            ref={priceKey}
                            type="number"
                            id="price"
                            placeholder="price"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            className="input w-full"
                            step="any"
                            required
                        />
                    </div>
                    <div className="flex flex-col items-start justify-center w-full max-w-5/6 mb-4">
                        <label htmlFor="cost" className="mb-2">ต้นทุนสินค้า</label>
                        <input
                            ref={costKey}
                            type="number"
                            id="cost"
                            placeholder="cost"
                            value={cost}
                            onChange={e => setCost(e.target.value)}
                            className="input w-full"
                            step="any"
                            required
                        />
                    </div>
                    <div className="flex flex-col items-start justify-center w-full max-w-5/6 mb-4">
                        <label htmlFor="quantity" className="mb-2">จำนวนสินค้า</label>
                        <input
                            ref={quantityKey}
                            type="number"
                            id="quantity"
                            placeholder="quantity"
                            value={quantity}
                            onChange={e => setQuantity(e.target.value)}
                            className="input w-full"
                            required
                        />
                    </div>
                    <div className="flex flex-col items-center justify-center w-full max-w-5/6 mb-4">
                        <button type="submit" className="btn btn-primary">เพิ่มสินค้า</button>
                    </div>
                </form>
            </div>
            {productDetail && <ModalAddPromotion productDetail={productDetail} open={isModalOpen} clearData={() => clearData()} onClose={() => { setIsModalOpen(false) }} />}
        </>
    )
}

export default AddProduct