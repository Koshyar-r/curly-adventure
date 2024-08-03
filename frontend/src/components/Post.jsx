import { Box, Flex, Image, Text, useToast, Avatar, Menu, MenuButton, MenuItem, MenuList, Portal, Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { DeleteIcon } from '@chakra-ui/icons';
import { BsThreeDots } from "react-icons/bs";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from 'date-fns';
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import Actions from "./Actions";
import postsAtom from "../atoms/postsAtom";

const Post = ({ post, postedBy }) => {
    const [user, setUser] = useState(null)
    const [postIdToDelete, setPostIdToDelete] = useState(null)

    const toast = useToast()
    const currentUser = useRecoilValue(userAtom)
    const [posts, setPosts] = useRecoilState(postsAtom)
    const navigate = useNavigate()

    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch("/api/users/profile/" + postedBy)
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
                setUser(data)
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
                setUser(null)
            }
        }

        getUser()
    }, [postedBy])

    const handleDeleteClick = (e) => {
        e.preventDefault()
        setPostIdToDelete(post._id)
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
            setPosts(posts.filter((p) => p._id !== post._id))
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

    if (!user) return null

    return (
        <Link to={`/${user.username}/post/${post._id}`}>
            <Flex gap={3} mb={4} py={5}>
                <Flex flexDirection={'column'} alignItems={'center'}>
                    <Avatar size='md' name={user.name} src={user?.profilePic} onClick={(e) => {
                        e.preventDefault()
                        navigate(`/${user.username}`)
                    }} />
                    <Box w={'1px'} h={'full'} bg={'gray.light'} my={2}></Box>
                    <Box position={'relative'} w={'full'}>
                        {post.replies.length === 0 && ''}

                        {post.replies[0] && (
                            <Avatar
                                size={'xs'}
                                name="John Doe"
                                src={post.replies[0].userProfilePic}
                                position={'absolute'}
                                top={'0px'}
                                left={'15px'}
                                padding={'2px'} />
                        )}

                        {post.replies[1] && (
                            <Avatar
                                size={'xs'}
                                name="John Doe"
                                src={post.replies[1].userProfilePic}
                                position={'absolute'}
                                top={'0px'}
                                left={'15px'}
                                padding={'2px'} />
                        )}

                        {post.replies[2] && (
                            <Avatar
                                size={'xs'}
                                name="John Doe"
                                src={post.replies[2].userProfilePic}
                                position={'absolute'}
                                top={'0px'}
                                left={'15px'}
                                padding={'2px'} />
                        )}
                    </Box>
                </Flex>

                <Flex flex={1} flexDirection={'column'} gap={2}>
                    <Flex justifyContent={'space-between'} w={'full'}>
                        <Flex w={'full'} alignItems={'center'}>
                            <Text fontSize={'sm'} fontWeight={'bold'} onClick={(e) => {
                                e.preventDefault()
                                navigate(`/${user.username}`)
                            }}>{user?.username}</Text>
                            <Image src="/verified.png" w={4} h={4} ml={1} />
                        </Flex>
                        <Flex gap={4} alignItems={'center'}>
                            <Text fontSize={"sm"} width={36} textAlign={'right'} color={"gray.light"}>
                                {formatDistanceToNow(new Date(post.createdAt))} ago
                            </Text>

                            {currentUser?._id === user._id && (
                                <DeleteIcon size={20} cursor={'pointer'} onClick={handleDeleteClick} />
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

                    <Text fontSize={'sm'}>{post.text}</Text>

                    {post.img && (
                        <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
                            <Image src={post.img} w={"full"} />
                        </Box>
                    )}

                    <Flex gap={3} my={1}>
                        <Actions post={post} />
                    </Flex>
                </Flex>
            </Flex>

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
        </Link>
    )
}

export default Post