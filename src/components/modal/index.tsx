import {
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Modal,
    Text,
    Button,
    Flex
} from '@chakra-ui/react'


import { FiUser, FiScissors } from 'react-icons/fi'
import { FaMoneyBillAlt } from 'react-icons/fa'
import { ScheduleItem } from '../../pages/dashboard'

interface ModalInfoProp {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    data: ScheduleItem;
    finishService: () => Promise<void>;
}

export function ModalInfo({ isOpen, onOpen, onClose, data, finishService }: ModalInfoProp) {

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent bg={"barber.400"}>
                <ModalHeader>Próximo</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    
                    <Flex align={"center"} mb={3}>
                        <FiUser size={28} color="#ffb13e" />
                        <Text ml={3} fontWeight={"bold"} fontSize={"large"}>{data?.customer}</Text>
                    </Flex>

                    <Flex align={"center"} mb={3}>
                        <FiScissors size={28} color="#fff" />
                        <Text ml={3} fontWeight={"bold"} fontSize={"large"}>{data?.haircut?.name}</Text>
                    </Flex>

                    <Flex align={"center"} mb={3}>
                        <FaMoneyBillAlt size={28} color="#46ef75" />
                        <Text ml={3} fontWeight={"bold"} fontSize={"large"}>R$ {data?.haircut?.price}</Text>
                    </Flex>

                    <ModalFooter>
                        <Button
                            bg={"button.cta"}
                            color={"#fff"}
                            mb={3}
                            _hover={{ bg: "orange.500", color: "#000" }}
                            onClick={() => finishService()}
                        >
                            Finalizar Serviço
                        </Button>
                    </ModalFooter>

                </ModalBody>

            </ModalContent>
        </Modal>
    )
}