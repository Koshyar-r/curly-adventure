'use client'

import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
  useToast,
} from '@chakra-ui/react'
import { useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom'
import usePreviewImg from '../hooks/usePreviewImg'

export default function UpdateProfilePage() {

    const [user, setUser] = useRecoilState(userAtom)

    const [inputs, setInputs] = useState({
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        password: ""
    })

    const fileRef = useRef(null)

    const [updating, setUpdating] = useState(false)

    const {handleImageChange, imgUrl} = usePreviewImg()

    const toast = useToast()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(updating) return
        setUpdating(true)

        try {
            const res = await fetch(`/api/users/update/${user._id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ ...inputs, profilePic: imgUrl }),
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
                description: "Profile updated successfully",
                status: 'success',
                variant: 'left-accent',
                position: 'top',
                duration: 3000,
                isClosable: true,
            })
            
			setUser(data)
			localStorage.setItem("user", JSON.stringify(data))
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
        } finally {
            setUpdating(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <Flex align={'center'} justify={'center'} my={6}>
                <Stack spacing={4} w={'full'} maxW={'md'} bg={useColorModeValue('white', 'gray.dark')} rounded={'xl'} boxShadow={'lg'} p={6}>
                    <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
                        Edit Your Profile
                    </Heading>
                    <FormControl id="userName">
                    <Stack direction={['column', 'row']} spacing={6}>
                        <Center>
                            <Avatar size="xl" boxShadow={'md'} src={imgUrl || user.profilePic} />
                        </Center>
                        <Center w="full">
                            <Button w="full" onClick={() => fileRef.current.click()}>Change Avatar</Button>
                            <Input type="file" hidden ref={fileRef} onChange={handleImageChange} />
                        </Center>
                    </Stack>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Fullname</FormLabel>
                        <Input placeholder="fullname"
                        _placeholder={{ color: 'gray.500' }}
                        value={inputs.name}
                        onChange={(e) => setInputs({...inputs, name: e.target.value})}
                        type="text" />
                    </FormControl>
                    <FormControl>
                    <FormLabel>Username</FormLabel>
                    <Input
                        placeholder="username"
                        _placeholder={{ color: 'gray.500' }}
                        value={inputs.username}
                        onChange={(e) => setInputs({...inputs, username: e.target.value})}
                        type="text"
                    />
                    </FormControl>
                    <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input
                        placeholder="your-email@example.com"
                        _placeholder={{ color: 'gray.500' }}
                        value={inputs.email}
                        onChange={(e) => setInputs({...inputs, email: e.target.value})}
                        type="email"
                    />
                    </FormControl>
                    <FormControl>
                    <FormLabel>Bio</FormLabel>
                    <Input
                        placeholder="bio"
                        _placeholder={{ color: 'gray.500' }}
                        value={inputs.bio}
                        onChange={(e) => setInputs({...inputs, bio: e.target.value})}
                        type="text"
                    />
                    </FormControl>
                    <FormControl>
                    <FormLabel>Password</FormLabel>
                    <Input
                        placeholder="password"
                        _placeholder={{ color: 'gray.500' }}
                        value={inputs.password}
                        onChange={(e) => setInputs({...inputs, password: e.target.value})}
                        type="password"
                    />
                    </FormControl>
                    <Stack spacing={6} direction={['column', 'row']}>
                    <Button
                        bg={'red.400'}
                        color={'white'}
                        w="full"
                        _hover={{
                        bg: 'red.500',
                        }}>
                        Cancel
                    </Button>
                    <Button
                        bg={'green.400'}
                        color={'white'}
                        w="full"
                        _hover={{bg: 'green.500',}}
                        type='submit'
                        isLoading={updating}>
                        Confirm
                    </Button>
                    </Stack>
                </Stack>
            </Flex>
        </form>
    )
}