import { useState } from "react";
import TaskList from "./TaskList";
import { Droppable, DragDropContext, DropResult } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import { task } from "./types/task";

function App() {
  const [tasks, setTasks] = useState<task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<task[]>([]);
  const [newTaskText, setNewTaskText] = useState("");

  const addTask = () => {
    if (newTaskText.trim() === "") {
      return;
    }

    const newTask = {
      id: uuidv4(),
      desc: newTaskText,
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
    setNewTaskText("");
  };

  const removeTask = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    setCompletedTasks((prevTasks) =>
      prevTasks.filter((task) => task.id !== taskId)
    );
  };

  const editTask = (taskId: string, newDesc: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, desc: newDesc } : task
      )
    );
    setCompletedTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, desc: newDesc } : task
      )
    );
  };

  const completeTask = (taskId: string) => {
    const taskToComplete = tasks.find((task) => task.id === taskId);
    if (taskToComplete) {
      setCompletedTasks((prevTasks) => [...prevTasks, taskToComplete]);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    let add;
    const active = tasks;
    const complete = completedTasks;

    if (source.droppableId === "activeTasks") {
      add = active[source.index];
      active.splice(source.index, 1);
    } else {
      add = complete[source.index];
      complete.splice(source.index, 1);
    }

    if (destination.droppableId === "activeTasks") {
      active.splice(destination.index, 0, add);
    } else {
      complete.splice(destination.index, 0, add);
    }

    setCompletedTasks(complete);
    setTasks(active);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="min-h-screen p-10 bg-[conic-gradient(at_left,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
        <div className="w-full max-w-screen-xxl p-4 mx-auto">
          <h1 className="text-3xl font-semibold text-center mb-10 font-mono">
            TaskMaster
          </h1>

          <div className="mb-10">
            <input
              type="text"
              placeholder="Add a new task..."
              className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
            />
            <button
              onClick={addTask}
              className="bg-blue-500 text-white p-2 rounded mt-2 block w-full text-center hover:bg-blue-600"
            >
              Add
            </button>
          </div>

          <div className="flex space-x-4">
            <Droppable droppableId="activeTasks">
              {(provided, snapshot) => (
                <div
                  className={`w-full ${
                    snapshot.isDraggingOver ? "bg-blue-200" : ""
                  }`}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <TaskList
                    title="Active Tasks"
                    tasks={tasks}
                    onRemoveTask={removeTask}
                    onEditTask={editTask}
                    onCompleteTask={completeTask}
                    placeholder={provided.placeholder}
                  />
                </div>
              )}
            </Droppable>
            <Droppable droppableId="completedTasks">
              {(provided, snapshot) => (
                <div
                  className={`w-full ${
                    snapshot.isDraggingOver ? "bg-blue-200" : ""
                  }`}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <TaskList
                    title="Completed Tasks"
                    tasks={completedTasks}
                    onRemoveTask={removeTask}
                    onEditTask={editTask}
                    onCompleteTask={completeTask}
                    placeholder={provided.placeholder}
                  />
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}

export default App;
