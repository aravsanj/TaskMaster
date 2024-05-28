import React, { ReactNode, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { task } from "./types/task";
import { FaEdit, FaTrash, FaCheckCircle } from "react-icons/fa";

interface TaskListProps {
  title: string;
  tasks: task[];
  placeholder: ReactNode;
  onRemoveTask: (taskId: string) => void;
  onEditTask: (taskId: string, newDesc: string) => void;
  onCompleteTask: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  title,
  tasks,
  placeholder,
  onRemoveTask,
  onEditTask,
  onCompleteTask,
}) => {
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [editedTaskDesc, setEditedTaskDesc] = useState("");

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTaskDesc(e.target.value);
  };

  const handleEditSave = (taskId: string) => {
    onEditTask(taskId, editedTaskDesc);
    setEditTaskId(null);
  };

  return (
    <div className="w-full border p-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-4">
        {tasks.map((task, index) => (
          <Draggable
            key={task.id.toString()}
            draggableId={task.id.toString()}
            index={index}
          >
            {(provided) => (
              <div
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
                className="bg-white p-2 rounded border mb-2 flex justify-between items-center"
              >
                {editTaskId === task.id ? (
                  <input
                    type="text"
                    value={editedTaskDesc}
                    onChange={handleEditInputChange}
                    autoFocus
                  />
                ) : (
                  <div>{task.desc}</div>)
                }
                <div className="flex space-x-2">
                  {editTaskId === task.id ? (
                    <button
                      className="text-blue-500"
                      onClick={() => handleEditSave(task.id)}
                    >
                      <FaCheckCircle />
                    </button>
                  ) : (
                    <button
                      className="text-blue-500"
                      onClick={() => {
                        setEditTaskId(task.id);
                        setEditedTaskDesc(task.desc);
                      }}
                    >
                      <FaEdit />
                    </button>
                  )}
                  <button
                    className="text-red-500"
                    onClick={() => {
                      onRemoveTask(task.id);
                    }}
                  >
                    <FaTrash />
                  </button>
                  <button
                    className="text-green-500"
                    onClick={() => {
                      onCompleteTask(task.id);
                    }}
                  >
                    <FaCheckCircle />
                  </button>
                </div>
              </div>
            )}
          </Draggable>
        ))}
        {placeholder}
      </div>
    </div>
  );
};

export default TaskList;
