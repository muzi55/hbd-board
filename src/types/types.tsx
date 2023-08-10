export interface Data {
  email: string;
  contents: string;
  id: number;
  isDeleted: boolean;
}
export interface CommentData {
  comments: string;
  email: string;
  id: number;
  postNum: number;
}

export interface addCommentData {
  comments: string;
  email: string | null;
  postNum: number;
}
