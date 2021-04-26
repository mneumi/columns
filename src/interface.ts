export interface IStore {
  loading: number;
  token: string;
  user: IUser;
  columnInfo: IColumnInfo;
}

export interface IColumnInfo {
  columnId: string;
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
  [key: string]: string;
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
  [key: string]: string;
}
