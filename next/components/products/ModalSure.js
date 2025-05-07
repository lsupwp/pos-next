import { useEffect, useRef } from "react"

const ModalSure = (props) => {

    const { open, onClose, onDelete } = props

    const dialogRef = useRef(null)


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
            onClose();
        }

        dialog.addEventListener('close', handleClose);

        return () => {
            dialog.removeEventListener('close', handleClose);
        }
    }, [open, onClose]);
    return (
        <>
            <dialog ref={dialogRef} id="sure_modal" className="modal">
                <div className="modal-box">
                    <div className="flex items-center justify-center w-full">
                        <h1 className="font-bold text-3xl mb-4">ต้องการลบโปรโมชั่นใช่หรือไม่!</h1>
                    </div>
                    <div className="flex items-center justify-end w-full">
                        <button onClick={()=>onDelete()} className="btn btn-error w-36">ใช่</button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    )
}

export default ModalSure