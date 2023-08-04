import axios from "axios";
import React, { useCallback, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getJSDocDeprecatedTag } from "typescript";
interface Props {}
// 2. detail 페이지 구현
//     (1) Main.tsx 리스트 방명록 내용 클릭 가능하게 구현
//     (2) Detail.tsx 생성
//     (3) Router 수정
//     (4) Detail.tsx에서는 본문내용, 작성자 이메일 출력
//     (5) 작성자와 로그인 한 유저가 일치하는 경우, 삭제버튼 활성화(디자인 알아서)
interface Data {
  comments: string;
  id: number;
  postNum: number;
  email: string;
}
const Detail = ({}: Props): JSX.Element => {
  const [comments, setComments] = useState<string>("");
  const navigate = useNavigate();
  const { state: data } = useLocation();
  const myEmail = localStorage.getItem("email");
  const { email, contents, isDeleted, id } = data;
  const [commentData, setCommentData] = useState<Data[]>([]);

  const getData = async () => {
    const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/comments?postNum=${id}&isDeleted=${false}`);
    // console.log(response.data);
    setCommentData(response.data);
  };
  useEffect(() => {
    getData();
  }, [navigate]);

  const onClickDelBtn = useCallback(async () => {
    const check = window.confirm("야 너 삭제할꺼냐?");
    if (!check) return;
    try {
      axios.patch(`${process.env.REACT_APP_SERVER_URL}/boards/${id}`, { isDeleted: true });
      alert("야 삭제했어");

      navigate("/");
    } catch (error) {
      console.error(error);
    }
  }, [id]);
  const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  const onChanInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComments(e.target.value);
  };

  const addData = async () => {
    const newComment = {
      comments,
      postNum: id,
      email: localStorage.getItem("email"),
    };
    try {
      await axios.post(`${process.env.REACT_APP_SERVER_URL}/comments`, newComment);
      alert("야 추가완료야");
    } catch (error) {
      console.error(error);
    } finally {
      window.location.reload();
    }
  };

  const onCommentDelBtn = (id: number) => {
    const check = window.confirm("너 정말 삭제할꺼니?");
    if (!check) return;
    axios.delete(`${process.env.REACT_APP_SERVER_URL}/comments/${id}`);
    alert("삭제가 완료됐어 야 !");
    window.location.reload();
  };
  return (
    <>
      <h2>{email}</h2>
      <p>{contents}</p>
      <p>삭제여부 : {isDeleted ? "삭제됨" : "삭제안됨"}</p>
      <p>글 아이디 : {id}</p>

      {myEmail === email && <button onClick={onClickDelBtn}>삭제</button>}
      <button
        onClick={() => {
          navigate("/");
        }}>
        되돌아가기
      </button>
      <hr />
      <form action="#" onSubmit={onSubmitForm} style={{ display: "flex" }}>
        <input type="text" onChange={onChanInput} placeholder="댓글입력해야" value={comments} />
        <button onClick={addData}>입력</button>
      </form>
      <hr />
      {commentData.map((el, index) => (
        <div key={el.id + index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p>{el.comments}</p>
          <button onClick={() => onCommentDelBtn(el.id)}>삭제</button>
        </div>
      ))}
    </>
  );
};

export default Detail;
