# MockMate/Erenmax API Requirements Documentation

## Overview
This document outlines all API endpoints needed for the MockMate accountability platform. The platform connects goal-setters with accountability partners for interview prep, fitness, speaking, and other skills.

---

## Data Models

### User
```json
{
  "id": "string (uuid)",
  "email": "string",
  "password": "string (hashed)",
  "name": "string",
  "avatar": "string (url, optional)",
  "bio": "string (optional)",
  "trustScore": "number (0-100, default 50)",
  "totalPoints": "number (default 0)",
  "showRate": "number (percentage, 0-100)",
  "sessionsCompleted": "number",
  "goalsPosted": "number",
  "goalsHelped": "number",
  "streak": "number (days)",
  "badges": ["string"],
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### Goal
```json
{
  "id": "string (uuid)",
  "userId": "string (uuid, goal poster)",
  "title": "string",
  "description": "string",
  "category": "string (enum: 'dsa', 'system-design', 'behavioral', 'fitness', 'speaking', 'other')",
  "difficulty": "string (enum: 'beginner', 'intermediate', 'advanced')",
  "topic": "string (specific topic like 'Arrays', 'Trees', 'URL Shortener')",
  "pledgedPoints": "number (points staked by goal poster)",
  "scheduledDate": "timestamp (optional)",
  "duration": "number (minutes, e.g., 45, 60, 90)",
  "meetingLink": "string (optional)",
  "status": "string (enum: 'open', 'matched', 'in-progress', 'completed', 'cancelled')",
  "applicationsOpen": "boolean",
  "maxApplicants": "number (optional)",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### Application
```json
{
  "id": "string (uuid)",
  "goalId": "string (uuid)",
  "applicantId": "string (uuid)",
  "message": "string (optional, why they want to help)",
  "stakedPoints": "number (points applicant stakes)",
  "status": "string (enum: 'pending', 'approved', 'rejected', 'withdrawn')",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### Session
```json
{
  "id": "string (uuid)",
  "goalId": "string (uuid)",
  "goalOwnerId": "string (uuid)",
  "partnerId": "string (uuid, the approved applicant)",
  "scheduledAt": "timestamp",
  "duration": "number (minutes)",
  "meetingLink": "string",
  "status": "string (enum: 'scheduled', 'in-progress', 'completed', 'no-show', 'cancelled')",
  "notes": "string (optional, session notes)",
  "goalOwnerRating": "number (1-5, optional)",
  "partnerRating": "number (1-5, optional)",
  "goalOwnerFeedback": "string (optional)",
  "partnerFeedback": "string (optional)",
  "goalOwnerShowedUp": "boolean",
  "partnerShowedUp": "boolean",
  "completedAt": "timestamp (optional)",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### Notification
```json
{
  "id": "string (uuid)",
  "userId": "string (uuid)",
  "type": "string (enum: 'application_received', 'application_approved', 'application_rejected', 'session_reminder', 'session_completed', 'points_earned', 'points_lost', 'streak_bonus', 'new_badge')",
  "title": "string",
  "message": "string",
  "data": "object (optional, additional context like goalId, sessionId)",
  "read": "boolean",
  "createdAt": "timestamp"
}
```

### TrustScoreLog
```json
{
  "id": "string (uuid)",
  "userId": "string (uuid)",
  "action": "string (enum: 'session_completed', 'good_feedback', 'streak_bonus', 'no_show', 'late_cancel')",
  "pointsChange": "number (positive or negative)",
  "description": "string",
  "sessionId": "string (uuid, optional)",
  "createdAt": "timestamp"
}
```

---

## API Endpoints

### 1. Authentication

#### POST /api/auth/register
Create a new user account.

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required, unique)",
  "password": "string (required, min 8 chars)"
}
```

**Response (201 Created):**
```json
{
  "user": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "trustScore": 50,
    "totalPoints": 100,
    "createdAt": "timestamp"
  },
  "token": "string (JWT)"
}
```

**Errors:** 400 (validation), 409 (email exists)

---

#### POST /api/auth/login
Authenticate user and get token.

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "avatar": "string|null",
    "trustScore": "number",
    "totalPoints": "number",
    "showRate": "number"
  },
  "token": "string (JWT)"
}
```

