import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Send, Users, Search, Plus } from "lucide-react"

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
  id: string
  content: string
  timestamp: string
  isSent: boolean
}

export default function Chat() {
  const [selectedChat, setSelectedChat] = useState<string | null>("1")
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const chatUsers: ChatUser[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      avatar: "/placeholder.svg",
      lastMessage: "Hey! Are you free for the study session tomorrow?",
      timestamp: "2m ago",
      isOnline: true,
      unread: 2
    },
    {
      id: "2",
      name: "Mike Rodriguez",
      avatar: "/placeholder.svg",
      lastMessage: "Thanks for sharing those notes!",
      timestamp: "1h ago",
      isOnline: false,
      unread: 0
    },
    {
      id: "3",
      name: "CS Study Group",
      avatar: "/placeholder.svg",
      lastMessage: "Alex: The assignment is due next week",
      timestamp: "3h ago",
      isOnline: true,
      unread: 5
    },
    {
      id: "4",
      name: "Emma Wilson",
      avatar: "/placeholder.svg",
      lastMessage: "See you at the library!",
      timestamp: "1d ago",
      isOnline: false,
      unread: 0
    }
  ]

  const messages: Message[] = [
    {
      id: "1",
      content: "Hey! How's your project coming along?",
      timestamp: "10:30 AM",
      isSent: false
    },
    {
      id: "2",
      content: "Pretty good! Just finished the ML model training. How about yours?",
      timestamp: "10:32 AM",
      isSent: true
    },
    {
      id: "3",
      content: "That's awesome! I'm still debugging my neural network 😅",
      timestamp: "10:35 AM",
      isSent: false
    },
    {
      id: "4",
      content: "Haha, I feel you! Want to work together tomorrow? We could meet at the library",
      timestamp: "10:36 AM",
      isSent: true
    },
    {
      id: "5",
      content: "Hey! Are you free for the study session tomorrow?",
      timestamp: "2m ago",
      isSent: false
    }
  ]

  const sendMessage = () => {
    if (!newMessage.trim()) return
    // Here you would typically send the message to your backend
    setNewMessage("")
  }

  const selectedUser = chatUsers.find(user => user.id === selectedChat)

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-200px)] grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chat List */}
      <Card className="lg:col-span-1">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <span>Messages</span>
            </CardTitle>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="h-[400px]">
            <div className="space-y-1 p-4">
              {chatUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => setSelectedChat(user.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedChat === user.id
                      ? 'bg-primary/10 border border-primary/20'
                      : 'hover:bg-muted/50'
                    }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {user.isOnline && (
                        <div className="absolute -bottom-0 -right-0 h-3 w-3 rounded-full bg-success border-2 border-background"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm truncate">{user.name}</h3>
                        <span className="text-xs text-muted-foreground">{user.timestamp}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground truncate">{user.lastMessage}</p>
                        {user.unread > 0 && (
                          <Badge className="ml-2 h-5 w-5 p-0 text-xs">{user.unread}</Badge>
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

      {/* Chat Window */}
      <Card className="lg:col-span-2 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                    <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {selectedUser.isOnline && (
                    <div className="absolute -bottom-0 -right-0 h-3 w-3 rounded-full bg-success border-2 border-background"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{selectedUser.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedUser.isOnline ? 'Online' : 'Last seen 1h ago'}
                  </p>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 p-4">
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isSent ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] space-y-1`}>
                        <div
                          className={`p-3 rounded-lg ${message.isSent
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                            }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <p className={`text-xs text-muted-foreground ${message.isSent ? 'text-right' : 'text-left'
                          }`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
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
              <p className="text-sm text-muted-foreground">
                Choose a chat from the sidebar to start messaging
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}