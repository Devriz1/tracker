document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const descriptionInput = document.getElementById('description');
    const amountInput = document.getElementById('amount');
    const expenseList = document.getElementById('expense-list');
    const totalAmountElem = document.getElementById('total-amount');
    const downloadBtn = document.getElementById('download-btn');

    let totalAmount = 0;

    // Load expenses from localStorage on page load
    function loadExpenses() {
        const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        expenses.forEach(expense => addExpense(expense.description, expense.amount));
    }

    function updateTotalAmount() {
        totalAmountElem.textContent = `₹${totalAmount.toFixed(2)}`;
    }

    function addExpense(description, amount) {
        const listItem = document.createElement('li');
        listItem.className = 'expense-item';

        const amountText = document.createElement('span');
        amountText.textContent = `${description}: ₹${amount.toFixed(2)}`;
        listItem.appendChild(amountText);

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.className = 'remove-btn';
        removeButton.addEventListener('click', () => {
            if (confirm('Are you sure you want to remove this expense?')) {
                removeExpense(amount, listItem);
            }
        });
        listItem.appendChild(removeButton);

        expenseList.appendChild(listItem);

        totalAmount += parseFloat(amount);
        updateTotalAmount();

        saveExpenses();
    }

    function removeExpense(amount, listItem) {
        totalAmount -= parseFloat(amount);
        updateTotalAmount();
        expenseList.removeChild(listItem);
        saveExpenses();
    }

    function saveExpenses() {
        const expenses = [];
        expenseList.querySelectorAll('li').forEach(item => {
            const text = item.querySelector('span').textContent;
            const [description, amount] = text.split(': ₹');
            expenses.push({
                description: description.trim(),
                amount: parseFloat(amount)
            });
        });
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }

    expenseForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const description = descriptionInput.value.trim();
        const amount = parseFloat(amountInput.value);

        if (description && !isNaN(amount) && amount > 0) {
            addExpense(description, amount);

            descriptionInput.value = '';
            amountInput.value = '';
        } else {
            alert('Please enter a valid description and amount.');
        }
    });

    // Initialize expenses on page load
    loadExpenses();

    // Download expenses as a text file
    function downloadExpenses() {
        if (confirm('Do you want to download your  expenses file?')) {
            const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
            let fileContent = 'Description,Amount\n';

            expenses.forEach(expense => {
                fileContent += `${expense.description},₹${expense.amount.toFixed(2)}\n`;
            });

            const blob = new Blob([fileContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'expenses.txt';
            a.click();
            URL.revokeObjectURL(url);

            // Optional: Alert the user that the file is being downloaded
            // alert('Your expenses file is being downloaded.');
        }
    }

    downloadBtn.addEventListener('click', downloadExpenses);
});
