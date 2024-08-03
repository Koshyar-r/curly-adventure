import React, { useEffect, useState } from 'react'
import { Box, Flex, Spinner, useToast } from '@chakra-ui/react'
import Post from '../components/Post'
import { useRecoilState } from 'recoil'
import postsAtom from '../atoms/postsAtom'
import SuggestedUsers from '../components/SuggestedUsers'

const HomePage = () => {

    const [posts, setPosts] = useRecoilState(postsAtom)
    const [loading, setLoading] = useState(true)
    const toast = useToast()

    useEffect(() => {
        const getFeedPosts = async () => {
            setLoading(true)
            setPosts([])
            try {
                const res = await fetch("/api/posts/feed")
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
                    return
                }
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
                setLoading(false)
            }
        }

        getFeedPosts()
    }, [setPosts])

    return (
        <Flex gap={10} alignItems={'flex-start'}>
            <Box flex={70}>
                {!loading && posts.length === 0 && <h1>You are not following anyone</h1>}

                {loading && (
                    <Flex justify={'center'}>
                        <Spinner size={'xl'} />
                    </Flex>
                )}

                {posts.map((post) => (
                    <Post key={post._id} post={post} postedBy={post.postedBy} />
                ))}
            </Box>

            <Box flex={30} display={{
                base: "none",
                md: "block"
            }}>
                <SuggestedUsers />
            </Box>
        </Flex>
    )
}

export default HomePage