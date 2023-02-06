const rowsPerPage = 10;
const minButtonsCount = 5;
let currentPage = 0;
let pagesCount;
let buttonsCount;

createTable(data.JSON);
createPaginationSection();

document.addEventListener('DOMContentLoaded', () =>
{
	const getSort = ({ target }) =>
	{
		const order = (target.dataset.order = -(target.dataset.order || -1));
		const index = [...target.parentNode.cells].indexOf(target);
		const collator = new Intl.Collator(['en', 'ru']);

		const comparator = (index, order) => (a, b) => order * collator.compare(
			a.children[index].innerHTML,
			b.children[index].innerHTML
		);

		for (const tBody of target.closest('table').tBodies)
			tBody.append(...[...tBody.rows].sort(comparator(index, order)));

		for (const cell of target.parentNode.cells)
			cell.classList.toggle('sorted', cell === target);
	};

	document.querySelector('.table thead').addEventListener('click', () => getSort(event));
});

// создание таблицы
function createTable(people) {
	pagesCount = Math.ceil(data.JSON.length / rowsPerPage);

	const tableHeaders = ['First Name', 'Last Name', 'About', 'Eye Color'];

	const table = document.createElement('table');
	table.classList.add('table');
	
	const thead = document.createElement('thead');
	const trThead = document.createElement('tr');

	tableHeaders.forEach((title) => {
		const th = document.createElement('th');
		th.classList.add('no-select');
		th.textContent = title;
		trThead.appendChild(th);
	});

	thead.appendChild(trThead);
	table.appendChild(thead);

	const tbody = document.createElement('tbody');

	people.every((person, index) => {
		const tr = document.createElement('tr');
		tr.onclick = () => openModal(person, tr);

		const tdFirstName = document.createElement('td');
		tdFirstName.textContent = person.name.firstName;
		tr.appendChild(tdFirstName);

		const tdLastName = document.createElement('td');
		tdLastName.textContent = person.name.lastName;
		tr.appendChild(tdLastName);

		const tdAboutWrapper = document.createElement('td');
		tdAboutWrapper.classList.add('about-wrapper');
		const spanAbout = document.createElement('span');
		spanAbout.classList.add('about');
		spanAbout.textContent = person.about;
		tdAboutWrapper.appendChild(spanAbout);
		tr.appendChild(tdAboutWrapper);
	
		const tdEyeColor = document.createElement('td');
		tdEyeColor.classList.add('eye-color', 'no-select');
		tdEyeColor.style.backgroundColor = person.eyeColor;
		tdEyeColor.textContent = person.eyeColor;
		tr.appendChild(tdEyeColor);

		tbody.appendChild(tr);
		return index != 9;
	});

	table.appendChild(tbody);

	// замена заполнителя созданной таблицей
	document.querySelector('.table-placeholder').replaceWith(table);
	
}

function setColumnVisibility(checkBoxId, columnId) {
	var checkBox = document.getElementById(checkBoxId);
	
	// перебор строчек в таблице и изменение стиля
	// если нужно скрыть первый столбец скрывается первый дочерний элемент строки и тд
	let rows = document.querySelectorAll('tr');
	for (var item of rows) {
		if (checkBox.checked)
			item.classList.remove(columnId);
		else
			item.classList.add(columnId);
	}
}

// переход на следуюшую страницу
function onIncrementButtonClick() { setCurrentPage(currentPage + 1) } 

// переход на предыдущую страницу
function onDecrementButtonClick() { setCurrentPage(currentPage - 1) }

// создание секции пагинации
function createPaginationSection() {
	const paginationSection = document.createElement('div');
	paginationSection.classList.add('pagination-section')

	// кнопка перехода на предыдущую страницу
	const decrementButton = document.createElement('span');
	decrementButton.classList.add('button', 'no-select');;
	decrementButton.textContent = 'i--';
	decrementButton.onclick = onDecrementButtonClick;
	paginationSection.appendChild(decrementButton);

	buttonsCount = Math.min(Math.ceil(data.JSON.length / rowsPerPage), minButtonsCount);
	console.log('buttonsCount', buttonsCount);

	for (let i = 0; i < buttonsCount; i++) {

		// создание проиндексированных кнопок
		const button = document.createElement('span');
		
		button.classList.add('button', 'no-select');;
		if (i === currentPage)
			button.classList.add('button-active');
			
		button.textContent = i;
		button.onclick = () => { setCurrentPage(i); }
		paginationSection.appendChild(button);
	}

	// кнопка перехода на следующую страницу
	const incrementButton = document.createElement('span');
	incrementButton.classList.add('button', 'no-select');
	incrementButton.textContent = 'i++';
	incrementButton.onclick = onIncrementButtonClick;
	paginationSection.appendChild(incrementButton);

	document.querySelector('.pagination-section-placeholder').replaceWith(paginationSection);
}

// установка текущей страницы 
function setCurrentPage(number) {
	
	number = Math.min(Math.max(number, 0), pagesCount - 1);

	if (number === currentPage)
		return;
	
	currentPage = number;

	// высчитывание номера страницы, с которого отображается секция пагинации
	let startIndex;
	if (pagesCount - number < buttonsCount)
		startIndex = pagesCount - buttonsCount;
	else
		startIndex = number;

	const paginationSection = document.querySelector('.pagination-section');

	for (let i = 0; i < buttonsCount; i++) {
		let button = paginationSection.childNodes[1 + i];
		button.textContent = startIndex + i;
		
		if (startIndex + i === currentPage)
			button.classList.add('button-active');
		else
			button.classList.remove('button-active');
		
		button.onclick = () => { setCurrentPage(startIndex + i) }
	}

	const rows = document.querySelector('tbody').childNodes;

	let i = 0;
	rows.forEach((tr) => {
		const person = data.JSON[currentPage * rowsPerPage + i];
		if (person)
		{
			tr.classList.remove('hide');
			tr.onclick = () => openModal(person, tr);
		
		//	заполнение строки в таблице 
			tr.cells[0].textContent = person.name.firstName;
			tr.cells[1].textContent = person.name.lastName;
			tr.cells[2].children[0].textContent = person.about;
			tr.cells[3].textContent = person.eyeColor;
			tr.cells[3].style.backgroundColor = person.eyeColor;
			i++;
		}
		else
			tr.classList.add('hide');
			
	})
}

