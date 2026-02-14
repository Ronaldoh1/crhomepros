"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";
import { BLOG_POSTS, BLOG_CATEGORIES } from "@/lib/blog-posts";
import { cn } from "@/lib/utils";

const categories = ["All", ...BLOG_CATEGORIES];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const featuredPost = BLOG_POSTS[0];

  // Filter posts based on active category
  const filteredPosts =
    activeCategory === "All"
      ? BLOG_POSTS.slice(1)
      : BLOG_POSTS.slice(1).filter((post) => post.category === activeCategory);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-dark-900 via-primary-900 to-dark-950 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block text-sm font-semibold text-gold-400 tracking-wider uppercase mb-4">
              Our Blog
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
              Home Improvement{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-500">
                Tips & Insights
              </span>
            </h1>
            <p className="text-xl text-white/70 leading-relaxed">
              Expert advice, project inspiration, and practical tips from our
              experienced team.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <Link href={`/blog/${featuredPost.slug}`} className="group block">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 px-3 py-1 bg-gold-500 rounded-full text-xs font-semibold text-dark-900">
                  Featured
                </div>
              </div>
              <div>
                <span className="text-sm font-medium text-primary-600">
                  {featuredPost.category}
                </span>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-dark-900 mt-2 mb-4 group-hover:text-primary-800 transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-dark-500 mb-6">{featuredPost.excerpt}</p>
                <div className="flex items-center gap-6 text-sm text-dark-400">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {featuredPost.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(featuredPost.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {featuredPost.readTime}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="section-padding bg-dark-50">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-12">
            <h2 className="text-2xl font-display font-bold text-dark-900">
              Recent Articles
            </h2>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    activeCategory === cat
                      ? "bg-primary-800 text-white"
                      : "bg-white text-dark-600 hover:bg-primary-50 hover:text-primary-700",
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Posts Grid */}
          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-dark-100 hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 rounded text-xs font-medium text-dark-700">
                      {post.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-display font-semibold text-dark-900 mb-2 group-hover:text-primary-800 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-dark-500 text-sm mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-dark-400">
                      <span>
                        {new Date(post.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span>{post.readTime} read</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl">
              <p className="text-dark-500">No posts found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="section-padding bg-primary-800">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center text-white">
            <h2 className="text-3xl font-display font-bold mb-4">
              Get Home Improvement Tips in Your Inbox
            </h2>
            <p className="text-primary-200 mb-8">
              Subscribe for monthly tips, project ideas, and exclusive offers.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl text-dark-900 placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
              <button type="submit" className="btn-gold">
                Subscribe
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
