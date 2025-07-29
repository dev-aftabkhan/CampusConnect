// ✅ FIXED Chat.tsx with improved socket stability and message sending
import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Send } from "lucide-react"
import { getCommonChatUsers } from "@/api/user"
import { getChatMessages } from "@/api/chat"
import io, { Socket } from "socket.io-client"

interface ChatUser {
  id: string
  name: string
  avatar: string
  lastMessage: string
  timestamp: string
  isOnline: boolean
  unread: number
}

interface Message {
  id?: string
  sender?: string
  content: string
  timestamp: string
  isSent: boolean
  read?: boolean
}

const socketURL = import.meta.env.VITE_API_BASE_URL.replace("/api", "")

function formatDateLabel(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const oneDay = 24 * 60 * 60 * 1000

  if (diff < oneDay) return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  if (diff < 2 * oneDay) return "Yesterday"
  return date.toLocaleDateString()
}

export default function Chat() {
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([])
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const socketRef = useRef<Socket | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const token = localStorage.getItem("token")

  // ✅ Connect to socket only once
  useEffect(() => {
    if (!token) return

    const socket = io(socketURL, {
      auth: { token },
      transports: ["websocket"],
    })

    socketRef.current = socket

    socket.on("connect", () => {
      console.log("✅ Connected to socket:", socket.id)
    })

    socket.on("disconnect", (reason) => {
      console.warn("🔌 Socket disconnected:", reason)
    })

    socket.on("receive_message", (msg) => {
      if (!msg || !msg.sender) return
      console.log("📥 Message from:", msg.sender)

      if (msg.sender === selectedChat) {
        setMessages((prev) => [
          ...prev,
          {
            content: msg.text,
            timestamp: msg.createdAt,
            isSent: false,
            sender: msg.sender,
            read: msg.read,
          },
        ])
        socket.emit("mark_as_read", { from: selectedChat })
      } else {
        setChatUsers((prev) =>
          prev.map((user) =>
            user.id === msg.sender
              ? {
                ...user,
                unread: user.unread + 1,
                lastMessage: msg.text,
                timestamp: formatDateLabel(msg.createdAt),
              }
              : user
          )
        )
      }
    })

    socket.on("message_sent", (msg) => {
      setMessages((prev) => [
        ...prev,
        {
          content: msg.text,
          timestamp: msg.createdAt,
          isSent: true,
          read: true,
        },
      ])
    })

    return () => {
      socket.disconnect()
    }
  }, [token])

  // ✅ Load users
  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) return
      try {
        const data = await getCommonChatUsers(token)
        const users = data.map((u: any) => ({
          id: u.user_id,
          name: u.username,
          avatar: u.profilePicture,
          lastMessage: "Start a conversation",
          timestamp: "Now",
          isOnline: u.isOnline,
          unread: 0,
        }))
        setChatUsers(users)
      } catch (err) {
        console.error("Failed to load users:", err)
      }
    }
    fetchUsers()
  }, [token])

  // ✅ Load chat history
  useEffect(() => {
    const fetchMessages = async () => {
      if (!token || !selectedChat) return
      try {
        const data = await getChatMessages(selectedChat, token)
        const msgs = data.map((msg: any) => ({
          id: msg._id,
          sender: msg.sender,
          content: msg.text,
          timestamp: msg.createdAt,
          isSent: msg.sender !== selectedChat,
          read: msg.read,
        }))
        setMessages(msgs)
        setChatUsers((prev) =>
          prev.map((u) => (u.id === selectedChat ? { ...u, unread: 0 } : u))
        )
        socketRef.current?.emit("mark_as_read", { from: selectedChat })
      } catch (err) {
        console.error("Failed to load chat history:", err)
      }
    }
    fetchMessages()
  }, [selectedChat, token])

  // ✅ Auto scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])  

  // ✅ Send message
  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return
    const socket = socketRef.current
    if (!socket || !socket.connected) {
      console.warn("Socket not connected")
      return
    }
    socket.emit("send_message", {
      to: selectedChat,
      text: newMessage.trim(),
    })
    setNewMessage("")
  }

  const selectedUser = chatUsers.find((u) => u.id === selectedChat)

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* User List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" /> Messages
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <div className="space-y-1 p-4">
              {chatUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => setSelectedChat(user.id)}
                  className={`p-3 rounded-lg cursor-pointer transition ${selectedChat === user.id
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-muted/50"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {user.isOnline && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium truncate">{user.name}</h3>
                        <span className="text-xs text-muted-foreground">{user.timestamp}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                          {user.lastMessage}
                        </p>
                        {user.unread > 0 && (
                          <Badge className="ml-2 h-5 w-5 p-0 text-xs flex items-center justify-center rounded-full">
                          {user.unread}
                        </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat View */}
      <Card className="lg:col-span-2 flex flex-col">
        {selectedUser ? (
          <>
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedUser.avatar} />
                    <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {selectedUser.isOnline && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success border-2 border-white" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{selectedUser.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedUser.isOnline ? "Online" : "Last seen recently"}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 p-4 overflow-hidden">
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                    >
                      <div className="max-w-[70%] space-y-1 min-h-[80px]">
                        <div
                          className={`p-3 rounded-lg ${message.isSent ? "bg-primary text-white" : "bg-muted"
                            }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <p
                          className={`text-xs text-muted-foreground ${message.isSent ? "text-right" : "text-left"
                            }`}
                        >
                          {formatDateLabel(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={scrollRef} /> {/* 👈 scrolls into view automatically */}
                </div>
              </ScrollArea>

            </CardContent>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1"
                />
                <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <CardContent className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-2">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="font-medium">Select a conversation</h3>
              <p className="text-sm text-muted-foreground">Choose a chat to start messaging</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}