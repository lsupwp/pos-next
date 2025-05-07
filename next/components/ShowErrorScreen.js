const ShowErrorScreen = ({text})=>{
    return(
        <>
            <div className="flex flex-col items-center justify-center h-screen w-full">
                <h1 className="text-xl">{text}</h1>
            </div>
        </>
    )

}

export default ShowErrorScreen