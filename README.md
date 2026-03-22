# NexusChat — Real-Time Messaging Application

A full-featured real-time chat application built with React, TypeScript, Zustand, and Socket.io. Supports private DMs and group chats with real-time messaging, typing indicators, read receipts, presence detection, QR code group invites, and demo accounts for instant testing.

**Live:** [https://nexus-chat-ruby.vercel.app/](https://nexus-chat-ruby.vercel.app/)

**Backend Repo:** [https://github.com/Verifieddanny/chat-app-BE](https://github.com/Verifieddanny/chat-app-BE)

## Tech Stack

- **Framework:** React 19 with TypeScript
- **State Management:** Zustand with localStorage persistence
- **Real-Time:** Socket.io Client
- **HTTP Client:** Axios with interceptors
- **Routing:** React Router
- **Notifications:** Sonner (toast)
- **QR Codes:** qrcode.react
- **Image Uploads:** Cloudinary
- **Icons:** Hugeicons React
- **Deployment:** Vercel

## Features

### Messaging
- **Real-Time Messaging** — Send and receive messages instantly via WebSockets
- **Read Receipts** — Single tick for sent, double tick when read. Blue double tick when majority of group has read
- **Message Info** — Tap your own message to see exactly who read it and when
- **Typing Indicators** — See when someone is typing in real time. Supports "X is typing", "X and Y are typing", and "X and 2 others are typing"
- **Message Context Menu** — Long press or click the caret to copy text or view message info
- **Link Detection** — URLs in messages render as clickable links. Group invite links trigger in-app joining
- **Infinite Scroll** — Scroll up to load older messages with pagination. Scroll position preserved on load

### Rooms
- **Private DMs** — Search for any user and start a conversation. Duplicate rooms prevented
- **Group Chats** — Create groups with name, bio, and display picture via Cloudinary upload
- **Group Management** — Admin can add/remove members and edit group details. Members can leave
- **QR Code Invites** — Generate a QR code for any group. Anyone who scans it can join
- **Invite Links** — Copy a shareable link. Clicking it in-app or in-browser joins the group automatically
- **Last Message Preview** — Sidebar shows the most recent message and timestamp for each room, sorted by recency

### Presence
- **Online/Offline Status** — Green dot and "Online" label when a user is connected
- **Last Seen** — Stored on disconnect for future display
- **Initial Online Users** — On connection, receive the full list of currently online users

### Auth
- **Signup & Login** — Username/password authentication with JWT
- **Session Persistence** — Auth state persisted in localStorage via Zustand
- **Auto Logout** — Token expiry triggers automatic logout and redirect
- **Demo Accounts** — 4 pre-created demo users for instant testing. Online users filtered out to prevent session conflicts

### Demo Restrictions
- Demo users cannot search for other users
- Demo users cannot create new groups
- Demo users cannot edit the demo group picture and add members to group

## Project Structure

```
src/
├── components/
│   ├── chat/
│   │   ├── ChatHeader.tsx         # Room header with online status and typing
│   │   ├── EmptyState.tsx         # Default view when no room selected
│   │   ├── MessageInfoDrawer.tsx  # Who read the message and when
│   │   ├── MessageInput.tsx       # Message composition form
│   │   ├── MessageList.tsx        # Message rendering with context menus
│   │   └── RoomInfoDrawer.tsx     # Room/contact info, members, QR, invite
│   ├── sidebar/
│   │   ├── CreateGroupOverlay.tsx # Group creation form with image upload
│   │   ├── RoomList.tsx           # Chat list with last message preview
│   │   ├── SearchBar.tsx          # User search with demo restrictions
│   │   └── SidebarHeader.tsx      # User profile and logout
│   ├── ChatLayout.tsx             # Main layout combining sidebar + chat
│   ├── ChatWindow.tsx             # Core chat logic and state management
│   ├── JoinGroup.tsx              # Join group via URL route
│   ├── Landing.tsx                # Public landing page
│   ├── Login.tsx                  # Login with demo user quick-select
│   └── Signup.tsx                 # User registration
├── constant/
│   └── demoUsers.ts               # Demo user IDs for restriction logic
├── helper/
│   ├── getUsernameColor.ts        # Unique colors per user in group chats
│   ├── renderMessageContent.tsx   # URL detection and link rendering
│   └── uploadToCDN.ts             # Cloudinary image upload utility
├── services/
│   ├── api.ts                     # Axios instance with auth interceptors
│   └── socket.ts                  # Socket.io connection and event handlers
├── store/
│   ├── authStore.ts               # Auth state with persistence
│   └── chatStore.ts               # Chat state (rooms, messages, presence, typing)
├── types/
│   └── index.ts                   # Shared TypeScript interfaces
├── App.tsx                        # Router setup
└── main.tsx                       # Entry point
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- The [NexusChat Backend](https://github.com/Verifieddanny/chat-app-BE) running locally or deployed

### Installation

```bash
git clone https://github.com/Verifieddanny/nexus-chat.git
cd nexus-chat
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```
VITE_BACKEND_URL=http://localhost:8080
VITE_SOCKET_URL=http://localhost:8080    #which can be substituted as the backend url
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
VITE_TUNDY_USER_ID=demo_user_1_id
VITE_MEKUS_USER_ID=demo_user_2_id
VITE_TANNY_USER_ID=demo_user_3_id
VITE_ADAEZE_USER_ID=demo_user_4_id
```

### Running the App

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture

The app runs two communication layers in parallel:

**REST API (Axios)** handles authentication, room creation, fetching room lists, and loading message history with pagination.

**WebSockets (Socket.io)** handle everything real-time: new messages, typing indicators, online/offline presence, read receipts, and group update notifications.

**State Management (Zustand)** maintains two stores. The auth store persists login state across sessions. The chat store manages rooms, messages per room, pagination tracking, online user sets, and typing indicators — all with immutable updates and duplicate prevention.

When a user logs in, the app authenticates via REST, stores the JWT, then opens a WebSocket connection using that token. The server authenticates the socket, joins the user to all their rooms, and sends the initial list of online users. From that point, all live communication flows through WebSocket events.

## Related

- **Backend API:** [github.com/Verifieddanny/chat-app-BE](https://github.com/Verifieddanny/chat-app-BE)

## License

MIT