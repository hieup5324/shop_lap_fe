import { useEffect, useState, useRef } from 'react'
import { Input, Button, List, Avatar, message, Spin } from 'antd'
import { UserOutlined, SendOutlined } from '@ant-design/icons'
import io from 'socket.io-client'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useAppSelector } from '@/src/redux/hooks'
import { getCookie } from '@/src/utils/cookie'
import COOKIE_KEY from '@/src/shared/cookie-key'
import mainAxios from '@/src/libs/main-axios'
import { getLocalStorageItem } from '@/src/utils/local-storage'

interface Message {
  id: number
  content: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  is_read: boolean
  sender: {
    id: number
    first_name: string
    last_name: string
    photo_url: string | null
    role: string
  }
}

interface Room {
  id: number
  name: string
  is_active: boolean
  is_resolved: boolean
  customer_id: number
  createdAt: string
  updatedAt: string
  customer: {
    id: number
    first_name: string
    last_name: string
    photo_url: string | null
    role: string
  }
  messages: Message[]
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [socket, setSocket] = useState<any>(null)
  const [room, setRoom] = useState<Room | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const userInfo = useAppSelector(state => state.auth.userInfo)

  const handleSendMessage = () => {
    if (newMessage.trim() && socket && room) {
      socket.emit('message', {
        data: {
          room_id: room.id,
          content: newMessage.trim()
        }
      })
      setNewMessage('')
    }
  }

  useEffect(() => {
    const token = getCookie(COOKIE_KEY.TOKEN)
    if (!token) {
      message.error('Vui lòng đăng nhập để sử dụng chat')
      return
    }

    // Kết nối với server socket
    const newSocket = io('http://localhost:3001/chat', {
      path: '/socket.io',
      extraHeaders: {
        Authorization: `Bearer ${token}`
      }
    })

    setSocket(newSocket)

    // Lắng nghe tin nhắn mới
    newSocket.on('new_message', (message: Message) => {
      console.log('new_message', message)
      setMessages(prev => [...prev, message])
    })

    // Lắng nghe lịch sử chat
    newSocket.on('chat_history', (data: { messages: Message[] }) => {
      setMessages(data.messages)
      setIsLoading(false)
    })

    // Lấy hoặc tạo room chat
    const initializeChat = async () => {
      try {
        const rooms = await mainAxios.get(
          `http://localhost:3001/chat/rooms/user/${userInfo?.id}`
        )

        console.log('response', rooms)

        if (rooms && Array.isArray(rooms) && rooms.length > 0) {
          const existingRoom = rooms[0]
          console.log('existingRoom', existingRoom)
          setRoom(existingRoom)
          setMessages(existingRoom.messages || [])
          newSocket.emit('join_room', { data: { room_id: existingRoom.id } })
        } else {
          const { data: newRoom } = await mainAxios.post(
            'http://localhost:3001/chat/rooms',
            {
              customer_id: userInfo?.id,
              name: `Hỗ trợ đơn hàng #${Date.now()}`
            }
          )
          setRoom(newRoom)
          setMessages([])
          newSocket.emit('join_room', { data: { room_id: newRoom.id } })
        }
        setIsLoading(false)
      } catch (error) {
        console.error('Error initializing chat:', error)
        message.error('Không thể khởi tạo chat')
        setIsLoading(false)
      }
    }

    initializeChat()

    return () => {
      newSocket.disconnect()
    }
  }, [userInfo?.id])

  useEffect(() => {
    // Tự động cuộn xuống tin nhắn mới nhất
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (isLoading) {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div className="flex h-[600px] flex-col rounded-lg bg-white shadow-lg">
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold">Chat với hỗ trợ viên</h2>
        {room?.is_resolved && (
          <p className="mt-1 text-sm text-green-500">Đã giải quyết</p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <List
          dataSource={messages}
          renderItem={message => (
            <List.Item className="!px-0">
              <div
                className={`flex ${
                  message.sender.id === Number(userInfo?.id)
                    ? 'justify-end'
                    : 'justify-start'
                } w-full`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender.id === Number(userInfo?.id)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100'
                  }`}
                >
                  <div className="mb-1 flex items-center gap-2">
                    <Avatar icon={<UserOutlined />} />
                    <span className="font-medium">
                      {message.sender.id === Number(userInfo?.id)
                        ? 'Bạn'
                        : message.sender.id === 3
                        ? 'Admin'
                        : `${message.sender.first_name} ${message.sender.last_name}`}
                    </span>
                  </div>
                  <p className="mb-1">{message.content}</p>
                  <span className="text-xs opacity-70">
                    {format(new Date(message.createdAt), 'HH:mm dd/MM/yyyy', {
                      locale: vi
                    })}
                  </span>
                </div>
              </div>
            </List.Item>
          )}
        />
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onPressEnter={handleSendMessage}
            placeholder="Nhập tin nhắn..."
            className="flex-1"
            disabled={room?.is_resolved}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSendMessage}
            disabled={room?.is_resolved}
          >
            Gửi
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Chat
