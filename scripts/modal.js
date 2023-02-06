const modal = document.getElementById("modal");

// заполнение формы
function setFormData(person) {
	document.getElementsByName('id')[0].value = person.id;
	document.getElementsByName('firstName')[0].value = person.name.firstName;
	document.getElementsByName('lastName')[0].value = person.name.lastName;
	document.getElementsByName('phone')[0].value = person.phone;
	document.getElementsByName('about')[0].value = person.about;
	document.getElementsByName('eyeColor')[0].value = standardizeColor(person.eyeColor);
}

function openModal(person, tr) {

	// отображение модального окна с формой
	document.getElementById('modal').style.display = 'block';
	setFormData(person); // заполнение формы

	// привязка функции обратного вызова для оброботки нажатия на кнопку 'отменить изменения' 
	document.getElementById('reset-button').onclick = () => {
		setFormData(person);
	}

	// привязка функции обратного вызова для оброботки нажатия на кнопку 'сохранить' 
	document.getElementById('submit-button').onclick = () => {

		// изменение записи пользователя в таблице
		tr.cells[0].textContent = document.getElementsByName('firstName')[0].value;
		tr.cells[1].textContent = document.getElementsByName('lastName')[0].value;
		tr.cells[2].children[0].textContent = document.getElementsByName('about')[0].value;
		
		const newEyeColor = document.getElementsByName('eyeColor')[0].value;
		tr.cells[3].style.backgroundColor = newEyeColor;
		tr.cells[3].textContent = newEyeColor;

		// изменение записи пользователя в json данных 
		let obj = data.JSON.find((value) => { return value === person });
		obj.id = document.getElementsByName('id')[0].value;
		obj.name.firstName = document.getElementsByName('firstName')[0].value;
		obj.name.lastName = document.getElementsByName('lastName')[0].value;
		obj.phone = document.getElementsByName('phone')[0].value;
		obj.about = document.getElementsByName('about')[0].value;
		obj.eyeColor = document.getElementsByName('eyeColor')[0].value;

		onCloseButtonClick(); // закрытие модального окна
	}
}

function onCloseButtonClick() {
	modal.style.display = 'none'; // закрытие модального окна
}

// функция получения hex кода цвета
function standardizeColor(str) {
	var ctx = document.createElement('canvas').getContext('2d');
	ctx.fillStyle = str;
	return ctx.fillStyle;
}
