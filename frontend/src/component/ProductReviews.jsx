import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { authDataContext } from '../context/AuthContext';
import { FaStar } from "react-icons/fa";
import Loading from './Loading';

function ProductReviews({ productData, onReviewAdded }) {
  const { serverUrl } = useContext(authDataContext);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  // Fallback to empty array
  const reviews = productData.reviews || [];

  const submitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/product/review/${productData._id}`,
        { rating, comment },
        { withCredentials: true }
      );
      toast.success(result.data.message || 'Review added successfully!');
      setComment('');
      setRating(5);
      if (onReviewAdded) onReviewAdded();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col gap-8'>
      {/* Review Form */}
      <div className='bg-white p-6 rounded-2xl border border-gray-100 shadow-sm'>
        <h3 className='text-lg font-bold text-gray-900 mb-4'>Write a Review</h3>
        <form onSubmit={submitReview} className='flex flex-col gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Rating</label>
            <div className='flex gap-2 mb-2'>
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  size={24}
                  className={`cursor-pointer transition-colors ${star <= rating ? 'text-[#FFD700]' : 'text-gray-200'}`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Comment</label>
            <textarea
              className='w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm resize-none'
              rows='4'
              placeholder='What did you think about this product?'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={loading}
            ></textarea>
          </div>
          <button
            type='submit'
            disabled={loading}
            className='self-start px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-600/20 active:scale-95 disabled:opacity-70 flex justify-center items-center'
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>

      {/* Review List */}
      <div>
        <h3 className='text-lg font-bold text-gray-900 mb-6'>Customer Reviews ({reviews.length})</h3>
        {reviews.length === 0 ? (
          <p className='text-gray-500 italic bg-gray-50 p-6 rounded-xl border border-gray-100'>No reviews yet. Be the first to review!</p>
        ) : (
          <div className='flex flex-col gap-4'>
            {reviews.map((rev, idx) => (
              <div key={idx} className='bg-gray-50 p-5 rounded-xl border border-gray-100'>
                <div className='flex items-center justify-between mb-2'>
                  <p className='font-bold text-gray-900'>{rev.name}</p>
                  <p className='text-xs text-gray-400 font-medium'>
                    {new Date(rev.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <div className='flex gap-1 mb-3'>
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} size={14} className={i < rev.rating ? 'text-[#FFD700]' : 'text-gray-200'} />
                  ))}
                </div>
                <p className='text-gray-600 text-sm leading-relaxed'>{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductReviews;