**Errors:** 400 (validation), 401 (invalid credentials)

---

#### POST /api/auth/logout
Invalidate user session/token.

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

---

#### GET /api/auth/me
Get current authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "user": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "avatar": "string|null",
    "bio": "string|null",
    "trustScore": "number",
    "totalPoints": "number",
    "showRate": "number",
    "sessionsCompleted": "number",
    "goalsPosted": "number",
    "goalsHelped": "number",
    "streak": "number",
    "badges": ["string"]
  }
}
```

---

### 2. Users / Profiles

#### GET /api/users/:userId
Get a user's public profile.

**Response (200 OK):**
```json
{
  "user": {
    "id": "uuid",
    "name": "string",
    "avatar": "string|null",
    "bio": "string|null",
    "trustScore": "number",
    "showRate": "number",
    "sessionsCompleted": "number",
    "goalsPosted": "number",
    "goalsHelped": "number",
    "badges": ["string"],
    "createdAt": "timestamp"
  }
}
```

---

#### PATCH /api/users/me
Update current user's profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body (all optional):**
```json
{
  "name": "string",
  "avatar": "string (url)",
  "bio": "string"
}
```

**Response (200 OK):**
```json
{
  "user": { /* updated user object */ }
}
```

---

#### GET /api/users/me/stats
Get detailed stats for dashboard.

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "stats": {
    "trustScore": "number",
    "totalPoints": "number",
    "showRate": "number",
    "sessionsCompleted": "number",
    "sessionsThisWeek": "number",
    "goalsPosted": "number",
    "goalsHelped": "number",
    "currentStreak": "number",
    "longestStreak": "number",
    "totalHoursSpent": "number",
    "averageRating": "number"
  },
  "weeklyActivity": [
    { "day": "Mon", "sessions": 2 },
    { "day": "Tue", "sessions": 1 }
  ],
  "categoryBreakdown": [
    { "category": "dsa", "count": 15 },
    { "category": "system-design", "count": 8 }
  ]
}
```

---

#### GET /api/users/me/trust-score-history
Get trust score change history.

**Headers:** `Authorization: Bearer <token>`

**Query Params:** `?limit=20&offset=0`

**Response (200 OK):**
```json
{
  "history": [
    {
      "id": "uuid",
      "action": "session_completed",
      "pointsChange": 15,
      "description": "Showed up and gave good feedback",
      "createdAt": "timestamp"
    }
  ],
  "total": "number"
}
```

---

### 3. Goals

#### POST /api/goals
Create a new goal.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "string (required)",
  "description": "string (required)",
  "category": "string (required, enum)",
  "difficulty": "string (required, enum)",
  "topic": "string (optional)",
  "pledgedPoints": "number (required, min 10)",
  "scheduledDate": "timestamp (optional)",
  "duration": "number (required, minutes)",
  "meetingLink": "string (optional)"
}
```

**Response (201 Created):**
```json
{
  "goal": {
    "id": "uuid",
    "userId": "uuid",
    "title": "string",
    "description": "string",
    "category": "string",
    "difficulty": "string",
    "topic": "string|null",
    "pledgedPoints": "number",
    "scheduledDate": "timestamp|null",
    "duration": "number",
    "meetingLink": "string|null",
    "status": "open",
    "applicationsOpen": true,
    "createdAt": "timestamp"
  }
}
```

**Notes:** Deduct pledgedPoints from user's totalPoints when creating goal.

---

#### GET /api/goals
Get list of goals (browse/feed).

**Query Params:**
- `?category=dsa` (filter by category)
- `?difficulty=beginner` (filter by difficulty)
- `?search=arrays` (search in title/description/topic)
- `?status=open` (filter by status, default: open)
- `?sortBy=recent|points|date` (default: recent)
- `?limit=20&offset=0` (pagination)

**Response (200 OK):**
```json
{
  "goals": [
    {
      "id": "uuid",
      "title": "string",
      "description": "string",
      "category": "string",
      "difficulty": "string",
      "topic": "string|null",
      "pledgedPoints": "number",
      "scheduledDate": "timestamp|null",
      "duration": "number",
      "status": "string",
      "applicationsOpen": "boolean",
      "applicationCount": "number",
      "createdAt": "timestamp",
      "user": {
        "id": "uuid",
        "name": "string",
        "avatar": "string|null",
        "trustScore": "number"
      }
    }
  ],
  "total": "number",
  "hasMore": "boolean"
}
```

---

#### GET /api/goals/:goalId
Get single goal details.

**Response (200 OK):**
```json
{
  "goal": {
    "id": "uuid",
    "title": "string",
    "description": "string",
    "category": "string",
    "difficulty": "string",
    "topic": "string|null",
    "pledgedPoints": "number",
    "scheduledDate": "timestamp|null",
    "duration": "number",
    "meetingLink": "string|null",
    "status": "string",
    "applicationsOpen": "boolean",
    "applicationCount": "number",
    "createdAt": "timestamp",
    "user": {
      "id": "uuid",
      "name": "string",
      "avatar": "string|null",
      "trustScore": "number",
      "showRate": "number",
      "sessionsCompleted": "number"
    }
  },
  "userApplication": {
    "id": "uuid",
    "status": "pending"
  } | null
}
```

---

#### PATCH /api/goals/:goalId
Update a goal (owner only).

**Headers:** `Authorization: Bearer <token>`

**Request Body (all optional):**
```json
{
  "title": "string",
  "description": "string",
  "scheduledDate": "timestamp",
  "meetingLink": "string",
  "applicationsOpen": "boolean"
}
```

**Response (200 OK):**
```json
{
  "goal": { /* updated goal object */ }
}
```

---

#### DELETE /api/goals/:goalId
Delete/cancel a goal (owner only, only if no approved applications).

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "message": "Goal deleted successfully"
}
```

