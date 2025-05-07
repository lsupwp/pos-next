import { useRef, useEffect, useState } from "react"
import axios from "axios"

const ModalUpdatePromotion = (props) => {

    const { barcode, open, onClose, onReload } = props

    const dialogRef = useRef(null)

    const [error, setError] = useState("");
    const [promotionQuantity, setPromotionQuantity] = useState("");
    const [promotionPrice, setPromotionPrice] = useState("");

    const clearFrom = () => {
        setPromotionQuantity("");
        setPromotionPrice("");
        setError("");
    }

    const handleAddPromorion = async (e) => {
        e.preventDefault();

        if (!barcode) return

        if (isNaN(promotionQuantity) || promotionQuantity <= 0) {
            setError("โปรดกรอกจำนวนสินค้าที่จะจัดโปรโมชั่นให้ถูกต้อง")
            return
        }

        if (isNaN(promotionPrice) || promotionPrice <= 0) {
            setError("โปรดกรอกราคาสินค้าที่จะจัดโปรโมชั่นให้ถูกต้อง")
            return
        }

        const newQuantity = Math.floor(promotionQuantity)
        const parsePrice = parseFloat(promotionPrice)

        const newPromotion = {
            barcode: barcode,
            quantity: newQuantity,
            price: parsePrice
        }

        try {

            const response = await axios.post(`/api/products/add-promotion`, newPromotion);
            const result = response.data
            if (result.status === "error") {
                setError(result.message);
                return
            }

            alert(result.message)
            await dialogRef.current.close();
            await onReload()
        } catch (err) {
            setError("Internal server error")
        }


        setError("")
    }

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        // เปิด / ปิด dialog ตาม open prop
        if (open && !dialog.open) {
            dialog.showModal();
        }
        if (!open && dialog.open) {
            dialog.close();
        }

        // ฟัง event ปิด dialog แล้วเรียก onClose
        const handleClose = () => {
            clearFrom();
            onClose();
        }

        dialog.addEventListener('close', handleClose);

        return () => {
            dialog.removeEventListener('close', handleClose);
        }
    }, [open, onClose]);

    return (
        <>
            <dialog ref={dialogRef} id="update_promotion" className="modal">
                <div className="modal-box">
                    {error &&
                        <>
                            <div role="alert" className="alert alert-error w-full mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        </>
                    }
                    <form onSubmit={handleAddPromorion} className="flex flex-col items-center justify-center">
                        <h1 className="text-3xl mb-4">เพิ่มโปรโมชั่น</h1>
                        <div className="flex flex-col items-start justify-center w-full max-w-5/6 mb-4">
                            <label htmlFor="promotion_quantity" className="mb-2">จำนวนที่จะจัดโปรโมชั่น</label>
                            <input type="number" id="promotion_quantity" placeholder="quantity" className="input w-full" value={promotionQuantity} onChange={e => setPromotionQuantity(e.target.value)} required />
                        </div>
                        <div className="flex flex-col items-start justify-center w-full max-w-5/6 mb-4">
                            <label htmlFor="promotion_price" className="mb-2">ราคาโปรโมชั่น</label>
                            <input type="number" id="promotion_price" placeholder="price" className="input w-full" value={promotionPrice} onChange={e => setPromotionPrice(e.target.value)} required />
                        </div>
                        <div className="flex flex-col items-end justify-center w-full max-w-5/6 mb-4">
                            <button type="submit" className="btn btn-primary">บันทึกสินค้า</button>
                        </div>
                    </form>
                    <p className="text-sm">Press ESC key or click outside to close</p>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button onClick={onClose}>close</button>
                </form>
            </dialog>
        </>
    )
}

export default ModalUpdatePromotion