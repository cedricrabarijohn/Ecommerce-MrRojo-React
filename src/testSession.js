import { useNavigate } from "react-router-dom";

const useTestSession = () => {
    const navigate = useNavigate()
    const userId = localStorage.getItem("userId");
    if(!userId){
        navigate('/login')
        return
    }
    return
}
export default useTestSession