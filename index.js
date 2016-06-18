var state = {items: []},
		data = localStorage.getItem('data');

if (data) {
	state = JSON.parse(data);
};

window.addEventListener('DOMContentLoaded', function () {
	var count = document.querySelector('.count'),
			errorMessage = document.querySelector('.error-message'),
			generateField = document.querySelector('.generateField'),
			mainGame = document.querySelector('.mainGame'),
			startNewGame = document.querySelector('.startNewGame'),
			winnerMessage = document.querySelector('.winner-message'),
			field = document.querySelector('.field'),
			pattern = /\d{1,2}x\d{1,2}$/i,
			mov = 'x';

	count.setAttribute('maxlength', '5');
	
	function createField() {
		if (field.children.length != 0) {
			var forDel = field.querySelectorAll('*');
			for (var i = 0; i < forDel.length; i++) {
				forDel[i].parentNode.removeChild(forDel[i]);
			}
		}
		var countValue = count.value;
		if (countValue.match(pattern) != null) {
			var rowCell = countValue.split(/x/i),
					row = parseInt(rowCell[0]),
					cell = parseInt(rowCell[1]);
			if (row < 3 || row > 15 || cell < 3 || cell > 15) {
				errorMessage.innerHTML = 'Количество строк и колонок должно быть в диапазоне от 3 до 15!';
			} else {
				var cellFragment = document.createDocumentFragment(),
						rowFragment = document.createDocumentFragment();
				for (var i = 0; i < row; i++) {
					var onerow = document.createElement('div');
					onerow.classList.add('row');
					for (var j = 0; j < cell; j++) {
						var onecell = document.createElement('div');
						onecell.classList.add('cell');
						cellFragment.appendChild(onecell);
					}
					onerow.appendChild(cellFragment);
					rowFragment.appendChild(onerow);
				}
				field.appendChild(rowFragment);
				mainGame.style.display = 'block';
				errorMessage.innerHTML = '';
			}
		} else {
			errorMessage.innerHTML = 'Неверно введены параметры. Пример 3x3 или 10x11';
		}
	}
	generateField.addEventListener('click', createField);

	function clearField() {
		var cell = document.querySelectorAll('.cell');
		for (var i = 0; i < cell.length; i++) {
			cell[i].classList.remove('x', 'o');
		};
		mov = 'x';
		winnerMessage.innerHTML = '';
	}
	startNewGame.addEventListener('click', clearField);

	function addXO(e) {
		if (e.target.classList.contains('x') || e.target.classList.contains('o') || !e.target.classList.contains('cell')) return;
		if (getWinner()) return;
		e.target.classList.add(mov);
		if (mov == 'x') {
			mov = 'o';
		} else {
			mov = 'x';
		}
		if (getWinner()) {
			if (getWinner() == 'x') {
				winnerMessage.innerHTML = 'X WIN!!!';
			} else if (getWinner() == 'o') {
				winnerMessage.innerHTML = 'O WIN!!!';
			} else {
				winnerMessage.innerHTML = 'NO ONE WINNER';
			}
		}
	}
	field.addEventListener('click', addXO);

	function getWinner() {
		var getWinRow = document.querySelectorAll('.row'),
				getWinCellInRow = getWinRow[0].querySelectorAll('.cell'),
				cells = [],
				rows = [],
				rowcell = [],
				cellrow = [],
				ab = getWinRow.length - getWinCellInRow.length;

		for (var i = 0; i < getWinCellInRow.length; i++) {
			rows[i] = [];
		}

		for (var i = 0; i < getWinRow.length; i++) {
			cells[i] = [];
			getWinCellInRow = getWinRow[i].querySelectorAll('.cell');
			for (var j = 0; j < getWinCellInRow.length; j++) {
				if (getWinCellInRow[j].classList.contains('x')) {
					cells[i][j] = 'x';
					rows[j][i] = 'x';
				}
				if (getWinCellInRow[j].classList.contains('o')) {
					cells[i][j] = 'o';
					rows[j][i] = 'o';
				}
			}
		}
		for (var k = 0; k <= Math.abs(ab)+1; k++) {
			rowcell[k] = [];
			for (var i = 0; i < getWinRow.length; i++) {
				getWinCellInRow = getWinRow[i].querySelectorAll('.cell');
				for (var j = 0; j < getWinCellInRow.length; j++) {
					if (ab < 0) {
						if ((j == (k + i)) && (getWinCellInRow[j].classList.contains('x'))) rowcell[k][j-k] = 'x';
						if ((j == (k + i)) && (getWinCellInRow[j].classList.contains('o'))) rowcell[k][j-k] = 'o';
					} else {
						if ((i == (k + j)) && (getWinCellInRow[j].classList.contains('x'))) rowcell[k][i-k] = 'x';
						if ((i == (k + j)) && (getWinCellInRow[j].classList.contains('o'))) rowcell[k][i-k] = 'o';
					}
				}
			}
		}

		for (var k = 0; k <= Math.abs(ab); k++) {
			cellrow[k] = [];
			for (var i = 0; i < getWinRow.length; i++) {
				getWinCellInRow = getWinRow[i].querySelectorAll('.cell');
				for (var j = 0; j < getWinCellInRow.length; j++) {
					if (ab < 0) {
						if (((getWinCellInRow.length - j - 1) == (k + i)) && (getWinCellInRow[j].classList.contains('x'))) cellrow[k][i] = 'x';
						if (((getWinCellInRow.length - j - 1) == (k + i)) && (getWinCellInRow[j].classList.contains('o'))) cellrow[k][i] = 'o';
					} else {
						if (((getWinRow.length - i - 1) == (k + j)) && (getWinCellInRow[j].classList.contains('x'))) cellrow[k][j] = 'x';
						if (((getWinRow.length - i - 1) == (k + j)) && (getWinCellInRow[j].classList.contains('o'))) cellrow[k][j] = 'o';
					}
				}
			}
		}

		function isX(element, index, array) {
			return element == 'x';
		}
		function isO(element, index, array) {
			return element == 'o';
		}

		for (var i = 0; i < getWinRow.length; i++) {
			if (cells[i].filter(isX).length == getWinCellInRow.length) return 'x';
			if (cells[i].filter(isO).length == getWinCellInRow.length) return 'o';
		}

		for (var i = 0; i < getWinCellInRow.length; i++) {
			if (rows[i].filter(isX).length == getWinRow.length) return 'x';
			if (rows[i].filter(isO).length == getWinRow.length) return 'o';
		}

		for (var i = 0; i < rowcell.length; i++) {
			if ((rowcell[i].filter(isX).length == getWinRow.length) || (rowcell[i].filter(isX).length == getWinCellInRow.length)) return 'x';
			if ((rowcell[i].filter(isO).length == getWinRow.length) || (rowcell[i].filter(isO).length == getWinCellInRow.length)) return 'o';
		}

		for (var i = 0; i < cellrow.length; i++) {
			if ((cellrow[i].filter(isX).length == getWinRow.length) || (cellrow[i].filter(isX).length == getWinCellInRow.length)) return 'x';
			if ((cellrow[i].filter(isO).length == getWinRow.length) || (cellrow[i].filter(isO).length == getWinCellInRow.length)) return 'o';
		}
	}

});