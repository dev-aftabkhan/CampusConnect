import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Search, MapPin, BookOpen, Star, Calendar, UserPlus } from "lucide-react"

interface Student {
  id: string
  name: string
  avatar: string
  university: string
  major: string
  year: string
  bio: string
  interests: string[]
  location: string
  mutualConnections: number
}

interface StudyGroup {
  id: string
  name: string
  subject: string
  members: number
  description: string
  meetingTime: string
  location: string
  isJoined: boolean
}

export default function Discover() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")

  const students: Student[] = [
    {
      id: "1",
      name: "Emily Zhang",
      avatar: "/placeholder.svg",
      university: "Stanford University",
      major: "Computer Science",
      year: "Senior",
      bio: "Passionate about AI and machine learning. Looking to connect with fellow CS students!",
      interests: ["AI", "Research", "Tennis", "Photography"],
      location: "Palo Alto, CA",
      mutualConnections: 5
    },
    {
      id: "2",
      name: "Marcus Johnson",
      avatar: "/placeholder.svg",
      university: "MIT",
      major: "Mechanical Engineering",
      year: "Junior",
      bio: "Robotics enthusiast working on autonomous systems. Love to collaborate on projects!",
      interests: ["Robotics", "Engineering", "Soccer", "Music"],
      location: "Cambridge, MA",
      mutualConnections: 3
    },
    {
      id: "3",
      name: "Sophia Rodriguez",
      avatar: "/placeholder.svg",
      university: "UC Berkeley",
      major: "Psychology",
      year: "Sophomore",
      bio: "Studying cognitive psychology and neuroscience. Always up for academic discussions!",
      interests: ["Psychology", "Research", "Hiking", "Reading"],
      location: "Berkeley, CA",
      mutualConnections: 8
    }
  ]

  const studyGroups: StudyGroup[] = [
    {
      id: "1",
      name: "Advanced Algorithms Study Group",
      subject: "Computer Science",
      members: 12,
      description: "Weekly meetings to discuss and solve complex algorithmic problems. Preparing for technical interviews together!",
      meetingTime: "Wednesdays 7:00 PM",
      location: "Gates Building, Room 104",
      isJoined: false
    },
    {
      id: "2",
      name: "Organic Chemistry Lab Partners",
      subject: "Chemistry",
      members: 8,
      description: "Study group focused on organic chemistry concepts and lab work. Share notes and practice problems.",
      meetingTime: "Sundays 2:00 PM",
      location: "Chemistry Library",
      isJoined: true
    },
    {
      id: "3",
      name: "Machine Learning Research Circle",
      subject: "Computer Science",
      members: 15,
      description: "Discussing latest ML papers and working on research projects together. Open to all levels!",
      meetingTime: "Fridays 4:00 PM",
      location: "AI Lab, Basement",
      isJoined: false
    }
  ]

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.major.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.interests.some(interest => 
      interest.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  const filteredGroups = studyGroups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.subject.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Discover Your Campus Community
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Connect with fellow students, join study groups, and build meaningful academic relationships
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students, study groups, interests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs defaultValue="students" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="students" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Students</span>
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>Study Groups</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.map((student) => (
              <Card key={student.id} className="hover:shadow-campus transition-shadow">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="relative mx-auto w-fit">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-success border-2 border-background"></div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold">{student.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {student.major} • {student.year}
                      </p>
                      <div className="flex items-center justify-center space-x-1 text-xs text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" />
                        <span>{student.location}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-center">{student.bio}</p>
                    
                    <div className="flex flex-wrap gap-1 justify-center">
                      {student.interests.slice(0, 3).map((interest, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-center space-x-1 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span>{student.mutualConnections} mutual connections</span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1">
                          <UserPlus className="h-3 w-3 mr-1" />
                          Connect
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          Message
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="groups" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGroups.map((group) => (
              <Card key={group.id} className="hover:shadow-campus transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{group.subject}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{group.members} members</span>
                        </div>
                      </div>
                    </div>
                    {group.isJoined && (
                      <Badge className="bg-success text-success-foreground">
                        Joined
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm">{group.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{group.meetingTime}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{group.location}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    variant={group.isJoined ? "outline" : "default"}
                  >
                    {group.isJoined ? "View Group" : "Join Group"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}