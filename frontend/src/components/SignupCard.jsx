'use client'

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  useToast,
} from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useRecoilState, useSetRecoilState } from 'recoil'
import authScreenAtom from '../atoms/authAtom'
import userAtom from '../atoms/userAtom'

export default function SignupCard() {
  const [showPassword, setShowPassword] = useState(false)

  const setAuthScreen = useSetRecoilState(authScreenAtom)

  const setUser = useSetRecoilState(userAtom)

  const [inputs, setInputs] = useState({
    name: "",
    username: "",
    email: "",
    password: ""
  })

  const toast = useToast()

  const handleSignup = async () => {
    try {
        const res = await fetch("/api/users/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
        body: JSON.stringify(inputs)
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
        return
      }

      localStorage.setItem("user", JSON.stringify(data))
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
    }
  }

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Sign up
          </Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            to enjoy all of our cool features ✌️
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.dark')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl isRequired>
                  <FormLabel>Full Name</FormLabel>
                  <Input type="text"
                  onChange={(e) => setInputs({...inputs, name: e.target.value})}
                  value={inputs.name} />
                </FormControl>
              </Box>
              <Box>
                <FormControl isRequired>
                  <FormLabel>Username</FormLabel>
                  <Input type="text"
                  onChange={(e) => setInputs({...inputs, username: e.target.value})}
                  value={inputs.username} />
                </FormControl>
              </Box>
            </HStack>
            <FormControl isRequired>
              <FormLabel>Email address</FormLabel>
              <Input type="email"
              onChange={(e) => setInputs({...inputs, email: e.target.value})}
              value={inputs.email} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input type={showPassword ? 'text' : 'password'}
                onChange={(e) => setInputs({...inputs, password: e.target.value})}
                value={inputs.password} />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={useColorModeValue("gray.600", "gray.700")}
                color={'white'}
                onClick={handleSignup}
                _hover={{
                  bg: useColorModeValue("gray.700", "gray.800"),
                }}>
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Already a user? <Link onClick={() => setAuthScreen("login")} color={'blue.400'}>Login</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}