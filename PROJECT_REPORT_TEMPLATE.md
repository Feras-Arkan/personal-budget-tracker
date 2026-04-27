# Internet Programming Project Report

## Altinbas University - Software Engineering Department

- Instructor: F. Kuzey Edes Huyal
- Due Date: 30 April 2026
- Submission Type: Manual / Printed Submission

## Student Information

- Student Name Surname: [Write your full name]
- Student Number: [Write your student number]
- GitHub Username: Feras-Arkan
- Public GitHub Repository Link: https://github.com/Feras-Arkan/personal-budget-tracker.git

---

## 1) Website Aim and Target Users

This project is called **Personal Budget Tracker**. The main aim of the website is to help users manage their money in a simple and visual way. Many students and young professionals do not track how much they spend every day, and this causes financial stress at the end of the month. I designed this project to solve that problem by allowing users to record income and expenses, categorize their transactions, and see spending patterns clearly.

The target users are mainly:

- University students who want to control monthly spending
- Young employees with fixed salary and variable expenses
- Anyone who needs a lightweight personal finance tool

The app focuses on clarity and speed. Users can add transactions in seconds, filter records by category or date, and view chart-based summaries. This combination helps users make better financial decisions. For example, a user can quickly discover that most expenses come from food or transportation and then adjust spending habits.

Another important project goal is educational value. I built this app to practice full-stack web development with HTML, CSS, JavaScript, backend APIs, and a real database. This project demonstrates how frontend and backend systems communicate in a practical scenario.

---

## 2) HTML Structure Used in the Project

The website uses semantic and organized HTML in `public/index.html`. The page is divided into clear sections:

1. **Header section**
   - Contains the app title and short description
   - Helps users understand the app purpose immediately

2. **Add Transaction form**
   - Includes form controls for type, amount, category, date, and note
   - Uses labels and required attributes for accessibility and validation
   - Contains submit and cancel-edit buttons

3. **Filter section**
   - Includes controls for filtering by type, category, date from, and date to
   - Includes clear filter button for quick reset

4. **Transactions table**
   - Displays transaction list in rows
   - Columns: ID, Type, Amount, Category, Date, Note, Action
   - Action buttons include edit and delete

5. **Chart sections**
   - A canvas for expense-by-category pie chart
   - A canvas for income-vs-expense bar chart

The HTML structure supports maintainability. Each element has clear IDs and class names so JavaScript can target it easily and CSS can style it consistently.

---

## 3) CSS Styling and Design Choices

The CSS file (`public/css/style.css`) was written to make the interface clean, readable, and responsive. I used a card-based layout with soft background colors and rounded corners to create a modern UI style.

Main design choices:

- **Color coding**
  - Income text is green
  - Expense text is red
  - This visual distinction improves readability immediately

- **Responsive grid**
  - The app layout switches between one and two columns depending on screen width
  - Forms and filter controls adapt on small screens

- **Buttons and interaction styles**
  - Primary button for submit
  - Secondary button for reset/cancel actions
  - Separate color for delete button to communicate destructive action

- **Table usability**
  - Horizontal scrolling for smaller screens
  - Sticky table header for easier reading with long lists

- **Message feedback**
  - Success and error colors provide direct user feedback after API actions

My goal in styling was to keep the interface simple and practical for daily use instead of adding unnecessary visual complexity.

---

## 4) JavaScript Usage and Dynamic Features

JavaScript (`public/js/app.js`) provides the dynamic behavior of the app. The main logic includes:

1. **CRUD operations with Fetch API**
   - `GET` loads transactions from backend
   - `POST` creates new transaction
   - `PUT` updates selected transaction
   - `DELETE` removes selected transaction

2. **Form handling**
   - Reads values from form controls
   - Converts amount to number
   - Sends JSON payload to API
   - Resets form after successful operation

3. **Edit mode**
   - Clicking edit button loads transaction data into form
   - Submit button text changes to "Update Transaction"
   - Cancel button exits edit mode and resets form

4. **Filtering**
   - Client-side filtering by type, category, and date range
   - Filters apply instantly as user changes inputs

5. **Summary calculation**
   - Calculates total income, total expense, and current balance
   - Re-renders whenever data changes

6. **Charts update**
   - Pie chart grouped by expense categories
   - Bar chart compares income and expense totals
   - Charts refresh after create/update/delete and filter changes

This JavaScript structure shows practical use of DOM manipulation, event handling, asynchronous API calls, and data transformation.

---

## 5) Database Usage and Data Handling

The backend uses SQLite for persistent storage. The database file is `data/budget.db`. On server startup, the app creates the `transactions` table automatically if it does not exist.

Table fields:

