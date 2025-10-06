import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { ChevronLeftIcon, UserGroupIcon, ChatBubbleLeftRightIcon, BellIcon, StarIcon, MapPinIcon, PhoneIcon, EnvelopeIcon } from './Icons';

interface CommunityProps {
  onBack: () => void;
}

interface CommunityUser {
  id: string;
  name: string;
  role: 'asha' | 'supervisor' | 'admin';
  village: string;
  district?: string;
  phone: string;
  email: string;
  experience: number; // years
  specializations: string[];
  isOnline: boolean;
  lastSeen: string;
  rating: number;
  completedCases: number;
  joinedAt: string;
}

interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: 'asha' | 'supervisor' | 'admin';
  title: string;
  content: string;
  category: 'question' | 'success_story' | 'resource' | 'announcement' | 'discussion';
  tags: string[];
  timestamp: string;
  likes: number;
  replies: CommunityReply[];
  isResolved?: boolean;
}

interface CommunityReply {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: 'asha' | 'supervisor' | 'admin';
  content: string;
  timestamp: string;
  likes: number;
}

const Community: React.FC<CommunityProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'feed' | 'connect' | 'messages'>('feed');
  const [communityUsers, setCommunityUsers] = useLocalStorage<CommunityUser[]>('communityUsers', []);
  const [communityPosts, setCommunityPosts] = useLocalStorage<CommunityPost[]>('communityPosts', []);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'discussion' as const, tags: '' });
  const [selectedUser, setSelectedUser] = useState<CommunityUser | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messagingUser, setMessagingUser] = useState<CommunityUser | null>(null);
  const [messageText, setMessageText] = useState('');

  // Initialize community data on first load
  useEffect(() => {
    if (communityUsers.length === 0) {
      const sampleUsers: CommunityUser[] = [
        {
          id: 'user_asha_1',
          name: 'Priya Sharma',
          role: 'asha',
          village: 'Rampur',
          district: 'Muzaffarnagar',
          phone: '+91 9876543210',
          email: 'priya.asha@example.com',
          experience: 3,
          specializations: ['Maternal Health', 'Child Care'],
          isOnline: true,
          lastSeen: new Date().toISOString(),
          rating: 4.8,
          completedCases: 245,
          joinedAt: '2022-01-15T00:00:00.000Z'
        },
        {
          id: 'user_asha_2',
          name: 'Sunita Devi',
          role: 'asha',
          village: 'Kashipur',
          district: 'Muzaffarnagar',
          phone: '+91 9876543211',
          email: 'sunita.asha@example.com',
          experience: 5,
          specializations: ['Immunization', 'Family Planning'],
          isOnline: false,
          lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          rating: 4.9,
          completedCases: 432,
          joinedAt: '2020-03-10T00:00:00.000Z'
        },
        {
          id: 'user_supervisor_1',
          name: 'Dr. Rajesh Kumar',
          role: 'supervisor',
          village: 'District Hospital',
          district: 'Muzaffarnagar',
          phone: '+91 9876543212',
          email: 'dr.rajesh@example.com',
          experience: 12,
          specializations: ['Community Medicine', 'Public Health'],
          isOnline: true,
          lastSeen: new Date().toISOString(),
          rating: 4.9,
          completedCases: 1250,
          joinedAt: '2018-06-01T00:00:00.000Z'
        }
      ];
      setCommunityUsers(sampleUsers);
    }

    if (communityPosts.length === 0) {
      const samplePosts: CommunityPost[] = [
        {
          id: 'post_1',
          authorId: 'user_supervisor_1',
          authorName: 'Dr. Rajesh Kumar',
          authorRole: 'supervisor',
          title: 'New Vaccination Guidelines for 2025',
          content: 'Dear ASHA workers, please note the updated vaccination schedule for children. The new guidelines include additional doses for improved immunity. Training sessions will be conducted next week.',
          category: 'announcement',
          tags: ['vaccination', 'guidelines', 'training'],
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
          likes: 12,
          replies: [
            {
              id: 'reply_1',
              authorId: 'user_asha_1',
              authorName: 'Priya Sharma',
              authorRole: 'asha',
              content: 'Thank you for the update, Dr. Kumar. When will the training materials be available?',
              timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
              likes: 3
            }
          ]
        },
        {
          id: 'post_2',
          authorId: 'user_asha_2',
          authorName: 'Sunita Devi',
          authorRole: 'asha',
          title: 'Success Story: Zero Malnutrition in My Village',
          content: 'I am proud to share that through consistent monitoring and community engagement, we have achieved zero severe malnutrition cases in Kashipur village this year. Here are the strategies that worked...',
          category: 'success_story',
          tags: ['malnutrition', 'success', 'community'],
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
          likes: 25,
          replies: [
            {
              id: 'reply_2',
              authorId: 'user_supervisor_1',
              authorName: 'Dr. Rajesh Kumar',
              authorRole: 'supervisor',
              content: 'Excellent work, Sunita! This is exactly the kind of community impact we strive for. Would you be willing to share your approach in our next district meeting?',
              timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
              likes: 8
            }
          ]
        },
        {
          id: 'post_3',
          authorId: 'user_asha_1',
          authorName: 'Priya Sharma',
          authorRole: 'asha',
          title: 'Need Advice: Handling Vaccine Hesitancy',
          content: 'I am facing some challenges with vaccine hesitancy in my area, especially among new mothers. What strategies have worked for you in building trust and educating families?',
          category: 'question',
          tags: ['vaccine-hesitancy', 'advice', 'education'],
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
          likes: 8,
          replies: []
        }
      ];
      setCommunityPosts(samplePosts);
    }
  }, [communityUsers.length, communityPosts.length, setCommunityUsers, setCommunityPosts]);

  const filteredUsers = useMemo(() => {
    return communityUsers.filter(u => 
      u.id !== user?.id && 
      (u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       u.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
       u.specializations.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())))
    );
  }, [communityUsers, user?.id, searchQuery]);

  const filteredPosts = useMemo(() => {
    return communityPosts.filter(post => 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [communityPosts, searchQuery]);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim() || !user) return;

    const post: CommunityPost = {
      id: `post_${Date.now()}`,
      authorId: user.id,
      authorName: user.name,
      authorRole: user.role as 'asha' | 'supervisor' | 'admin',
      title: newPost.title.trim(),
      content: newPost.content.trim(),
      category: newPost.category,
      tags: newPost.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: []
    };

    setCommunityPosts(prev => [post, ...prev]);
    setNewPost({ title: '', content: '', category: 'discussion', tags: '' });
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMs = now.getTime() - time.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return time.toLocaleDateString();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'announcement': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'success_story': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'question': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'resource': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'supervisor': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
    }
  };

  return (
    <div className="min-h-screen">
      {/* Modern Header with Gradient */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/80 to-blue-600/80" />
        <div className="relative px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center space-x-3">
            {onBack && (
              <button
                onClick={onBack}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors flex-shrink-0"
                aria-label="Go back"
              >
                <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>
            )}
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
              <UserGroupIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 truncate">Community</h1>
              <p className="text-emerald-100 text-xs sm:text-sm lg:text-base line-clamp-1">Connect with fellow ASHA workers</p>
            </div>
            <div className="flex sm:hidden items-center space-x-1 bg-white/10 backdrop-blur-sm px-2 py-1 rounded-full">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white text-xs font-medium">{communityUsers.length}</span>
            </div>
            <div className="hidden sm:flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-medium">{communityUsers.length} Members</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 min-h-screen">
        {/* Search Bar */}
        <div className="px-3 sm:px-4 py-4 sm:py-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search posts, people, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm text-sm sm:text-base"
            />
            <svg className="absolute left-2.5 sm:left-3 top-2.5 sm:top-3.5 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-3 sm:px-4 mb-4 sm:mb-6">
          <div className="flex space-x-1 bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl p-1 shadow-sm border border-slate-200 dark:border-slate-700">
            {[
              { id: 'feed', label: 'Community Feed', shortLabel: 'Feed', icon: ChatBubbleLeftRightIcon },
              { id: 'connect', label: 'Connect', shortLabel: 'Connect', icon: UserGroupIcon },
              { id: 'messages', label: 'Messages', shortLabel: 'Messages', icon: BellIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 sm:py-3 px-1 sm:px-3 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-700'
                }`}
              >
                <tab.icon className="h-4 w-4 sm:h-4 sm:w-4" />
                <span className="block sm:hidden">{tab.shortLabel}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>      {/* Content based on active tab */}
      <div className="px-3 sm:px-4 pb-20 sm:pb-24">
        {activeTab === 'feed' && (
          <div className="space-y-6">
            {/* Create Post Form */}
            <div className="bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-3 sm:mb-4">Share with Community</h3>
              <form onSubmit={handleCreatePost} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Post title..."
                    value={newPost.title}
                    onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <textarea
                    placeholder="What would you like to share?"
                    value={newPost.content}
                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value as any }))}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="discussion">Discussion</option>
                    <option value="question">Question</option>
                    <option value="success_story">Success Story</option>
                    <option value="resource">Resource</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Tags (comma separated)"
                    value={newPost.tags}
                    onChange={(e) => setNewPost(prev => ({ ...prev, tags: e.target.value }))}
                    className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Post
                  </button>
                </div>
              </form>
            </div>

            {/* Posts Feed */}
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <div key={post.id} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {post.authorName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-slate-900 dark:text-white">{post.authorName}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(post.authorRole)}`}>
                            {post.authorRole.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{formatTimeAgo(post.timestamp)}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(post.category)}`}>
                      {post.category.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 mb-3 sm:mb-4 line-clamp-3">{post.content}</p>
                  
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded-full truncate">
                          #{tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded-full">
                          +{post.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <button className="flex items-center space-x-1 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        <StarIcon className="h-4 w-4" />
                        <span className="text-xs sm:text-sm">{post.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        <ChatBubbleLeftRightIcon className="h-4 w-4" />
                        <span className="text-xs sm:text-sm">{post.replies.length}</span>
                      </button>
                    </div>
                    {post.isResolved && (
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">✓ Resolved</span>
                    )}
                  </div>
                  
                  {post.replies.length > 0 && (
                    <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
                      {post.replies.slice(0, 2).map((reply) => (
                        <div key={reply.id} className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 sm:p-4">
                          <div className="flex items-start justify-between mb-2 gap-2">
                            <div className="flex items-center space-x-2 min-w-0 flex-1">
                              <span className="font-medium text-slate-900 dark:text-white text-xs sm:text-sm truncate">{reply.authorName}</span>
                              <span className={`px-1.5 py-0.5 text-xs rounded-full ${getRoleColor(reply.authorRole)} flex-shrink-0`}>
                                {reply.authorRole.toUpperCase()}
                              </span>
                            </div>
                            <span className="text-xs text-slate-500 dark:text-slate-400 flex-shrink-0">{formatTimeAgo(reply.timestamp)}</span>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm line-clamp-2">{reply.content}</p>
                        </div>
                      ))}
                      {post.replies.length > 2 && (
                        <button className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:underline ml-2">
                          View {post.replies.length - 2} more replies
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'connect' && (
          <div className="space-y-4">
            {/* User Directory */}
            <div className="grid gap-3 sm:gap-4">
              {filteredUsers.map((communityUser) => (
                <div key={communityUser.id} className="bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm sm:text-base">
                          {communityUser.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white dark:border-slate-800 ${
                        communityUser.isOnline ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base truncate">{communityUser.name}</h3>
                            <span className={`px-1.5 py-0.5 text-xs rounded-full ${getRoleColor(communityUser.role)} flex-shrink-0`}>
                              {communityUser.role.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-2">
                            <div className="flex items-center space-x-1">
                              <MapPinIcon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                              <span className="truncate">{communityUser.village}</span>
                            </div>
                            <div className="flex items-center space-x-1 flex-shrink-0">
                              <StarIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span>{communityUser.rating}</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
                            {communityUser.specializations.slice(0, 2).map((spec, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full truncate">
                                {spec}
                              </span>
                            ))}
                            {communityUser.specializations.length > 2 && (
                              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded-full">
                                +{communityUser.specializations.length - 2}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                            {communityUser.experience}y exp • {communityUser.completedCases} cases
                            {!communityUser.isOnline && ` • ${formatTimeAgo(communityUser.lastSeen)}`}
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2 flex-shrink-0 mt-2 sm:mt-0">
                          <button
                            onClick={() => setSelectedUser(communityUser)}
                            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm rounded-md sm:rounded-lg transition-colors whitespace-nowrap"
                          >
                            Connect
                          </button>
                          <button 
                            onClick={() => setMessagingUser(communityUser)}
                            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-xs sm:text-sm rounded-md sm:rounded-lg transition-colors whitespace-nowrap"
                          >
                            Message
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-4">
            {/* Quick Messages */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Connect</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Send quick messages to fellow ASHA workers and supervisors. Click on any user in the Connect tab to start messaging.
              </p>
              <div className="grid gap-3">
                {communityUsers.slice(0, 3).map((user) => (
                  <button
                    key={user.id}
                    onClick={() => setMessagingUser(user)}
                    className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-xs">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{user.village} • {user.role}</p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Message Guidelines */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">Community Guidelines</h4>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                  <span>Be respectful and professional in all communications</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                  <span>Share knowledge and support fellow ASHA workers</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                  <span>Keep discussions focused on health and community welfare</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                  <span>Report any inappropriate content to supervisors</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Connect with {selectedUser.name}</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <PhoneIcon className="h-5 w-5 text-slate-400" />
                <span className="text-slate-700 dark:text-slate-300">{selectedUser.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <EnvelopeIcon className="h-5 w-5 text-slate-400" />
                <span className="text-slate-700 dark:text-slate-300">{selectedUser.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPinIcon className="h-5 w-5 text-slate-400" />
                <span className="text-slate-700 dark:text-slate-300">{selectedUser.village}, {selectedUser.district}</span>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setSelectedUser(null)}
                className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  // Here you would implement the connection logic
                  setSelectedUser(null);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messaging Modal */}
      {messagingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl max-w-md w-full mx-2 sm:mx-0 max-h-[90vh] sm:max-h-[80vh] flex flex-col">
            {/* Message Header */}
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-xs sm:text-sm">
                    {messagingUser.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">{messagingUser.name}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{messagingUser.village}</p>
                </div>
              </div>
              <button
                onClick={() => setMessagingUser(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Message Area */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              <div className="text-center py-8">
                <ChatBubbleLeftRightIcon className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Start a conversation with {messagingUser.name}
                </p>
              </div>
            </div>
            
            {/* Message Input */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex space-x-3">
                <input
                  type="text"
                  placeholder={`Message ${messagingUser.name}...`}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      // Handle send message
                      if (messageText.trim()) {
                        // Here you would implement actual message sending
                        console.log('Sending message:', messageText, 'to:', messagingUser.name);
                        setMessageText('');
                        // For now, just show an alert
                        alert(`Message sent to ${messagingUser.name}: "${messageText}"`);
                      }
                    }
                  }}
                />
                <button
                  onClick={() => {
                    if (messageText.trim()) {
                      // Handle send message
                      console.log('Sending message:', messageText, 'to:', messagingUser.name);
                      alert(`Message sent to ${messagingUser.name}: "${messageText}"`);
                      setMessageText('');
                    }
                  }}
                  disabled={!messageText.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  Send
                </button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Press Enter to send • Messages are currently simulated
              </p>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Community;