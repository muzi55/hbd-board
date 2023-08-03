import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Input } from "antd";
import axios from "axios";

const Main: React.FC<any> = () => {
  const [data, setData] = useState([]);
  const [contents, setContents] = useState<string>("");
  const authEmail = localStorage.getItem("email");
  const fetchData = async () => {
    // alert("TODO 요구사항에 맞추어 기능을 완성해주세요.");
    // TODO: 데이터베이스에서 boards 리스트 가져오기 //=>axios.get
    // TODO: 가져온 결과 배열을 data state에 set 하기 //=>setState
    // TODO: 네트워크 등 기타 문제인 경우, "일시적인 오류가 발생하였습니다. 고객센터로 연락주세요." alert //=>했음
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/boards`);
      setData(response.data);
    } catch (error) {
      alert('네트워크 등 기타 문제인 경우, "일시적인 오류가 발생하였습니다. 고객센터로 연락주세요.');
      console.error(error);
    }
  };

  useEffect(() => {
    // TODO: 해당 useEffect는 최초 마운트시에만 동작하게 제어//=>desp[]
    fetchData();
  }, []);

  const handleBoardSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (contents === "") {
        return alert("야 제대로좀 써 ");
      }
      const newboards = {
        email: authEmail,
        contents,
        isDeleted: false,
      };
      await axios.post(`${process.env.REACT_APP_SERVER_URL}/boards`, newboards);
      alert("작성이 완료되었습니다. 아직 자동 새로고침이 불가하여 수동으로 갱신합니다.");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("일시적인 오류가 발생하였습니다. 고객센터로 연락주세요.");
    }

    // alert("TODO 요구사항에 맞추어 기능을 완성해주세요.");
    // TODO: 자동 새로고침 방지 //=> hashrouter
    // TODO: 이메일과 contents를 이용하여 post 요청 등록(isDeleted 기본값은 false) //=>완료
    // TODO: 네트워크 등 기타 문제인 경우, "일시적인 오류가 발생하였습니다. 고객센터로 연락주세요." alert //=>완료
    // TODO: 성공한 경우, "작성이 완료되었습니다. 아직 자동 새로고침이 불가하여 수동으로 갱신합니다." alert //=>완료
    // TODO: 처리완료 후, reload를 이용하여 새로고침
  };

  const handleInputChange = (e: any) => {
    setContents(e.target.value);
  };

  const handDelBtn = async (id: any) => {
    const check = window.confirm("야 너정말 삭제할꺼니 ?");
    if (!check) return;
    try {
      console.log(id);
      await axios.delete(`${process.env.REACT_APP_SERVER_URL}/boards/${id}`);
      alert("삭제완료야 야");
      window.location.reload();
    } catch (error) {
      console.error(`${error} 바보 ㅋㅋ`);
    }
  };

  return (
    <MainWrapper>
      <h1>메인 리스트 페이지</h1>
      <StyledForm onSubmit={handleBoardSubmit}>
        <StyledInput placeholder="방명록을 입력해주세요." value={contents} onChange={handleInputChange} />
      </StyledForm>
      <ListWrapper>
        {data.map((item: any, index) => (
          <ListItem key={item.id}>
            <span>
              {index + 1}. {item.contents}
            </span>
            {/* // TODO: 로그인 한 user의 이메일과 일치하는 경우에만 삭제버튼 보이도록 제어//=> 완료 */}
            {item.email === authEmail && (
              <Button
                onClick={() => {
                  handDelBtn(item.id);
                }}>
                삭제
              </Button>
            )}
          </ListItem>
        ))}
      </ListWrapper>
    </MainWrapper>
  );
};

export default Main;

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
