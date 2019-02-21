const tableData = document.querySelector('#tableData');
const thead = document.querySelector('thead');
const rows = [...tableData.rows];
const orders = [1, 1, 1, 1, 1, 1, 1, 1];

const sort = (header, col, type) => {
	let rowCount = rows.length;
	rows.sort((a, b) => {
		if (type === 'text') {
			let i = a.children[col].firstChild.nodeValue;
			let j = b.children[col].firstChild.nodeValue;

			if (i === j) {
				//?? why won't it let me abstract this?
				return 0;
			} else if (i > j) {
				return orders[col];
			} else {
				return -orders[col];
			}
		} else if (type === 'number') {
			let i = parseInt(a.children[col].firstChild.nodeValue, 10);
			let j = parseInt(b.children[col].firstChild.nodeValue, 10);

			if (i === j) {
				return 0;
			} else if (i > j) {
				return orders[col]; //?? what is happening here?
			} else {
				return -orders[col];
			}
		}
	});

	orders[col] *= -1; //??
	activeHeader(header);
	sortIndicator(header, orders[col]);
	while (tableData.lastChild) tableData.lastChild.remove();
	while (rowCount--) tableData.prepend(rows[rowCount]);
};

const activeHeader = header => {
	const thArray = Array.from(thead.querySelectorAll('th'));
	thArray.forEach(th => {
		th.className = '';
		th.removeAttribute('aria-label');
		if (th === header) {
			th.classList.add('active');
		}
	});
};

const sortIndicator = (header, ordering) => {
	if (ordering === 1) {
		header.classList.remove('asc');
		header.classList.add('desc');
		header.setAttribute(
			'aria-label',
			'sort by ' + header.innerHTML + ' in descending order'
		);
	} else if (ordering === -1) {
		header.classList.remove('desc');
		header.classList.add('asc');
		header.setAttribute(
			'aria-label',
			'sort by ' + header.innerHTML + ' in ascending order'
		);
	}
};

thead.addEventListener('click', event => {
	let target = event.target;
	let type = target.dataset.type;
	if (target.nodeName.toLowerCase() === 'th') {
		//this is for robustness and not strictly necessary in my code
		sort(target, target.cellIndex, type);
	}
});