- `id` (primary key, auto increment)
- `type` (`income` or `expense`)
- `amount` (positive number)
- `category` (text)
- `date` (text date)
- `note` (optional text)
- `created_at` (timestamp)

Data handling flow:

1. User submits form in frontend.
2. Frontend sends request to Express API.
3. Backend validates values.
4. SQL query runs (`INSERT`, `SELECT`, `UPDATE`, `DELETE`).
5. JSON response is returned to frontend.
6. Frontend refreshes table, summary, and charts.

Using SQLite is suitable for this project because it is lightweight, fast for local usage, and does not require external database server setup.

---

## 6) Main Pages of the Website

Although the app is built as a single-page interface, it has clearly separated functional sections that behave like main pages:

- Add Transaction area (data entry)
- Filters area (search and refine)
- Transactions list area (records management)
- Charts area (analysis and insights)

This design keeps user flow simple. Instead of navigating many pages, users can complete all actions in one place. For personal budgeting, this improves usability and reduces confusion.

---

## 7) Navigation and User Experience

The website is designed for straightforward navigation:

- Top section identifies purpose immediately
- Input form is placed first to encourage quick data entry
- Filters are nearby for faster search
- Table and charts are below to review results

Important UX details:

- Required form fields prevent incomplete entries
- Clear success/error messages communicate operation result
- Delete confirmation avoids accidental data loss
- Edit mode clearly changes button labels and behavior
- Responsive design supports mobile/laptop use

Overall, the user experience prioritizes clarity, speed, and predictable behavior.

---

## 8) Challenges Faced and Solutions Applied

During development, I faced several challenges:

1. **Keeping charts synchronized with filtered data**
   - At first, charts and table did not always match.
   - Solution: I made rendering pipeline update table, summary, and charts from the same filtered dataset.

2. **Edit and create behavior conflict**
   - Using one form for both operations caused confusion.
   - Solution: Added explicit edit mode state and reset function to switch modes safely.

3. **Data validation consistency**
   - Invalid inputs could break logic if only frontend validation existed.
   - Solution: Added backend validation for type, amount, category, and date before SQL operations.

4. **Delete safety**
   - Single-click delete risked accidental removal.
   - Solution: Added confirmation dialog and clear red delete button style.

These challenges improved the quality of the final application and helped me better understand full-stack debugging.

---

## 9) GitHub Username and Public Repository Link

- GitHub Username: Feras-Arkan
- Public Repository Link: https://github.com/Feras-Arkan/personal-budget-tracker.git

I used GitHub to track project versions and backup my code. A public repository allows the instructor to review implementation details and commit history.

---

## 10) Overall Organization, Language Quality, and Manual Submission

I organized this project with clear folder structure, readable code style, and separated concerns between frontend and backend. I also wrote meaningful variable names and reusable functions to improve maintainability. The final interface is clean and practical, and the backend API supports full transaction management.

This report explains not only what I built but also how I built it and why I chose each approach. I paid attention to rubric requirements, especially technical explanation and personal understanding of the implementation process.

For manual submission, I will:

- Print this report
- Include screenshots with explanations
- Include student information and GitHub link
- Sign inside the report
- Sign the additional submission list as required

---

## Screenshot Section (Add Your Own Images)

### Screenshot 1 - Main Dashboard Interface
[Paste image]

Explanation: This screenshot shows the main interface including transaction form, filters, and transactions table. It is important because it demonstrates the core workflow of entering and reviewing budget data.

### Screenshot 2 - Added Transactions and Summary
[Paste image]

Explanation: This screenshot shows multiple records and summary pills (income, expense, balance). It proves that dynamic calculations are working correctly.

### Screenshot 3 - Charts Section
[Paste image]

Explanation: This screenshot shows the expense-by-category pie chart and income-vs-expense bar chart. It is important because users can visually analyze spending behavior.

### Screenshot 4 - Edit Transaction Mode
[Paste image]

Explanation: This screenshot shows the form populated for editing and the update/cancel buttons. It demonstrates update functionality and improved user control.

### Screenshot 5 - Filtered Results
[Paste image]

Explanation: This screenshot shows filtered transactions (for example, expense only or specific date range). It demonstrates search and analysis functionality.

---

## Conclusion

This project helped me apply full-stack web development concepts in a practical and meaningful way. I developed a Personal Budget Tracker that solves a real user problem: controlling personal finances. The project includes structured HTML, responsive CSS, dynamic JavaScript, backend API logic, and persistent SQLite storage. I also improved the application through testing, feedback, and UI refinements.

Most importantly, I learned how frontend, backend, and database layers work together as one system. This experience increased my confidence in building usable web applications and prepared me for more advanced software engineering projects.

---

Student Signature: _________________________

