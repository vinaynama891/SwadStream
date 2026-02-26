import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const API_BASE = 'http://localhost:3000/api'

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const VideoReelCard = ({
  video,
  isActive,
  onVisitStore,
  onLike,
  onSave,
  onOpenComments,
  isLiked,
  isSaved,
  likeCount,
}) => {
  return (
    <div className="reel-card">
      <div className="reel-video-wrap">
        <video
          src={video.video}
          className="reel-video"
          loop
          muted
          playsInline
          autoPlay={isActive}
        />
      </div>

      <div className="reel-overlay">
        <button type="button" className="reel-visit-store-btn" onClick={() => onVisitStore(video)}>
          Visit store
        </button>
        <p className="reel-description" title={video.description}>
          {video.description || ''}
        </p>
      </div>

      <div className="reel-actions">
        

        <button
          type="button"
          className="reel-action-btn"
          onClick={() => onOpenComments(video._id)}
          title="Comments"
        >
          💬
        </button>

        <button
          type="button"
          className={`reel-action-btn ${isSaved ? 'reel-action-btn--active' : ''}`}
          onClick={() => onSave(video._id)}
          title="Save"
        >
          {isSaved ? '🔖' : '📑'}
        </button>
      </div>
    </div>
  )
}

const CommentModal = ({
  isOpen,
  onClose,
  reel,
  comments,
  commentText,
  onCommentChange,
  onAddComment,
  onDeleteComment,
}) => {
  if (!isOpen || !reel) return null

  return (
    <div className="comment-modal-overlay">
      <div className="comment-modal">
        <div className="comment-modal-header">
          <h3>Comments</h3>
          <button type="button" className="comment-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="comment-modal-body">
          <div className="comment-modal-list">
            {(comments || []).map((c) => (
              <div key={c._id || `${c.user?._id}-${c.createdAt}`} className="comment-modal-item">
                <div className="comment-modal-item-text">
                  <strong>{c.user?.fullName || 'User'}:</strong> {c.text}
                </div>
                <button
                  type="button"
                  className="comment-modal-delete"
                  onClick={() => onDeleteComment(reel._id, c._id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="comment-modal-input">
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => onCommentChange(reel._id, e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onAddComment(reel._id)}
          />
          <button type="button" onClick={() => onAddComment(reel._id)}>
            Post
          </button>
        </div>
      </div>
    </div>
  )
}

const Home = () => {
  const containerRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [savedIds, setSavedIds] = useState([])
  const [likedIds, setLikedIds] = useState([])
  const [comments, setComments] = useState({})
  const [commentTexts, setCommentTexts] = useState({})
  const [likeCounts, setLikeCounts] = useState({})
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false)
  const [activeCommentReelId, setActiveCommentReelId] = useState(null)
  const navigate = useNavigate()

  const handleScroll = () => {
    if (!containerRef.current) return
    const { scrollTop, clientHeight } = containerRef.current
    const index = Math.round(scrollTop / clientHeight)
    setActiveIndex(index)
  }

  const handleVisitStore = (video) => {
    if (video.foodPartner) {
      navigate(`/store/${video.foodPartner}`)
    } else {
      navigate('/user/account')
    }
  }

  const fetchComments = (reelId) => {
    axios.get(`${API_BASE}/user/comments/${reelId}`, { withCredentials: true })
      .then(res => {
        setComments(prev => ({ ...prev, [reelId]: res.data.comments || [] }))
      })
      .catch(() => { })
  }

  const openComments = (reelId) => {
    setActiveCommentReelId(reelId)
    setIsCommentModalOpen(true)
    fetchComments(reelId)
  }

  const closeComments = () => {
    setIsCommentModalOpen(false)
    setActiveCommentReelId(null)
  }

  const handleDeleteComment = (reelId, commentId) => {
    if (!commentId) return
    axios
      .delete(`${API_BASE}/user/comment/${reelId}/${commentId}`, { withCredentials: true })
      .then((res) => {
        setComments((prev) => ({ ...prev, [reelId]: res.data.comments || [] }))
      })
      .catch(() => { })
  }

  useEffect(() => {
    axios.get(`${API_BASE}/food`, { withCredentials: true })
      .then(response => {
        if (response.data && response.data.foodItems) {
          const items = shuffleArray(response.data.foodItems)
          setVideos(items)
          const counts = {}
          items.forEach(v => {
            counts[v._id] = v.likes?.length ?? 0
            fetchComments(v._id)
          })
          setLikeCounts(counts)
        }
      })
      .catch(() => setVideos([]))
      .finally(() => setLoading(false))

    axios.get(`${API_BASE}/user/saved-liked-ids`, { withCredentials: true })
      .then(res => {
        setSavedIds(res.data.savedIds || [])
        setLikedIds(res.data.likedIds || [])
      })
      .catch(() => { })
  }, [])

  const handleLike = (reelId) => {
    console.log(reelId)
    const isLiked = likedIds.includes(String(reelId))
    axios[isLiked ? 'delete' : 'post'](`${API_BASE}/user/like-reel/${reelId}`, {}, { withCredentials: true })
      .then((res) => {
        setLikedIds(prev => (isLiked ? prev.filter(id => id !== String(reelId)) : [...prev, String(reelId)]))
        const count = res.data?.likeCount ?? (likeCounts[reelId] || 0) + (isLiked ? -1 : 1)
        setLikeCounts(prev => ({ ...prev, [reelId]: count }))
      })
      .catch((err) => {
        console.error('Like error:', err.response?.status, err.response?.data)
        // Optional: alert(err.response?.data?.message || 'Please log in to like')
      })
  }

  const handleSave = (reelId) => {
    const isSaved = savedIds.includes(reelId)
    axios[isSaved ? 'delete' : 'post'](`${API_BASE}/user/save-reel/${reelId}`, {}, { withCredentials: true })
      .then(() => {
        setSavedIds(prev => (isSaved ? prev.filter(id => id !== reelId) : [...prev, reelId]))
      })
      .catch(() => { })
  }

  const handleAddComment = (reelId) => {
    const text = commentTexts[reelId] || ''
    if (!text.trim()) return
    axios.post(`${API_BASE}/user/comment/${reelId}`, { text }, { withCredentials: true })
      .then(res => {
        setComments(prev => ({ ...prev, [reelId]: res.data.comments || [] }))
        setCommentTexts(prev => ({ ...prev, [reelId]: '' }))
      })
      .catch(() => { })
  }

  const handleCommentChange = (reelId, value) => {
    setCommentTexts(prev => ({ ...prev, [reelId]: value }))
  }

  if (loading) {
    return (
      <div className="reels-container">
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          Loading reels...
        </div>
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="reels-container">
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          No reels available yet
        </div>
      </div>
    )
  }

  const activeReel = activeCommentReelId
    ? videos.find((v) => v._id === activeCommentReelId)
    : null

  return (
    <div className="reels-container" ref={containerRef} onScroll={handleScroll}>
      <button 
        className="back-button home-back-button"
        onClick={() => navigate(-1)}
        title="Go Back"
      >
        ← Back
      </button>
      {videos.map((video, index) => (
        <VideoReelCard
          key={video._id || index}
          video={video}
          isActive={index === activeIndex}
          onVisitStore={handleVisitStore}
          onLike={handleLike}
          onSave={handleSave}
          onOpenComments={openComments}
          isLiked={likedIds.includes(String(video._id))}
          isSaved={savedIds.includes(video._id)}
          likeCount={likeCounts[video._id] ?? video.likes?.length ?? 0}
        />
      ))}

      {activeReel && (
        <CommentModal
          isOpen={isCommentModalOpen}
          onClose={closeComments}
          reel={activeReel}
          comments={comments[activeReel._id]}
          commentText={commentTexts[activeReel._id] || ''}
          onCommentChange={handleCommentChange}
          onAddComment={handleAddComment}
          onDeleteComment={handleDeleteComment}
        />
      )}
    </div>
  )
}

export default Home