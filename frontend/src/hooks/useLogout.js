import { useToast } from "@chakra-ui/react"
import { useSetRecoilState } from "recoil"
import userAtom from "../atoms/userAtom"

const useLogout = () => {

    const setUser = useSetRecoilState(userAtom)
    const toast = useToast()

    const Logout = async () => {
        try {
            
            const res = await fetch("/api/users/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            const data = await res.json()

            if(data.error) {
                toast({
                    title: 'Error',
                    description: data.error,
                    status: 'error',
                    variant: 'left-accent',
                    position: 'top',
                    duration: 3000,
                    isClosable: true,
                })
            }

            localStorage.removeItem('user')
            setUser(null)
        } catch (error) {
            toast({
                title: 'Error',
                description: error,
                status: 'error',
                variant: 'left-accent',
                position: 'top',
                duration: 3000,
                isClosable: true,
            })
        }
    }

    return Logout
}

export default useLogout