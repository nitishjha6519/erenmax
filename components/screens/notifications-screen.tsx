"use client"

import { useState } from "react"
import { Bell, UserPlus, Calendar, CheckCircle, MessageSquare, Star, ArrowLeft, Check, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NotificationsScreenProps {
  onNavigate: (screen: string) => void
}

const notifications = [
  {
    id: 1,
    type: "partner_request",
    title: "New Partner Request",
    message: "Alex Chen wants to be your accountability partner for \"Senior PM at Google\"",
    time: "2 hours ago",
    read: false,
    icon: UserPlus,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600"
  },
  {
    id: 2,
    type: "session_reminder",
    title: "Session Starting Soon",
    message: "Your mock interview session with Sarah Kim starts in 30 minutes",
    time: "30 min ago",
    read: false,
    icon: Calendar,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600"
  },
  {
    id: 3,
    type: "goal_completed",
    title: "Goal Milestone Reached!",
    message: "Congratulations! You've completed 5 mock interviews this week",
    time: "1 day ago",
    read: true,
    icon: CheckCircle,
    iconBg: "bg-green-100",
    iconColor: "text-green-600"
  },
  {
    id: 4,
    type: "feedback",
    title: "New Feedback Received",
    message: "Marcus Johnson left feedback on your behavioral interview session",
    time: "2 days ago",
    read: true,
    icon: MessageSquare,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600"
  },
  {
    id: 5,
    type: "trust_score",
    title: "Trust Score Updated",
    message: "Your trust score increased to 4.9! Keep up the great work",
    time: "3 days ago",
    read: true,
    icon: Star,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600"
  }
]

export function NotificationsScreen({ onNavigate }: NotificationsScreenProps) {
  const [notificationList, setNotificationList] = useState(notifications)
  const [filter, setFilter] = useState<"all" | "unread">("all")

  const filteredNotifications = filter === "all" 
    ? notificationList 
    : notificationList.filter(n => !n.read)

  const unreadCount = notificationList.filter(n => !n.read).length

  const markAsRead = (id: number) => {
    setNotificationList(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotificationList(prev => prev.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: number) => {
    setNotificationList(prev => prev.filter(n => n.id !== id))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => onNavigate("dashboard")} className="p-2 hover:bg-muted rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Notifications</h1>
                {unreadCount > 0 && (
                  <p className="text-sm text-muted-foreground">{unreadCount} unread</p>
                )}
              </div>
            </div>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                <Check className="w-4 h-4 mr-1" />
                Mark all read
              </Button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "all" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "unread" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </button>
          </div>
        </div>
      </header>

      {/* Notifications List */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No notifications</h3>
            <p className="text-muted-foreground">
              {filter === "unread" ? "You're all caught up!" : "You don't have any notifications yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => {
              const Icon = notification.icon
              return (
                <div
                  key={notification.id}
                  className={`bg-card rounded-xl p-4 border transition-all ${
                    notification.read ? "border-border" : "border-primary/30 bg-primary/5"
                  }`}
                >
                  <div className="flex gap-4">
                    <div className={`w-10 h-10 rounded-full ${notification.iconBg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${notification.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className={`font-medium ${notification.read ? "text-foreground" : "text-foreground"}`}>
                            {notification.title}
                            {!notification.read && (
                              <span className="inline-block w-2 h-2 bg-primary rounded-full ml-2"></span>
                            )}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        {!notification.read && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="w-3 h-3 mr-1" />
                            Mark read
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
