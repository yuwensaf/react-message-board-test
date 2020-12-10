import "./App.css";
import styled from "styled-components";
import { MEDIA_QUERY_MD, MEDIA_QUERY_LG } from "./constants/style";

const TodoItemWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  border: 1px solid black;
  margin-bottom: 10px;
`;

const TodoContent = styled.div`
  color: ${(props) => props.theme.colors.primary_500};
  font-size: 16px;
  ${(props) =>
    props.size === "XL" &&
    `
    font-size: 20px;
  `}

  ${(props) =>
    props.$isFinished &&
    `
    text-decoration: line-through;
  `}
`;

const TodoButtonWrapper = styled.div``;

const Button = styled.button`
  padding: 5px;
  color: teal;
  font-size: 26px;
  ${MEDIA_QUERY_MD} {
    font-size: 24px;
  }

  ${MEDIA_QUERY_LG} {
    font-size: 22px;
  }

  &:hover {
    color: blue;
  }
  & + & {
    margin-left: 10px;
  }
`;

const RedButton = styled(Button)`
  color: red;
`;

export default function TodoItem({
  className,
  size,
  todo,
  handleDeleteTodo,
  handleToggleIsFinished,
}) {
  const handleToggleClick = () => {
    handleToggleIsFinished(todo.id);
  };

  const handleDeleteClick = () => {
    handleDeleteTodo(todo.id);
  };

  return (
    <TodoItemWrapper className={className} data-todo-id={todo.id}>
      <TodoContent $isFinished={todo.isFinished} size={size}>
        {todo.content}
      </TodoContent>
      <TodoButtonWrapper>
        <Button onClick={handleToggleClick}>
          {todo.isFinished && "未完成"}
          {!todo.isFinished && "已完成"}
        </Button>
        <RedButton onClick={handleDeleteClick}>刪除</RedButton>
      </TodoButtonWrapper>
    </TodoItemWrapper>
  );
}
