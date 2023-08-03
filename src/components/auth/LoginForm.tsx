import React from "react";
import { Form, Input, Button } from "antd";
import styled from "styled-components";
import axios from "axios";
import shortid from "shortid";
import { useNavigate } from "react-router-dom";

const LoginForm: React.FC<any> = ({ setIsLogin }) => {
  const navigate = useNavigate();
  const handleLogin = async (values: any) => {
    // alert("TODO 요구사항에 맞추어 기능을 완성해주세요.");
    const { email, password } = values;

    // TODO: email과 password를 DB에서 찾아서 로그인 검증
    try {
      const response = await axios.get(`http://localhost:4000/users?email=${email}&password=${password}`);

      if (response.data.length >= 1) {
        alert("로그인 완료야 !!");
      } else {
        return alert('일치하는 유저가 없는 경우 "일치하는 유저를 찾을 수 없습니다.');
      }
      localStorage.setItem("email", email);
      localStorage.setItem("token", shortid.generate());
      setIsLogin(false);
      navigate("/");
    } catch (error) {
      console.log("일시적인 오류가 발생하였습니다. 고객센터로 연락주세요.");
    }

    // TODO: 일치하는 유저가 없는 경우 "일치하는 유저를 찾을 수 없습니다." alert
    // TODO: 네트워크 등 기타 문제인 경우, "일시적인 오류가 발생하였습니다. 고객센터로 연락주세요." alert
    // TODO: 성공 시(1), "로그인에 성공하였습니다. 메인 페이지로 이동합니다." alert
    // TODO: 성공 시(2), localStorage에 token과 email을 저장
    // TODO: 성공 시(3), token은 shortId로 생성
    // TODO: 성공 시(4), "/" 라우터로 이동
  };

  return (
    <FormWrapper onFinish={handleLogin}>
      <Form.Item label="이메일" name="email" rules={[{ required: true, message: "이메일을 입력해주세요." }]}>
        <Input />
      </Form.Item>
      <Form.Item label="비밀번호" name="password" rules={[{ required: true, message: "비밀번호를 입력해주세요." }]}>
        <Input.Password />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          로그인
        </Button>
      </Form.Item>
    </FormWrapper>
  );
};

export default LoginForm;

const FormWrapper = styled(Form)`
  width: 300px;
`;
