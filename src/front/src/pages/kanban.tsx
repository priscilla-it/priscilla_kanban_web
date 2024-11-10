"use client";

import React, { useState } from "react";
import {
    useTaskManager,
    Status,
    Task,
    TaskInfoModalProps,
} from "./logic";
import "../styles/globals.css";

const TaskInfoModal: React.FC<TaskInfoModalProps> = ({ task, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4 text-black">
                    Информация о задаче
                </h2>
                <p className="text-lg font-bold text-black">Заголовок: {task.title}</p>
                <p className="text-lg text-black">Описание: {task.description}</p>
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-black rounded-lg px-4 py-2"
                    >
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    );
};

const TaskModal: React.FC<{
    title: string;
    taskInput: string;
    taskDescription: string;
    taskColor: string;
    setTaskInput: (input: string) => void;
    setTaskDescription: (description: string) => void;
    setTaskColor: (color: string) => void;
    onClose: () => void;
    onConfirm: () => void;
}> = ({
    title,
    taskInput,
    taskDescription,
    taskColor,
    setTaskInput,
    setTaskDescription,
    setTaskColor,
    onClose,
    onConfirm,
}) => {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                    <h2 className="text-xl font-bold mb-4 text-black">{title}</h2>
                    <input
                        type="text"
                        value={taskInput}
                        onChange={(e) => setTaskInput(e.target.value.slice(0, 64))}
                        className="p-2 border border-gray-300 rounded-lg w-full"
                        placeholder="Название задачи"
                        style={{ color: "black" }}
                    />
                    <h2 className="text-lg font-bold mt-4 text-black">
                        Описание задачи (макс. 255 символов)
                    </h2>
                    <textarea
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value.slice(0, 255))}
                        className="p-2 border border-gray-300 rounded-lg w-full resize-none"
                        placeholder="Описание задачи"
                        rows={3}
                        style={{ color: "black" }}
                    />
                    <h2 className="text-lg font-bold mt-4 text-black">
                        Выберите цвет задачи
                    </h2>
                    <input
                        type="color"
                        value={taskColor}
                        onChange={(e) => setTaskColor(e.target.value)}
                        className="w-full"
                    />
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={onClose}
                            className="mr-2 bg-gray-300 text-black rounded-lg px-4 py-2"
                        >
                            Отмена
                        </button>
                        <button
                            onClick={onConfirm}
                            className="bg-blue-600 text-white rounded-lg px-4 py-2"
                        >
                            Подтвердить
                        </button>
                    </div>
                </div>
            </div>
        );
    };

