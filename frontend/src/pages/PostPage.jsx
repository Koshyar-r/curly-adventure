import { Avatar, Box, Button, Divider, Flex, Image, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Portal, Spinner, Text, useDisclosure, useToast } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { BsThreeDots } from "react-icons/bs"
import Comment from "../components/Comment"
import Actions from "../components/Actions"
import useGetUserProfile from "../hooks/useGetUserProfile"
import { useNavigate, useParams } from "react-router-dom"
import { formatDistanceToNow } from "date-fns"
import { useRecoilState, useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom"
import { DeleteIcon } from "@chakra-ui/icons"
import postsAtom from "../atoms/postsAtom"

const PostPage = () => {    

    const {user, loading} = useGetUserProfile()
    const [posts, setPosts] = useRecoilState(postsAtom)
    const [postIdToDelete, setPostIdToDelete] = useState(null)
    const toast = useToast()
    const {postId} = useParams()
    const currentUser = useRecoilValue(userAtom)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const navigate = useNavigate()

    const currentPost = posts[0]

    useEffect(() => {
        const getPost = async () => {
            try {
                const res = await fetch(`/api/posts/${postId}`)
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
                setPosts([data])
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
            }
        }

        getPost()
    }, [postId, setPosts])

    const handleDeleteClick = (e) => {
        e.preventDefault()
        setPostIdToDelete(currentPost._id)
        onOpen()
    }

    const handleDeletePost = async () => {
        try {
            const res = await fetch(`/api/posts/${postIdToDelete}`, {
                method: "DELETE",
            })

            const data = await res.json()
            if (data.error) {
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
            toast({
                title: 'Success',
                description: "Post deleted",
                status: 'success',
                variant: 'left-accent',
                position: 'top',
                duration: 3000,
                isClosable: true,
            })
            navigate(`/${user.username}`)
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
            onClose()
        }
    }

    if (!user && loading) {
		return (
			<Flex justifyContent={"center"}>
				<Spinner size={"xl"} />
			</Flex>
		)
	}

    if(!currentPost) return null

    return (
        <>
            <Flex>
                <Flex w={'full'} alignItems={'center'} gap={3}>
                    <Avatar src={user.profilePic} size={'md'} name="Mark Fuckerberg" />
                    <Flex>
                        <Text fontSize={'sm'} fontWeight={'bold'}>{user.username}</Text>
                        <Image src="/verified.png" w={4} h={4} ml={4} />
                    </Flex>
                </Flex>

                <Flex gap={4} alignItems={'center'}>
                        <Text fontSize={"sm"} width={36} textAlign={'right'} color={"gray.light"}>
                            {formatDistanceToNow(new Date(currentPost.createdAt))} ago
                        </Text>

                        {currentUser?._id === user._id && (
                            <DeleteIcon size={20} onClick={handleDeleteClick} />
                        )}
                        <Menu>
                            <MenuButton>
                                <BsThreeDots size={24} cursor={'pointer'} />
                            </MenuButton>
                            <Portal>
                                <MenuList>
                                    <MenuItem>nothing</MenuItem>
                                </MenuList>
                            </Portal>
                        </Menu>
                </Flex>
            </Flex>

            <Text my={3}>{currentPost.text}</Text>
            
            {currentPost.img && (
                <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
                    <Image src={currentPost.img} w={"full"} />
                </Box>
            )}

            <Flex gap={3} my={3}>
                <Actions post={currentPost} />
            </Flex>

            <Divider my={4} />

            <Flex justifyContent={"space-between"}>
				<Flex gap={2} alignItems={"center"}>
					<Text fontSize={"2xl"}>👋</Text>
					<Text color={"gray.light"}>Remember to keep your comments respectful.</Text>
				</Flex>
			</Flex>

            <Divider my={4} />

            {currentPost.replies.map(reply => (
                <Comment key={reply._id} reply={reply} lastReply={reply._id === currentPost.replies[currentPost.replies.length - 1]._id} />
            ))}
            
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirmation</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <p>Are you sure you want to delete this post?</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button mr={2} colorScheme="green" onClick={handleDeletePost}>
                            Confirm
                        </Button>
                        <Button colorScheme="red" onClick={onClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default PostPage