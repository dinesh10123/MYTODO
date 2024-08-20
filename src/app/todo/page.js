"use client";
import Image from "next/image";
import { db } from "../config";
import {
  collection,
  addDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
  doc,
  upadateDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";

async function addTodoToFirebase(title, details, dueDate) {
  try {
    const docRef = await addDoc(collection(db, "todos"), {
      title: title,
      details: details,
      dueDate: dueDate,
      cretedAt: serverTimestamp(),
    });
    console.log("Todo added with ID: ", docRef.id);
    return true;
  } catch (error) {
    console.log("Error While adding the list", error);
    return false;
  }
}

//for fetching todos from firebase
async function fetchTodosFromFirebase() {
  try {
    //  const todosCollection = collection(db, "todos");
    const querySnapshot = await getDocs(collection(db, "todos"));
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });

    // const todosData = querySnapshot.docs.map((doc) => ({
    //   id: doc.id,
    //   ...doc.data(),
    // }));
    return data;
  } catch (error) {
    console.error("Error fetching todos:", error);
  }
}

//  deleting the todo
async function deleteTodoFromFirebase(todoId) {
  try {
    console.log("Attempting to delete todo with ID : ", todoId);
    await deleteDoc(doc(db, "todos", todoId));
    return todoId;
  } catch (error) {
    console.error("Error deleting todo: ", error);
    return null;
  }
}
export default function Todo() {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [dueDate, setDueDate] = useState("");

  //  For list of TODO
  const [todos, setTodos] = useState([]);

  // for selecting todos
  const [selectedTodo, setSelectedTodo] = useState(null);

  // For updating the todo
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isUpdateMode) {
      if (selectedTodo) {
        try {
          const updatedTodo = {
            title,
            details,
            dueDate,
          };
          const todoRef = doc(db, "todos", selectedTodo.id);
          await updateDoc(todoRef, updatedTodo);

          //reset form details
          setTitle("");
          setDetails("");
          setDueDate("");
          setSelectedTodo(null);
          setIsUpdateMode(false);
          alert("Todo Updated Sucessfully");
        } catch (error) {
          console.error("Error updating todos: ", error);
        }
      }
    } else {
      const added = await addTodoToFirebase(title, details, dueDate);
      if (added) {
        setTitle("");
        setDetails("");
        setDueDate("");
        alert("Todo added to firestore sucessfully!!");
      }
    }
  };

  //fetch todos
  useEffect(() => {
    async function fetchTodos() {
      const data = await fetchTodosFromFirebase();
      setTodos(data);
    }

    // const fetchTodos = async () => {};

    // fetchTodos();

    fetchTodos();
  }, []);

  //function to handle update button
  const handleUpdateClick = (todo) => {
    setTitle(todo.title || "");
    setDetails(todo.details || "");
    setDueDate(todo.dueDate || "");

    setSelectedTodo(todo);
    setIsUpdateMode(true);
  };

  //fetch todos from firebase on componentmount
  useEffect(() => {
    async function fetchTodos() {
      const todos = await fetchTodosFromFirebase();
      setTodos(todos);
    }
    fetchTodos();
  }, [handleSubmit]);

  return (
    <main className="flex flex-1 items-center justify-center flex-col md:flex-row min-h-screen">
      {/* {Left Section} */}
      <section className="flex-1 flex md:flex-col items-center md:justify-start mx-auto">
        {/* Todo Form */}
        <div className="p-6 md:p-12 mt-10 rounded-lg shadow-xl w-full max-w-lg bg-white">
          <h2 className="text-center text-2xl font-bold leading-9 text-gray-900">
            {isUpdateMode ? "Update Your Todo" : "Create a Todo Task"}
          </h2>

          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium leading-6 text-gray-600"
              >
                Title
              </label>
              <div className="mt-2">
                <input
                  id="title"
                  name="title"
                  type="text"
                  autoComplete="off"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded border py-2 pl-2 tect-gray-900 shadow ring"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="details"
                className="block text-sm font-medium leading-6 text-gray-600"
              >
                Details
              </label>
              <div className="mt-2">
                <textarea
                  id="details"
                  name="details"
                  rows="4"
                  autoComplete="off"
                  required
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full rounded border py-2 pl-2 tect-gray-900 shadow ring"
                ></textarea>
              </div>
            </div>
            <div>
              <label
                htmlFor="dueDate"
                className="block text-sm font-medium leading-6 text-gray-600"
              >
                Due Date
              </label>
              <div className="mt-2">
                <input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  autoComplete="off"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded border py-2 pl-2 tect-gray-900 shadow ring"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-indigo-700"
              >
                {isUpdateMode ? "Update Todo Task" : "Create Todo Task"}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Right section */}
      <section className="md:w-1/2 md:max:-h-screen overflow-y-auto md:ml-10 mt-20 mx-auto">
        {/* Todo Task Lists */}
        <div className="p-6 md:p-12 mt-10 rounded-lg shadow-xl w-full max-w-lg bg-white">
          <h2 className="text-center text-2xl font-bold leading-9 text-gray-900">
            Todo List
          </h2>

          {/* Todo Tasks  */}
          <div className="mt-6 space-y-6">
            {todos.map((todo) => (
              <div key={todo.id} className="border p-4 rounded-md shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 break-words">
                  {todo.title}
                </h3>
                <p className="text-sm text-gray-500">
                  Due Date : {todo.dueDate}
                </p>
                <p className="text-gray-700 multiline break-words">
                  {todo.details}
                </p>

                <div className="mt-4 space-x-6">
                  <button
                    type="button"
                    className="px-3 py-1 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-md"
                    onClick={() => handleUpdateClick(todo)}
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      const deletedTodoId = await deleteTodoFromFirebase(
                        todo.id
                      );
                      if (deletedTodoId) {
                        const updatedTodos = todos.filter(
                          (t) => t.id !== deletedTodoId
                        );
                        setTodos(updatedTodos);
                      }
                    }}
                    className="px-3 py-1 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
