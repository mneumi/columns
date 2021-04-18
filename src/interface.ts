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
  description: string;
  avatar: string;
}

export interface IUser {
  _id: string;
  email: string;
  nickName: string;
  description: string;
  avatar: string;
  column: string;
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
