import { useRef, useEffect, useState } from "react"
import axios from "axios"

const ModalAddPromotion = (props) => {
    const { productDetail, open, onClose , clearData} = props

    const dialogRef = useRef(null)

    const [havePromotion, setHavePromotion] = useState(false)
    const [promotionQuantity, setPromotionQuantity] = useState("")
    const [promotionPrice, setPromotionPrice] = useState("")
    const [error, setError] = useState("")

    const handleNotHavePromotion = async (e) => {
        e.preventDefault()
        if(!productDetail) return

        try{
            const response = await axios.post(`/api/products/add-product`, productDetail)
            if(response.data.status === "error"){
                setError(response.data.message)
                return
            }

            alert(response.data.message);
            clearData();
            dialogRef.current.close()
        }catch (err) {
            alert("Internal server error!")
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(!productDetail) return

        if(isNaN(promotionQuantity) || promotionQuantity <= 0){
            setError("จำนวนที่จะจัดโปรโมชั่นไม่ถูกต้อง")
            return
        }
        if(isNaN(promotionPrice) || promotionPrice <= 0){
            setError("ราคาที่จะจัดโปรโมชั่นไม่ถูกต้อง")
            return
        }

        setError("")
        const newProductDetail = {
            ...productDetail,
            promotion_quantity: promotionQuantity,
            promotion_price: promotionPrice
        }
        try{
            const response = await axios.post("/api/products/add-product", newProductDetail)
            if(response.data.status === "error"){
                setError(response.data.message)
                return
            }

            alert(response.data.message);
            clearData();
            dialogRef.current.close()
        }catch (err){
            alert("Internal server error!!")
        }
    }

    const clearForm = ()=>{
        setPromotionQuantity("")
        setPromotionPrice("")
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
            setHavePromotion(false)
            clearForm();
            onClose();
        }
    
        dialog.addEventListener('close', handleClose);
    
        return () => {
            dialog.removeEventListener('close', handleClose);
        }
    }, [open, onClose]);
    

    useEffect(()=>{
        if(!productDetail){
            setError("ไม่พบข้อมูลสินค้า")
            return
        }else{
            setError("")
        }
    }, [productDetail])

    return (
        <dialog ref={dialogRef} id="promotion" className="modal">
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
                <div className="flex flex-col items-center justify-center mb-7">
                    <h1 className="text-2xl mb-4">สินค้านี้มีโปรโมชั่นไหม</h1>
                    <div>
                        <button className="btn btn-error mr-4" onClick={handleNotHavePromotion}>ไม่มีโปรโมชั่น</button>
                        <button className="btn btn-success" onClick={() => setHavePromotion(true)}>มีโปรโมชั่น</button>
                    </div>
                </div>
                {havePromotion &&
                    <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center">
                        <div className="flex flex-col items-start justify-center w-full max-w-5/6 mb-4">
                            <label htmlFor="promotion_quantity" className="mb-2">จำนวนที่จะจัดโปรโมชั่น</label>
                            <input type="text" id="promotion_quantity" placeholder="quantity" value={promotionQuantity} onChange={e => setPromotionQuantity(e.target.value)} className="input w-full" required />
                        </div>
                        <div className="flex flex-col items-start justify-center w-full max-w-5/6 mb-4">
                            <label htmlFor="promotion_price" className="mb-2">ราคาโปรโมชั่น</label>
                            <input type="text" id="promotion_price" placeholder="price" value={promotionPrice} onChange={e => setPromotionPrice(e.target.value)} className="input w-full" required />
                        </div>
                        <div className="flex flex-col items-end justify-center w-full max-w-5/6 mb-4">
                            <button type="submit" className="btn btn-primary">บันทึกสินค้า</button>
                        </div>
                    </form>
                }
                <p className="text-sm">Press ESC key or click outside to close</p>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={onClose}>close</button>
            </form>
        </dialog>
    )
}

export default ModalAddPromotion