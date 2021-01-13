import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const API_ENDPOINT =
  "https://student-json-api.lidemy.me/comments?_sort=createdAt&_order=desc";

const Page = styled.div`
  width: 360px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: salmon;
  margin-bottom: 10px;
`;

const MessageForm = styled.form`
  margin-bottom: 10px;
`;

const MessageTextArea = styled.textarea`
  width: 100%;
  display: block;
  margin-bottom: 8px;
`;

const SubmitButton = styled.button``;

const MessageList = styled.div``;

const MessageContainer = styled.div`
  border: 1px solid black;
  padding: 8px 16px;
  border-radius: 8px;
  margin-bottom: 8px;
`;

const MessageHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 4px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
`;

const MessageTitle = styled.div`
  color: rgba(10, 20, 30, 0.7);
  font-size: 14px;
`;

const MessageTime = styled.div``;

const MessageBody = styled.div`
  font-size: 16px;
`;

const ErrorMessage = styled.div`
  color: red;
`;

// 正在發送 request 的 Loading component
const Loading = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
`;

function Message({ author, time, children }) {
  return (
    <MessageContainer>
      <MessageHead>
        <MessageTitle>{author}</MessageTitle>
        <MessageTime>{time}</MessageTime>
      </MessageHead>
      <MessageBody>{children}</MessageBody>
    </MessageContainer>
  );
}

Message.propTypes = {
  author: PropTypes.string,
  time: PropTypes.string,
  children: PropTypes.node,
};

function App() {
  const [messages, setMessages] = useState(null);
  const [messageApiError, setmessageApiError] = useState(null); // GET message（顯示留言）的錯誤訊息
  const [value, setValue] = useState(); // textarea 的 value
  const [postMessageError, setPostMessageError] = useState(); // POST message（送出留言）的錯誤訊息
  const [isLoadingPostMessage, setisLoadingPostMessage] = useState(false); // 是否正在送出留言（是否正在發送 request）

  // 用 fetch 發送 GET request 去 API 拿資料
  const fetchMessages = () => {
    return fetch(API_ENDPOINT)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
      })
      .catch((err) => setmessageApiError(err.message));
  };

  const handleTextareaChange = (e) => {
    setValue(e.target.value);
  };

  // 當使用者 focus 在 textarea 時（準備開始打字），錯誤訊息要消失掉
  const handleTextareaFocus = () => {
    setPostMessageError(null); // 把 postMessageError 設為 false
  };

  // 表單送出的事件
  const handleFormSubmit = (e) => {
    e.preventDefault(); // 先阻止預設的表單送出行為

    // isLoadingPostMessage 是 true 代表：上一個留言還正在發送
    if (isLoadingPostMessage) {
      return; // 如果上一個留言還正在發送，就 return
    }

    setisLoadingPostMessage(true); // 在發送 API 之前，要把 isLoadingPostMessage 設為 true
    fetch("https://student-json-api.lidemy.me/comments", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        nickname: "harry",
        body: value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setisLoadingPostMessage(false); // 在 API 的結果回來之後，要把 isLoadingPostMessage 設為 false
        if (data.ok === 0) {
          // 如果送出留言失敗（沒有輸入留言內容）
          setPostMessageError(data.message);
        }
        // 如果有成功送出留言，就再發一次 GET request 去 API 拿最新的資料
        setValue(""); // 把 textarea 清空
        fetchMessages();
      })
      .catch((err) => {
        setisLoadingPostMessage(false); // 在 API 的結果（錯誤訊息）回來之後，要把 isLoadingPostMessage 設為 false
        setPostMessageError(err.message);
      });
  };

  // 用 fetch 發送 GET request 去 API 拿資料
  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <Page>
      {isLoadingPostMessage && <Loading>Loading...</Loading>}
      <Title>留言板</Title>
      <MessageForm onSubmit={handleFormSubmit}>
        <MessageTextArea
          rows={10}
          value={value}
          onChange={handleTextareaChange}
          onFocus={handleTextareaFocus}
        />
        <SubmitButton>送出留言</SubmitButton>
        {postMessageError && <ErrorMessage>{postMessageError}</ErrorMessage>}
      </MessageForm>
      {messageApiError && ( // 這裡要加上小括號，才能換行
        <ErrorMessage>
          Something went wrong. {messageApiError.toString()}
        </ErrorMessage>
      )}

      {messages && messages.length === 0 && <div>No message!</div>}
      <MessageList>
        {messages &&
          messages.map((message) => (
            <Message
              key={message.id}
              author={message.nickname}
              time={new Date(message.createdAt).toLocaleString()}
            >
              {message.body}
            </Message>
          ))}
      </MessageList>
    </Page>
  );
}

export default App;
