import axios from "axios";
import React, { useCallback, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { CommentData, addCommentData } from "../../types/types";
import { Button } from "antd";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { addCommentsData, delCommentsData, getCommentsData, updateCommentsData } from "../../api/comments";
import { updateBoardData } from "../../api/board";

interface Props {}

const Detail = ({}: Props): JSX.Element => {
  const localToken = localStorage.getItem("token");
  const localEmail = localStorage.getItem("email");

  const [comments, setComments] = useState<string>("");
  const [newData, setNewData] = useState<CommentData[]>([]);
  const navigate = useNavigate();
  const { state: data } = useLocation();
  const myEmail = localStorage.getItem("email");
  const { email, contents, isDeleted, id } = data;

  const { isLoading: commentsLoading, isError: commentsError, data: commentsData } = useQuery<CommentData[]>(["comments"], getCommentsData);
  useEffect(() => {
    if (typeof commentsData !== "undefined") {
      setNewData(commentsData);
    }
  }, [commentsData]);

  const queryClient = useQueryClient();
  const commentsMutationAdd = useMutation(addCommentsData, {
    onSuccess: () => {
      queryClient.invalidateQueries(["comments"]);
    },
  });
  const commentsMutationDel = useMutation(delCommentsData, {
    onSuccess: () => {
      queryClient.invalidateQueries(["comments"]);
    },
  });
  const commentsMutationUpdate = useMutation(updateCommentsData, {
    onSuccess: () => {
      queryClient.invalidateQueries(["comments"]);
    },
  });
  const boardMutationUpdate = useMutation(updateBoardData, {
    onSuccess: () => {
      queryClient.invalidateQueries(["borads"]);
    },
  });

  const onClickDelBtn = useCallback(async () => {
    const check = window.confirm("야 너 삭제할꺼냐?");
    if (!check) return;
    try {
      boardMutationUpdate.mutate(id);
      // axios.patch(`${process.env.REACT_APP_SERVER_URL}/boards/${id}`, { isDeleted: true });
      // alert("야 삭제했어");

      navigate("/");
    } catch (error) {
      console.error(error);
    }
  }, [id]);
  const onSubmitForm = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }, []);
  const onChanInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setComments(e.target.value);
  }, []);

  // 추가
  const addData = () => {
    const newComment: addCommentData = {
      comments,
      postNum: id,
      email: localStorage.getItem("email"),
    };
    commentsMutationAdd.mutate(newComment);
    setComments("");
  };

  // 삭제
  const onCommentDelBtn = useCallback((id: number) => {
    const check = window.confirm("너 정말 삭제할꺼니?");
    if (!check) return;
    commentsMutationDel.mutate(id);
    alert("삭제가 완료됐어 야 !");
  }, []);

  if (commentsLoading) return <div>히히뿡</div>;
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
      {console.log(newData)}
      {newData?.map((el, index) => (
        <div key={el.id + index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p>{el.comments}</p>
          {myEmail === el.email && <button onClick={() => onCommentDelBtn(el.id)}>삭제</button>}
        </div>
      ))}
      <Button style={{ position: "absolute", top: "0", left: 0 }} onClick={() => navigate("/")}>
        메인으로
      </Button>
    </>
  );
};

export default React.memo(Detail);