**Notes:** Refund pledgedPoints to user's totalPoints.

---

#### GET /api/goals/my
Get current user's posted goals.

**Headers:** `Authorization: Bearer <token>`

**Query Params:** `?status=open|matched|completed|all&limit=20&offset=0`

**Response (200 OK):**
```json
{
  "goals": [
    {
      /* goal object with applicationCount */
    }
  ],
  "total": "number"
}
```

---

### 4. Applications

#### POST /api/goals/:goalId/applications
Apply to help with a goal.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "message": "string (optional, why you want to help)",
  "stakedPoints": "number (required, points to stake)"
}
```

**Response (201 Created):**
```json
{
  "application": {
    "id": "uuid",
    "goalId": "uuid",
    "applicantId": "uuid",
    "message": "string|null",
    "stakedPoints": "number",
    "status": "pending",
    "createdAt": "timestamp"
  }
}
```

**Notes:** Deduct stakedPoints from applicant's totalPoints (held in escrow).

---

#### GET /api/goals/:goalId/applications
Get applications for a goal (goal owner only).

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "applications": [
    {
      "id": "uuid",
      "message": "string|null",
      "stakedPoints": "number",
      "status": "string",
      "createdAt": "timestamp",
      "applicant": {
        "id": "uuid",
        "name": "string",
        "avatar": "string|null",
        "trustScore": "number",
        "showRate": "number",
        "sessionsCompleted": "number"
      }
    }
  ]
}
```

---

#### POST /api/applications/:applicationId/approve
Approve an application (goal owner only).

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "application": {
    "id": "uuid",
    "status": "approved"
  },
  "session": {
    "id": "uuid",
    "scheduledAt": "timestamp",
    "status": "scheduled"
  }
}
```

**Notes:** 
- Creates a new Session record
- Updates goal status to "matched"
- Closes applications for this goal
- Sends notification to approved applicant
- Optionally rejects other pending applications

---

#### POST /api/applications/:applicationId/reject
Reject an application (goal owner only).

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "application": {
    "id": "uuid",
    "status": "rejected"
  }
}
```

**Notes:** Refund stakedPoints to applicant's totalPoints.

---

