import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { Button, Input } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CommentData, Data } from "../types/types";
import Funcomponents from "../components/Funcomponents";
import { addBoardData, delBoardData, getBoardData, updateBoardData } from "../api/board";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { addCommentsData, delCommentsData, getCommentsData, updateCommentsData } from "../api/comments";
import Loading from "../components/loading/Loading";

const Main: React.FC<any> = () => {
  const [data, setData] = useState<Data[]>([]);
  const [commentData, setCommentData] = useState<CommentData[]>([]);
  const [contents, setContents] = useState<string>("");
  const authEmail = localStorage.getItem("email");
  const navigate = useNavigate();

  const { isLoading: boardsLoading, isError: boardsError, data: boardsData } = useQuery<Data[]>(["borads"], getBoardData);
  const { isLoading: commentsLoading, isError: commentsError, data: commentsData } = useQuery(["comments"], getCommentsData);
  // 쿼리
  const queryClient = useQueryClient();

  const boardMutationAdd = useMutation(addBoardData, {
    onSuccess: () => {
      queryClient.invalidateQueries(["borads"]);
    },
  });
  const boardMutationUpdate = useMutation(updateBoardData, {
    onSuccess: () => {
      queryClient.invalidateQueries(["borads"]);
    },
  });
  // 쿼리
  const handleBoardSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log(contents);
      try {
        if (contents === "") {
          return alert("야 제대로좀 써 ");
        }

        const newboards = {
          email: authEmail,
          contents,
          isDeleted: false,
        };
        boardMutationAdd.mutate(newboards);
        setContents("");
        // window.location.reload();
      } catch (error) {
        console.error(error);
        alert("일시적인 오류가 발생하였습니다. 고객센터로 연락주세요.");
      }
    },
    [contents]
  );

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setContents(e.target.value);
  }, []);

  const handDelBtn = useCallback(async (id: number) => {
    const check = window.confirm("야 너정말 삭제할꺼니 ?");
    if (!check) return;
    try {
      boardMutationUpdate.mutate(id);
      alert(`삭제완료야 야 `);
    } catch (error) {
      console.error(`${error} 바보 ㅋㅋ`);
    }
  }, []);

  // 만능리듀스 => 댓글조회
  const getCountComment = (arr: CommentData[], el: number) => {
    return arr.reduce((acc: any, current: CommentData): number => {
      return acc + (current.postNum === el);
    }, 0);
  };

  if (boardsLoading || commentsLoading) return <Loading />;
  if (boardsLoading || commentsLoading) return <div>에러야 바보</div>;
  return (
    <MainWrapper>
      <h1>메인 리스트 페이지</h1>
      <StyledForm onSubmit={handleBoardSubmit}>
        <StyledInput placeholder="방명록을 입력해주세요." value={contents} onChange={handleInputChange} />
      </StyledForm>
      <ListWrapper>
        {boardsData
          ?.filter((el: any) => el.isDeleted === false)
          .map((item: Data, index) => (
            <ListItem key={item.id}>
              <span>
                {index + 1}. {item.contents} 댓글수 ( {getCountComment(commentData, item.id)} )
              </span>
              {/* // TODO: 로그인 한 user의 이메일과 일치하는 경우에만 삭제버튼 보이도록 제어//=> 완료 */}
              <div className="Btn-box">
                {item.email === authEmail && (
                  <Button
                    onClick={() => {
                      handDelBtn(item.id);
                    }}>
                    삭제
                  </Button>
                )}
                <Button
                  onClick={() => {
                    navigate(`detail/${item.id}`, { state: item });
                  }}>
                  상세보기
                </Button>
              </div>
            </ListItem>
          ))}
      </ListWrapper>
    </MainWrapper>
  );
};

export default React.memo(Main);

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ListWrapper = styled.div`
  width: 50%;
  padding: 10px;
`;

const ListItem = styled.div`
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
`;

const StyledInput = styled(Input)`
  width: 50%;
`;

const StyledForm = styled.form`
  width: 100%;
  text-align: center;
`;
