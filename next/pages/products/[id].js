import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

import Navbar from "@/components/Navbar";
import ModalUpdatePromotion from "@/components/products/ModalUpdatePromotion";
import ModalSure from "@/components/products/ModalSure";
import Loading from "@/components/Loading";

const isNonEmpty = (value) => typeof value === 'string' && value.trim() !== "";

const parsePositiveNumber = (value) => {
    const num = Number(value);
    return !isNaN(num) && num > 0 ? num : null;
};

const validateMainDetails = (product) => {
    return (
        isNonEmpty(product.barcode) &&
        isNonEmpty(product.name) &&
        parsePositiveNumber(product.price) !== null &&
        parsePositiveNumber(product.cost) !== null &&
        parsePositiveNumber(product.quantity) !== null &&
        (!isNaN(product.saled_quantity) && product.saled_quantity >= 0 ? product.saled_quantity : null) !== null
    );
};

const validatePromotionDetails = (product) => {
    return (
        parsePositiveNumber(product.promotion_price) !== null &&
        parsePositiveNumber(product.promotion_quantity) !== null
    );
};

const hasMainDetailsChanged = (product, originalProduct) => {
    return (
        product.barcode !== originalProduct.barcode ||
        product.name !== originalProduct.name ||
        product.price !== originalProduct.price ||
        product.cost !== originalProduct.cost ||
        product.quantity !== originalProduct.quantity ||
        product.saled_quantity !== originalProduct.saled_quantity
    );
};

const hasPromotionDetailsChanged = (product, originalProduct) => {
    return (
        product.promotion_price !== originalProduct.promotion_price ||
        product.promotion_quantity !== originalProduct.promotion_quantity
    );
};


