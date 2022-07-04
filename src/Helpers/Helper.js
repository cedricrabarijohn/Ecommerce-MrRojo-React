import { useNavigate } from "react-router-dom"

export const testSession = () => {
    return localStorage.getItem("userId") == null ? false : true
}