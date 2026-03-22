export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  displayPicture?: string;
  lastSeen?: string;
  isOnline?: boolean;
}

export interface Room {
  _id: string;
  name?: string; 
  roomType: 'private' | 'group';
  roomMembers: User[] | string[];
  creator: User | string;
  roomBio?: string;
  roomDisplayPicture?: string;
  lastMessage?: Message;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  content: string;
  from: User | string;
  to: string; // roomId
  viewedBy: Array<{
    user: User | string;
    read: string; // timestamp
  }>;
  createdAt: string;
  updatedAt: string;
  status?: 'pending' | 'sent' | 'read';
}

export interface TypingIndicator {
  roomId: string;
  userId: string;
  username: string;
}
