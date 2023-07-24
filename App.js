import { useEffect, useState } from "react";
import "./App.css";
import Header from "./component/Header";
import axios from "axios";

const App = () => {
  const [editMode, setEditMode] = useState(false);
  const [list, setList] = useState([]); //keep list as list throughout video.
  const [todoList, setTodoList] = useState(""); //takes the place of firstName useState within video.
  const [userId, setUserId] = useState("");

  //show list of tasks
  const showList = async () => {
    try {
      const { data } = await axios.get("/api/show/list");
      setList(data);
    } catch (error) {
      console.log(error);
    }
  };

  //add task to list
  const addTodo = async (e) => {
    e.preventDefault();
    try {
      const add = await axios.post("/api/create/list", { todoList });
      if (add.status === 200) {
        setTodoList("");
        showList();
      }
    } catch (error) {
      console.log(error);
    }
  };

  //delete task from list
  const deleteTodo = async (id) => {
    try {
      const todoDelete = await axios.delete(`/api/delete/list/${id}`);
      if (todoDelete.status === 200) {
        showList();
      }
    } catch (error) {
      console.log(error);
    }
  };

  //populate single task from list
  const showSingleTodo = async (id) => {
    setEditMode(true);

    try {
      const { data } = await axios.get(`/api/list/${id}`);
      setTodoList(data.todoList);
      setUserId(data.id);
    } catch (error) {
      console.log(error);
    }
  };

  //edit task from list
  const editTodo = async (e) => {
    e.preventDefault();

    try {
      const edit = await axios.put(`/api/update/list/${userId}`, { todoList });

      if (edit.status === 200) {
        setEditMode(false);
        setTodoList("");
        showList();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    showList();
  }, []);

  return (
    <>
      <Header />
      <div className="container">
        <div className="block glow">
          <div
            className="form"
            style={{ paddingBottom: "50px", paddingTop: "50px" }}
          >
            <form onSubmit={editMode ? editTodo : addTodo}>
              <div
                className="form-wrapper"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <div style={{ flex: 1, marginLeft: "10px", marginRight:"10px" }}>
                  <input
                    onChange={(e) => setTodoList(e.target.value)}
                    value={todoList}
                    className="form-control"
                    type="text"
                    placeholder="Enter task"
                    name="task"
                  ></input>
                </div>
                {editMode ? (
                  <button
                    type="submit"
                    style={{ width: "200px", marginLeft: "10px", marginRight:"10px" }}
                    className="btn btn-primary"
                  >
                    Edit
                  </button>
                ) : (
                  <button
                    type="submit"
                    style={{ width: "200px", marginLeft: "10px", marginRight:"10px" }}
                    className="btn btn-success"
                  >
                    + Add
                  </button>
                )}
              </div>
            </form>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Tasks</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list &&
                list.map((d) => (
                  <tr key={d.id}>
                    <input
                      className="form-check-input me-1"
                      type="checkbox"
                      style={{ backgroundColor: "grey", margin: "10px" }}
                      value=""
                      aria-label="..."
                    ></input>
                    <td>{d.todoList}</td>
                    <td>
                      <i
                        onClick={() => showSingleTodo(d.id)}
                        className="bi bi-pencil-square"
                        style={{
                          color: "green",
                          cursor: "pointer",
                          marginRight: "25px",
                        }}
                      ></i>
                      <i
                        onClick={() => deleteTodo(d.id)}
                        style={{ color: "red", cursor: "pointer" }}
                        className="bi bi-trash"
                      ></i>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default App;
