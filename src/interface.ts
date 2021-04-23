export type MessageType = 'success' | 'error' | 'default';

export interface IStore {
  loading: number;
  message: {
    type: MessageType;
    content: string;
  };
  token: string;
  user: IUser;
  columnInfo: IColumnInfo;
}

export interface IColumnInfo {
  title: string;
  desc: string;
  picture: string;
}

export interface IUser {
  userId: string;
  email: string;
  nickname: string;
  desc: string;
  avatar: string;
  columnId: string;
}

export interface IPost {
  postId: string;
  columnId: string;
  title: string;
  desc: string;
  content: string;
  picture: string;
  createAt: string;
  updateAt: string;
}