#### DELETE /api/applications/:applicationId
Withdraw application (applicant only, only if pending).

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "message": "Application withdrawn"
}
```

**Notes:** Refund stakedPoints to applicant's totalPoints.

---

#### GET /api/applications/my
Get current user's applications.

**Headers:** `Authorization: Bearer <token>`

**Query Params:** `?status=pending|approved|rejected|all`

**Response (200 OK):**
```json
{
  "applications": [
    {
      "id": "uuid",
      "status": "string",
      "stakedPoints": "number",
      "createdAt": "timestamp",
      "goal": {
        "id": "uuid",
        "title": "string",
        "category": "string",
        "scheduledDate": "timestamp|null",
        "status": "string",
        "user": {
          "id": "uuid",
          "name": "string",
          "avatar": "string|null"
        }
      }
    }
  ],
  "total": "number"
}
```

---

### 5. Sessions

#### GET /api/sessions
Get user's sessions.

**Headers:** `Authorization: Bearer <token>`

**Query Params:**
- `?type=upcoming|past|all` (default: all)
- `?role=owner|partner|all` (default: all)
- `?limit=20&offset=0`

**Response (200 OK):**
```json
{
  "sessions": [
    {
      "id": "uuid",
      "scheduledAt": "timestamp",
      "duration": "number",
      "status": "string",
      "meetingLink": "string|null",
      "goal": {
        "id": "uuid",
        "title": "string",
        "category": "string",
        "difficulty": "string",
        "pledgedPoints": "number"
      },
      "partner": {
        "id": "uuid",
        "name": "string",
        "avatar": "string|null",
        "trustScore": "number"
      },
      "isOwner": "boolean"
    }
  ],
  "total": "number"
}
```

---

#### GET /api/sessions/:sessionId
Get single session details.

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "session": {
    "id": "uuid",
    "scheduledAt": "timestamp",
    "duration": "number",
    "status": "string",
    "meetingLink": "string|null",
    "notes": "string|null",
    "goal": {
      "id": "uuid",
      "title": "string",
      "description": "string",
      "category": "string",
      "difficulty": "string",
      "topic": "string|null",
      "pledgedPoints": "number"
    },
    "goalOwner": {
      "id": "uuid",
      "name": "string",
      "avatar": "string|null",
      "trustScore": "number"
    },
    "partner": {
      "id": "uuid",
      "name": "string",
      "avatar": "string|null",
      "trustScore": "number"
    },
    "isOwner": "boolean"
  }
}
```

---

#### PATCH /api/sessions/:sessionId
Update session (add notes, update meeting link).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "notes": "string (optional)",
  "meetingLink": "string (optional)"
}
```

**Response (200 OK):**
```json
{
  "session": { /* updated session */ }
}
```

---

#### POST /api/sessions/:sessionId/start
Mark session as in-progress.

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "session": {
    "id": "uuid",
    "status": "in-progress"
  }
}
```

---

#### POST /api/sessions/:sessionId/complete
Complete a session and rate partner.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "rating": "number (1-5, required)",
  "feedback": "string (optional)",
  "partnerShowedUp": "boolean (required)"
}
```

**Response (200 OK):**
```json
{
  "session": {
    "id": "uuid",
    "status": "completed",
    "completedAt": "timestamp"
  },
  "pointsEarned": "number"
}
```

**Trust Points Logic:**
- Both showed up: +10 to +25 pts based on rating
- Partner gives good feedback: +5 bonus pts
- If no-show: -stakedPoints for the person who didn't show
- Goal owner: gets pledgedPoints back + keeps them if partner no-shows
- Partner: gets pledgedPoints from goal owner if completed successfully

---

#### POST /api/sessions/:sessionId/cancel
Cancel a session.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "reason": "string (optional)"
}
```

**Response (200 OK):**
```json
{
  "session": {
    "id": "uuid",
    "status": "cancelled"
  },
  "pointsLost": "number (if cancelled < 2h before)"
}
```

**Trust Points Logic:**
- Cancel > 2h before: No penalty, refund staked points
- Cancel < 2h before: -15 pts penalty

---

### 6. Partners

#### GET /api/partners
Get users you've partnered with.

**Headers:** `Authorization: Bearer <token>`

**Query Params:** `?limit=20&offset=0`

**Response (200 OK):**
```json
{
  "partners": [
    {
      "user": {
        "id": "uuid",
        "name": "string",
        "avatar": "string|null",
        "trustScore": "number"
      },
      "sessionsCount": "number",
      "lastSessionAt": "timestamp",
      "averageRating": "number"
    }
  ],
  "total": "number"
}
```

---

### 7. Notifications

#### GET /api/notifications
Get user's notifications.

**Headers:** `Authorization: Bearer <token>`

