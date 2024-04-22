let referencedDate = new Date().toDateString();

function signIn() {
	
	let username = document.getElementById('username').value
	let password = document.getElementById('password').value
	console.log(username, password)
	if (localStorage.getItem(username) === null) {
		localStorage.setItem(username, password)
		sessionStorage.setItem('currentUser', username)
		window.location.href = "pages/dashboard.html"
	} else {
		if (password === localStorage.getItem(username)) {
			sessionStorage.setItem('currentUser', username)
			window.location.href = "pages/dashboard.html"
		} else {
			alert('Incorrect Password')
		}
	}
}

if (localStorage.getItem(`${sessionStorage.getItem('currentUser')}-tasks`) === null) {
	localStorage.setItem(`${sessionStorage.getItem('currentUser')}-tasks`, "[]")
}
let task_string = localStorage.getItem(`${sessionStorage.getItem('currentUser')}-tasks`);
let tasks = JSON.parse(task_string);

function deleteAll() {
	let new_tasks = tasks.filter(function (task){ return task.date !== referencedDate })
	let list = JSON.stringify(new_tasks)
	localStorage.setItem(`${sessionStorage.getItem('currentUser')}-tasks`, list)
	location.reload()
}

function deleteOne(index, page) {
	tasks.splice(index, 1)
	console.log(tasks)
	let list = JSON.stringify(tasks)
	localStorage.setItem(`${sessionStorage.getItem('currentUser')}-tasks`, list)
	refreshTasks(page)
}

function updateDate(page) {
	referencedDate = document.getElementById('date').valueAsDate.toDateString()
	refreshTasks(page)
}

function updateTask() {
	document.getElementById("tasks").innerHTML = ''
	document.getElementById("username").innerHTML = sessionStorage.getItem('currentUser')
	tasks.map((task, index) => {
		if (task.date === referencedDate){
			document.getElementById("tasks").innerHTML += `<li id='task-${index}' class="task-item ${task.complete ? 'completed-task':''}">
				<input onChange='toggleCompleted(${index}, "main")' type="checkbox" ${task.complete ? 'checked' : ''}>
				<span>${task.name}</span>
				<div class="tooltip">
					<h2>${task.name}</h2>
					<div>
						<h4>Description</h4>
						<p>${task.desc ? task.desc : 'None'}</p>
					</div>
					<div class="icon-buttons">
						<button class="icon-btn mark-done" onclick="toggleCompleted(${index}, "main")"></button>
						<button class="icon-btn delete" onclick="deleteOne(${index}, 'main')"></button>
					</div>
				</div>
			</li>`
		}
	})
	completed = tasks.filter(function(task) {return task.complete})
	complete_percent = Math.round((completed.length / tasks.length) * 100)
	remaining = 100 - complete_percent
	document.getElementById('percent-complete').innerHTML = `${tasks.length === 0 ? '0' : complete_percent}%`
	document.getElementById('percent-remaining').innerHTML = `${tasks.length === 0 ? '0' : remaining}%`
}

function updateActiveTask() {
	document.getElementById("tasks-active").innerHTML = ''
	tasks.map((task, index) => {
		if (!task.complete && task.date === referencedDate){
			document.getElementById("tasks-active").innerHTML += `<li id='task-${index}'>
			<input onChange='toggleCompleted(${index}, "active")' type="checkbox" ${task.complete ? 'checked' : ''}>
			<span>${task?.name}</span>
			<div class="tooltip">
					<h2>${task.name}</h2>
					<div>
						<h4>Description</h4>
						<p>${task.desc ? task.desc : 'None'}</p>
					</div>
					<div class="icon-buttons">
						<button class="icon-btn mark-done" onclick="toggleCompleted(${index}, "active")"></button>
						<button class="icon-btn delete" onclick="deleteOne(${index}, 'active')"></button>
					</div>
				</div>
			</li>`
		}
	})
}

function updateCompleteTask() {
	document.getElementById("tasks-complete").innerHTML = ''
	tasks.map((task, index) => {
		if (task.complete && task.date === referencedDate) {
			document.getElementById("tasks-complete").innerHTML += `<li id='task-${index}' class='completed-task'>
			<input onChange='toggleCompleted(${index}, "complete")' type="checkbox" checked=${task.complete}>
			<span>${task?.name}</span>
			<div class="tooltip">
					<h2>${task.name}</h2>
					<div>
						<h4>Description</h4>
						<p>${task.desc ? task.desc : 'None'}</p>
					</div>
					<div class="icon-buttons">
						<button class="icon-btn mark-done" onclick="toggleCompleted(${index}, "complete")"></button>
						<button class="icon-btn delete" onclick="deleteOne(${index}, 'complete')"></button>
					</div>
				</div>
			</li>`
		}
	})
}

function refreshTasks(page) {
	if (page === 'active') {
		updateActiveTask()
	} else if (page === 'complete') {
		updateCompleteTask()
	} else {
		updateTask()
	}
}

function toggleCompleted(id, page) {
	tasks[id].complete = !tasks[id].complete
	let list = JSON.stringify(tasks)
	localStorage.setItem(`${sessionStorage.getItem('currentUser')}-tasks`, list) 
	refreshTasks(page)
}

function submitTask(page) {
	document.getElementById('add-task-modal').style.display = 'none';
	let name = document.getElementById("task-name").value
	let desc = document.getElementById("task-desc").value
	tasks.push(
		{
			"name": name,
			"desc": desc,
			"date": new Date().toDateString(),
			"complete": false
		}
	)
	let list = JSON.stringify(tasks)
	localStorage.setItem(`${sessionStorage.getItem('currentUser')}-tasks`, list) 
	document.getElementById("task-name").value = ''
	document.getElementById("task-desc").value = ''
	refreshTasks(page)
}