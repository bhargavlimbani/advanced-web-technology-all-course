export const initialBooks = [
  { id: 1, title: 'Clean Code', author: 'Robert C. Martin', category: 'Software Engineering', totalCopies: 5, availableCopies: 2 },
  { id: 2, title: 'The Pragmatic Programmer', author: 'Andrew Hunt', category: 'Software Engineering', totalCopies: 3, availableCopies: 3 },
  { id: 3, title: 'Design Patterns', author: 'Erich Gamma', category: 'Computer Science', totalCopies: 2, availableCopies: 0 },
  { id: 4, title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', category: 'Computer Science', totalCopies: 4, availableCopies: 1 },
];

export const initialTransactions = [
  { id: 101, bookId: 1, userId: 'student', issueDate: '2023-10-01', dueDate: '2023-10-15', returnDate: null, fine: 0, status: 'issued' },
  { id: 102, bookId: 3, userId: 'student', issueDate: '2023-09-15', dueDate: '2023-09-29', returnDate: '2023-10-05', fine: 30, status: 'returned' },
];

export const initialUsers = [
  { id: 'student', name: 'John Doe', email: 'student@university.edu', role: 'student' },
  { id: 'librarian', name: 'Admin Jane', email: 'admin@university.edu', role: 'librarian' },
];
