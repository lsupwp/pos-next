const DeleteProduct = ({ name, onDelete }) => {
    return (
        <>
            <button
                className="btn btn-error"
                onClick={() => {
                    if (confirm("ต้องการลบสินค้า " + name + " หรือไม่")) {
                        onDelete();
                    }
                }}>ลบสินค้า</button>
        </>
    )
}


export default DeleteProduct;