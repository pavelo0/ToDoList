type Task = {
    id: number;
    title: string;
    isCompleted: boolean;
};
type isValidResult = {
    status: boolean;
    result: string;
};
interface TasksVariants {
    allTasks: Task[] | null;
    completedTasks: Task[] | null;
}

function getTasks(): TasksVariants {
    const tasks: TasksVariants = {
        allTasks: [],
        completedTasks: [],
    };
    const storeAll = localStorage.getItem('tasks');
    const storedCompleted = localStorage.getItem('completedTasks');

    const allTasks: Task[] | null = storeAll ? JSON.parse(storeAll) : [];
    const completedTasks: Task[] | null = storedCompleted ? JSON.parse(storedCompleted) : [];

    tasks.allTasks = allTasks;
    tasks.completedTasks = completedTasks;

    return tasks;
}

function isValid(value: string): isValidResult {
    const validatedValue = value.trim();

    const result: isValidResult = {
        status: false,
        result: '',
    };
    if (validatedValue.length > 0 && validatedValue.length < 100) {
        result.result = validatedValue;
        result.status = true;
    } else {
        result.result = '';
        result.status = false;
    }

    return result;
}
function addTaskToList(taskValue: string): void {
    const { allTasks } = getTasks();
    const newTask: Task = {
        id: Date.now(),
        title: taskValue,
        isCompleted: false,
    };

    const updated = allTasks ? [...allTasks, newTask] : [newTask];
    localStorage.setItem('tasks', JSON.stringify(updated));
}
function removeTaskFromList(id: string) {
    const tasks = getTasks();
    const { allTasks } = tasks;
    const numId = Number(id);
    const updated = allTasks?.filter((task) => task.id !== numId);
    localStorage.setItem('tasks', JSON.stringify(updated));
}
function completeTask(id: string) {
    if (!id) return;

    let { completedTasks } = getTasks();
    const { allTasks } = getTasks();
    const numId = Number(id);

    const task = allTasks?.find((task) => task.id === numId);
    const withoutCompletedTask = allTasks?.filter((task) => task.id !== numId);
    if (task === null) return;

    completedTasks = completedTasks ?? [];
    const updatedTask = { ...task, isCompleted: true };

    const newCompletedTasks = [...completedTasks, updatedTask];

    localStorage.setItem('tasks', JSON.stringify(withoutCompletedTask));
    localStorage.setItem('completedTasks', JSON.stringify(newCompletedTasks));

    showTasks();
}
function showTasks(): void {
    const container = document.getElementById('tasks-list');
    const completedContainer = document.getElementById('completed-tasks-list');
    container!.innerHTML = '';
    completedContainer!.innerHTML = '';

    const tasks = getTasks();
    const { allTasks, completedTasks } = tasks;

    allTasks?.forEach((task) => {
        const { id, title } = task;

        const taskBlock = document.createElement('div');
        taskBlock.classList.add(
            'flex',
            'items-center',
            'justify-between',
            'border-xl',
            'border-gray-500',
            'rounded-xl',
            'task-block',
            'mb-2',
            'p-4',
            'bg-white',
            'shadow-md'
        );
        taskBlock.dataset.id = `${id}`;

        const taskTitle = document.createElement('h3');
        taskTitle.textContent = `${title}`;
        taskTitle.classList.add('text-lg', 'text-gray-800');

        const buttons = document.createElement('div');
        buttons.classList.add('flex', 'gap-2');

        const completeBtn = document.createElement('button');
        completeBtn.textContent = 'Complete';
        completeBtn.classList.add(
            'complete-btn',
            'bg-green-200',
            'text-black',
            'text-l',
            'hover:bg-green-300',
            'button'
        );

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add(
            'delete-btn',
            'bg-red-200',
            'text-black',
            'hover:bg-red-300',
            'button'
        );

        buttons.append(completeBtn, deleteBtn);
        taskBlock.append(taskTitle, buttons);

        container?.appendChild(taskBlock);
    });
    completedTasks?.forEach((task) => {
        const { id, title } = task;

        const completedTaskBlock = document.createElement('div');
        completedTaskBlock.classList.add(
            'flex',
            'items-center',
            'justify-between',
            'border-xl',
            'border-gray-500',
            'rounded-xl',
            'task-block',
            'mb-2',
            'p-4',
            'bg-white',
            'shadow-md'
        );
        completedTaskBlock.dataset.id = `${id}`;

        const completedTaskTitle = document.createElement('h3');
        completedTaskTitle.textContent = `${title}`;
        completedTaskTitle.classList.add('text-lg', 'text-gray-800', 'line-through');

        completedTaskBlock.append(completedTaskTitle);

        completedContainer?.appendChild(completedTaskBlock);
    });
}

function main() {
    document.addEventListener('DOMContentLoaded', () => {
        getTasks();
        showTasks();
    });

    const createTaskForm = document.getElementById('create-task-form') as HTMLFormElement;
    const createTaskInput = document.getElementById('create-task-input') as HTMLInputElement;
    const createTaskError = document.getElementById('create-task-error-text') as HTMLFormElement;
    createTaskForm?.addEventListener('submit', (event: SubmitEvent) => {
        event.preventDefault();

        const taskValue = createTaskInput.value;

        const { status, result } = isValid(taskValue);
        if (status) {
            createTaskError.textContent = '';
            createTaskInput.value = '';
            addTaskToList(result);
            showTasks();
        } else {
            createTaskError.textContent = 'Incorrect data';
        }
    });

    const tasksList = document.getElementById('tasks-list');
    tasksList?.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;

        if (target.classList.contains('delete-btn')) {
            const taskEl = target.closest('.task-block');
            if (taskEl) {
                taskEl.remove();
                const taskId = taskEl.getAttribute('data-id');
                if (!taskId) return;
                removeTaskFromList(taskId.toString());
            }
        } else if (target.classList.contains('complete-btn')) {
            const taskEl = target.closest('.task-block');

            if (taskEl) {
                taskEl.remove();
                const taskId = taskEl.getAttribute('data-id');
                if (!taskId) return;
                completeTask(taskId.toString());
            }
        }
    });
}

main();