**Query Params:**
- `?unreadOnly=true`
- `?limit=20&offset=0`

**Response (200 OK):**
```json
{
  "notifications": [
    {
      "id": "uuid",
      "type": "string",
      "title": "string",
      "message": "string",
      "data": { "goalId": "uuid" },
      "read": "boolean",
      "createdAt": "timestamp"
    }
  ],
  "total": "number",
  "unreadCount": "number"
}
```

---

#### PATCH /api/notifications/:notificationId/read
Mark notification as read.

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "notification": {
    "id": "uuid",
    "read": true
  }
}
```

---

#### POST /api/notifications/read-all
Mark all notifications as read.

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "message": "All notifications marked as read"
}
```

---

#### DELETE /api/notifications/:notificationId
Delete a notification.

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "message": "Notification deleted"
}
```

---

### 8. Categories

#### GET /api/categories
Get all available categories.

**Response (200 OK):**
```json
{
  "categories": [
    {
      "id": "dsa",
      "name": "DSA",
      "description": "Data Structures & Algorithms",
      "topics": ["Arrays", "Trees", "Graphs", "DP", "Strings"]
    },
    {
      "id": "system-design",
      "name": "System Design",
      "description": "Architect scalable systems",
      "topics": ["URL Shortener", "Twitter Feed", "Rate Limiter"]
    },
    {
      "id": "behavioral",
      "name": "Behavioral",
      "description": "STAR method interviews",
      "topics": ["Leadership", "Conflict Resolution", "Failure Stories"]
    },
    {
      "id": "fitness",
      "name": "Fitness",
      "description": "Workout accountability"
    },
    {
      "id": "speaking",
      "name": "Speaking",
      "description": "Public speaking practice"
    }
  ]
}
```

---

## Trust Points System

### Point Rules

| Action | Points |
|--------|--------|
| Show up + give good feedback | +10 to +25 pts |
| Streak bonus (7, 14, 30 days) | +25 pts |
| No-show after approval | -staked pts |
| Cancel < 2h before session | -15 pts |

### Starting Points
- New users start with 100 points and 50 trust score
- Trust score is calculated based on: show rate, average rating, total sessions, streak

### Trust Score Formula
```
trustScore = (showRate * 0.4) + (avgRating * 10) + min(sessionsCompleted * 0.5, 20) + min(streak, 10)
```

---

## Notification Types

| Type | Trigger | Message Example |
|------|---------|-----------------|
| `application_received` | Someone applies to your goal | "John applied to help with your goal" |
| `application_approved` | Your application was approved | "Your application was approved!" |
| `application_rejected` | Your application was rejected | "Your application was not selected" |
| `session_reminder` | 1h before session | "Session starts in 1 hour" |
| `session_completed` | Session marked complete | "Session completed! You earned 20 pts" |
| `points_earned` | Points earned | "You earned 25 points!" |
| `points_lost` | Points lost (no-show/cancel) | "You lost 15 points for late cancellation" |
| `streak_bonus` | Hit streak milestone | "7-day streak! +25 bonus points" |
| `new_badge` | Earned new badge | "You earned the 'Reliable Partner' badge!" |

---

## Error Response Format

All errors follow this format:

```json
{
  "error": {
    "code": "string (e.g., 'VALIDATION_ERROR', 'NOT_FOUND', 'UNAUTHORIZED')",
    "message": "string (human readable)",
    "details": {} 
  }
}
```

Common HTTP Status Codes:
- 400: Bad Request / Validation Error
- 401: Unauthorized (no/invalid token)
- 403: Forbidden (not allowed to access resource)
- 404: Not Found
- 409: Conflict (e.g., duplicate email)
- 500: Internal Server Error

---

## Authentication

All authenticated endpoints require:
```
Authorization: Bearer <JWT_TOKEN>
```

JWT payload should contain:
```json
{
  "userId": "uuid",
  "email": "string",
  "iat": "timestamp",
  "exp": "timestamp"
}
```

---

## Webhooks (Optional)

If implementing real-time features, consider WebSocket events for:
- New application received
- Application approved/rejected
- Session starting soon
- New notification

---

## Rate Limiting

Suggested limits:
- Auth endpoints: 5 requests/minute
- General API: 60 requests/minute
- Search: 30 requests/minute
