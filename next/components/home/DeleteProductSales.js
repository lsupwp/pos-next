const DeleteProductSales = ({ onDelete }) => {
    return (
        <div>
            <button 
                className="btn btn-warning"
                onClick={()=>{
                    if(confirm("ต้องการลบรายการสินค้าหรือไม่")) {
                        onDelete();
                    }
                }}
            >ลบรายการสินค้า</button>
        </div>
    )
}

export default DeleteProductSales;