import { useState } from "react";

export type Status =
    | "Сделать"
    | "В процессе"
    | "Готово"
    | "Отложено"
    | "Заброшено";

export interface Task {
    title: string;
    description: string;
    color: string;
}

export interface TaskInfoModalProps {
    task: Task;
    onClose: () => void;
}

const initialTasks: Record<Status, Task[]> = {
    Сделать: [
        { title: "Написать отчет по проекту", description: "", color: "#ffffff" },
        {
            title: "Подготовить презентацию для встречи",
            description: "",
            color: "#ffffff",
        },
    ],
    "В процессе": [
        {
            title: "Разработка нового функционала",
            description: "",
            color: "#ffffff",
        },
    ],
    Готово: [
        {
            title: "Завершение дизайна интерфейса",
            description: "",
            color: "#ffffff",
        },
        {
            title: "Настройка серверной инфраструктуры",
            description: "",
            color: "#ffffff",
        },
        { title: "Проверка кода", description: "", color: "#ffffff" },
    ],
    Отложено: [
        { title: "Обновление документации", description: "", color: "#ffffff" },
        {
            title: "Исследование новых технологий",
            description: "",
            color: "#ffffff",
        },
        { title: "Обсуждение идей", description: "", color: "#ffffff" },
    ],
    Заброшено: [
        {
            title: "Старый проект по автоматизации",
            description: "",
            color: "#ffffff",
        },
    ],
};

export const useTaskManager = () => {
    const [tasks, setTasks] = useState<Record<Status, Task[]>>(initialTasks);
    const [taskInput, setTaskInput] = useState<string>("");
    const [taskDescription, setTaskDescription] = useState<string>("");
    const [taskColor, setTaskColor] = useState<string>("#ffffff");
    const [editingTask, setEditingTask] = useState<{
        status: Status;
        index: number;
    } | null>(null);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
    const [currentStatus, setCurrentStatus] = useState<Status | null>(null);
    const [contextMenu, setContextMenu] = useState<{
        status: Status;
        index: number;
        x: number;
        y: number;
    } | null>(null);
    const [draggedTask, setDraggedTask] = useState<{
        status: Status;
        index: number;
    } | null>(null);
    const [dragging, setDragging] = useState<boolean>(false);
    const [containerNames, setContainerNames] = useState<Record<Status, string>>({
        Сделать: "Сделать",
        "В процессе": "В процессе",
        Готово: "Готово",
        Отложено: "Отложено",
        Заброшено: "Заброшено",
    });

    const handleAddTask = () => {
        if (taskInput.trim() === "") {
            alert("Название задачи не может быть пустым!");
            return;
        }
        if (currentStatus) {
            const isDuplicate = tasks[currentStatus].some(
                (task) => task.title === taskInput
            );
            if (isDuplicate) {
                alert("Задача с таким названием уже существует!");
                return;
            }
            setTasks((prevTasks) => ({
                ...prevTasks,
                [currentStatus]: [
                    ...prevTasks[currentStatus],
                    { title: taskInput, description: taskDescription, color: taskColor },
                ],
            }));
            setTaskInput("");
            setTaskDescription("");
            setTaskColor("#ffffff");
            setShowDialog(false);
            setCurrentStatus(null);
        }
    };

    const handleEditTask = (status: Status, index: number) => {
        setEditingTask({ status, index });
        const task = tasks[status][index];
        setTaskInput(task.title);
        setTaskDescription(task.description);
        setTaskColor(task.color);
        setShowEditDialog(true);
    };

    const handleUpdateTask = () => {
        if (editingTask) {
            const { status, index } = editingTask;
            setTasks((prevTasks) => {
                const updatedTasks = [...prevTasks[status]];
                updatedTasks[index] = {
                    title: taskInput,
                    description: taskDescription,
                    color: taskColor,
                };
                return { ...prevTasks, [status]: updatedTasks };
            });
            setEditingTask(null);
            setTaskInput("");
            setTaskDescription("");
            setTaskColor("#ffffff");
            setShowEditDialog(false);
        }
    };

    const handleDeleteTask = (status: Status, index: number) => {
        setTasks((prevTasks) => {
            const updatedTasks = [...prevTasks[status]];
            updatedTasks.splice(index, 1);
            return { ...prevTasks, [status]: updatedTasks };
        });
    };

    const handleContextMenu = (
        e: React.MouseEvent,
        status: Status,
        index: number
    ) => {
        e.preventDefault();
        setContextMenu({ status, index, x: e.clientX, y: e.clientY });
    };

    const handleCloseContextMenu = () => {
        setContextMenu(null);
    };

    const handleDragStart = (status: Status, index: number) => {
        setDraggedTask({ status, index });
        setDragging(true);
    };

    const handleDragEnd = () => {
        setDragging(false);
    };

    const handleDrop = (status: Status) => {
        if (draggedTask) {
            const { status: fromStatus, index } = draggedTask;

            if (fromStatus === status) {
                setDragging(false);
                return;
            }

            const taskToMove = tasks[fromStatus][index];

            setTasks((prevTasks) => {
                const updatedFromTasks = [...prevTasks[fromStatus]];
                updatedFromTasks.splice(index, 1);

                return {
                    ...prevTasks,
                    [fromStatus]: updatedFromTasks,
                    [status]: [...prevTasks[status], taskToMove],
                };
            });

            setDraggedTask(null);
            setDragging(false);
        }
    };

    const handleContainerRename = (status: Status, newName: string) => {
        if (newName.trim() === "") {
            alert("Имя контейнера не может быть пустым!");
            return;
        }
        setContainerNames((prevNames) => ({
            ...prevNames,
            [status]: newName,
        }));
    };

    return {
        tasks,
        taskInput,
        taskDescription,
        taskColor,
        editingTask,
        showDialog,
        showEditDialog,
        currentStatus,
        contextMenu,
        draggedTask,
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
        handleDragStart,
        handleDragEnd,
        handleDrop,
        handleContainerRename,
    };
};
