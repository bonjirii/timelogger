document.addEventListener('DOMContentLoaded', function() {
    // 変数定義
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [{ name: 'default', time: {}, active: true }];
    let currentTask = tasks.find(task => task.active);
    let timerInterval;
    let startTime;
    const taskListContainer = document.getElementById('taskListContainer');
    const startButton = document.getElementById('startButton');
    const calendarButton = document.getElementById('calendarButton');
    const calendarModal = document.getElementById("calendarModal");
    const closeButton = document.getElementsByClassName("close-button")[0];

    // タスク表示
    function renderTasks() {
        taskListContainer.innerHTML = '';
        tasks.forEach(task => {
            const taskDiv = document.createElement('div');
            taskDiv.innerHTML = `
                <input type="radio" name="taskRadio" ${task.active ? 'checked' : ''}>
                <span>${task.name}</span>
                <span class="time">${formatTime(task.time[getToday()] || 0)}</span>
                <button class="editTaskButton">…</button>
            `;
            taskListContainer.appendChild(taskDiv);

            // イベントリスナー追加（ラジオボタン、時間編集、編集ボタン）
            taskDiv.querySelector('input').addEventListener('change', () => {
                switchTask(task);
            });
            taskDiv.querySelector('.time').addEventListener('click', () => {
                // 時間編集処理（未実装）
                alert('時間編集は未実装です。');
            });
            taskDiv.querySelector('.editTaskButton').addEventListener('click', () => {
                // 編集処理（削除ボタン表示など）（未実装）
                alert('編集は未実装です。');
            });
        });
    }

    // 時間フォーマット
    function formatTime(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
    }

    // 日付取得 (YYYY-MM-DD形式)
    function getToday() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // タスク切り替え
    function switchTask(task) {
        if (currentTask) {
            currentTask.active = false;
        }
        task.active = true;
        currentTask = task;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        if (timerInterval) {
            clearInterval(timerInterval);
            startTime = Date.now();
            timerInterval = setInterval(updateTimer, 1000);
        }
    }

    // タイマー更新
    function updateTimer() {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        currentTask.time[getToday()] = (currentTask.time[getToday()] || 0) + elapsedTime;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
        startTime = Date.now();
    }

    // 開始ボタン
    startButton.addEventListener('click', () => {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
            startButton.textContent = '開始';
        } else {
            startTime = Date.now();
            timerInterval = setInterval(updateTimer, 1000);
            startButton.textContent = '停止';
        }
    });
    
    //カレンダー表示
    calendarButton.onclick = function() {
        calendarModal.style.display = "block";
    }

    closeButton.onclick = function() {
        calendarModal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == calendarModal) {
            calendarModal.style.display = "none";
        }
    }

    renderTasks();
});
