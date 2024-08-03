import { useEffect, useState } from "react"
import UserHeader from "../components/UserHeader"
import { useParams } from "react-router-dom"
import { Flex, Heading, Spinner, useToast } from "@chakra-ui/react"
import Post from '../components/Post'
import useGetUserProfile from "../hooks/useGetUserProfile"
import { useRecoilState } from "recoil"
import postsAtom from "../atoms/postsAtom"

const UserPage = () => {

    const {user, loading} = useGetUserProfile()
    const [posts, setPosts] = useRecoilState(postsAtom)
    const [fetchingPosts, setFetchingPosts] = useState(true)
    const toast = useToast()
    const {username} = useParams()

    useEffect(() => {
        const getPosts = async () => {
            setFetchingPosts(true)
            try {
                const res = await fetch(`/api/posts/user/${username}`)
                const data = await res.json()
                setPosts(data)
            } catch (error) {
                toast({
                    title: 'Error',
                    description: error.message,
                    status: 'error',
                    variant: 'left-accent',
                    position: 'top',
                    duration: 3000,
                    isClosable: true,
                })
            } finally {
                setFetchingPosts(false)
            }
        }

        getPosts()
    }, [username, setPosts])

    if(!user && loading) {
        return (
            <Flex justifyContent={'center'}>
                <Spinner size={"xl"} />
            </Flex>
        )
    }

    if(!user && !loading) return <h1>User not found</h1>

    return (
        <>
            <UserHeader user={user} />
            {!fetchingPosts && posts.length === 0 && <Heading mt={6} textAlign='center' as='h4' size='md'>No posts yet</Heading>}
            {fetchingPosts && (
                <Flex justifyContent={'center'} my={12}>
                    <Spinner size={'xl'} />
                </Flex>
            )}

            {posts.map((post) => (
                <Post key={post._id} post={post} postedBy={post.postedBy} />
            ))}
        </>
    )
}

export default UserPage