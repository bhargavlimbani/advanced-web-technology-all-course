import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '../../shared/components/Modal';
import { Button } from '../../shared/components/Button';

export const BookForm = ({ isOpen, onClose, book, onSubmit }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: book || { title: '', author: '', category: '', totalCopies: 1 }
  });

  useEffect(() => {
    if (book) {
      reset(book);
    } else {
      reset({ title: '', author: '', category: '', totalCopies: 1 });
    }
  }, [book, reset]);

  const submitForm = (data) => {
    const total = parseInt(data.totalCopies, 10);
    onSubmit({ 
      ...book, 
      ...data, 
      totalCopies: total, 
      availableCopies: book ? (book.availableCopies + (total - book.totalCopies)) : total 
    });
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={book ? 'Edit Book' : 'Add New Book'}>
      <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
          <input
            {...register('title', { required: 'Title is required' })}
            className={`w-full px-4 py-2 rounded-xl border \${errors.title ? 'border-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-primary-500'} bg-white dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2`}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Author</label>
          <input
            {...register('author', { required: 'Author is required' })}
            className={`w-full px-4 py-2 rounded-xl border \${errors.author ? 'border-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-primary-500'} bg-white dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2`}
          />
          {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
          <input
            {...register('category', { required: 'Category is required' })}
            className={`w-full px-4 py-2 rounded-xl border \${errors.category ? 'border-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-primary-500'} bg-white dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2`}
          />
        </div>

        <div>
           <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Total Copies</label>
           <input
            type="number"
            min="1"
            {...register('totalCopies', { required: 'Required', min: 1 })}
            className={`w-full px-4 py-2 rounded-xl border \${errors.totalCopies ? 'border-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-primary-500'} bg-white dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2`}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-700">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save Book</Button>
        </div>
      </form>
    </Modal>
  );
};
