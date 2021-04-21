export type MessageType = 'success' | 'error' | 'default';

export interface IStore {
  loading: number;
  message: {
    type: MessageType;
    content: string;
  };
  token: string;
  columns: IColumn[];
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

export interface IImage {
  _id: string;
  url: string;
}

export interface IColumn {
  _id: string;
  title: string;
  description: string;
  author: string;
  avatar?: IImage;
}
