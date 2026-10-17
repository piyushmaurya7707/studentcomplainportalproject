import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  ThumbsUp, MessageSquare, Share2, Send, CheckCircle2,
  Clock, AlertCircle, Search, Bell, Megaphone,
  Home, UserCircle2, MoreHorizontal, Image as ImageIcon,
  Edit3, Trash2, Flag, X, Link2, TrendingUp, Loader2,
  ChevronDown, Filter, ArrowUpDown, BellOff, Check, Sparkles
} from "lucide-react";
import "./OtherComplaint.css";

// ==================== SEED DATA ====================
const seedPosts = [
  {
    id: 1,
    authorId: "seed-aarav",
    studentName: "Aarav Mehta",
    department: "B.Tech Computer Science · 3rd Year",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav",
    title: "Library AC broken during summer exams",
    description: "It has been over 5 days since the main AC unit on the 2nd floor of the library broke down. With semester exams starting next week, the study rooms are completely unusable due to the heat. We tried talking to the supervisor but got no firm timeline.",
    banner: "Escalated to the Dean of Student Affairs",
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800",
    upvotes: 142,
    upvotedByMe: false,
    status: "Under Review",
    category: "Facilities",
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
    comments: [
      { id: 101, authorId: "seed-1", author: "Sneha Rao", text: "Completely agree, it is impossible to sit there for more than 10 minutes.", mine: false },
      { id: 102, authorId: "seed-2", author: "Prof. K. Sharma", text: "I have escalated this directly to the Dean of student affairs.", mine: false }
    ]
  },
  {
    id: 2,
    authorId: "seed-priya",
    studentName: "Priya Sharma",
    department: "MBA · 1st Year",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    title: "Water dispenser in Block C dispensing dirty water",
    description: "The main water purification outlet in Hostel Block C is dispensing brownish, metallic-tasting water. This is a severe health hazard. Many students are forced to buy plastic water bottles just to survive the day.",
    banner: "Flagged as a health & safety hazard",
    mediaType: "video",
    mediaUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    upvotes: 89,
    upvotedByMe: false,
    status: "Pending",
    category: "Hygiene",
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
    comments: []
  },
  {
    id: 3,
    authorId: "seed-rohan",
    studentName: "Rohan Das",
    department: "B.Sc Physics",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan",
    title: "Resolved: Streetlights on campus backroad repaired!",
    description: "Huge thanks to the campus maintenance team! All 4 broken streetlights along the back road leading to the girl's hostel have been fixed and upgraded to bright LED lamps. The road feels much safer to walk on at night now.",
    banner: "Fixed within 48 hours of reporting",
    mediaType: "none",
    mediaUrl: null,
    upvotes: 312,
    upvotedByMe: true,
    status: "Resolved",
    category: "Safety",
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
    comments: [
      { id: 103, authorId: "seed-3", author: "Anjali Nair", text: "This is amazing! Thank you for raising this issue.", mine: false }
    ]
  }
];

const storyAvatars = [
  { name: "Tanya", seed: "Tanya" },
  { name: "Steve", seed: "Steve" },
  { name: "An Wen", seed: "AnWen" },
  { name: "Melina", seed: "Melina" },
  { name: "Claire", seed: "Claire" }
];

const CATEGORIES = ["Facilities", "Hygiene", "Safety", "Academics", "Hostel", "General"];
const STATUS_FILTERS = ["All", "Pending", "Under Review", "Resolved"];

const DEFAULT_COMPLAINT = {
  title: "Wi-Fi down in Hostel Block D",
  description: "The Wi-Fi router on the 3rd floor of Block D has been offline since yesterday evening. Several of us have online submissions due this week and no ETA has been shared by the IT helpdesk.",
  category: "Facilities"
};

