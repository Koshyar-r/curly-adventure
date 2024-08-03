import { Box, Flex, Image, Text } from "@chakra-ui/react"
import { Link } from "react-router-dom"
import { Avatar, Menu, MenuButton, MenuItem, MenuList, Portal } from "@chakra-ui/react"
import { BsThreeDots } from "react-icons/bs"
import { useState } from "react"
// import Actions from "./Actions"

const UserPost = ({ postImg, postTitle, likes, replies }) => {

    const [liked, setLiked] = useState(false)

    return (
        <Flex gap={3} mb={4} py={5}>
            <Flex flexDirection={'column'} alignItems={'center'}>
                <Avatar size='md' name='Mark Fuckerberg' src='/zuck-avatar.png' />
                <Box w={'1px'} h={'full'} bg={'gray.light'} my={2}></Box>
                <Box position={'relative'} w={'full'}>
                    <Avatar
                        size={'xs'}
                        name="John Doe"
                        src="https://bit.ly/dan-abramov"
                        position={'absolute'}
                        top={'0px'}
                        left={'15px'}
                        padding={'2px'} />

                    <Avatar
                        size={'xs'}
                        name="John Doe"
                        src="https://bit.ly/sage-adebayo"
                        position={'absolute'}
                        top={'0px'}
                        left={'25px'}
                        padding={'2px'} />

                    <Avatar
                        size={'xs'}
                        name="John Doe"
                        src="https://bit.ly/prosper-baba"
                        position={'absolute'}
                        top={'0px'}
                        left={'35px'}
                        padding={'2px'} />
                </Box>
            </Flex>

            <Flex flex={1} flexDirection={'column'} gap={2}>
                <Flex justifyContent={'space-between'} w={'full'}>
                    <Flex w={'full'} alignItems={'center'}>
                        <Text fontSize={'sm'} fontWeight={'bold'}>markfuckerberg</Text>
                        <Image src="/verified.png" w={4} h={4} ml={1} />
                    </Flex>
                    <Flex gap={4} alignItems={'center'}>
                        <Text fontStyle={"sm"} color={"gray.light"}>1d</Text>
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

                <Text fontSize={'sm'}>{postTitle}</Text>
                <Link to={"/markfuckerberg/post/1"}>
                    {postImg && (
                        <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
                            <Image src={postImg} w={"full"} />
                        </Box>
                    )}
                </Link>

                <Flex gap={3} my={1}>
                    {/* <Actions liked={liked} setLiked={setLiked} /> */}
                </Flex>

                <Flex gap={2} alignItems={'center'}>
                    <Text color={'gray.light'} fontSize={'sm'}>{replies} replies</Text>
                    <Box w={0.5} h={0.5} borderRadius={'full'} bg={'gray.light'}></Box>
                    <Text color={"gray.light"} fontSize='sm'>{likes} likes</Text>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default UserPost