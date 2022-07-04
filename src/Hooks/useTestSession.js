import { useNavigate } from "react-router-dom"

const useTestSession = () => {
    const navigate = useNavigate()
    const test = localStorage.getItem("userId") == null ? false : true;
    if(!test){
        navigate("/login")
    }
    return
}

export default useTestSession