export default function Kanban() {
    const {
        tasks,
        taskInput,
        taskDescription,
        taskColor,
        showDialog,
        showEditDialog,
        contextMenu,
        dragging,
        containerNames,
        setTaskInput,
        setTaskDescription,
        setTaskColor,
        setShowDialog,
        setShowEditDialog,
        setCurrentStatus,
        handleAddTask,
        handleEditTask,
        handleUpdateTask,
        handleDeleteTask,
        handleContextMenu,
        handleCloseContextMenu,
        handleDragStart: originalHandleDragStart,
        handleDragEnd: originalHandleDragEnd,
        handleDrop,
        handleContainerRename,
    } = useTaskManager();

    const [renamingContainer, setRenamingContainer] = useState<Status | null>(
        null
    );
    const [newContainerName, setNewContainerName] = useState<string>("");
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);

    const handleRenameContainer = (status: Status) => {
        setRenamingContainer(status);
        setNewContainerName(containerNames[status]);
    };

    const confirmRenameContainer = () => {
        if (renamingContainer) {
            const trimmedName = newContainerName.slice(0, 16);
            handleContainerRename(renamingContainer, trimmedName);
            setRenamingContainer(null);
            setNewContainerName("");
        }
    };

    const handleTaskClick = (status: Status, index: number) => {
        const task = tasks[status][index];
        setSelectedTask(task);
    };

    const closeTaskInfoModal = () => {
        setSelectedTask(null);
    };

    const handleDragStart = (status: Status, index: number) => {
        setIsDragging(true);
        originalHandleDragStart(status, index);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        originalHandleDragEnd();
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-start p-6 bg-gradient-to-r from-blue-400 to-blue-600 backdrop-blur-md">
            <header className="flex justify-between items-center w-full py-4 bg-white bg-opacity-30 backdrop-blur-md rounded-lg shadow-lg">
                <div className="flex-grow flex justify-center">
                    <h1 className="text-2xl font-bold text-black">temnomor_kanban</h1>
                </div>
            </header>

            <div className="flex space-x-4 w-full mt-6">
                {["Сделать", "В процессе", "Готово", "Отложено", "Заброшено"].map(
                    (status) => (
                        <div
                            key={status}
                            className="bg-gray-200 bg-opacity-80 p-4 rounded-lg shadow-lg flex flex-col min-w-[250px] max-w-[350px] overflow-hidden"
                            onDrop={() => handleDrop(status as Status)}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            <div className="flex justify-between items-center">
                                {renamingContainer === status ? (
                                    <input
                                        type="text"
                                        value={newContainerName}
                                        onChange={(e) =>
                                            setNewContainerName(e.target.value.slice(0, 16))
                                        }
                                        className="border border-gray-300 rounded-lg p-1 text-black"
                                        onBlur={confirmRenameContainer}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") confirmRenameContainer();
                                        }}
                                    />
                                ) : (
                                    <h2 className="text-xl font-bold text-black">
                                        {containerNames[status as Status]}{" "}
                                        {/* Type assertion here */}
                                    </h2>
                                )}
                                <button
                                    onClick={() => handleRenameContainer(status as Status)}
                                    className="bg-gray-300 text-black rounded-lg px-2 py-1 transition duration-300 hover:bg-gray-400"
                                >
                                    ✎
                                </button>
                            </div>
                            <div className="mt-2 flex-grow overflow-y-auto">
                                {tasks[status as Status].map((task, index) => (
                                    <div
                                        key={index}
                                        className={`bg-white p-2 rounded-lg mb-2 text-black flex justify-between items-center break-words ${dragging ? "opacity-50" : ""
                                            } ${isDragging ? "shake" : ""}`}
                                        style={{ backgroundColor: task.color }}
                                        draggable
                                        onDragStart={() => handleDragStart(status as Status, index)}
                                        onDragEnd={handleDragEnd}
                                        onContextMenu={(e) => {
                                            e.preventDefault();
                                            handleContextMenu(e, status as Status, index);
                                        }}
                                        onClick={() => handleTaskClick(status as Status, index)}
                                    >
                                        <span className="break-words overflow-hidden overflow-ellipsis whitespace-normal max-w-[200px] h-12">
                                            {task.title}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleContextMenu(e, status as Status, index);
                                            }}
                                            className="bg-gray-300 text-black rounded-lg px-2 py-1 transition duration-300 hover:bg-gray-400"
                                        >
                                            ⋮
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => {
                                    setCurrentStatus(status as Status);
                                    setShowDialog(true);
                                }}
                                className="mt-4 bg-blue-600 text-white rounded-lg px-4 py-2 transition duration-300 hover:bg-blue-700"
                            >
                                + Добавить задачу
                            </button>
                        </div>
                    )
                )}
            </div>

            {showDialog && (
                <TaskModal
                    title="Введите название задачи"
                    taskInput={taskInput}
                    taskDescription={taskDescription}
                    taskColor={taskColor}
                    setTaskInput={setTaskInput}
                    setTaskDescription={setTaskDescription}
                    setTaskColor={setTaskColor}
                    onClose={() => {
                        setShowDialog(false);
                        setTaskInput("");
                        setTaskDescription("");
                        setTaskColor("#ffffff");
                    }}
                    onConfirm={handleAddTask}
                />
            )}

            {showEditDialog && (
                <TaskModal
                    title="Редактировать задачу"
                    taskInput={taskInput}
                    taskDescription={taskDescription}
                    taskColor={taskColor}
                    setTaskInput={setTaskInput}
                    setTaskDescription={setTaskDescription}
                    setTaskColor={setTaskColor}
                    onClose={() => {
                        setShowEditDialog(false);
                        setTaskInput("");
                        setTaskDescription("");
                        setTaskColor("#ffffff");
                    }}
                    onConfirm={handleUpdateTask}
                />
            )}

            {contextMenu && (
                <div
                    className="fixed"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                    onMouseLeave={handleCloseContextMenu}
                >
                    <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-2">
                        <button
                            onClick={() => {
                                handleEditTask(contextMenu.status, contextMenu.index);
                                handleCloseContextMenu();
                            }}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-200 text-blue-600"
                        >
                            Редактировать
                        </button>
                        <button
                            onClick={() => {
                                handleDeleteTask(contextMenu.status, contextMenu.index);
                                handleCloseContextMenu();
                            }}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-200 text-red-600"
                        >
                            Удалить
                        </button>
                    </div>
                </div>
            )}

            {selectedTask && (
                <TaskInfoModal task={selectedTask} onClose={closeTaskInfoModal} />
            )}
        </main>
    );
}