const seedNotifications = [
  { id: 1, icon: "like", text: "Sneha Rao and 12 others supported your complaint about the Library AC.", time: "10m", read: false },
  { id: 2, icon: "comment", text: "Prof. K. Sharma commented on your post.", time: "1h", read: false },
  { id: 3, icon: "status", text: "Your complaint \"Water dispenser in Block C\" status changed to Under Review.", time: "3h", read: false },
  { id: 4, icon: "like", text: "Rohan Das supported your complaint.", time: "1d", read: true }
];

const seedProfile = {
  name: "You",
  department: "B.Tech Information Technology · 2nd Year",
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=currentUser"
};

const STORAGE_KEY = "campus-feed:state:v1";
const CURRENT_USER_ID = "me";

function timeAgo(ts) {
  const diff = Math.max(0, Date.now() - ts);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}d`;
}

export default function CampusFeed() {
  const [loaded, setLoaded] = useState(false);
  const [posts, setPosts] = useState(seedPosts);
  const [notifications, setNotifications] = useState(seedNotifications);
  const [profile, setProfile] = useState(seedProfile);

  const [commentInputs, setCommentInputs] = useState({});
  const [expanded, setExpanded] = useState({});
  const [activeTab, setActiveTab] = useState("home");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [toast, setToast] = useState("");
  const [composer, setComposer] = useState({ title: "", description: "", category: "" });
  const [composerErrors, setComposerErrors] = useState({});
  const [composerPhoto, setComposerPhoto] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({ title: "", description: "" });
  const [reportedIds, setReportedIds] = useState({});
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortMode, setSortMode] = useState("recent"); // recent | trending
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [profileNameDraft, setProfileNameDraft] = useState("");
  const [editingProfile, setEditingProfile] = useState(false);
  const [saving, setSaving] = useState(false);

  const commentRefs = useRef({});
  const composerFileRef = useRef(null);
  const toastTimer = useRef(null);
  const saveTimer = useRef(null);

  // ---------- Load persisted state once ----------
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await window.storage?.get(STORAGE_KEY, false);
        if (!cancelled && result && result.value) {
          const data = JSON.parse(result.value);
          if (data.posts) setPosts(data.posts);
          if (data.notifications) setNotifications(data.notifications);
          if (data.profile) setProfile(data.profile);
        }
      } catch (e) {
        // no saved state yet, or storage unavailable — keep seed data
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ---------- Persist on change (debounced) ----------
  useEffect(() => {
    if (!loaded) return;
    setSaving(true);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await window.storage?.set(
          STORAGE_KEY,
          JSON.stringify({ posts, notifications, profile }),
          false
        );
      } catch (e) {
        // best-effort; ignore failures
      } finally {
        setSaving(false);
      }
    }, 500);
    return () => clearTimeout(saveTimer.current);
  }, [posts, notifications, profile, loaded]);

  const showToast = (msg) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2200);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // ---------- Post actions ----------
  const handleUpvote = (postId) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          upvotes: post.upvotedByMe ? post.upvotes - 1 : post.upvotes + 1,
          upvotedByMe: !post.upvotedByMe
        };
      }
      return post;
    }));
  };

  const handleCommentChange = (postId, text) => {
    setCommentInputs(prev => ({ ...prev, [postId]: text }));
  };

  const handleCommentSubmit = (postId, e) => {
    e.preventDefault();
    const commentText = commentInputs[postId]?.trim();
    if (!commentText) return;

    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            { id: Date.now(), authorId: CURRENT_USER_ID, author: `${profile.name} (Student)`, text: commentText, mine: true }
          ]
        };
      }
      return post;
    }));
    setCommentInputs(prev => ({ ...prev, [postId]: "" }));
  };

  const handleCommentDelete = (postId, commentId) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return { ...post, comments: post.comments.filter(c => c.id !== commentId) };
      }
      return post;
    }));
  };

  const toggleExpand = (postId) => {
    setExpanded(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const focusComment = (postId) => {
    const el = commentRefs.current[postId];
    if (el) el.focus();
  };

  const handleShare = async (post) => {
    const fakeUrl = `https://campusconnect.app/complaint/${post.id}`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(fakeUrl);
      }
    } catch (e) {
      // clipboard may be blocked in this environment — still show link
    }
    showToast(`Link copied: ${fakeUrl}`);
  };

  const toggleMenu = (postId) => {
    setOpenMenuId(prev => (prev === postId ? null : postId));
  };

  const startEdit = (post) => {
    setEditingId(post.id);
    setEditDraft({ title: post.title, description: post.description });
    setOpenMenuId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft({ title: "", description: "" });
  };

  const saveEdit = (postId) => {
    if (!editDraft.title.trim() || !editDraft.description.trim()) {
      showToast("Title and description can't be empty");
      return;
    }
    setPosts(prev => prev.map(post =>
      post.id === postId
        ? { ...post, title: editDraft.title.trim(), description: editDraft.description.trim(), banner: "Edited by author" }
        : post
    ));
    setEditingId(null);
    showToast("Complaint updated");
  };

  const deletePost = (postId) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    setOpenMenuId(null);
    showToast("Complaint deleted");
  };

  const reportPost = (postId) => {
    setReportedIds(prev => ({ ...prev, [postId]: true }));
    setOpenMenuId(null);
    showToast("Reported — our moderators will take a look");
  };

  // ---------- Composer ----------
  const fillDefaultComplaint = () => {
    setComposer(DEFAULT_COMPLAINT);
    setComposerErrors({});
  };

  const handleComposerChange = (field, value) => {
    setComposer(prev => ({ ...prev, [field]: value }));
    setComposerErrors(prev => ({ ...prev, [field]: null }));
  };

  const handlePhotoPick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Please choose an image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setComposerPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  const removeComposerPhoto = () => {
    setComposerPhoto(null);
    if (composerFileRef.current) composerFileRef.current.value = "";
  };

  const validateComposer = () => {
    const errs = {};
    if (!composer.title.trim()) errs.title = "Give your complaint a short title.";
    else if (composer.title.trim().length > 100) errs.title = "Keep the title under 100 characters.";
    if (!composer.description.trim()) errs.description = "Describe the issue so others understand it.";
    else if (composer.description.trim().length < 20) errs.description = "Add a bit more detail (at least 20 characters).";
    setComposerErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePostComplaint = () => {
    if (!validateComposer()) {
      showToast("Please fix the highlighted fields");
      return;
    }
    const newPost = {
      id: Date.now(),
      authorId: CURRENT_USER_ID,
      studentName: profile.name,
      department: profile.department,
      avatarUrl: profile.avatarUrl,
      title: composer.title.trim(),
      description: composer.description.trim(),
      banner: "Just submitted — awaiting review",
      mediaType: composerPhoto ? "image" : "none",
      mediaUrl: composerPhoto,
      upvotes: 0,
      upvotedByMe: false,
      status: "Pending",
      category: composer.category || "General",
      createdAt: Date.now(),
      comments: []
    };
    setPosts(prev => [newPost, ...prev]);
    setComposer({ title: "", description: "", category: "" });
    setComposerPhoto(null);
    setComposerErrors({});
    setActiveTab("home");
    showToast("Complaint posted to the campus feed");
  };

  // ---------- Notifications ----------
  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const openNotifications = () => {
    setActiveTab("notifications");
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // ---------- Profile ----------
  const startEditProfile = () => {
    setProfileNameDraft(profile.name);
    setEditingProfile(true);
  };

  const saveProfileName = () => {
    const name = profileNameDraft.trim();
    if (!name) {
      showToast("Name can't be empty");
      return;
    }
    setProfile(prev => ({ ...prev, name }));
    setPosts(prev => prev.map(p => p.authorId === CURRENT_USER_ID ? { ...p, studentName: name } : p));
    setEditingProfile(false);
    showToast("Profile updated");
  };

  // ---------- Derived data ----------
  const myPosts = useMemo(() => posts.filter(p => p.authorId === CURRENT_USER_ID), [posts]);
  const profileStats = useMemo(() => ({
    raised: myPosts.length,
    resolved: myPosts.filter(p => p.status === "Resolved").length,
    upvotesReceived: myPosts.reduce((sum, p) => sum + p.upvotes, 0)
  }), [myPosts]);

  const visiblePosts = useMemo(() => {
    let list = [...posts];
    if (statusFilter !== "All") list = list.filter(p => p.status === statusFilter);
    if (categoryFilter !== "All") list = list.filter(p => p.category === categoryFilter);
    if (sortMode === "trending") list.sort((a, b) => b.upvotes - a.upvotes);
    else list.sort((a, b) => b.createdAt - a.createdAt);
    return list;
  }, [posts, statusFilter, categoryFilter, sortMode]);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return posts.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.studentName.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [posts, searchQuery]);

  const trendingPosts = useMemo(
    () => [...posts].sort((a, b) => b.upvotes - a.upvotes).slice(0, 4),
    [posts]
  );

  const openPostFromSearch = (post) => {
    setSearchQuery("");
    setSearchFocused(false);
    setActiveTab("home");
    setStatusFilter("All");
    setCategoryFilter("All");
    setExpanded(prev => ({ ...prev, [post.id]: true }));
    setTimeout(() => {
      const el = document.getElementById(`post-${post.id}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
    showToast(`Showing "${post.title}"`);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Resolved": return <CheckCircle2 size={13} className="status-icon resolved" />;
      case "Under Review": return <Clock size={13} className="status-icon review" />;
      default: return <AlertCircle size={13} className="status-icon pending" />;
    }
  };

  const bannerTone = (status) => status === "Resolved" ? "resolved-tone" : status === "Under Review" ? "review-tone" : "pending-tone";

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "complaint", label: "Public Complaint", icon: Megaphone },
    { id: "profile", label: "Profile", icon: UserCircle2 },
    { id: "notifications", label: "Notification", icon: Bell, badge: unreadCount }
  ];

  const renderPost = (post) => {
    const isLong = post.description.length > 140;
    const isOpen = expanded[post.id];
    const shownText = isLong && !isOpen ? post.description.slice(0, 140) + "… " : post.description + " ";
    const isMine = post.authorId === CURRENT_USER_ID;
    const isEditing = editingId === post.id;
    const isReported = !!reportedIds[post.id];

    return (
      <article key={post.id} id={`post-${post.id}`} className="post-card">
        <div className="post-header">
          <img src={post.avatarUrl} alt={post.studentName} className="post-avatar" />
          <div className="post-meta">
            <div className="author-row">
              <h4>{post.studentName}</h4>
              {isMine && <span className="you-badge">You</span>}
            </div>
            <p className="author-dept">{post.department}</p>
            <p className="post-time">{timeAgo(post.createdAt)} · <span className="category-tag">{post.category}</span></p>
          </div>
          <div className="options-wrapper">
            <button className="options-btn" onClick={() => toggleMenu(post.id)} aria-label="Post options"><MoreHorizontal size={18} /></button>
            {openMenuId === post.id && (
              <div className="options-menu">
                {isMine ? (
                  <>
                    <button onClick={() => startEdit(post)}><Edit3 size={14} /> Edit</button>
                    <button className="danger" onClick={() => deletePost(post.id)}><Trash2 size={14} /> Delete</button>
                  </>
                ) : isReported ? (
                  <button className="reported" disabled><Check size={14} /> Reported</button>
                ) : (
                  <button className="danger" onClick={() => reportPost(post.id)}><Flag size={14} /> Report</button>
                )}
              </div>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="edit-form">
            <input
              value={editDraft.title}
              onChange={e => setEditDraft(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Title"
            />
            <textarea
              rows={4}
              value={editDraft.description}
              onChange={e => setEditDraft(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description"
            />
            <div className="edit-actions">
              <button className="edit-cancel-btn" onClick={cancelEdit}>Cancel</button>
              <button className="edit-save-btn" onClick={() => saveEdit(post.id)}>Save changes</button>
            </div>
          </div>
        ) : (
          <div className="post-content">
            <h3 className="post-title">{post.title}</h3>
            <p className="post-text">
              {shownText}
              {isLong && (
                <button className="see-more-btn" onClick={() => toggleExpand(post.id)}>
                  {isOpen ? "see less" : "see more"}
                </button>
              )}
            </p>
          </div>
        )}

        {post.mediaUrl && (
          <div className="post-media-container">
            {post.mediaType === "image" ? (
              <img src={post.mediaUrl} alt="Complaint attachment" className="post-media-img" />
            ) : (
              <video controls className="post-media-video">
                <source src={post.mediaUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            <div className="media-overlay-fade" />
            <div className="media-caption-banner">
              {getStatusIcon(post.status)}
              <span>{post.banner}</span>
            </div>
          </div>
        )}
        {!post.mediaUrl && (
          <div className={`text-only-banner ${bannerTone(post.status)}`}>
            {getStatusIcon(post.status)}
            <span>{post.banner}</span>
          </div>
        )}

        <div className="post-stats-row">
          <div className="votes-counter">
            <span className="reaction-stack">
              <span className="reaction-dot thumb"><ThumbsUp size={10} /></span>
              <span className="reaction-dot heart">❤</span>
            </span>
            <span>{post.upvotes}</span>
          </div>
          <button className="comments-count" onClick={() => focusComment(post.id)}>{post.comments.length} comments</button>
        </div>

        <div className="divider" />

        <div className="post-actions">
          <button
            className={`action-btn ${post.upvotedByMe ? "active" : ""}`}
            onClick={() => handleUpvote(post.id)}
          >
            <ThumbsUp size={18} />
            <span>{post.upvotedByMe ? "Liked" : "Like"}</span>
          </button>
          <button className="action-btn" onClick={() => focusComment(post.id)}>
            <MessageSquare size={18} />
            <span>Comment</span>
          </button>
          <button className="action-btn" onClick={() => handleShare(post)}>
            <Share2 size={18} />
            <span>Share</span>
          </button>
        </div>

        <div className="comments-section">
          {post.comments.length > 0 && (
            <div className="comments-list">
              {post.comments.map(comment => (
                <div key={comment.id} className="comment-bubble">
                  <div className="comment-bubble-header">
                    <strong>{comment.author}</strong>
                    {comment.mine && (
                      <button className="comment-del-btn" onClick={() => handleCommentDelete(post.id, comment.id)} aria-label="Delete comment">
                        <X size={13} />
                      </button>
                    )}
                  </div>
                  <p>{comment.text}</p>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={(e) => handleCommentSubmit(post.id, e)} className="comment-form">
            <img src={profile.avatarUrl} alt="Your avatar" className="comment-avatar" />
            <div className="comment-input-wrapper">
              <input
                ref={el => (commentRefs.current[post.id] = el)}
                type="text"
                placeholder="Add a comment…"
                value={commentInputs[post.id] || ""}
                onChange={(e) => handleCommentChange(post.id, e.target.value)}
              />
              <button type="submit" className="comment-send-btn" disabled={!commentInputs[post.id]?.trim()}>
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      </article>
    );
  };

  return (
    <div className="cf-root">
      <div className="app-shell">
        {/* Top bar */}
        <header className="top-bar">
          <div className="brand-mark" onClick={() => setActiveTab("home")}>
            <span className="brand-icon">CC</span>
          </div>
          <div className="search-wrapper">
            <div className="search-pill">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search complaints, people, categories…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
              />
              {searchQuery && (
                <button className="search-clear" onClick={() => setSearchQuery("")}><X size={14} /></button>
              )}
            </div>
            {searchFocused && searchQuery.trim() && (
              <div className="search-dropdown">
                {searchResults.length === 0 ? (
                  <div className="search-empty">No complaints match "{searchQuery}"</div>
                ) : (
                  searchResults.map(p => (
                    <button key={p.id} className="search-result-item" onMouseDown={() => openPostFromSearch(p)}>
                      <div>
                        <p className="search-result-title">{p.title}</p>
                        <p className="search-result-sub">{p.studentName} · {p.category} · {p.status}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <nav className="desktop-nav">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className={`desktop-nav-item ${activeTab === item.id ? "active" : ""}`}
                  onClick={() => item.id === "notifications" ? openNotifications() : setActiveTab(item.id)}
                >
                  <Icon size={20} />
                  <span>{item.label === "Public Complaint" ? "Complaints" : item.label}</span>
                  {item.badge ? <span className="nav-badge inline">{item.badge}</span> : null}
                </button>
              );
            })}
          </nav>

          <button className="icon-btn" onClick={() => showToast("No new messages")}><MessageSquare size={20} /></button>
          <img className="top-avatar" src={profile.avatarUrl} alt="Me" onClick={() => setActiveTab("profile")} />
        </header>

        {activeTab === "home" && (
          <div className="stories-row">
            <button className="story" onClick={() => setActiveTab("complaint")}>
              <div className="story-avatar own">
                <UserCircle2 size={20} />
                <span className="plus-badge">+</span>
              </div>
              <span className="story-label">Your story</span>
            </button>
            {storyAvatars.map(s => (
              <div className="story" key={s.seed}>
                <img className="story-avatar" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.seed}`} alt={s.name} />
                <span className="story-label">{s.name}</span>
              </div>
            ))}
          </div>
        )}

        <div className="content-area">
          <div className="desktop-layout">
            <div className="main-col">
              {/* ---------------- HOME ---------------- */}
              {activeTab === "home" && (
                <>
                  <div className="filter-bar">
                    {STATUS_FILTERS.map(s => (
                      <button
                        key={s}
                        className={`filter-chip ${statusFilter === s ? "active" : ""}`}
                        onClick={() => setStatusFilter(s)}
                      >
                        <Filter size={12} />{s}
                      </button>
                    ))}
                    <button
                      className={`filter-chip ${categoryFilter !== "All" ? "active" : ""}`}
                      onClick={() => {
                        const idx = CATEGORIES.indexOf(categoryFilter);
                        const next = idx === -1 || idx === CATEGORIES.length - 1 ? "All" : CATEGORIES[idx + 1];
                        setCategoryFilter(categoryFilter === "All" ? CATEGORIES[0] : next);
                      }}
                    >
                      {categoryFilter === "All" ? "Any category" : categoryFilter} <ChevronDown size={12} />
                    </button>
                  </div>

                  <div className="sort-row">
                    <span>{visiblePosts.length} complaint{visiblePosts.length !== 1 ? "s" : ""}{saving ? " · saving…" : ""}</span>
                    <button className="sort-btn" onClick={() => setSortMode(m => m === "recent" ? "trending" : "recent")}>
                      <ArrowUpDown size={13} /> {sortMode === "recent" ? "Most recent" : "Trending"}
                    </button>
                  </div>

                  <main className="feed-posts">
                    {!loaded ? (
                      <div className="loading-state">
                        <Loader2 size={22} className="spin" />
                        <span>Loading your campus feed…</span>
                      </div>
                    ) : visiblePosts.length === 0 ? (
                      <div className="empty-state">
                        <Megaphone size={28} />
                        <h3>No complaints here yet</h3>
                        <p>Try a different filter, or be the first to raise this issue.</p>
                      </div>
                    ) : (
                      visiblePosts.map(renderPost)
                    )}
                  </main>
                </>
              )}

              {/* ---------------- COMPOSER ---------------- */}
              {activeTab === "complaint" && (
                <main className="composer-page">
                  <div className="composer-card">
                    <div className="composer-header">
                      <Megaphone size={20} />
                      <h2>File a public complaint</h2>
                    </div>
                    <p className="composer-sub">Your post is shared with the whole campus feed so others can support it.</p>

                    <button className="fill-default-btn" onClick={fillDefaultComplaint}>
                      <TrendingUp size={15} /> Use example complaint
                    </button>

                    <label className="composer-label">Title <span className="char-count">{composer.title.length}/100</span></label>
                    <input
                      className={`composer-input ${composerErrors.title ? "error" : ""}`}
                      type="text"
                      maxLength={100}
                      placeholder="Short, clear title"
                      value={composer.title}
                      onChange={(e) => handleComposerChange("title", e.target.value)}
                    />
                    {composerErrors.title && <p className="field-error">{composerErrors.title}</p>}

                    <label className="composer-label">Category</label>
                    <div className="category-select-row">
                      {CATEGORIES.map(cat => (
                        <button
                          key={cat}
                          type="button"
                          className={`category-pill ${composer.category === cat ? "active" : ""}`}
                          onClick={() => handleComposerChange("category", cat)}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    <label className="composer-label">
                      Description
                      <span className={`char-count ${composer.description.length > 0 && composer.description.length < 20 ? "warn" : ""}`}>
                        {composer.description.length} chars
                      </span>
                    </label>
                    <textarea
                      className={`composer-textarea ${composerErrors.description ? "error" : ""}`}
                      rows={5}
                      placeholder="Describe the issue in detail…"
                      value={composer.description}
                      onChange={(e) => handleComposerChange("description", e.target.value)}
                    />
                    {composerErrors.description && <p className="field-error">{composerErrors.description}</p>}

                    {composerPhoto && (
                      <div className="photo-preview-wrap">
                        <img src={composerPhoto} alt="Attachment preview" />
                        <button className="photo-remove-btn" onClick={removeComposerPhoto} aria-label="Remove photo"><X size={14} /></button>
                      </div>
                    )}

                    <div className="composer-footer">
                      <input
                        ref={composerFileRef}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handlePhotoPick}
                      />
                      <button className="composer-secondary-btn" onClick={() => composerFileRef.current?.click()}>
                        <ImageIcon size={16} /> {composerPhoto ? "Change photo" : "Add photo"}
                      </button>
                      <button className="composer-post-btn" onClick={handlePostComplaint}>
                        Post complaint
                      </button>
                    </div>
                  </div>
                </main>
              )}

              {/* ---------------- PROFILE ---------------- */}
              {activeTab === "profile" && (
                <main className="profile-page">
                  <div className="profile-banner-img" />
                  <div className="profile-card">
                    <img className="profile-avatar" src={profile.avatarUrl} alt="Profile" />
                    {editingProfile ? (
                      <div className="profile-name-edit">
                        <input
                          value={profileNameDraft}
                          onChange={(e) => setProfileNameDraft(e.target.value)}
                          autoFocus
                        />
                        <button className="edit-save-btn" onClick={saveProfileName}>Save</button>
                        <button className="edit-cancel-btn" onClick={() => setEditingProfile(false)}>Cancel</button>
                      </div>
                    ) : (
                      <h2 onClick={startEditProfile} style={{ cursor: "pointer" }} title="Click to edit your name">{profile.name}</h2>
                    )}
                    <p className="profile-dept">{profile.department}</p>
                    <div className="profile-stats-row">
                      <div className="profile-stat">
                        <strong>{profileStats.raised}</strong>
                        <span>Raised</span>
                      </div>
                      <div className="profile-stat">
                        <strong>{profileStats.resolved}</strong>
                        <span>Resolved</span>
                      </div>
                      <div className="profile-stat">
                        <strong>{profileStats.upvotesReceived}</strong>
                        <span>Upvotes</span>
                      </div>
                    </div>

                    {myPosts.length > 0 && (
                      <div className="profile-mini-list">
                        <h4>Your complaints</h4>
                        {myPosts.map(p => (
                          <div className="profile-mini-item" key={p.id}>
                            <span>{p.title.length > 34 ? p.title.slice(0, 34) + "…" : p.title}</span>
                            <span className={`mini-status-badge ${p.status === "Resolved" ? "resolved" : p.status === "Under Review" ? "review" : "pending"}`}>
                              {p.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <button className="fill-default-btn full-width" onClick={() => setActiveTab("complaint")}>
                      <Megaphone size={15} /> File a new complaint
                    </button>
                  </div>
                </main>
              )}

              {/* ---------------- NOTIFICATIONS ---------------- */}
              {activeTab === "notifications" && (
                <main className="notifications-page">
                  <div className="notif-header-row">
                    <h3>Notifications</h3>
                    {unreadCount > 0 && (
                      <button className="mark-read-btn" onClick={markAllRead}><Check size={13} /> Mark all as read</button>
                    )}
                  </div>
                  {notifications.length === 0 ? (
                    <div className="empty-state">
                      <BellOff size={26} />
                      <h3>You're all caught up</h3>
                      <p>New activity on your complaints will show up here.</p>
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div
                        className={`notification-row ${n.read ? "" : "unread"}`}
                        key={n.id}
                        onClick={() => dismissNotification(n.id)}
                      >
                        <div className={`notif-icon ${n.icon}`}>
                          {n.icon === "like" && <ThumbsUp size={16} />}
                          {n.icon === "comment" && <MessageSquare size={16} />}
                          {n.icon === "status" && <AlertCircle size={16} />}
                        </div>
                        <div className="notif-body">
                          <p>{n.text}</p>
                          <span className="notif-time">{n.time}</span>
                        </div>
                      </div>
                    ))
                  )}
                </main>
              )}
            </div>

            {/* ---------------- DESKTOP SIDE RAIL ---------------- */}
            <aside className="side-col">
              <div className="side-card">
                <h4><Sparkles size={15} /> Your impact</h4>
                <div className="side-stat-grid">
                  <div className="side-stat-box">
                    <strong>{profileStats.raised}</strong>
                    <span>Raised</span>
                  </div>
                  <div className="side-stat-box">
                    <strong>{profileStats.resolved}</strong>
                    <span>Resolved</span>
                  </div>
                  <div className="side-stat-box">
                    <strong>{profileStats.upvotesReceived}</strong>
                    <span>Upvotes</span>
                  </div>
                  <div className="side-stat-box">
                    <strong>{posts.length}</strong>
                    <span>Campus-wide</span>
                  </div>
                </div>
              </div>

              <div className="side-card">
                <h4><TrendingUp size={15} /> Trending on campus</h4>
                {trendingPosts.map((p, i) => (
                  <button key={p.id} className="trending-item" onClick={() => openPostFromSearch(p)}>
                    <span className="trending-rank">{i + 1}</span>
                    <div>
                      <p className="trending-title">{p.title}</p>
                      <p className="trending-sub">{p.upvotes} upvotes · {p.category}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="side-card">
                <h4><Megaphone size={15} /> Have an issue?</h4>
                <p style={{ fontSize: "13px", color: "var(--li-text-muted)", margin: "0 0 12px" }}>
                  Raise it publicly so the campus community and administration can see it.
                </p>
                <button className="side-cta-btn" onClick={() => setActiveTab("complaint")}>File a complaint</button>
              </div>
            </aside>
          </div>
        </div>

        {toast && (
          <div className="toast">
            <Link2 size={14} />
            <span>{toast}</span>
            <button onClick={() => setToast("")}><X size={14} /></button>
          </div>
        )}

        <nav className="bottom-nav">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${activeTab === item.id ? "active" : ""}`}
                onClick={() => item.id === "notifications" ? openNotifications() : setActiveTab(item.id)}
              >
                <Icon size={22} />
                <span>{item.label}</span>
                {item.badge ? <span className="nav-badge">{item.badge}</span> : null}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}