const ProductDetail = () => {
    const router = useRouter();
    const { id } = router.query;

    if(router.isFallback){
        return <Loading/>
    }

    const [productDetail, setProductDetail] = useState({
        barcode: "",
        name: "",
        price: "",
        cost: "",
        quantity: "",
        saled_quantity: "",
        promotion_price: "",
        promotion_quantity: ""
    });

    const [originalDetail, setOriginalDetail] = useState(null);
    const [error, setError] = useState("");
    const [isShowModal, setIsShowModal] = useState(false);
    const [visibleAreYouSure, setVisibleAreYouSure] = useState(false)

    const deletePromotion = async () => {
        if (!productDetail.barcode) return

        try {
            const response = await axios.post(`/api/products/delete-promotion`, { barcode: productDetail.barcode })
            const result = response.data;
            if (result.status === "error") {
                setError(result.message);
                return;
            }

            setError("")
            window.location.reload(true);
        } catch (err) {
            setError("Internal server error")
        }

    }

    const updateProduct = async (e) => {
        e.preventDefault();

        if (!originalDetail) return;

        if (hasMainDetailsChanged(productDetail, originalDetail) && hasPromotionDetailsChanged(productDetail, originalDetail)) {
            if (!validatePromotionDetails(productDetail)) {
                setError("ข้อมูลโปรโมชั่นไม่ถูกต้อง")
                return;
            }
            if (!validateMainDetails(productDetail)) {
                setError("ข้อมูลสินค้าไม่ถูกต้อง")
                return;
            }
            try {
                const response = await axios.post(`/api/products/update-product-promotion`, { ...productDetail })
                const result = response.data;
                if (result.status === "error") {
                    setError(result.message);
                    return;
                }
                setError("")
                window.location.reload(true);
                return;
            } catch (err) {
                setError("Internal server error")
                return;
            }
        } else if (hasMainDetailsChanged(productDetail, originalDetail)) {
            if (!validateMainDetails(productDetail)) {
                setError("ข้อมูลสินค้าไม่ถูกต้อง")
                return
            }
            try {
                const response = await axios.post(`/api/products/update-product`, productDetail)
                const result = response.data;
                if (result.status === "error") {
                    setError(result.message);
                    return;
                }
                setError("")
                window.location.reload(true);
                return;
            } catch (err) {
                setError("Internal server error")
                return;
            }
        } else if (hasPromotionDetailsChanged(productDetail, originalDetail)) {
            if (!validatePromotionDetails(productDetail)) {
                setError("ข้อมูลสินค้าไม่ถูกต้อง")
                return
            }
            try {
                const response = await axios.post(`/api/products/update-promotion`, { barcode: productDetail.barcode, quantity: productDetail.promotion_quantity, price: productDetail.promotion_price })
                const result = response.data;
                if (result.status === "error") {
                    setError(result.message);
                    return;
                }
                setError("")
                window.location.reload(true);
                return;
            } catch (err) {
                setError("Internal server error")
                return;
            }
        } else {
            return;
        }
    }

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`/api/products/get-detail-product?id=${id}`)
                const result = response.data.product?.[0];
                if (!result) {
                    setError("Product not found");
                    return;
                }
                setError("")
                setProductDetail(result);
                setOriginalDetail({ ...result });
            } catch (err) {
                setError("Internal server error")
            }
        }

        fetchProducts()
    }, [id])

    const normalize = (obj = {}) => {
        return Object.keys(obj).reduce((acc, key) => {
            acc[key] = (obj[key] ?? '').toString().trim();
            return acc;
        }, {});
    };

    const isEdited = originalDetail && JSON.stringify(normalize(productDetail)) !== JSON.stringify(normalize(originalDetail));


    return (
        <>
            <Navbar />
            <div className="flex flex-col items-center justify-center h-screen w-full">
                <h1 className="text-3xl font-bold mb-4">รายละเอียดสินค้า</h1>
                <form onSubmit={updateProduct} className="flex flex-col items-center justify-center w-full">
                    {error &&
                        <div role="alert" className="alert alert-error w-full max-w-3/6 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    }
                    <div className="flex flex-col items-start justify-center w-full max-w-3/6 mb-4">
                        <label htmlFor="barcode" className="mb-2">บาร์โค้ด</label>
                        <input
                            type="text"
                            id="barcode"
                            placeholder="Barcode"
                            className="input w-full"
                            value={productDetail.barcode}
                            onChange={e => setProductDetail(prev => ({ ...prev, barcode: e.target.value }))}
                            required
                            disabled
                        />
                    </div>
                    <div className="flex flex-col items-start justify-center w-full max-w-3/6 mb-4">
                        <label htmlFor="name" className="mb-2">ชื่อสินค้า</label>
                        <input
                            type="text"
                            id="name"
                            placeholder="name"
                            className="input w-full"
                            value={productDetail.name}
                            onChange={e => setProductDetail(prev => ({ ...prev, name: e.target.value }))}
                            required
                        />
                    </div>
                    <div className="flex flex-col items-start justify-center w-full max-w-3/6 mb-4">
                        <label htmlFor="price" className="mb-2">ราคาขายสินค้า</label>
                        <input
                            type="text"
                            id="price"
                            placeholder="price"
                            className="input w-full"
                            value={productDetail.price}
                            onChange={e => setProductDetail(prev => ({ ...prev, price: e.target.value }))}
                            required
                        />
                    </div>
                    <div className="flex flex-col items-start justify-center w-full max-w-3/6 mb-4">
                        <label htmlFor="cost" className="mb-2">ต้นทุนต่อหน่วยของสินค้า</label>
                        <input
                            type="text"
                            id="cost"
                            placeholder="cost"
                            className="input w-full"
                            value={productDetail.cost}
                            onChange={e => setProductDetail(prev => ({ ...prev, cost: e.target.value }))}
                            required
                        />
                    </div>
                    <div className="flex flex-col items-start justify-center w-full max-w-3/6 mb-4">
                        <label htmlFor="quantity" className="mb-2">สินค้าคงเหลือ</label>
                        <input
                            type="text"
                            id="quantity"
                            placeholder="quantity"
                            className="input w-full"
                            value={productDetail.quantity}
                            onChange={e => setProductDetail(prev => ({ ...prev, quantity: e.target.value }))}
                            required
                        />
                    </div>
                    <div className="flex flex-col items-start justify-center w-full max-w-3/6 mb-4">
                        <label htmlFor="saled_quantity" className="mb-2">สินค้าที่ขายไปแล้ว</label>
                        <input
                            type="text"
                            id="saled_quantity"
                            placeholder="saled_quantity"
                            className="input w-full"
                            value={productDetail.saled_quantity}
                            onChange={e => setProductDetail(prev => ({ ...prev, saled_quantity: e.target.value }))}
                            required
                        />
                    </div>
                    {originalDetail && originalDetail.promotion_quantity && originalDetail.promotion_price ?

                        <>
                            <div className="flex flex-col items-start justify-center w-full max-w-3/6 mb-4">
                                <label htmlFor="quantity" className="mb-2">จำนวนสินค้าที่จัดโปรโมชั่น</label>
                                <input
                                    type="text"
                                    id="quantity"
                                    placeholder="quantity"
                                    className="input w-full"
                                    value={productDetail.promotion_quantity}
                                    onChange={e => setProductDetail(prev => ({ ...prev, promotion_quantity: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="flex flex-col items-start justify-center w-full max-w-3/6 mb-4">
                                <label htmlFor="quantity" className="mb-2">ราคาโปรโมชั่นสินค้า</label>
                                <input
                                    type="text"
                                    id="quantity"
                                    placeholder="quantity"
                                    className="input w-full"
                                    value={productDetail.promotion_price}
                                    onChange={e => setProductDetail(prev => ({ ...prev, promotion_price: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="flex justify-center items-center">
                            <h1>ต้องการลบโปรโมชั่นไหม ลบโปรโมชั่น =&gt;</h1>
                            <p onClick={() => setVisibleAreYouSure(true)} className="text-red-500 underline cursor-pointer">กดที่นี่</p>
                            </div>
                        </> :

                        <>
                        <div className="flex justify-center items-center">
                        <h1>สินค้านี้ยังไม่มีโปรโมชั่น เพิ่มโปรโมชั่น =&gt; </h1>
                        <p onClick={() => setIsShowModal(true)} className="text-blue-500 underline cursor-pointer">กดที่นี่</p>
                        </div>
                        </>}
                    <div className="flex flex-col items-end justify-center w-full max-w-3/6 mb-4">
                        <button type="submit" className="btn btn-primary" disabled={!originalDetail || !isEdited}>แก้ไขสินค้า</button>
                    </div>
                </form>
                {isShowModal && <ModalUpdatePromotion barcode={productDetail.barcode} open={isShowModal} onClose={() => setIsShowModal(false)} onReload={() => (window.location.reload(true))} />}
                {visibleAreYouSure && <ModalSure open={visibleAreYouSure} onClose={() => { setVisibleAreYouSure(false) }} onDelete={() => deletePromotion()} />}
            </div>
        </>
    )
}

export default ProductDetail