import { useState, useEffect, useRef } from "react";
import axios from "axios";

const PayBill = ({ open, onClose, products, total_sales, total_profit, onReload }) => {

    const dialogRef = useRef(null)
    const amountReceviedRef = useRef(null);

    const [data, setData] = useState({
        products: products,
        total_sales: total_sales,
        total_profit: total_profit,
        amount_received: "",
        change_amount: null
    })
    const [error, setError] = useState(null)


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!data.amount_received) {
            setError("กรุณากรอกจำนวนเงินที่ได้รับ")
            return
        }

        try {
            const response = await axios.post(`/api/paybill`, data)
            const result = response.data;
            if (result.status === "error") {
                alert(result.message)
                return
            }
            alert(result.message)
            onReload();
        } catch (err) {
            setError("Internal server error")
        }
    }

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (open && !dialog.open) {
            dialog.showModal();
            setTimeout(() => {
                amountReceviedRef.current?.focus();
            }, 0);

        }
        if (!open && dialog.open) {
            dialog.close();
        }

        const handleClose = () => {
            onClose();
        }

        dialog.addEventListener('close', handleClose);

        return () => {
            dialog.removeEventListener('close', handleClose);
        }
    }, [open, onClose]);


    return (
        <>
            <dialog ref={dialogRef} id="paybill" className="modal">
                <div className="modal-box">
                    <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-2 w-full">
                        <h1 className="text-2xl font-bold">จ่ายเงิน</h1>
                        {error && (
                            <div className="gap-2 w-full max-w-4/6">
                                <div role="alert" className="alert alert-error">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{error}</span>
                                </div>
                            </div>
                        )}
                        <div className="flex flex-col justify-center items-center gap-2 w-full">
                            <input
                                type="number"
                                placeholder="Type here"
                                value={data.total_sales}
                                className="input w-full max-w-4/6"
                                disabled
                                required
                            />
                        </div>
                        <div className="flex flex-col justify-center items-center gap-2 w-full">
                            <input
                                ref={amountReceviedRef}
                                type="number"
                                placeholder="กรอกยอกเงินที่รับมา"
                                value={data.amount_received}
                                onChange={(e) => {
                                    setData({
                                        ...data,
                                        amount_received: e.target.value,
                                        change_amount: e.target.value - data.total_sales
                                    })
                                }}
                                className="input w-full max-w-4/6"
                                required
                            />
                        </div>
                        <div className="flex flex-col justify-center items-center gap-2 w-full">
                            <button type="submit" className="btn btn-primary">จ่ายเงิน</button>
                        </div>
                        {(data.change_amount != null) && (
                            <div className="flex flex-col justify-center items-center gap-2 w-full">
                                <p className="text-xl text-green-500">เงินทอน : {data.change_amount}</p>
                            </div>
                        )}
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    )
}

export default PayBill;